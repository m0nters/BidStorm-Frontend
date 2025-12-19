"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

/**
 * The access token is stored in memory via Zustand store.
 * Therefore, on page reload, it's lost. We need to restore the session
 * by calling the refresh token endpoint to get a new access token.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return <>{children}</>;
}
