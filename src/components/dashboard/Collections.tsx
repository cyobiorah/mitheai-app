import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Edit,
  Folder,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";

const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

export default function Collections() {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get collections
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["/collections"],
  }) as { data: any; isLoading: boolean };

  // Create collection mutation
  const { mutate: createCollection, isPending: isCreatingPending } =
    useMutation({
      mutationFn: async (data: CollectionFormData) => {
        return await apiRequest("POST", "/collections", data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
        toast({
          title: "Collection created",
          description: "Your collection has been created successfully",
        });
        setIsCreating(false);
        createForm.reset();
      },
      onError: () => {
        toast({
          title: "Creation failed",
          description: "Failed to create collection. Please try again.",
          variant: "destructive",
        });
      },
    });

  // Update collection mutation
  const { mutate: updateCollection, isPending: isUpdatingPending } =
    useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: number;
        data: CollectionFormData;
      }) => {
        return await apiRequest("PATCH", `collections/${id}`, data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/collections"] });
        toast({
          title: "Collection updated",
          description: "Your collection has been updated successfully",
        });
        setIsEditing(false);
        setCurrentCollection(null);
      },
      onError: () => {
        toast({
          title: "Update failed",
          description: "Failed to update collection. Please try again.",
          variant: "destructive",
        });
      },
    });

  // Delete collection mutation
  const { mutate: deleteCollection } = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/collections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/collections"] });
      toast({
        title: "Collection deleted",
        description: "The collection has been deleted",
      });
    },
    onError: () => {
      toast({
        title: "Deletion failed",
        description: "Failed to delete the collection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createForm = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editForm = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onCreateSubmit(data: CollectionFormData) {
    createCollection(data);
  }

  function onEditSubmit(data: CollectionFormData) {
    if (currentCollection) {
      updateCollection({ id: currentCollection._id, data });
    }
  }

  function handleEdit(collection: any) {
    setCurrentCollection(collection);
    editForm.reset({
      name: collection.name,
      description: collection.description ?? "",
    });
    setIsEditing(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Collections</h2>
          <p className="text-muted-foreground">
            Organize your content into thematic collections
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus size={16} className="mr-2" />
          New Collection
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : collections.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections?.data.map((collection: any) => (
            <Card key={collection._id} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <Folder size={18} className="text-primary" />
                    {collection.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(collection)}>
                        <Edit size={14} className="mr-2" />
                        Edit Collection
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteCollection(collection._id)}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete Collection
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>
                  {collection.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm">{collection.contentIds.length} posts</p>
              </CardContent>
              <CardFooter className="bg-muted/40 py-2">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <a href={`/dashboard/collections/${collection.id}`}>
                    View Content
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No collections yet</CardTitle>
            <CardDescription>
              Create collections to organize your social media content
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} className="mr-2" />
              Create Your First Collection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Collection Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your social media content
            </DialogDescription>
          </DialogHeader>

          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onCreateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Collection name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is this collection about?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description to help identify this collection
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingPending}>
                  {isCreatingPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Collection
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Update the details of your collection
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Collection name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is this collection about?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description to help identify this collection
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingPending}>
                  {isUpdatingPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
