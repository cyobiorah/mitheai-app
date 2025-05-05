import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../store/hooks";
import { getSocialIcon } from "../../lib/utils";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Loader2, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import socialApi from "../../api/socialApi";

const postSchema = z.object({
  content: z.string().min(1, "Content is required"),
  media: z.array(z.string()).optional(),
  scheduleTime: z.date().optional(),
  status: z.enum(["scheduled", "published"]),
  collectionId: z.string().optional(),
  selectedAccount: z.string().min(1, "Select an account"),
  platform: z.string().min(1, "Select a platform"),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostCreate() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [mediaLinks, setMediaLinks] = useState<string[]>([]);
  const [newMediaLink, setNewMediaLink] = useState("");
  const [loading, setLoading] = useState(false);

  // Get social accounts
  const { data: socialAccounts = [], isLoading: isFetchingAccounts } = useQuery(
    {
      queryKey: [`/social-accounts/${user?._id}`],
    }
  ) as { data: any[]; isLoading: boolean };

  // Get collections
  const {
    data: collections = { count: 0, data: [] },
    isLoading: isFetchingCollections,
  } = useQuery({
    queryKey: ["/collections"],
  }) as { data: { count: number; data: any[] } } & { isLoading: boolean };

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      media: [],
      status: "published",
      selectedAccount: "",
      platform: "",
    },
  });

  function addMediaLink() {
    if (newMediaLink && !mediaLinks.includes(newMediaLink)) {
      setMediaLinks([...mediaLinks, newMediaLink]);
      form.setValue("media", [...mediaLinks, newMediaLink]);
      setNewMediaLink("");
    }
  }

  function removeMediaLink(link: string) {
    const updatedLinks = mediaLinks.filter((item) => item !== link);
    setMediaLinks(updatedLinks);
    form.setValue("media", updatedLinks);
  }

  async function onSubmit(data: PostFormData) {
    const selectedAccount = socialAccounts.find(
      (acc: any) => acc._id === data.selectedAccount
    );

    if (!selectedAccount) {
      toast({
        title: "Error",
        description: "Selected account not found",
        variant: "destructive",
      });
    }

    if (data.status === "scheduled") {
      if (!data.scheduleTime) {
        toast({
          title: "Error",
          description: "Please select a schedule time",
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      const scheduledPost = {
        content: data.content,
        platforms: [
          {
            platform: selectedAccount.platform,
            platformId: selectedAccount.platformId,
            accountId: selectedAccount.accountId,
            accountName: selectedAccount.accountName,
            accountType: selectedAccount.accountType,
          },
        ],
        scheduledFor: data.scheduleTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        mediaType: "TEXT",
      };

      await socialApi.schedulePost(scheduledPost);
      toast({ title: "Success", description: "Post scheduled successfully!" });
    } else {
      const postData = {
        content: data.content,
        accountId: selectedAccount.accountId,
        platformAccountId: selectedAccount.platformAccountId,
        media: mediaLinks,
        accountName: selectedAccount.accountName,
        accountType: selectedAccount.accountType,
        platform: selectedAccount.platform,
        platformId: selectedAccount.platformId,
      };
      setLoading(true);

      try {
        switch (selectedAccount.platform) {
          case "threads":
            await socialApi.postToThreads(selectedAccount._id, postData);
            toast({
              title: "Success",
              description: "Posted successfully to Threads!",
            });
            break;
          case "linkedin":
            await socialApi.postToLinkedIn(
              selectedAccount._id,
              postData.content
            );
            toast({
              title: "Success",
              description: "Posted successfully to LinkedIn!",
            });
            break;
          case "twitter":
            await socialApi.postToTwitter(selectedAccount._id, postData);
            toast({
              title: "Success",
              description: "Posted successfully to Twitter!",
            });
            break;
          default:
            toast({
              title: "Error",
              description: `Posting to ${selectedAccount.platform} not supported`,
              variant: "destructive",
            });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to post. Please try again.",
          variant: "destructive",
        });
      } finally {
        form.reset();
        setMediaLinks([]);
        setLoading(false);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    if (form.watch("selectedAccount")) {
      const account = socialAccounts.find(
        (account: any) => account._id === form.watch("selectedAccount")
      );
      if (account) {
        form.setValue("platform", account.platform);
      }
    }
  }, [form.watch("selectedAccount")]);

  const getSocialAccountView = (field: any) => {
    if (isFetchingAccounts) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    } else if (socialAccounts.length > 0) {
      return socialAccounts.map((account: any) => (
        <div
          key={account._id}
          className="flex items-center space-x-2 border p-2 rounded-md"
        >
          <input
            type="radio"
            id={account._id}
            checked={field.value === account._id}
            onChange={() => {
              field.onChange(account._id);
            }}
            className="h-4 w-4"
          />
          <label
            htmlFor={account._id}
            className="flex items-center space-x-2 text-sm cursor-pointer"
          >
            <i className={`${getSocialIcon(account.platform)} text-lg`}></i>
            <span>{account?.metadata?.username ?? account.accountName}</span>
          </label>
        </div>
      ));
    } else {
      return (
        <div className="text-center p-2 border rounded-md bg-muted">
          <p className="text-muted-foreground">No social accounts connected</p>
          <Button variant="link" size="sm" asChild className="mt-1">
            <Link href="/dashboard/accounts">Connect an account</Link>
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create New Post</h2>
          <p className="text-muted-foreground">
            Compose and schedule your content across multiple platforms
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What's on your mind?"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Media</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add image or video URL"
                    value={newMediaLink}
                    onChange={(e) => setNewMediaLink(e.target.value)}
                  />
                  <Button type="button" onClick={addMediaLink} size="sm">
                    Add
                  </Button>
                </div>

                {mediaLinks.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {mediaLinks.map((link, index) => (
                      <div
                        key={`${link}-${index}`}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="truncate flex-1">{link}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMediaLink(link)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="selectedAccount"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Select Accounts</FormLabel>
                        <div className="space-y-2">
                          {getSocialAccountView(field)}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant={
                              field.value === "scheduled"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => field.onChange("scheduled")}
                            size="sm"
                          >
                            Schedule
                          </Button>
                          <Button
                            type="button"
                            variant={
                              field.value === "published"
                                ? "default"
                                : "outline"
                            }
                            onClick={() => field.onChange("published")}
                            size="sm"
                          >
                            Post Now
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection (Optional)</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a collection" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isFetchingCollections ? (
                              <div className="flex items-center justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                            ) : collections.count > 0 ? (
                              collections.data.map((collection: any) => (
                                <SelectItem
                                  key={collection._id}
                                  value={collection._id}
                                >
                                  {collection.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No collections available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("status") === "scheduled" && (
                    <FormField
                      control={form.control}
                      name="scheduleTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Schedule Time (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP HH:mm")
                                  ) : (
                                    <span>Pick a date and time</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    // Keep the time if already set, otherwise use current time
                                    const scheduleTime =
                                      field.value || new Date();
                                    scheduleTime.setFullYear(
                                      date.getFullYear()
                                    );
                                    scheduleTime.setMonth(date.getMonth());
                                    scheduleTime.setDate(date.getDate());
                                    field.onChange(scheduleTime);
                                  }
                                }}
                              />
                              <div className="p-3 border-t">
                                <div className="flex justify-between">
                                  <Input
                                    type="time"
                                    value={
                                      field.value
                                        ? format(field.value, "HH:mm")
                                        : ""
                                    }
                                    onChange={(e) => {
                                      if (e.target.value && field.value) {
                                        const [hours, minutes] =
                                          e.target.value.split(":");
                                        const newDate = new Date(field.value);
                                        newDate.setHours(parseInt(hours));
                                        newDate.setMinutes(parseInt(minutes));
                                        field.onChange(newDate);
                                      }
                                    }}
                                  />
                                  {field.value && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => field.onChange(undefined)}
                                    >
                                      <X size={16} className="mr-1" />
                                      Clear
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="pt-4">
              <div className="border rounded-lg p-4 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-sm font-medium">
                        {user?.firstName?.charAt(0) ??
                          user?.username?.charAt(0) ??
                          "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user?.firstName ?? ""}</p>
                      <p className="text-xs text-muted-foreground">
                        {form.watch("status") === "scheduled" &&
                        form.watch("scheduleTime")
                          ? `Scheduled for ${format(
                              form.watch("scheduleTime") as Date,
                              "PPP 'at' h:mm a"
                            )}`
                          : form.watch("status") === "published"
                          ? "Publishing now"
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm">
                    {form.watch("content") || (
                      <span className="text-muted-foreground italic">
                        No content added yet
                      </span>
                    )}
                  </div>

                  {mediaLinks.length > 0 && (
                    <div className="space-y-2">
                      {mediaLinks.map((link, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-2 text-xs text-muted-foreground"
                        >
                          Media: {link}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t pt-2 flex flex-wrap gap-1">
                    {(() => {
                      const selectedAccountId = form.watch("selectedAccount");
                      const account = socialAccounts.find(
                        (a: any) => a._id === selectedAccountId
                      );

                      if (!account) return null;

                      return (
                        <div
                          key={account._id}
                          className="text-xs bg-muted px-2 py-1 rounded-full flex items-center"
                        >
                          <i
                            className={`${getSocialIcon(
                              account.platform
                            )} mr-1`}
                          ></i>
                          <span>{account.accountName}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getBtnText(form)}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const getBtnText = (form: any) => {
  if (form.watch("status") === "scheduled") return "Scheduled Post";
  else return "Publish Now";
};

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href}>{children}</a>;
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
