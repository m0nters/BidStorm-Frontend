import { getAccessToken, WS_BASE_URL } from "@/api/config";
import { getBidHistory } from "@/services/bids";
import { BidEvent, BidResponse } from "@/types/bid";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";

interface UseProductBidsOptions {
  isSeller?: boolean;
}

interface UseProductBidsReturn {
  bids: BidResponse[];
  loading: boolean;
  currentPrice: number | null;
  highestBidder: string | null;
  endTime: string | null;
  addBidOptimistically: (bid: BidResponse, newPrice: number) => void;
}

export const useProductBids = (
  productId: number,
  options: UseProductBidsOptions = {},
): UseProductBidsReturn => {
  const { isSeller = false } = options;
  const [bids, setBids] = useState<BidResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const ignoredBidIdsRef = useRef<Set<number>>(new Set());
  const lastRejectionTimestampRef = useRef<number>(0);
  const rejectionToastShownRef = useRef<boolean>(false);

  useEffect(() => {
    // Don't run if productId is invalid
    if (!productId || productId <= 0) {
      setLoading(false);
      return;
    }

    let isActive = true;

    // Fetch initial bid history from API
    const fetchInitialBids = async () => {
      try {
        const initialBids = await getBidHistory(productId);
        if (isActive) {
          setBids(initialBids);
          setLoading(false);
        }
      } catch (error) {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchInitialBids();

    // Setup WebSocket connection
    const token = getAccessToken();
    // SockJS expects HTTP/HTTPS URL, NOT ws:// - it handles protocol upgrade internally
    const wsUrl = WS_BASE_URL;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      // Subscribe to appropriate channel based on role
      const channel = isSeller
        ? `/topic/product/${productId}/bids/seller`
        : `/topic/product/${productId}/bids`;

      client.subscribe(channel, (message) => {
        try {
          const event: BidEvent = JSON.parse(message.body);

          // Handle events directly here to avoid stale closures
          if (event.type === "NEW_BID" && event.bid) {
            // Skip if this bid was just added via API (prevent duplicate)
            if (ignoredBidIdsRef.current.has(event.bid.id)) {
              return; // Don't delete from set, just skip
            }

            setBids((prev) => {
              // Check if bid already exists (prevent duplicates)
              const bidExists = prev.some((b) => b.id === event.bid!.id);

              if (bidExists) {
                return prev; // Don't add duplicate
              }

              // If new bid is the highest bidder, clear flag from all previous bids
              const updatedPreviousBids = event.bid!.isHighestBidder
                ? prev.map((b) => ({ ...b, isHighestBidder: false }))
                : prev;

              // Add new bid to the beginning (most recent first)
              return [event.bid!, ...updatedPreviousBids];
            });

            // Update current price, highest bidder, and end time
            if (event.currentPrice !== undefined) {
              setCurrentPrice(event.currentPrice);
            }
            if (event.highestBidder !== undefined) {
              setHighestBidder(event.highestBidder);
            }
            if (event.endTime !== undefined) {
              setEndTime(event.endTime);
            }

            // Show notification if not your own bid
            if (!event.bid.isYourself) {
              toast.info(
                `${event.bid.bidderName} đã đặt giá ${event.bid.bidAmount.toLocaleString("vi-VN")}₫`,
              );
            }
          } else if (event.type === "BID_REJECTED") {
            // Extract bidderId from either event.bidderId or event.bid.bidderId
            const rejectedBidderId = event.bidderId || event.bid?.bidderId;

            if (!rejectedBidderId) {
              console.error("❌ BID_REJECTED event missing bidderId:", event);
              return;
            }

            // Prevent duplicate toast using timestamp (events within 100ms are considered duplicates)
            const now = Date.now();
            if (now - lastRejectionTimestampRef.current < 100) {
              return;
            }
            lastRejectionTimestampRef.current = now;
            rejectionToastShownRef.current = false; // Reset flag for new rejection event

            // Check if rejected bidder is current user BEFORE updating state
            // Use functional state access to get latest state
            setBids((prev) => {
              // Check if rejected bidder is current user
              const wasYourBid = prev.some(
                (b) => b.bidderId === rejectedBidderId && b.isYourself,
              );

              // Show toast inside callback to ensure it has correct value
              if (wasYourBid && !rejectionToastShownRef.current) {
                rejectionToastShownRef.current = true;
                toast.error("Bạn đã bị loại khỏi phiên đấu giá này");
              }

              const remainingBids = prev.filter(
                (b) => b.bidderId !== rejectedBidderId,
              );

              // Clear all isHighestBidder flags first
              const clearedBids = remainingBids.map((b) => ({
                ...b,
                isHighestBidder: false,
              }));

              // If there are remaining bids, mark the first one (highest) as highest bidder
              if (clearedBids.length > 0) {
                clearedBids[0].isHighestBidder = true;
              }

              return clearedBids;
            });

            // Update current price and highest bidder from backend
            if (event.currentPrice !== undefined) {
              setCurrentPrice(event.currentPrice);
            }
            if (event.highestBidder !== undefined) {
              setHighestBidder(event.highestBidder);
            }
          }
        } catch (error) {
          // Silently ignore parse errors
        }
      });
    };

    client.onStompError = (frame) => {};

    client.activate();
    clientRef.current = client;

    return () => {
      isActive = false;
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
    };
  }, [productId, isSeller]);

  const addBidOptimistically = (bid: BidResponse, newPrice: number) => {
    // Mark this bid ID as ignored for WebSocket events FIRST
    ignoredBidIdsRef.current.add(bid.id);

    // Add or replace bid with personalized unmasked response
    setBids((prev) => {
      const existingIndex = prev.findIndex((b) => b.id === bid.id);

      if (existingIndex !== -1) {
        // Replace masked version from WebSocket with unmasked version from API
        const newBids = [...prev];
        newBids[existingIndex] = bid; // Replace with personalized response
        return newBids;
      }

      // If new bid is the highest bidder, clear flag from all previous bids
      const updatedPreviousBids = bid.isHighestBidder
        ? prev.map((b) => ({ ...b, isHighestBidder: false }))
        : prev;

      // Add new bid if doesn't exist
      return [bid, ...updatedPreviousBids];
    });

    // Update current price and highest bidder from backend response
    setCurrentPrice(newPrice);
    // Only update highest bidder if this bid is actually the highest (backend determines this)
    if (bid.isHighestBidder) {
      setHighestBidder(bid.bidderName);
    }
  };

  return {
    bids,
    loading,
    currentPrice,
    highestBidder,
    endTime,
    addBidOptimistically,
  };
};
