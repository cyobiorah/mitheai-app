// src/utils/timezoneUtils.ts

import { format, toZonedTime, fromZonedTime } from "date-fns-tz";

// Organized by continent/region for better UX
export const timezoneGroups = {
  Africa: [
    { value: "Africa/Lagos", label: "Lagos (GMT+1)", country: "Nigeria" },
    { value: "Africa/Cairo", label: "Cairo (GMT+2)", country: "Egypt" },
    { value: "Africa/Nairobi", label: "Nairobi (GMT+3)", country: "Kenya" },
    {
      value: "Africa/Johannesburg",
      label: "Johannesburg (GMT+2)",
      country: "South Africa",
    },
    {
      value: "Africa/Casablanca",
      label: "Casablanca (GMT+1)",
      country: "Morocco",
    },
    // Add more African timezones
  ],
  Europe: [
    {
      value: "Europe/London",
      label: "London (GMT+0/+1)",
      country: "United Kingdom",
    },
    { value: "Europe/Paris", label: "Paris (GMT+1/+2)", country: "France" },
    { value: "Europe/Berlin", label: "Berlin (GMT+1/+2)", country: "Germany" },
    // Add more European timezones
  ],
  Americas: [
    { value: "America/New_York", label: "New York (GMT-5/-4)", country: "USA" },
    { value: "America/Chicago", label: "Chicago (GMT-6/-5)", country: "USA" },
    {
      value: "America/Los_Angeles",
      label: "Los Angeles (GMT-8/-7)",
      country: "USA",
    },
    {
      value: "America/Toronto",
      label: "Toronto (GMT-5/-4)",
      country: "Canada",
    },
    {
      value: "America/Sao_Paulo",
      label: "São Paulo (GMT-3)",
      country: "Brazil",
    },
    // Add more American timezones
  ],
  Asia: [
    { value: "Asia/Tokyo", label: "Tokyo (GMT+9)", country: "Japan" },
    { value: "Asia/Shanghai", label: "Shanghai (GMT+8)", country: "China" },
    { value: "Asia/Dubai", label: "Dubai (GMT+4)", country: "UAE" },
    {
      value: "Asia/Kolkata",
      label: "Mumbai/Delhi (GMT+5:30)",
      country: "India",
    },
    // Add more Asian timezones
  ],
  Pacific: [
    {
      value: "Pacific/Auckland",
      label: "Auckland (GMT+12/+13)",
      country: "New Zealand",
    },
    {
      value: "Australia/Sydney",
      label: "Sydney (GMT+10/+11)",
      country: "Australia",
    },
    // Add more Pacific timezones
  ],
};

// Flat list for simple dropdown usage
export const allTimezones = Object.values(timezoneGroups).flat();

// Default timezone (UTC)
export const DEFAULT_TIMEZONE = "UTC";

// Convert UTC date to user's timezone
export function toUserTimezone(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  const utcDate = typeof date === "string" ? new Date(date) : date;
  return toZonedTime(utcDate, timezone);
}

// Convert user's local time to UTC for storage
export function toUTC(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  const localDate = typeof date === "string" ? new Date(date) : date;
  return fromZonedTime(localDate, timezone);
}

// Format date in user's timezone with specified format
export function formatInTimezone(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
  formatStr: string = "yyyy-MM-dd HH:mm:ss"
): string {
  const zonedDate = toUserTimezone(date, timezone);
  return format(zonedDate, formatStr, { timeZone: timezone });
}

// Get current time in user's timezone
export function getCurrentTimeInTimezone(
  timezone: string = DEFAULT_TIMEZONE
): Date {
  return toUserTimezone(new Date(), timezone);
}

// Detect user's timezone from browser
export function detectUserTimezone(): string {
  if (typeof Intl !== "undefined") {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return DEFAULT_TIMEZONE;
}

// Check if a timezone is valid
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (e) {
    return false;
  }
}
