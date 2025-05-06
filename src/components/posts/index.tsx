import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "../../store/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { getSocialIcon } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: posts } = useQuery({
    queryKey: [`/social-posts/${user?._id}`],
    enabled: isAuthenticated,
  }) as { data: { data: any[] } };

  function getStatusColor(status: string) {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "posted":
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Posts</h2>
          <p className="text-muted-foreground">
            View and manage your posts for your social media accounts
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/create-post")}>
          <Plus size={16} className="mr-2" />
          New Post
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts?.data?.map((post: any) => (
          <Card key={post._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <i className={`${getSocialIcon(post.platform)} text-2xl`}></i>
                  <div>
                    <CardTitle className="text-base">
                      {post.metadata?.socialPost?.username ??
                        post.metadata?.socialPost?.accountName ??
                        post.metadata?.accountName}
                    </CardTitle>
                    <CardDescription>{post.platform}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(post.status)}>
                  <span className="capitalize">{post.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-base line-clamp-3">{post.content}</div>
              {/* Optional: Show preview image if available */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post Preview"
                  className="mt-2 rounded-md max-h-40 object-cover w-full"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Posts;
