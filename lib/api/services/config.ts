import { fetchApi } from "../fetch";

/**
 * Get auto extend trigger time in minutes
 * This determines when auto-extension is triggered before auction end
 */
export const getAutoExtendTriggerMin = async () => {
  const response = await fetchApi.get<number>(
    "/config/auto-extend-trigger-min",
    {
      next: {
        revalidate: 3600, // Cache for 1 hour (config rarely changes)
        tags: ["config"],
      },
    },
  );
  return response.data;
};

/**
 * Get auto extend duration in minutes
 * This determines how many minutes to extend the auction by
 */
export const getAutoExtendByMin = async () => {
  const response = await fetchApi.get<number>("/config/auto-extend-by-min", {
    next: {
      revalidate: 3600, // Cache for 1 hour (config rarely changes)
      tags: ["config"],
    },
  });
  return response.data;
};
