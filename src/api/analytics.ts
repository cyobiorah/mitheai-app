import axiosInstance from "./axios";

/**
 * Fetch content analytics data
 * @param period - Time period for analytics (week, month, quarter)
 */
export const fetchApiAnalytics = async (period: string = "month") => {
  const response = await axiosInstance.get(`/analytics/content?period=${period}`);
  return response;
};

/**
 * Fetch platform-specific analytics
 * @param platform - Social media platform (twitter, instagram, etc.)
 */
export const fetchApiPlatformAnalytics = async (platform: string) => {
  try {
    const response = await axiosInstance.get(`/analytics/platform/${platform}`);
    return response;
  } catch (error) {
    console.error(`Error fetching ${platform} analytics:`, error);
    throw error;
  }
};

/**
 * Export analytics data in specified format
 * @param format - Export format (json, csv)
 */
export const fetchApiExportAnalytics = async (format: string = "json") => {
  const response = await axiosInstance.get(`/analytics/export?format=${format}`, {
    responseType: format === "csv" ? "blob" : "json",
  });
  return response;
};
