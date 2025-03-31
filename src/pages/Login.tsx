import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../store/hooks";
import AuthLayout from "../components/AuthLayout";

const Login: React.FC = () => {
  const { login, authError, authLoading, clearAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Use either local error or auth error from store
  const error = localError || authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();

    try {
      await login(email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            setLocalError("Invalid email address");
            break;
          case "auth/user-disabled":
            setLocalError("This account has been disabled");
            break;
          case "auth/user-not-found":
            setLocalError("No account found with this email");
            break;
          case "auth/wrong-password":
            setLocalError("Incorrect password");
            break;
          default:
            setLocalError("Failed to log in");
        }
      } else {
        const message = (error as Error).message;
        setLocalError(message || "An unexpected error occurred");
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setLocalError("Please enter your email address first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setLocalError("");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            setLocalError("Invalid email address");
            break;
          case "auth/user-not-found":
            setLocalError("No account found with this email");
            break;
          default:
            setLocalError("Failed to send reset email");
        }
      }
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          </div>
        )}
        {resetSent && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-600 dark:text-green-400">
              Password reset email sent! Check your inbox.
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-gray-300"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-neutral-700 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={authLoading}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
          >
            {authLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="text-sm text-center">
          <span className="text-neutral-700 dark:text-gray-300">
            Don't have an account?{" "}
          </span>
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Register here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
