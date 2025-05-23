import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Button } from "../ui/button";
import { ArrowLeft, Edit, Plus, Share2 } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function Collection() {
  const { collectionId } = useParams();
  const navigate = useNavigate();

  const [collectionPosts, setCollectionPosts] = useState<any[]>([]);

  // Get collections
  const {
    data: collection,
    isLoading: isLoadingCollection,
    // refetch: refetchCollection,
  } = useQuery({
    queryKey: [`/collections/collection/${collectionId}`],
    queryFn: () => apiRequest("GET", `/collections/collection/${collectionId}`),
  }) as { data: any; isLoading: boolean; refetch: any };

  console.log({ collection });

  useEffect(() => {
    if (!collectionId) {
      navigate("/collections");
    }
  }, [collectionId]);

  useEffect(() => {
    if (collection?.items?.length) {
      setCollectionPosts(collection.items);
    }
  }, [collection]);

  useEffect(() => {
    console.log({ collectionPosts });
  }, [collectionPosts]);

  const isLoading = isLoadingCollection;

  if (isLoading) {
    return <CollectionSkeleton />;
  }

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-muted-foreground mt-2">
              {collection.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>
              {collection.items?.length ?? 0} post
              {(collection.items?.length ?? 0) !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>
              Created{" "}
              {formatDate(new Date(collection.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionPosts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CollectionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96 max-w-full" />
          <div className="flex gap-4 mt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { readonly post: any }) {
  const platform = post.platform;
  const content = post.content;
  const profileImage =
    post.metadata?.profileImageUrl ??
    post.metadata?.socialPost?.profileImageUrl ??
    null;
  const accountName =
    post.metadata?.accountName ??
    post.metadata?.socialPost?.username ??
    "Unknown";

  return (
    <div className="border p-4 rounded-lg space-y-2">
      {profileImage && (
        <img
          src={profileImage}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
      )}
      <p className="text-sm text-muted-foreground">{platform}</p>
      <p className="font-medium">{content}</p>
      <p className="text-xs text-muted-foreground">By {accountName}</p>
    </div>
  );
}
