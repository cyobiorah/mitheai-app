import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, type }: AuthModalProps) {
  const [activeView, setActiveView] = useState<
    "login" | "register" | "forgot-password"
  >(type);

  const handleSuccess = () => {
    onClose();
  };

  const goToLogin = () => setActiveView("login");
  const goToRegister = () => setActiveView("register");
  const goToForgotPassword = () => setActiveView("forgot-password");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeView === "login" && "Log In to Skedlii"}
            {activeView === "register" && "Create an Account"}
            {activeView === "forgot-password" && "Reset Your Password"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeView === "login" &&
              "Enter your credentials to access your account"}
            {activeView === "register" &&
              "Sign up to join Skedlii and manage your social media"}
            {activeView === "forgot-password" &&
              "We'll send you a link to reset your password"}
          </DialogDescription>
        </DialogHeader>

        {activeView === "forgot-password" ? (
          <ForgotPasswordForm onSuccess={handleSuccess} onBack={goToLogin} />
        ) : (
          <Tabs
            defaultValue={activeView}
            onValueChange={(value) => setActiveView(value as any)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4">
              <LoginForm
                onSuccess={handleSuccess}
                onForgotPassword={goToForgotPassword}
                onRegister={goToRegister}
              />
            </TabsContent>
            <TabsContent value="register" className="pt-4">
              <RegisterForm onSuccess={handleSuccess} onLogin={goToLogin} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
