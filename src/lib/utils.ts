import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { apiRequest } from "./queryClient";
import axiosInstance from "../api/axios";
import { MediaItem } from "../components/posting/MediaUpload";

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
      return "ri-stack-fill";
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

type UploadedMedia = {
  url: string;
  publicId: string;
  type: "image" | "video";
  resourceType: string;
};

// export async function uploadMediaToCloudinary(
//   files: File[],
//   folder = "skedlii"
// ): Promise<UploadedMedia[]> {
//   const results: UploadedMedia[] = [];

//   for (const file of files) {
//     const public_id = `${file.name.split(".")[0]}-${Date.now()}`;

//     const signatureRes = await fetch("/api/media/cloudinary/signature", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ public_id, folder }),
//     });

//     if (!signatureRes.ok) {
//       throw new Error("Failed to get Cloudinary signature");
//     }

//     const { signature, timestamp, apiKey, cloudName } =
//       await signatureRes.json();

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("api_key", apiKey);
//     formData.append("timestamp", timestamp);
//     formData.append("signature", signature);
//     formData.append("folder", folder);
//     formData.append("public_id", public_id);

//     const cloudRes = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await cloudRes.json();

//     if (!data.secure_url) {
//       throw new Error("Cloudinary upload failed");
//     }

//     results.push({
//       url: data.secure_url,
//       publicId: data.public_id,
//       type: file.type.startsWith("video/") ? "video" : "image",
//       resourceType: data.resource_type,
//     });
//   }

//   return results;
// }

export const uploadToCloudinary = async (
  file: File
): Promise<MediaItem | null> => {
  const isImage = file.type.startsWith("image/");
  const public_id = `${file.name}-${Date.now()}`;

  const signatureRes = await axiosInstance.post("/media/cloudinary/signature", {
    public_id,
    folder: "skedlii",
  });

  if (!signatureRes.data) {
    throw new Error("Failed to get Cloudinary signature");
  }

  console.log({ signatureRes });

  const { timestamp, signature, apiKey, cloudName } = await signatureRes.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("public_id", public_id);
  formData.append("folder", "skedlii");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await uploadRes.json();
  if (!data.secure_url) return null;

  return {
    id: public_id,
    file,
    type: isImage ? "image" : "video",
    url: data.secure_url,
    thumbnailUrl: isImage ? data.secure_url : undefined,
    thumbnailTime: 0,
  };
};
