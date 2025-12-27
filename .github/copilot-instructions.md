# BidStorm - AI Coding Instructions

## UPDATE IF NEEDED RULE

In the future , these instructions can be updated as the project evolves. When you receive a request to update something and you think these instructions should be updated to catch with the coding conventions/project requirements, suggest changes to these instructions accordingly and I will review and approve them.

## Project Overview

BidStorm is a Vietnamese online auction platform built with **Next.js 15 (App Router)** and **TypeScript**. The app features a minimalist black-and-white design and follows a multi-role architecture: guests, bidders (buyers), and sellers.

For the full project requirements, see [Project requirements.md](../Project%20requirements.md). Also in the future when you receive requests related to this project, you can refer to that file for more context about the features and business logic.

## Tech Stack & Architecture

### Core Framework

- **Next.js 15** with App Router (file-based routing in `app/`)
- **React 19** with Server Components by default
- **TypeScript** with strict mode enabled
- **Tailwind CSS 4** for styling
- **Montserrat** font via `next/font`

### Key Libraries

- **State**: Zustand (`store/authStore.ts`)
- **Forms**: React Hook Form + `@hookform/resolvers` with Zod validation (`validations/`)
- **API**: Custom fetch wrapper (`api/fetch.ts`)
- **Auth**: JWT access tokens + httpOnly refresh cookies
- **Real-time**: STOMP over SockJS for WebSocket (`@stomp/stompjs`, `sockjs-client`)
- **UI**: react-icons (Feather), react-toastify

## Design Features

### Color Palette

- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Gray Scale**: Various shades for depth
- **Accent**: Minimal use of blue, red, and green for specific actions

### Key UI Elements

- Clean, minimalist cards with subtle shadows
- Smooth hover transitions
- Real-time countdown timers
- Responsive grid layouts
- Mobile-optimized navigation

### Responsive Design

- **Mobile**: Single column, hamburger menu
- **Tablet**: 2-column grid
- **Desktop**: 5-column grid for products, full navigation

## Critical Patterns

### 1. API Layer Architecture

**Location**: `api/fetch.ts`, `services/*.ts`

```typescript
// ALL API calls use this custom wrapper (NOT native fetch)
import { api } from "@/api/fetch";

// Service layer wraps api methods
export const login = async (credentials: LoginRequest) => {
  const response = await api.post<LoginResponse>("/auth/login", credentials, {
    cache: "no-store",
    credentials: "include", // Required for httpOnly cookies
  });
  return response.data;
};
```

**Key behaviors**:

- Automatically handles `ApiResponse<T>` unwrapping
- Auto-redirects to `/dang-nhap` on 401 (except guest pages)
- Adds `Authorization: Bearer {token}` when `auth: true` option is set
- All endpoints are **relative** to `API_FULL_URL` from `api/config.ts`

### 2. Authentication Flow

**Token management**: Zustand store (`store/authStore.ts`) + `api/config.ts`

```typescript
// Login flow
const data = await login(credentials);
setAuth(data.user, data.accessToken); // Updates store + api/config

// Refresh flow (on app load)
restoreSession(); // Called in AuthProvider, uses httpOnly cookie

// Protected routes
<AuthGuard>{children}</AuthGuard> // Redirects if not authenticated
```

**Access token** is stored in memory (Zustand). **Refresh token** is httpOnly cookie (never in JS).

### 3. Server vs Client Components

**Rule**: Components are Server Components by default. Add `"use client"` only when needed.

**Requires client**:

- Event handlers (onClick, onChange)
- Hooks (useState, useEffect, useRouter, useSearchParams)
- Zustand stores, form libraries
- Interactive UI (modals, dropdowns, carousels)

**Examples**:

- `app/layout.tsx` - Server (fetches categories)
- `components/ui/product/ProductCard.tsx` - Client (countdown timer, favorites)
- `components/auth/AuthGuard.tsx` - Client (useRouter, useAuthStore)

### 4. Route Structure

**Vietnamese URL segments** (e.g., `/dang-nhap`, `/dang-ky`, `/danh-muc/[...slug]`)

```
app/
  dang-nhap/page.tsx      # Login
  dang-ky/page.tsx        # Register
  xac-nhan-otp/page.tsx   # OTP verification
  danh-muc/[...slug]/     # Category pages (catch-all)
    CategoryPageClient.tsx  # Client component
    page.tsx                # Server component (data fetching)
  tai-khoan/page.tsx      # User profile (protected)
```

**Pattern**: Server `page.tsx` fetches data, passes to client component for interactivity.

### 5. Form Validation

**Location**: `validations/*.ts`

All forms use **Zod schemas** matching backend validation rules:

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/auth";

const { register, handleSubmit } = useForm({
  resolver: zodResolver(loginSchema),
});
```

**Vietnamese error messages** are embedded in schemas (not i18n files).

### 6. Type System

**Location**: `types/*.ts`

- `types/api.ts` - Generic `ApiResponse<T>`, `PaginatedResponse<T>` (Spring Boot format)
- `types/auth.ts` - Auth-related types
- `types/product.ts`, `types/category.ts` - Domain models

**Import from index**:

```typescript
import { ProductListResponse, CategoryResponse } from "@/types";
```

### 7. Component Organization

**Barrel exports** via `index.ts` in each folder:

```typescript
// components/ui/index.ts
export * from "./category";
export * from "./product";

// Usage
import { ProductCard, CategoryTree } from "@/components/ui";
```

**Layout components** (`components/layout/`): Header, Footer, PageHero
**Auth components** (`components/auth/`): AuthGuard, GuestGuard, RoleGuard, AuthProvider

### 8. Utility Functions

**Date formatting** (`utils/dateTime.ts`):

- `formatFullDateTime()` - Tooltips
- `formatDateForFeed()` - Relative time (< 7 days) or absolute
- Vietnamese locale by default

**Price formatting** (`utils/price.ts`):

- Vietnamese currency format (₫)

**Role hierarchy** (`utils/roleHierarchy.ts`):

- `hasRolePermission(userRole, requiredRole)` - Check role hierarchy (BIDDER < SELLER < ADMIN)
- `hasAnyRolePermission(userRole, allowedRoles)` - Check against multiple roles
- Higher roles automatically have all lower role permissions

### 9. Rich Text Editing

**TinyMCE with Tailwind Typography**:

- Use `@tailwindcss/typography` plugin for rich text content
- Editor wrapper: `<div className="prose prose-sm max-w-none">`
- Display content: `<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />`
- Custom `content_style` in TinyMCE config preserves default HTML styles (headings, lists, etc.)
- This prevents Tailwind CSS reset from overriding semantic HTML styling

### 10. Real-time WebSocket

**Location**: `hooks/useProductComments.ts`

All real-time features use **STOMP over SockJS** with **JWT authentication** and dual-channel broadcasting:

```typescript
import { useProductComments } from "@/hooks/useProductComments";

// For sellers - see unmasked names
const { comments, loading } = useProductComments(productId, { isSeller: true });

// For other users - see masked names
const { comments, loading } = useProductComments(productId, {
  isSeller: false,
});
```

**Channel Architecture**:

- **Public channel**: `/topic/product/{id}/comments` - Masked names for privacy
- **Seller channel**: `/topic/product/{id}/comments/seller` - Unmasked names (authenticated sellers only)

**Event format** (from backend):

```typescript
interface CommentEvent {
  type: "NEW_COMMENT" | "DELETE_COMMENT";
  productId: number;
  comment?: CommentResponse; // For NEW_COMMENT
  commentId?: number; // For DELETE_COMMENT
}
```

**Security Features**:

- JWT token sent in WebSocket CONNECT headers (`Authorization: Bearer {token}`)
- Backend validates JWT and authorizes seller channel subscriptions
- Only product sellers can subscribe to `/topic/product/{id}/comments/seller`
- Public channel remains accessible without authentication

**Backend requirements**:

- WebSocket endpoint must allow public access (`/ws/**` in Spring Security)
- `WebSocketAuthChannelInterceptor` authenticates JWT and authorizes seller channel
- Backend broadcasts to BOTH channels after create operations:
  - Public channel: masked names (`viewerId=null, isSeller=false`)
  - Seller channel: unmasked names (`viewerId=null, isSeller=true`)
- Use `SimpMessagingTemplate.convertAndSend()` after create/delete operations

### 10. Bidding Real-time System

**Location**: `hooks/useProductBids.ts`, `types/bid.ts`

Bidding uses the **same WebSocket architecture** with dual-channel broadcasting and adds automatic bidding algorithm:

```typescript
import { useProductBids } from "@/hooks/useProductBids";

// For sellers - see unmasked names and max bid amounts
const { bids, currentPrice, highestBidder } = useProductBids(productId, {
  isSeller: true,
});

// For bidders - see masked names, own max bid only
const { bids, currentPrice, highestBidder } = useProductBids(productId, {
  isSeller: false,
});
```

**Channel Architecture**:

- **Public channel**: `/topic/product/{id}/bids` - Masked names for privacy
- **Seller channel**: `/topic/product/{id}/bids/seller` - Unmasked names + all max bids

**Event types**:

```typescript
interface BidEvent {
  type: "NEW_BID" | "BID_REJECTED";
  productId: number;
  bid?: BidResponse; // Contains isHighestBidder flag
  bidderId?: number; // For BID_REJECTED (may be at event level or inside bid object)
  currentPrice?: number; // Updated auction price
  highestBidder?: string; // Updated highest bidder name (masked if needed)
}
```

**Critical Pattern - Automatic Bidding Algorithm**:

- **Backend determines `isHighestBidder`** via automatic bidding algorithm (maxBidAmount + chronological tie-breaking)
- Frontend **NEVER** calculates who has the trophy - always uses backend's `isHighestBidder` flag
- When new bid arrives with `isHighestBidder: true`, clear the flag from ALL previous bids

**Critical Pattern - Stale Closure Problem**:

- WebSocket event handlers defined in `useEffect` with dependencies become stale over time
- **Solution**: Handle ALL events inline within the subscription callback, NOT in separate functions
- Use functional state updates `setState((prev) => ...)` to access latest state
- Example:

```typescript
client.subscribe(channel, (message) => {
  const event = JSON.parse(message.body);

  // Handle inline - DO NOT call external function
  if (event.type === "NEW_BID") {
    setBids((prev) => {
      // Use prev to access latest state
      return [event.bid, ...prev];
    });
  }
});
```

**Critical Pattern - Optimistic UI Updates**:

- When user places bid via API, add to UI immediately with `addBidOptimistically()`
- Mark bid ID as ignored in `ignoredBidIdsRef` to prevent duplicate from WebSocket
- Don't delete from ignored set - just skip if seen again
- WebSocket will broadcast to other users, API response updates current user

**Critical Pattern - Real-time State Sync**:

- `useProductBids` returns `currentPrice` and `highestBidder` from WebSocket
- Product detail page syncs these to local state when changed:

```typescript
useEffect(() => {
  if (realtimePrice !== null && realtimePrice !== product.currentPrice) {
    setProduct((prev) =>
      prev ? { ...prev, currentPrice: realtimePrice } : prev,
    );
  }
  if (
    realtimeHighestBidder !== null &&
    realtimeHighestBidder !== product.highestBidderName
  ) {
    setProduct((prev) =>
      prev ? { ...prev, highestBidderName: realtimeHighestBidder } : prev,
    );
  }
}, [realtimePrice, realtimeHighestBidder]);
```

**BID_REJECTED Event Handling**:

- Backend sends `BID_REJECTED` when seller rejects a bidder
- Extract bidderId with fallback: `const rejectedBidderId = event.bidderId || event.bid?.bidderId`
- Filter out all bids from rejected bidder
- Recalculate trophy: Clear all `isHighestBidder` flags, mark first bid as highest
- Update price and highest bidder from event
- Show toast if rejected bidder is current user

**Backend requirements**:

- Backend must set `isHighestBidder: true` ONLY for the actual highest bidder
- Broadcast to BOTH channels after bid operations (NEW_BID, BID_REJECTED)
- Include updated `currentPrice` and `highestBidder` in events
- BID_REJECTED must include either `event.bidderId` or `event.bid.bidderId`

## Development Workflow

### Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run clear-cache  # Delete .next folder
npm run clean-start  # Clear cache + dev
```

### Environment

- No `.env` files committed
- API base URL configured in `api/config.ts`
- Images from Unsplash + Google Drive (see `next.config.ts`)

### State Management

- **Zustand** for global state (currently only `authStore.ts`)
- **Server state** fetched directly in Server Components (no React Query yet)

## Component Conventions

- **No React.FC**: Use plain function component syntax with explicit prop types

  ```typescript
  // Good
  export const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {

  // Bad
  export const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  ```

- **Vietnamese naming**: Use Vietnamese for user-facing routes/text, English for code

2. **Path aliases**: Use `@/*` for imports (configured in `tsconfig.json`)
3. **No generic placeholders**: Use real API responses (see `types/api.ts`)
4. **Protected pages**: Wrap with `<AuthGuard>` or redirect via `useAuthStore`
5. **Pagination**: Spring Boot format (`number`, `size`, `totalElements`, `totalPages`)
6. **Error handling**: Toast notifications via `react-toastify`
7. **reCAPTCHA**: Required for registration (`react-google-recaptcha`)

## Key Files to Reference

- [app/layout.tsx](app/layout.tsx) - Root layout, auth provider setup
- [api/fetch.ts](api/fetch.ts) - API wrapper, error handling
- [store/authStore.ts](store/authStore.ts) - Authentication state
- [types/api.ts](types/api.ts) - Backend response structure
- [validations/auth.ts](validations/auth.ts) - Form validation examples
- [Project requirements.md](Project%20requirements.md) - Full feature spec

## Business Logic Notes

- **Bidding rules**: Users need 80%+ rating or seller permission to bid
- **Product states**: New (< N minutes), Urgent (< 3 days), Ended
- **Multi-role**: Guest → Bidder (after registration) → Seller (after 7-day approval)
- **OTP verification**: Required for email confirmation, password reset
- **Watch lists**: Favorite products tracked per user
