import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../store/hooks";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileInformation from "./ProfileInformation";
import PasswordChange from "./PasswordChange";
import NotificationSettings from "./NotificationSettings";

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function UserSettings() {
  const { user, fetchUserData } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update profile mutation
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return await apiRequest("PATCH", `/users/me`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/users/me"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      fetchUserData();
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationFn: async (data: PasswordFormData) => {
        const { confirmPassword, ...passwordData } = data;
        return await apiRequest("POST", "/users/change-password", passwordData);
      },
      onSuccess: () => {
        toast({
          title: "Password changed",
          description: "Your password has been changed successfully",
        });
        passwordForm.reset();
      },
      onError: () => {
        toast({
          title: "Password change failed",
          description:
            "Failed to change your password. Current password may be incorrect.",
          variant: "destructive",
        });
      },
    }
  );

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onProfileSubmit(data: ProfileFormData) {
    if (data.email) delete data.email;
    console.log({ data });
    updateProfile(data);
  }

  function onPasswordSubmit(data: PasswordFormData) {
    changePassword(data);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-muted-foreground">
            Manage your account preferences and security
          </p>
        </div>
        <Link to="/dashboard/billing">
          <Button variant="outline" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing & Subscription
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileInformation
            profileForm={profileForm}
            onProfileSubmit={onProfileSubmit}
            isUpdatingProfile={isUpdatingProfile}
          />
        </TabsContent>

        <TabsContent value="password">
          <PasswordChange
            passwordForm={passwordForm}
            onPasswordSubmit={onPasswordSubmit}
            isChangingPassword={isChangingPassword}
            showCurrentPassword={showCurrentPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
