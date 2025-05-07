import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../../hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";

// Validation schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  readonly token: string;
  readonly onBack?: () => void;
}

export default function ResetPasswordForm({
  onBack,
  token,
}: ResetPasswordFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: resetPassword } = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/auth/reset-password", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    const { confirmPassword, ...rest } = data;
    try {
      resetPassword({ ...rest, token });

      setIsSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl text-green-500 mb-4">
          <i className="ri-check-double-line"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Password Updated
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your password has been successfully reset.
        </p>
        <Button onClick={onBack} className="w-full">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Set New Password
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter your new password below.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter new password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm new password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
            <Button type="button" variant="link" onClick={onBack}>
              Back to Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
