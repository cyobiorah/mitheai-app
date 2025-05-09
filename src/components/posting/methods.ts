import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { MediaItem } from "./uploadComponents";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "../../hooks/use-toast";
import { uploadToCloudinary } from "../../lib/utils";

export const removeMediaItem = (
  idToRemove: string,
  media: MediaItem[],
  onChange: (media: MediaItem[]) => void
) => {
  const itemToRemove = media.find((m) => m.id === idToRemove);
  if (itemToRemove) {
    URL.revokeObjectURL(itemToRemove.url);
    if (itemToRemove.thumbnailUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(itemToRemove.thumbnailUrl);
    }
  }
  onChange(media.filter((item) => item.id !== idToRemove));
};

export const handleVideoRef = (
  element: HTMLVideoElement | null,
  itemId: string,
  media: MediaItem[],
  setVideoPreviewElement: React.Dispatch<
    React.SetStateAction<HTMLVideoElement | null>
  >
) => {
  if (media.length > 0 && media[0].id === itemId) {
    setVideoPreviewElement(element);
  }
};

export const handleDragCancel = (
  setActiveDragId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setActiveDragId(null);
};

export const handleDragStart = (
  event: DragStartEvent,
  setActiveDragId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setActiveDragId(event.active.id as string);
};

export const handleDragEnd = (
  event: DragEndEvent,
  setActiveDragId: React.Dispatch<React.SetStateAction<string | null>>,
  media: MediaItem[],
  onChange: (media: MediaItem[]) => void
) => {
  setActiveDragId(null);
  const { active, over } = event;
  if (over && active.id !== over.id) {
    const oldIndex = media.findIndex((item) => item.id === active.id);
    const newIndex = media.findIndex((item) => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(media, oldIndex, newIndex));
    }
  }
};

export const handleVideoSeek = (
  itemId: string,
  value: number[],
  media: MediaItem[],
  videoPreviewElement: HTMLVideoElement | null,
  updateVideoThumbnailTime: (itemId: string, time: number) => void
) => {
  const time = value[0];
  const item = media.find((m) => m.id === itemId);

  if (videoPreviewElement && media.length > 0 && media[0].id === itemId) {
    videoPreviewElement.currentTime = time;
  }

  if (item && item.type === "video") {
    updateVideoThumbnailTime(itemId, time);
  }
};

export const updateVideoThumbnailTime = async (
  idToUpdate: string,
  time: number,
  media: MediaItem[],
  onChange: (media: MediaItem[]) => void
) => {
  const itemIndex = media.findIndex((m) => m.id === idToUpdate);
  if (itemIndex === -1 || media[itemIndex].type !== "video") return;

  const item = media[itemIndex];
  try {
    const thumbnailUrl = await extractVideoThumbnail(item.file, time);
    if (thumbnailUrl) {
      const newMedia = [...media];
      if (newMedia[itemIndex].thumbnailUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(newMedia[itemIndex].thumbnailUrl);
      }
      newMedia[itemIndex] = {
        ...newMedia[itemIndex],
        thumbnailUrl,
        thumbnailTime: time,
      };
      onChange(newMedia);
    }
  } catch (error) {
    console.error("Error updating thumbnail:", error);
  }
};

const extractVideoThumbnail = async (
  file: File,
  time: number
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(time, video.duration || 0);
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg");
        URL.revokeObjectURL(url); // Revoke object URL after use
        resolve(thumbnailUrl);
      } else {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get canvas context"));
      }
    };
    video.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error(`Error loading video: ${err as string}`));
    };
  });
};

export const handleUploadClick = (
  fileInputRef: React.RefObject<HTMLInputElement>
) => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

export const handleFileInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  fileInputRef: React.RefObject<HTMLInputElement>,
  media: MediaItem[],
  onChange: (media: MediaItem[]) => void,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    processFiles(files, media, onChange, setIsUploading, setUploadProgress);
  }
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

export const processFiles = async (
  files: FileList,
  media: MediaItem[],
  onChange: (media: MediaItem[]) => void,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const validFiles = Array.from(files)
    .slice(0, 10 - media.length)
    .filter((file) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        console.error(validation.message);
        // Consider showing this error to the user via a toast or message
        return false;
      }
      return true;
    });

  if (validFiles.length === 0) return;

  setIsUploading(true);

  const uploadPromises = validFiles.map((file) =>
    uploadToCloudinary(file, (percent) => {
      setUploadProgress(percent);
    })
  );

  try {
    const uploaded = await Promise.all(uploadPromises);
    onChange([...media, ...(uploaded.filter(Boolean) as MediaItem[])]);
    setIsUploading(false);
  } catch (error) {
    console.error("Error uploading files:", error);
    setIsUploading(false);
    toast({
      title: "Error",
      description: "Error uploading files",
      variant: "destructive",
    });
  }
};

const validateFile = (file: File): { valid: boolean; message?: string } => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const videoTypes = ["video/mp4", "video/quicktime", "video/webm"];
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!imageTypes.includes(file.type) && !videoTypes.includes(file.type)) {
    return {
      valid: false,
      message:
        "Unsupported file type. Please upload images (JPG, PNG, GIF, WebP) or videos (MP4, QuickTime, WebM).",
    };
  }
  if (file.size > maxSize) {
    return {
      valid: false,
      message: "File is too large. Maximum size is 50MB.",
    };
  }
  return { valid: true };
};

export const handleDragOverEvent = (
  e: React.DragEvent<HTMLButtonElement>,
  setDragOver: React.Dispatch<React.SetStateAction<boolean>>
) => {
  e.preventDefault();
  setDragOver(true);
};

export const handleDragLeaveEvent = (
  e: React.DragEvent<HTMLButtonElement>,
  setDragOver: React.Dispatch<React.SetStateAction<boolean>>
) => {
  e.preventDefault();
  setDragOver(false);
};

export const handleDropEvent = (
  e: React.DragEvent<HTMLButtonElement>,
  setDragOver: React.Dispatch<React.SetStateAction<boolean>>,
  media: MediaItem[],
  onChange: (media: MediaItem[]) => void,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  e.preventDefault();
  setDragOver(false);
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processFiles(files, media, onChange, setIsUploading, setUploadProgress);
  }
};
