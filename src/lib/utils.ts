import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { apiRequest } from "./queryClient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = "PPP") {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "twitter":
      return "ri-twitter-fill";
    case "instagram":
      return "ri-instagram-line";
    case "linkedin":
      return "ri-linkedin-box-fill";
    case "facebook":
      return "ri-facebook-circle-fill";
    case "threads":
      return "ri-stack-fill";
    default:
      return "ri-global-line";
  }
}

// export async function registerUser(userData: any) {
//   const response = await apiRequest("POST", "/auth/register", userData);
//   return response;
// }

// export async function loginUser(credentials: any) {
//   const response = await apiRequest("POST", "/auth/login", credentials);
//   return response;
// }

// export async function logoutUser() {
//   const response = await apiRequest("POST", "/auth/logout");
//   return response;
// }

// export async function getCurrentUser() {
//   const response = await apiRequest("GET", "/users/me");
//   return response;
// }

export async function joinWaitlist(data: any) {
  const response = await apiRequest("POST", "/waitlist", data);
  return response;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Could not copy text: ", err);
    return false;
  }
}

export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
