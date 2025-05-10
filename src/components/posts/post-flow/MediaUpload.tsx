import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Image, Upload, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import {
  DraggableOverlayItem,
  MediaUploadProps,
  SortableMediaItem,
} from "./mediaUploadComponents";
import {
  handleDragCancel,
  handleDragEnd,
  handleDragLeaveEvent,
  handleDragOverEvent,
  handleDragStart,
  handleDropEvent,
  handleFileInputChange,
  handleUploadClick,
  handleVideoRef,
  handleVideoSeek,
  removeMediaItem,
  updateVideoThumbnailTime,
} from "../../posting/methods";

export default function MediaUpload({
  media,
  onChange,
}: Readonly<MediaUploadProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaActiveTab, setMediaActiveTab] = useState<string>("upload");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [videoPreviewElement, setVideoPreviewElement] =
    useState<HTMLVideoElement | null>(null);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  useEffect(() => {
    if (media.length > 0) {
      setMediaActiveTab("preview");
    } else {
      setMediaActiveTab("upload");
    }
  }, [media]);

  const activeDraggedItem = activeDragId
    ? media.find((item) => item.id === activeDragId)
    : null;
  const activeDraggedItemIndex = activeDraggedItem
    ? media.indexOf(activeDraggedItem)
    : -1;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before starting a drag
      // Helps prevent accidental drags when clicking buttons inside items
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Media</CardTitle>
            <CardDescription>Add photos or videos to your post</CardDescription>
          </div>
          <Tabs
            defaultValue={mediaActiveTab}
            value={mediaActiveTab}
            onValueChange={setMediaActiveTab}
          >
            <TabsList>
              <TabsTrigger
                value="upload"
                onClick={() => setMediaActiveTab("upload")}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                onClick={() => setMediaActiveTab("preview")}
                disabled={media.length === 0 || isUploading}
              >
                <Image className="h-4 w-4 mr-2" />
                Preview ({media.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {mediaActiveTab === "upload" && (
          <button
            type="button"
            aria-label="Upload media by dragging and dropping files here"
            className={`w-full border-2 border-dashed rounded-lg p-8 text-center ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            } transition-colors`}
            onDragOver={(e) => handleDragOverEvent(e, setDragOver)}
            onDragLeave={(e) => handleDragLeaveEvent(e, setDragOver)}
            onDrop={(e) =>
              handleDropEvent(
                e,
                setDragOver,
                media,
                onChange,
                setIsUploading,
                setUploadProgress
              )
            }
            onClick={() => handleUploadClick(fileInputRef)}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm"
              multiple
              onChange={(e) =>
                handleFileInputChange(
                  e,
                  fileInputRef,
                  media,
                  onChange,
                  setIsUploading,
                  setUploadProgress
                )
              }
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
                  <span className="text-primary cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md m-2 inline-block">
                    Select Files
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Support JPG, PNG, GIF, WebP, MP4, WebM and QuickTime up to
                    50MB. Maximum 10 files.
                  </p>
                </div>
              </div>
            )}
          </button>
        )}

        {mediaActiveTab === "preview" && media.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event) => handleDragStart(event, setActiveDragId)}
            onDragEnd={(event) =>
              handleDragEnd(event, setActiveDragId, media, onChange)
            }
            onDragCancel={() => handleDragCancel(setActiveDragId)}
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
                      ref={(el) =>
                        handleVideoRef(
                          el,
                          media[0].id,
                          media,
                          setVideoPreviewElement
                        )
                      }
                      src={media[0].url}
                      controls
                      className="w-full max-h-[400px] object-contain rounded-t-md"
                    >
                      <track kind="captions" srcLang="en" />
                    </video>
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
                            defaultValue={[media[0].thumbnailTime ?? 0]}
                            max={
                              videoPreviewElement
                                ? Math.floor(videoPreviewElement.duration)
                                : 100 // Fallback max if duration not available
                            }
                            step={1}
                            onValueChange={(value) =>
                              handleVideoSeek(
                                media[0].id,
                                value,
                                media,
                                videoPreviewElement,
                                (itemId, time) =>
                                  updateVideoThumbnailTime(
                                    itemId,
                                    time,
                                    media,
                                    onChange
                                  )
                              )
                            }
                          />
                        </div>
                        <span className="text-xs whitespace-nowrap">
                          {Math.floor(media[0].thumbnailTime ?? 0)}s
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
                        onClick={() =>
                          removeMediaItem(media[0].id, media, onChange)
                        }
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
                      onRemove={() => removeMediaItem(item.id, media, onChange)}
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
                    onClick={() => handleUploadClick(fileInputRef)}
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
    </Card>
  );
}
