import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import { Link } from "react-router-dom";
import { formatDate, getSocialIcon } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Calendar } from "../../components/ui/calendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Loader2,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Plus,
} from "lucide-react";

export default function ScheduledPosts() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/social-posts"],
  }) as { data: any[]; isLoading: boolean };

  // Delete post mutation
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/social-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
    },
    onError: () => {
      toast({
        title: "Deletion failed",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Change post status mutation
  const { mutate: updatePostStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/social-posts/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      toast({
        title: "Status updated",
        description: "The post status has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update the post status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filterPostsByDate = (date: Date | undefined) => {
    if (!date) return [];

    return posts.filter((post: any) => {
      if (!post.scheduleTime) return false;
      const postDate = new Date(post.scheduleTime);
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      );
    });
  };

  const filterPostsByStatus = (status: string) => {
    return posts.filter((post: any) => post.status === status);
  };

  // Group posts by date for showing on the calendar
  const getPostsByDate = () => {
    const postsByDate: Record<string, number> = {};

    posts.forEach((post: any) => {
      if (post.scheduleTime) {
        const date = new Date(post.scheduleTime);
        const dateKey = date.toISOString().split("T")[0];
        postsByDate[dateKey] = (postsByDate[dateKey] || 0) + 1;
      }
    });

    return postsByDate;
  };

  const handleDeletePost = (post: any) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPost) {
      deletePost(selectedPost.id);
    }
  };

  const scheduleHasPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return !!getPostsByDate()[dateStr];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText size={12} /> Draft
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock size={12} /> Scheduled
          </Badge>
        );
      case "published":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle size={12} /> Published
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle size={12} /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Schedule</h2>
          <p className="text-muted-foreground">
            Manage your scheduled social media posts
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/create-post">
            <Plus size={16} className="mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="md:w-[300px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon size={18} />
                  Calendar
                </CardTitle>
                <CardDescription>
                  Select a date to view scheduled posts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{
                    hasPost: (date) => scheduleHasPostsForDate(date),
                  }}
                  modifiersStyles={{
                    hasPost: {
                      backgroundColor: "var(--primary-50)",
                      fontWeight: "bold",
                      borderBottom: "2px solid var(--primary-500)",
                    },
                  }}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Posts for{" "}
                    {selectedDate ? formatDate(selectedDate, "PPP") : "today"}
                  </CardTitle>
                  <CardDescription>
                    {filterPostsByDate(selectedDate).length} posts scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filterPostsByDate(selectedDate).length > 0 ? (
                    <div className="space-y-4">
                      {filterPostsByDate(selectedDate).map((post: any) => (
                        <Card key={post.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                {getStatusBadge(post.status)}
                                <CardTitle className="mt-2 text-base">
                                  {post.content.length > 60
                                    ? post.content.substring(0, 60) + "..."
                                    : post.content || "No content"}
                                </CardTitle>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      to={`/dashboard/posts/${post.id}/edit`}
                                    >
                                      <Edit size={14} className="mr-2" />
                                      Edit Post
                                    </Link>
                                  </DropdownMenuItem>
                                  {post.status === "scheduled" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updatePostStatus({
                                          id: post.id,
                                          status: "published",
                                        })
                                      }
                                    >
                                      <CheckCircle size={14} className="mr-2" />
                                      Publish Now
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeletePost(post)}
                                  >
                                    <Trash2 size={14} className="mr-2" />
                                    Delete Post
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            {post.scheduleTime && (
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Clock size={14} className="mr-1.5" />
                                {formatDate(post.scheduleTime, "p")}
                              </p>
                            )}
                          </CardContent>
                          <CardFooter className="flex flex-wrap gap-1 border-t pt-2 bg-muted/30">
                            {post.platforms?.map(
                              (platform: any, index: number) => (
                                <div
                                  key={index}
                                  className="text-xs bg-muted px-2 py-1 rounded-full flex items-center"
                                >
                                  <i
                                    className={`${getSocialIcon(
                                      platform.type
                                    )} mr-1`}
                                  ></i>
                                  <span>{platform.name}</span>
                                </div>
                              )
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border rounded-lg bg-muted/20">
                      <p className="text-muted-foreground">
                        No posts scheduled for this date
                      </p>
                      <Button variant="link" asChild className="mt-2">
                        <Link to="/dashboard/create-post">Create a post</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle>All Posts</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Drafts ({filterPostsByStatus("draft").length})
                  </Button>
                  <Button variant="outline" size="sm">
                    Scheduled ({filterPostsByStatus("scheduled").length})
                  </Button>
                  <Button variant="outline" size="sm">
                    Published ({filterPostsByStatus("published").length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post: any) => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            {getStatusBadge(post.status)}
                            <CardTitle className="mt-2 text-base">
                              {post.content.length > 60
                                ? post.content.substring(0, 60) + "..."
                                : post.content || "No content"}
                            </CardTitle>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/dashboard/posts/${post.id}/edit`}>
                                  <Edit size={14} className="mr-2" />
                                  Edit Post
                                </Link>
                              </DropdownMenuItem>
                              {post.status === "scheduled" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updatePostStatus({
                                      id: post.id,
                                      status: "published",
                                    })
                                  }
                                >
                                  <CheckCircle size={14} className="mr-2" />
                                  Publish Now
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeletePost(post)}
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                          {post.scheduleTime && (
                            <p className="flex items-center">
                              <Clock size={14} className="mr-1.5" />
                              {formatDate(post.scheduleTime, "PPP 'at' p")}
                            </p>
                          )}
                          {post.publishedTime && (
                            <p className="flex items-center">
                              <CheckCircle size={14} className="mr-1.5" />
                              Published:{" "}
                              {formatDate(post.publishedTime, "PPP 'at' p")}
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-1 border-t pt-2 bg-muted/30">
                        {post.platforms?.map((platform: any, index: number) => (
                          <div
                            key={index}
                            className="text-xs bg-muted px-2 py-1 rounded-full flex items-center"
                          >
                            <i
                              className={`${getSocialIcon(platform.type)} mr-1`}
                            ></i>
                            <span>{platform.name}</span>
                          </div>
                        ))}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">
                    You haven't created any posts yet
                  </p>
                  <Button variant="link" asChild className="mt-2">
                    <Link to="/dashboard/create-post">
                      Create your first post
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
