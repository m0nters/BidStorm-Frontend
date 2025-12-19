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

### 9. Real-time WebSocket

**Location**: `hooks/useProductComments.ts`

All real-time features use **STOMP over SockJS** connecting to backend `/ws` endpoint:

```typescript
import { useProductComments } from "@/hooks/useProductComments";

const { comments, loading } = useProductComments(productId);
```

**Event format** (from backend):

```typescript
interface CommentEvent {
  type: "NEW_COMMENT" | "DELETE_COMMENT";
  productId: number;
  comment?: CommentResponse; // For NEW_COMMENT
  commentId?: number; // For DELETE_COMMENT
}
```

**Backend requirements**:

- WebSocket endpoint must allow public access (`/ws/**` in Spring Security)
- Backend broadcasts to `/topic/product/{productId}/comments`
- Use `SimpMessagingTemplate.convertAndSend()` after create/delete operations

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

## Project-Specific Conventions

1. **Vietnamese naming**: Use Vietnamese for user-facing routes/text, English for code
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
