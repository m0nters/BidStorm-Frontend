import { setAccessToken as setApiAccessToken } from "@/api/config";
import { refreshAccessToken } from "@/services/auth";
import { AuthState, UserInfo } from "@/types/auth";
import { create } from "zustand";

interface AuthStore extends AuthState {
  isInitializing: boolean;
  setAuth: (user: UserInfo | null, accessToken: string | null) => void;
  clearAuth: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true, // Start as true, will be set to false after restore attempt

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: !!user && !!accessToken,
      isInitializing: false,
    });
    setApiAccessToken(accessToken);
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: false,
    });
    setApiAccessToken(null);
  },

  restoreSession: async () => {
    try {
      const data = await refreshAccessToken();
      set({
        user: data.user,
        accessToken: data.accessToken,
        isAuthenticated: true,
        isInitializing: false,
      });
      setApiAccessToken(data.accessToken);
    } catch (error) {
      console.error("Failed to restore session:", error);
      // Still set isInitializing to false even on error
      set({ isInitializing: false });
    }
  },
}));
