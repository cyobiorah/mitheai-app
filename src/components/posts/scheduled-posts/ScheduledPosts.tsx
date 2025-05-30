import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../../lib/queryClient";
import { useToast } from "../../../hooks/use-toast";
import { Link } from "react-router-dom";
import { formatDate, getDateKey } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Calendar } from "../../ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Loader2, Calendar as CalendarIcon, Plus } from "lucide-react";
import { getScheduledPostListView } from "./listView";
import { getScheduledPostCalendarView } from "./calendarView";

export default function ScheduledPosts() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!selectedDate) setSelectedDate(new Date());
  }, [selectedDate]);

  // Get posts
  const {
    data: scheduledPosts = { data: [] },
    isLoading: isFetchingScheduledPosts,
  } = useQuery({
    queryKey: ["/scheduled-posts"],
  }) as { data: { data: any[] } } & { isLoading: boolean };

  // Delete post mutation
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/scheduled-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/scheduled-posts"] });
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
      return await apiRequest("PATCH", `/scheduled-posts/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/scheduled-posts"] });
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

    return scheduledPosts.data.filter((post: any) => {
      if (!post.scheduledFor) return false;
      const postDate = new Date(post.scheduledFor);
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      );
    });
  };

  const filterPostsByStatus = (status: string) => {
    return scheduledPosts.data.filter((post: any) => post.status === status);
  };

  // Group posts by date for showing on the calendar
  const getPostsByDate = () => {
    const postsByDate: Record<string, number> = {};

    scheduledPosts.data.forEach((post: any) => {
      if (post.scheduledFor) {
        const dateKey = getDateKey(post.scheduledFor);
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
      deletePost(selectedPost._id);
    }
  };

  const scheduleHasPostsForDate = (date: Date) => {
    const dateStr = getDateKey(date.toISOString());
    return !!getPostsByDate()[dateStr];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Content Schedule</h2>
          <p className="text-muted-foreground">
            Manage your scheduled social media posts
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/post-flow">
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
                    hasPost: (date) => scheduleHasPostsForDate(new Date(date)),
                  }}
                  modifiersStyles={{
                    hasPost: {
                      fontWeight: "bold",
                      borderBottom: "1px solid green",
                      borderRadius: "0.375rem",
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
                  {getScheduledPostCalendarView({
                    isFetchingScheduledPosts,
                    postsByDate: filterPostsByDate(selectedDate),
                    updatePostStatus,
                    handleDeletePost,
                  })}
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
                    Scheduled ({filterPostsByStatus("scheduled").length})
                  </Button>
                  <Button variant="outline" size="sm">
                    Completed ({filterPostsByStatus("completed").length})
                  </Button>
                  <Button variant="outline" size="sm">
                    Failed ({filterPostsByStatus("failed").length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {getScheduledPostListView(
                isFetchingScheduledPosts,
                scheduledPosts,
                updatePostStatus,
                handleDeletePost
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
