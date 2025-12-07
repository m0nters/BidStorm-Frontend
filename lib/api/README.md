# API Client Documentation

This directory contains the **hybrid API client** setup for communicating with the backend server.

## 🎯 Hybrid Approach

This project uses **TWO API clients** to leverage the best of both worlds:

1. **Axios** (`api`) - For Client Components, real-time updates, JWT interceptors
2. **Next.js Fetch** (`fetchApi`) - For Server Components, caching, revalidation

## Structure

- `config.ts` - Axios instance configuration, interceptors, and token management
- `client.ts` - Axios-based API methods (GET, POST, PUT, DELETE, PATCH, upload)
- `fetch.ts` - Next.js enhanced fetch with caching and revalidation
- `index.ts` - Exports all API modules
- `services/` - Individual API service modules (auth, products, bids, etc.)
  - `*-client.ts` - Client Component services (uses Axios)
  - `*-server.ts` - Server Component services (uses fetch)

## 🤔 When to Use Which?

### Use `fetchApi` (Next.js fetch) when:

- ✅ Fetching data in **Server Components**

````typescript
"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

function ProductActions() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Client-side fetch, no caching
    api.get<Product[]>("/api/products").then((response) => {
      setProducts(response.data);
    });
  }, []);

  // Other examples
  const handleSubmit = async () => {
- ✅ Client Components with user interactions
- ✅ **Authenticated requests** (JWT token auto-added)
- ✅ Real-time updates (bidding, notifications)
- ✅ Form submissions
- ✅ File uploads with progress tracking
- ✅ Need request/response interceptors

## Usage

### Server Components (with caching)

```typescript
import { fetchApi } from "@/lib/api";

// In a Server Component
async function ProductsPage() {
  // This will be cached and revalidated every 5 minutes
  const response = await fetchApi.get<Product[]>("/api/products", {
    next: { revalidate: 300 }
  });

  return <ProductList products={response.data} />;
    // POST request
    const response = await api.post<CreateResponse>("/api/products", {
      name: "Product Name",
      price: 100000,
    });

    // PUT request
    await api.put("/api/products/123", { name: "Updated" });

    // DELETE request
    await api.delete("/api/products/123");
  };
}
````

### Next.js Caching Examples

````typescript
import { fetchApi } from "@/lib/api";

// 1. Cache indefinitely (static data)
const categories = await fetchApi.get("/api/categories", {
  cache: "force-cache"
});

// 2. Never cache (always fresh)
const bids = await fetchApi.get("/api/bids/live", {
  cache: "no-store"
});

// 3. Revalidate every hour
const products = await fetchApi.get("/api/products", {
  next: { revalidate: 3600 }
});

// 4. Tag for on-demand revalidation
const product = await fetchApi.get(`/api/products/${id}`, {
  next: {
    revalidate: 60,
    tags: [`product-${id}`]
  }
});

// Later, revalidate with:
// revalidateTag(`product-${id}`)
```st response = await api.post<CreateResponse>("/api/products", {
  name: "Product Name",
  price: 100000,
});

// PUT request
const response = await api.put<UpdateResponse>("/api/products/123", {
  name: "Updated Name",
});

// DELETE request
const response = await api.delete<DeleteResponse>("/api/products/123");
````

### Authentication

```typescript
import { setAccessToken, clearAccessToken } from "@/lib/api";

// After successful login
setAccessToken(loginResponse.accessToken);

// On logout
clearAccessToken();

// Token is automatically added to all subsequent requests
```

### Error Handling

```typescript
import { ApiErrorResponse } from "@/types/api";

try {
  const response = await api.post("/api/auth/login", credentials);
  // Handle success
} catch (error) {
  const apiError = error as ApiErrorResponse;

  console.log(apiError.message); // General error message
  console.log(apiError.status); // HTTP status code

  // Handle field-specific errors
  if (apiError.details) {
    apiError.details.forEach((detail) => {
      console.log(`${detail.field}: ${detail.message}`);
    });
  }
}
```

### Using with React Hook

````typescript
import { useApi } from "@/hooks/useApi";
import { getProducts } from "@/lib/api/services/products";

function ProductList() {
  const { data, loading, error, execute } = useApi(getProducts);

  useEffect(() => {
## Creating Service Modules

Create **TWO** service files for each resource:

### 1. Client-side service (`*-client.ts`)
```typescript
// lib/api/services/products-client.ts
"use client";

import api from "../client";
import { Product } from "@/types";

export const getProducts = async () => {
  const response = await api.get<Product[]>("/api/products");
  return response.data;
};

export const createProduct = async (data: CreateProductDto) => {
  const response = await api.post<Product>("/api/products", data);
  return response.data;
};
````

### 2. Server-side service (`*-server.ts`)

````typescript
// lib/api/services/products-server.ts
import { fetchApi } from "../fetch";
import { Product } from "@/types";

export const getProducts = async () => {
  const response = await fetchApi.get<Product[]>("/api/products", {
    next: { revalidate: 300 } // Cache 5 minutes
  });
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await fetchApi.get<Product>(`/api/products/${id}`, {
    next: { revalidate: 60, tags: [`product-${id}`] }
  });
  return response.data;
};
```ormData.append("file", file);

  const response = await api.upload<{ url: string }>("/api/upload", formData);
## Features

### Axios (`api`)
- ✅ Automatic JWT token handling via interceptors
- ✅ Request/response transformation
- ✅ Consistent error handling
- ✅ Automatic 401 handling (redirect to login)
- ✅ File upload with progress tracking
- ✅ Request/response interceptors
- ✅ Timeout handling

### Next.js Fetch (`fetchApi`)
- ✅ Server-side rendering support
- ✅ Automatic request deduplication
- ✅ Built-in caching with `cache` option
- ✅ ISR with `revalidate`
- ✅ On-demand revalidation with tags
- ✅ Streaming and Server Actions ready
- ✅ JWT token support (manual via `auth: true`)

### Both
- ✅ TypeScript type safety
- ✅ Consistent error format
- ✅ Network error handling
- ✅ Query parameter support

## 📋 Best Practices

1. **Use fetchApi in Server Components** for better performance and SEO
2. **Use api in Client Components** for interactivity and real-time updates
3. **Cache public data** (categories, product lists) with `revalidate`
4. **Don't cache user-specific data** (profile, orders, bids)
5. **Use tags** for on-demand revalidation when data changes
6. **Use `cache: 'no-store'`** for real-time data (live bids, countdowns)
    q: "laptop",
    category: "electronics",
    page: 1,
    limit: 20,
  },
});
````

## Creating Service Modules

Create service files in `services/` directory for organized API endpoints:

```typescript
// lib/api/services/products.ts
import api from "../client";
import { Product } from "@/types";

export const getProducts = async () => {
  const response = await api.get<Product[]>("/api/products");
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get<Product>(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (data: CreateProductDto) => {
  const response = await api.post<Product>("/api/products", data);
  return response.data;
};
```

## Environment Variables

Set the API base URL in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Features

- ✅ Automatic JWT token handling
- ✅ Request/response interceptors
- ✅ Consistent error handling
- ✅ TypeScript type safety
- ✅ Network error handling
- ✅ Automatic 401 handling (redirect to login)
- ✅ File upload support
- ✅ Query parameter support
