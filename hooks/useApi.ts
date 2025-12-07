import { ApiErrorResponse } from "@/types/api";
import { useCallback, useState } from "react";

/**
 * Custom hook for handling API calls with loading and error states
 *
 * @example
 * const { data, loading, error, execute } = useApi(getProducts);
 *
 * useEffect(() => {
 *   execute();
 * }, []);
 */
export function useApi<T, Args extends any[] = []>(
  apiFunction: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const apiError = err as ApiErrorResponse;
        setError(apiError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for immediate API call on component mount
 */
export function useApiOnMount<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const { data, loading, error, execute } = useApi(apiFunction);

  useState(() => {
    execute();
  });

  return { data, loading, error, refetch: execute };
}
