"use client";

import { api } from "@/api/fetch";
import { useAuthStore } from "@/store/authStore";
import { LoginResponse } from "@/types/auth";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleLoginButton = ({
  onSuccess,
  onError,
}: GoogleLoginButtonProps) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const buttonRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

    if (!clientId) {
      console.error("Google Client ID not found");
      return;
    }

    // Prevent double initialization
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && buttonRef.current) {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: buttonRef.current.offsetWidth,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      const credential = response.credential;

      // Send the credential token to backend
      const loginResponse = await api.post<LoginResponse>(
        "/auth/google/callback",
        { credential },
        {
          cache: "no-store",
          credentials: "include",
        },
      );

      // Store access token in memory via zustand
      setAuth(loginResponse.data.user, loginResponse.data.accessToken);

      toast.success("Đăng nhập Google thành công!");
      onSuccess?.();
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage =
        error?.message || "Đăng nhập Google thất bại. Vui lòng thử lại.";

      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <div className="w-full">
      {/* Custom styled container for Google button */}
      <div
        ref={buttonRef}
        className="flex min-h-[44px] w-full items-center justify-center"
      />
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}
