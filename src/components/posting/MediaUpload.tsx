import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Image, Upload, X, FileImage, FileVideo } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { TabsList, TabsTrigger } from "../ui/tabs";

// Media item interface
export interface MediaItem {
  file: File;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  thumbnailTime?: number; // For videos, the time position for thumbnail
}

interface MediaUploadProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

export default function MediaUpload({ media, onChange }: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [videoPreviewElement, setVideoPreviewElement] =
    useState<HTMLVideoElement | null>(null);

  // When media changes, set the active tab
  useEffect(() => {
    if (media.length > 0) {
      setActiveTab("preview");
    } else {
      setActiveTab("upload");
    }
  }, [media]);

  // Trigger file input click when upload button is clicked
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  // Validate file type and size
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

  // Process files for upload
  const processFiles = (files: FileList) => {
    // Validate and process up to 10 files
    const validFiles = Array.from(files)
      .slice(0, 10 - media.length)
      .filter((file) => {
        const validation = validateFile(file);
        if (!validation.valid) {
          console.error(validation.message);
          return false;
        }
        return true;
      });

    if (validFiles.length === 0) return;

    // Simulate upload
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);

        // Process each file and create media items
        const processFilePromises = validFiles.map(async (file) => {
          const isImage = file.type.startsWith("image/");
          const url = URL.createObjectURL(file);

          const newItem: MediaItem = {
            file,
            type: isImage ? "image" : "video",
            url,
          };

          // For videos, generate a thumbnail at 0 seconds
          if (!isImage) {
            try {
              const thumbnailUrl = await extractVideoThumbnail(file, 0);
              if (thumbnailUrl) {
                newItem.thumbnailUrl = thumbnailUrl;
                newItem.thumbnailTime = 0;
              }
            } catch (error) {
              console.error("Error generating thumbnail:", error);
            }
          }

          return newItem;
        });

        Promise.all(processFilePromises).then((newItems) => {
          onChange([...media, ...newItems]);
        });
      }
    }, 200);
  };

  // Extract thumbnail from video
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
        // Make sure we seek to a valid time
        const seekTime = Math.min(time, video.duration);
        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL("image/jpeg");
          URL.revokeObjectURL(url);
          resolve(thumbnailUrl);
        } else {
          URL.revokeObjectURL(url);
          reject(new Error("Could not get canvas context"));
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Error loading video"));
      };
    });
  };

  // Remove a media item
  const removeMediaItem = (index: number) => {
    const newMedia = [...media];

    // Revoke URL to avoid memory leaks
    URL.revokeObjectURL(newMedia[index].url);
    if (
      newMedia[index].thumbnailUrl &&
      newMedia[index].thumbnailUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(newMedia[index].thumbnailUrl);
    }

    newMedia.splice(index, 1);
    onChange(newMedia);
  };

  // Update video thumbnail time
  const updateVideoThumbnailTime = async (index: number, time: number) => {
    const item = media[index];
    if (item.type !== "video") return;

    try {
      const thumbnailUrl = await extractVideoThumbnail(item.file, time);
      if (thumbnailUrl) {
        const newMedia = [...media];

        // Revoke old thumbnail URL to avoid memory leaks
        if (
          newMedia[index].thumbnailUrl &&
          newMedia[index].thumbnailUrl.startsWith("blob:")
        ) {
          URL.revokeObjectURL(newMedia[index].thumbnailUrl);
        }

        newMedia[index] = {
          ...newMedia[index],
          thumbnailUrl,
          thumbnailTime: time,
        };

        onChange(newMedia);
      }
    } catch (error) {
      console.error("Error updating thumbnail:", error);
    }
  };

  // Set up video preview element refs
  const handleVideoRef = (element: HTMLVideoElement | null, index: number) => {
    if (index === 0) {
      setVideoPreviewElement(element);
    }
  };

  // Handle seeking in the video
  const handleVideoSeek = (index: number, value: number[]) => {
    const time = value[0];

    // Update the video's current time if we have a reference to it
    if (videoPreviewElement && index === 0) {
      videoPreviewElement.currentTime = time;
    }

    // Start a debounce to update the thumbnail
    const item = media[index];
    const debounceTimeout = setTimeout(() => {
      if (item && item.type === "video") {
        updateVideoThumbnailTime(index, time);
      }
    }, 200);

    return () => clearTimeout(debounceTimeout);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Media</CardTitle>
            <CardDescription>Add photos or videos to your post</CardDescription>
          </div>

          <TabsList>
            <TabsTrigger
              value="upload"
              onClick={() => setActiveTab("upload")}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              onClick={() => setActiveTab("preview")}
              disabled={media.length === 0 || isUploading}
            >
              <Image className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "upload" && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            } transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
              multiple
              onChange={handleFileInputChange}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
                <div className="text-center">
                  <p className="text-lg font-medium">Uploading...</p>
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 flex items-center justify-center mx-auto">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    Drag & drop files here
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Support JPG, PNG, GIF, WebP, MP4 and QuickTime up to 50MB
                  </p>
                </div>
                <Button onClick={handleUploadClick} disabled={isUploading}>
                  Select Files
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "preview" && media.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center bg-black rounded-lg overflow-hidden">
              {/* Main preview */}
              {media[0].type === "image" ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={media[0].url}
                    alt="Media preview"
                    className="max-h-[400px] object-contain"
                  />
                </div>
              ) : (
                <div className="w-full">
                  <video
                    ref={(el) => handleVideoRef(el, 0)}
                    src={media[0].url}
                    controls
                    className="w-full max-h-[400px] object-contain"
                  />

                  {/* Video thumbnail control */}
                  <div className="p-3 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Label
                        htmlFor="thumbnail-time"
                        className="text-white text-sm whitespace-nowrap"
                      >
                        Cover frame:
                      </Label>
                      <div className="flex-1">
                        <Slider
                          id="thumbnail-time"
                          defaultValue={[media[0].thumbnailTime || 0]}
                          max={
                            videoPreviewElement
                              ? Math.floor(videoPreviewElement.duration)
                              : 100
                          }
                          step={1}
                          onValueChange={(value: any) =>
                            handleVideoSeek(0, value)
                          }
                        />
                      </div>
                      <span className="text-white text-xs whitespace-nowrap">
                        {media[0].thumbnailTime || 0}s
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails of media */}
            {media.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {media.map((item, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square border rounded-md overflow-hidden ${
                      index === 0 ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.thumbnailUrl || ""}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs flex items-center justify-center">
                        {item.type === "image" ? (
                          <FileImage className="h-3 w-3 mr-1" />
                        ) : (
                          <FileVideo className="h-3 w-3 mr-1" />
                        )}
                        {index === 0 ? "Cover" : `#${index + 1}`}
                      </div>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 rounded-full"
                            onClick={() => removeMediaItem(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            )}

            {/* Upload more button */}
            {media.length < 10 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add More Media ({media.length}/10)
                </Button>
              </div>
            )}

            {/* Media limits info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Optimal dimensions: 1080 x 1080px (1:1 ratio)</p>
              <p>Maximum files: 10 (You've used {media.length})</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
