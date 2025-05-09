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
import { TabsList, TabsTrigger } from "../ui/tabs"; // Assuming this path is correct, e.g. ../../components/ui/tabs
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  Active,
  Over,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "../../hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { uploadToCloudinary } from "../../lib/utils";

// Media item interface
export interface MediaItem {
  id: string; // Add a stable unique ID for dnd-kit items
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

// Component to display the media item, used in SortableMediaItem and DragOverlay
function MediaItemDisplayContent({
  item,
  index,
  isCover,
}: {
  item: MediaItem;
  index: number;
  isCover: boolean;
}) {
  return (
    <>
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
        {item.type === "image" ? (
          <img
            src={item.url}
            alt={`Media ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item.thumbnailUrl || ""} // Provide a fallback empty string for thumbnailUrl
            alt={`Media ${index + 1}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs flex items-center justify-center pointer-events-none">
        {item.type === "image" ? (
          <FileImage className="h-3 w-3 mr-1" />
        ) : (
          <FileVideo className="h-3 w-3 mr-1" />
        )}
        {isCover ? "Cover" : `#${index + 1}`}
      </div>
    </>
  );
}

// Sortable Media Item Component
function SortableMediaItem({
  item,
  index,
  onRemove,
}: {
  item: MediaItem;
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined, // Ensure dragged item placeholder doesn't overlap overlay
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative aspect-square border rounded-md overflow-hidden cursor-move ${
        index === 0 ? "ring-2 ring-primary" : "shadow-sm"
      }
      }`}
    >
      <MediaItemDisplayContent
        item={item}
        index={index}
        isCover={index === 0}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-5 w-5 rounded-full z-20" // Ensure button is above overlays
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag from starting on remove click
                onRemove();
              }}
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
  );
}

// Draggable Overlay Item (for ghosting effect)
function DraggableOverlayItem({
  item,
  index,
}: {
  item: MediaItem;
  index: number;
}) {
  return (
    <div
      className={`relative aspect-square border rounded-md overflow-hidden shadow-2xl ${
        index === 0 ? "ring-2 ring-primary" : ""
      } bg-background`}
    >
      <MediaItemDisplayContent
        item={item}
        index={index}
        isCover={index === 0}
      />
    </div>
  );
}

export default function MediaUpload({
  media,
  onChange,
}: Readonly<MediaUploadProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [videoPreviewElement, setVideoPreviewElement] =
    useState<HTMLVideoElement | null>(null);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  useEffect(() => {
    if (media.length > 0) {
      setActiveTab("preview");
    } else {
      setActiveTab("upload");
    }
  }, [media]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOverEvent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeaveEvent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDropEvent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
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

  const processFiles = async (files: FileList) => {
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

    // let progress = 0;
    // const interval = setInterval(() => {
    //   progress += 10;
    //   setUploadProgress(progress);
    //   if (progress >= 100) {
    //     clearInterval(interval);
    //     setIsUploading(false);
    //     setUploadProgress(0);

    //     const processFilePromises = validFiles.map(async (file, idx) => {
    //       const isImage = file.type.startsWith("image/");
    //       const url = URL.createObjectURL(file);
    //       // Create a more stable ID, e.g., using file name, size, and a timestamp/random element
    //       const uniqueId = `${file.name}-${file.size}-${Date.now()}-${idx}`;

    //       const newItem: MediaItem = {
    //         id: uniqueId,
    //         file,
    //         type: isImage ? "image" : "video",
    //         url,
    //       };

    //       if (!isImage) {
    //         try {
    //           const thumbnailUrl = await extractVideoThumbnail(file, 0);
    //           if (thumbnailUrl) {
    //             newItem.thumbnailUrl = thumbnailUrl;
    //             newItem.thumbnailTime = 0;
    //           }
    //         } catch (error) {
    //           console.error("Error generating thumbnail:", error);
    //         }
    //       }
    //       return newItem;
    //     });

    //     Promise.all(processFilePromises).then((newItems) => {
    //       onChange([
    //         ...media,
    //         ...newItems.filter((item) => item !== null),
    //       ] as MediaItem[]);
    //     });
    //   }
    // }, 200);

    const uploadPromises = validFiles.map((file) => uploadToCloudinary(file));
    try {
      const uploaded = await Promise.all(uploadPromises);
      onChange([...media, ...(uploaded.filter(Boolean) as MediaItem[])]);
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
        reject(new Error(`Error loading video: ${err}`));
      };
    });
  };

  const removeMediaItem = (idToRemove: string) => {
    const itemToRemove = media.find((m) => m.id === idToRemove);
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.url);
      if (itemToRemove.thumbnailUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(itemToRemove.thumbnailUrl);
      }
    }
    onChange(media.filter((item) => item.id !== idToRemove));
  };

  const updateVideoThumbnailTime = async (idToUpdate: string, time: number) => {
    const itemIndex = media.findIndex((m) => m.id === idToUpdate);
    if (itemIndex === -1 || media[itemIndex].type !== "video") return;

    const item = media[itemIndex];
    try {
      const thumbnailUrl = await extractVideoThumbnail(item.file, time);
      if (thumbnailUrl) {
        const newMedia = [...media];
        if (newMedia[itemIndex].thumbnailUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(newMedia[itemIndex].thumbnailUrl!);
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

  const handleVideoRef = (element: HTMLVideoElement | null, itemId: string) => {
    // Assuming the main preview always shows media[0]
    if (media.length > 0 && media[0].id === itemId) {
      setVideoPreviewElement(element);
    }
  };

  const handleVideoSeek = (itemId: string, value: number[]) => {
    const time = value[0];
    const item = media.find((m) => m.id === itemId);

    if (videoPreviewElement && media.length > 0 && media[0].id === itemId) {
      videoPreviewElement.currentTime = time;
    }

    // Debounce thumbnail update
    // (Original code had a setTimeout, consider implementing a proper debounce if needed)
    if (item && item.type === "video") {
      updateVideoThumbnailTime(itemId, time);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before starting a drag
      // Helps prevent accidental drags when clicking buttons inside items
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  const activeDraggedItem = activeDragId
    ? media.find((item) => item.id === activeDragId)
    : null;
  const activeDraggedItemIndex = activeDraggedItem
    ? media.indexOf(activeDraggedItem)
    : -1;

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
              Preview ({media.length})
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
            onDragOver={handleDragOverEvent}
            onDragLeave={handleDragLeaveEvent}
            onDrop={handleDropEvent}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
              multiple
              onChange={handleFileInputChange}
              disabled={isUploading || media.length >= 10}
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
                    Drag & drop files here, or
                  </h3>
                  <Button
                    onClick={handleUploadClick}
                    disabled={isUploading || media.length >= 10}
                  >
                    Select Files
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Support JPG, PNG, GIF, WebP, MP4, WebM and QuickTime up to
                    50MB. Maximum 10 files.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "preview" && media.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="space-y-6">
              {/* Main Preview Area */}
              <div className="relative w-full flex items-center justify-center bg-muted/10 rounded-md min-h-[300px] max-h-[400px]">
                {media[0].type === "image" ? (
                  <img
                    src={media[0].url}
                    alt="Media preview"
                    className="max-h-[400px] object-contain rounded-md"
                  />
                ) : (
                  <div className="w-full">
                    <video
                      ref={(el) => handleVideoRef(el, media[0].id)}
                      src={media[0].url}
                      controls
                      className="w-full max-h-[400px] object-contain rounded-t-md"
                    />
                    <div className="p-3 bg-muted/20 rounded-b-md">
                      <div className="flex items-center gap-3">
                        <Label
                          htmlFor={`thumbnail-time-${media[0].id}`}
                          className="text-sm whitespace-nowrap"
                        >
                          Cover frame:
                        </Label>
                        <div className="flex-1">
                          <Slider
                            id={`thumbnail-time-${media[0].id}`}
                            defaultValue={[media[0].thumbnailTime || 0]}
                            max={
                              videoPreviewElement
                                ? Math.floor(videoPreviewElement.duration)
                                : 100 // Fallback max if duration not available
                            }
                            step={1}
                            onValueChange={(value) =>
                              handleVideoSeek(media[0].id, value)
                            }
                          />
                        </div>
                        <span className="text-xs whitespace-nowrap">
                          {Math.floor(media[0].thumbnailTime || 0)}s
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full"
                        onClick={() => removeMediaItem(media[0].id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove current cover</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Sortable Thumbnail Grid */}
              <SortableContext
                items={media.map((item) => item.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 pt-4 border-t border-border">
                  {media.map((item, index) => (
                    <SortableMediaItem
                      key={item.id}
                      item={item}
                      index={index}
                      onRemove={() => removeMediaItem(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={null}>
                {activeDragId && activeDraggedItem ? (
                  <DraggableOverlayItem
                    item={activeDraggedItem}
                    index={activeDraggedItemIndex}
                  />
                ) : null}
              </DragOverlay>

              {media.length < 10 && (
                <div className="flex justify-center pt-4">
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
              <div className="text-center text-sm text-muted-foreground">
                <p>Drag to reorder. The first item is the cover.</p>
                <p>Optimal dimensions: 1080 x 1080px (1:1 ratio recommended)</p>
                <p>Maximum files: 10 (You've uploaded {media.length})</p>
              </div>
            </div>
          </DndContext>
        )}
      </CardContent>
      {/* Removed SampleDragDrop component as it's likely for testing */}
    </Card>
  );
}
