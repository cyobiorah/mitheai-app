import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { apiRequest } from "./queryClient";
import axiosInstance from "../api/axios";
import { MediaItem } from "../components/posts/post-flow/mediaUploadComponents";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDateKey = (date: string) =>
  format(parseISO(date), "yyyy-MM-dd");

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
      return "ri-threads-line";
    case "tiktok":
      return "ri-tiktok-line";
    case "youtube":
      return "ri-youtube-line";
    default:
      return "ri-global-line";
  }
}

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

export function getClassName(platform: string) {
  switch (platform) {
    case "twitter":
      return "bg-blue-50 dark:bg-blue-900/20";
    case "instagram":
      return "bg-pink-50 dark:bg-pink-900/20";
    case "linkedin":
      return "bg-blue-50 dark:bg-blue-900/20";
    case "facebook":
      return "bg-blue-50 dark:bg-blue-900/20";
    case "threads":
      return "bg-black dark:bg-white dark:text-black";
    default:
      return "bg-gray-50 dark:bg-gray-800";
  }
}

export function getTextColor(platform: string) {
  switch (platform) {
    case "twitter":
      return "text-blue-500";
    case "instagram":
      return "text-pink-500";
    case "linkedin":
      return "text-blue-600";
    case "threads":
      return "text-black dark:text-white";
    default:
      return "text-gray-500";
  }
}

export type UploadedMedia = {
  url: string;
  publicId: string;
  type: "image" | "video";
  resourceType: string;
};

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<MediaItem | null> {
  const publicId = `${file.name.split(".")[0]}-${Date.now()}`;

  const res = await axiosInstance.post("/media/cloudinary/signature", {
    public_id: publicId,
    folder: "skedlii",
  });

  if (!res.data) throw new Error("Failed to get Cloudinary signature");
  const { signature, timestamp, apiKey, cloudName } = res.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("public_id", publicId);
  formData.append("folder", "skedlii");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              id: publicId,
              url: data.secure_url,
              file,
              type: file.type.startsWith("video/") ? "video" : "image",
              thumbnailUrl: file.type.startsWith("video/")
                ? "" // You may add thumbnail logic later
                : data.secure_url,
              thumbnailTime: 0,
            });
          } else {
            reject(new Error(data.error?.message ?? "Upload failed"));
          }
        } catch (err) {
          reject(err as Error);
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
    );
    xhr.send(formData);
  });
}
