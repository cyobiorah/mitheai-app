import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  CalendarClock,
  BarChart2,
  Users,
  FolderPlus,
  Plus,
  Activity,
} from "lucide-react";
import { formatDate } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../ui/badge";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: posts } = useQuery({
    queryKey: [`/social-posts/${user?._id}`],
    enabled: isAuthenticated,
  }) as { data: { data: any[] } };

  const { data: socialAccounts = [] } = useQuery({
    queryKey: [`/social-accounts/${user?._id}`],
    enabled: isAuthenticated,
  }) as { data: any[] };

  const { data: collections = { count: 0, data: [] } } = useQuery({
    queryKey: ["/collections"],
    enabled: isAuthenticated,
  }) as { data: { count: number; data: any[] } };

  const { data: scheduledPosts } = useQuery({
    queryKey: ["/scheduled-posts"],
    enabled: isAuthenticated,
  }) as { data: { data: any[] } };

  const recentPosts = posts?.data?.slice(0, 3);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  function getPostStatus(post: any) {
    if (post.status === "published" || post.status === "posted") {
      return `Published • ${formatDate(
        post.publishedDate ?? post.postedAt,
        "PPPpp"
      )}`;
    } else if (post.status === "scheduled") {
      return `Scheduled • ${formatDate(post.scheduleTime, "PPPpp")}`;
    } else {
      return `Draft • Created on ${formatDate(
        post.createdAt ?? new Date(),
        "PPPpp"
      )}`;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "scheduled":
        return "bg-amber-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <main className="flex-1 p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.firstName ?? ""}!
              </p>
            </div>
            <Button onClick={() => navigate("/dashboard/post-flow")}>
              <Plus size={16} className="mr-2" />
              Create Post
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Posts</CardDescription>
                <CardTitle className="text-3xl">
                  {posts?.data?.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Activity size={12} className="mr-1" />
                  {posts?.data?.length > 0 ? "Active" : "No posts yet"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Scheduled Posts</CardDescription>
                <CardTitle className="text-3xl">
                  {scheduledPosts?.data?.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground flex items-center">
                  <CalendarClock size={12} className="mr-1" />
                  Upcoming posts
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Connected Accounts</CardDescription>
                <CardTitle className="text-3xl">
                  {socialAccounts?.length ?? 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Users size={12} className="mr-1" />
                  Social profiles
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Collections</CardDescription>
                <CardTitle className="text-3xl">
                  {collections?.count ?? 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground flex items-center">
                  <FolderPlus size={12} className="mr-1" />
                  Content organization
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent">
            <TabsList>
              <TabsTrigger value="recent">Recent Posts</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>
                    Your most recent content across platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPosts?.length > 0 ? (
                    <div className="space-y-4">
                      {recentPosts?.map((post: any) => (
                        <div
                          key={post._id}
                          className="border-b pb-4 last:border-none"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {post.content.length > 100
                                  ? post.content.substring(0, 100) + "..."
                                  : post.content}
                              </p>
                              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <span className="mr-2">
                                  {getPostStatus(post)}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/dashboard/posts/${post._id}/edit`)
                              }
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No posts yet</p>
                      <Button
                        variant="link"
                        onClick={() => navigate("/dashboard/post-flow")}
                        className="mt-2"
                      >
                        Create your first post
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Posts</CardTitle>
                  <CardDescription>Your scheduled content</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduledPosts?.data?.length > 0 ? (
                    <div className="space-y-4">
                      {scheduledPosts?.data?.map((post: any) => (
                        <div
                          key={post._id}
                          className="border-b pb-4 last:border-none"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {post.content.length > 100
                                  ? post.content.substring(0, 100) + "..."
                                  : post.content}
                              </p>
                              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <CalendarClock size={14} className="mr-1" />
                                <span>
                                  Scheduled for{" "}
                                  {post.scheduledFor
                                    ? formatDate(
                                        post.scheduledFor,
                                        "PPP 'at' p"
                                      )
                                    : "—"}
                                </span>
                                <Badge
                                  className={`${getStatusColor(
                                    post.status
                                  )} capitalize ml-2`}
                                >
                                  {post.status}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/dashboard/posts/${post._id}/edit`)
                              }
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No scheduled posts
                      </p>
                      <Button
                        variant="link"
                        onClick={() => navigate("/dashboard/post-flow")}
                        className="mt-2"
                      >
                        Schedule a post
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle>Content Insights</CardTitle>
                  <CardDescription>
                    Performance metrics for your social media content
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2
                      size={48}
                      className="mx-auto text-muted-foreground mb-4"
                    />
                    <p>Analytics available soon</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We're working on comprehensive analytics for your content
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Frequently used tools</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <button
                  className="h-auto py-4 justify-start border-muted-foreground rounded-md bg-background hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => navigate("/dashboard/post-flow")}
                  style={{
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <Plus className="h-6 w-6 mb-1" />
                    <span>Create Post</span>
                  </div>
                </button>
                <button
                  className="h-auto py-4 justify-start border-muted-foreground rounded-md bg-background hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => navigate("/dashboard/schedule")}
                  style={{
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <CalendarClock className="h-6 w-6 mb-1" />
                    <span>View Schedule</span>
                  </div>
                </button>
                <button
                  className="h-auto py-4 justify-start border-muted-foreground rounded-md bg-background hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => navigate("/dashboard/accounts")}
                  style={{
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <Users className="h-6 w-6 mb-1" />
                    <span>Manage Accounts</span>
                  </div>
                </button>
                <button
                  className="h-auto py-4 justify-start border-muted-foreground rounded-md bg-background hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => navigate("/dashboard/collections")}
                  style={{
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <FolderPlus className="h-6 w-6 mb-1" />
                    <span>Collections</span>
                  </div>
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>Your social media platforms</CardDescription>
              </CardHeader>
              <CardContent>
                {socialAccounts.length > 0 ? (
                  <div className="space-y-3">
                    {socialAccounts.slice(0, 5).map((account: any) => (
                      <div
                        key={account._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                            <i
                              className={`ri-${account.platform.toLowerCase()}-fill text-lg`}
                            ></i>
                          </div>
                          <div>
                            <p className="font-medium">{account.accountName}</p>
                            <p className="text-xs text-muted-foreground">
                              {account.platform}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            account.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      No accounts connected
                    </p>
                    <Button
                      variant="link"
                      onClick={() => navigate("/dashboard/accounts")}
                      className="mt-2"
                    >
                      Connect an account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
