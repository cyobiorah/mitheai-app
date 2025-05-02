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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  readonly onSuccess?: () => void;
  readonly onBack?: () => void;
}

export default function ForgotPasswordForm({
  onSuccess,
  onBack,
}: ForgotPasswordFormProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      console.log({ data });
      // In a real implementation, this would call an API endpoint to send a reset link
      // For now, we'll just simulate a successful submission
      // await apiRequest("POST", "/api/auth/forgot-password", data);

      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }

      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl text-primary-500 mb-4">
          <i className="ri-mail-send-line"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Check your email
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We've sent a password reset link to your email address. The link will
          expire in 24 hours.
        </p>
        <Button variant="outline" onClick={onBack} className="mt-2">
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button type="button" variant="link" onClick={onBack}>
              Back to login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
