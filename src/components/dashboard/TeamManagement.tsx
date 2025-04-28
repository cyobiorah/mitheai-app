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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { getInitials } from "../../lib/utils";
import { Loader2, Plus, RefreshCw, UserPlus, X } from "lucide-react";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
  organizationId: z.number(),
});

const memberSchema = z.object({
  userId: z.string().min(1, "User is required"),
  role: z.string().min(1, "Role is required"),
});

type TeamFormData = z.infer<typeof teamSchema>;
type MemberFormData = z.infer<typeof memberSchema>;

export default function TeamManagement() {
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get teams
  const { data: teams = [], isLoading: isLoadingTeams } = useQuery({
    queryKey: ["/teams"],
  }) as { data: any[]; isLoading: boolean };

  // Get organizations (for team creation)
  const { data: organizations = [], isLoading: isLoadingOrgs } = useQuery({
    queryKey: ["/organizations"],
  }) as { data: any[]; isLoading: boolean };

  // Get users (for member addition)
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/users"],
  }) as { data: any[]; isLoading: boolean };

  // Get team members for selected team
  const { data: teamMembers = [], isLoading: isLoadingMembers } = useQuery({
    queryKey: ["/teams", selectedTeam?.id, "members"],
    enabled: !!selectedTeam,
  }) as { data: any[]; isLoading: boolean };

  // Create team mutation
  const { mutate: createTeam, isPending: isCreatingTeamPending } = useMutation({
    mutationFn: async (data: TeamFormData) => {
      return await apiRequest("POST", "/teams", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/teams"] });
      toast({
        title: "Team created",
        description: "Your team has been created successfully",
      });
      setIsCreatingTeam(false);
      teamForm.reset();
    },
    onError: () => {
      toast({
        title: "Creation failed",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add team member mutation
  const { mutate: addTeamMember, isPending: isAddingMemberPending } =
    useMutation({
      mutationFn: async (data: { teamId: number; member: MemberFormData }) => {
        return await apiRequest(
          "POST",
          `/teams/${data.teamId}/members`,
          data.member
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["/teams", selectedTeam?.id, "members"],
        });
        toast({
          title: "Member added",
          description: "The team member has been added successfully",
        });
        setIsAddingMember(false);
        memberForm.reset();
      },
      onError: () => {
        toast({
          title: "Addition failed",
          description:
            "Failed to add team member. User may already be part of the team.",
          variant: "destructive",
        });
      },
    });

  // Remove team member mutation
  const { mutate: removeTeamMember, isPending: isRemovingMemberPending } =
    useMutation({
      mutationFn: async ({
        teamId,
        userId,
      }: {
        teamId: number;
        userId: number;
      }) => {
        return await apiRequest(
          "DELETE",
          `/teams/${teamId}/members/${userId}`
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["/teams", selectedTeam?.id, "members"],
        });
        toast({
          title: "Member removed",
          description: "The team member has been removed from the team",
        });
      },
      onError: () => {
        toast({
          title: "Removal failed",
          description: "Failed to remove team member. Please try again.",
          variant: "destructive",
        });
      },
    });

  const teamForm = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      description: "",
      organizationId: organizations?.[0]?.id,
    },
  });

  const memberForm = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      userId: "",
      role: "member",
    },
  });

  function onTeamSubmit(data: TeamFormData) {
    createTeam(data);
  }

  function onMemberSubmit(data: MemberFormData) {
    if (selectedTeam) {
      addTeamMember({
        teamId: selectedTeam.id,
        member: {
          userId: data.userId,
          role: data.role,
        },
      });
    }
  }

  function openAddMemberDialog(team: any) {
    setSelectedTeam(team);
    setIsAddingMember(true);
  }

  function handleRemoveMember(userId: number) {
    if (selectedTeam) {
      removeTeamMember({
        teamId: selectedTeam.id,
        userId,
      });
    }
  }

  function getUserById(userId: number) {
    return users.find((user: any) => user.id === userId);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">Create and manage your teams</p>
        </div>
        <Button onClick={() => setIsCreatingTeam(true)}>
          <Plus size={16} className="mr-2" />
          Create Team
        </Button>
      </div>

      <Tabs defaultValue="teams">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members" disabled={!selectedTeam}>
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          {isLoadingTeams ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team: any) => {
                const organization = organizations.find(
                  (org: any) => org.id === team.organizationId
                );
                return (
                  <Card key={team.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription>
                        {organization?.name || "Organization not found"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {team.description ? (
                        <p className="text-sm text-muted-foreground">
                          {team.description}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No description
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 border-t pt-4 bg-muted/40">
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => setSelectedTeam(team)}
                      >
                        View Members
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openAddMemberDialog(team)}
                      >
                        <UserPlus size={16} className="mr-2" />
                        Add Member
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No teams yet</CardTitle>
                <CardDescription>
                  Create a team to collaborate with others on your social media
                  content
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <Button onClick={() => setIsCreatingTeam(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Your First Team
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="members">
          {selectedTeam && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{selectedTeam.name}</CardTitle>
                      <CardDescription>Team Members</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddMemberDialog(selectedTeam)}
                    >
                      <UserPlus size={16} className="mr-2" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingMembers ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : teamMembers.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamMembers.map((member: any) => {
                          const user = getUserById(member.userId);
                          return (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {user?.name
                                        ? getInitials(user.name)
                                        : user?.username
                                            ?.substring(0, 2)
                                            .toUpperCase() || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {user?.name ||
                                        user?.username ||
                                        "Unknown"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {user?.email || ""}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    member.role === "admin"
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {member.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() =>
                                    handleRemoveMember(member.userId)
                                  }
                                  disabled={isRemovingMemberPending}
                                >
                                  {isRemovingMemberPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X size={16} />
                                  )}
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        This team doesn't have any members yet. Add members to
                        collaborate.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Team Dialog */}
      <Dialog open={isCreatingTeam} onOpenChange={setIsCreatingTeam}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              Create a new team to collaborate on social media content
            </DialogDescription>
          </DialogHeader>

          <Form {...teamForm}>
            <form
              onSubmit={teamForm.handleSubmit(onTeamSubmit)}
              className="space-y-4"
            >
              <FormField
                control={teamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Marketing Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={teamForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Team's purpose and goals"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={teamForm.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingOrgs ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : organizations.length > 0 ? (
                          organizations.map((org: any) => (
                            <SelectItem key={org.id} value={org.id.toString()}>
                              {org.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No organizations available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The organization this team belongs to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCreatingTeam(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingTeamPending}>
                  {isCreatingTeamPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Team
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a user to the "{selectedTeam?.name}" team
            </DialogDescription>
          </DialogHeader>

          <Form {...memberForm}>
            <form
              onSubmit={memberForm.handleSubmit(onMemberSubmit)}
              className="space-y-4"
            >
              <FormField
                control={memberForm.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingUsers ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : users.length > 0 ? (
                          users.map((user: any) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.name || user.username} ({user.email})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No users available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={memberForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Defines what permissions the user will have in this team
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAddingMemberPending}>
                  {isAddingMemberPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Member
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
