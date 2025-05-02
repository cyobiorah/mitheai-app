import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/hooks";
import RegisterForm from "../components/auth/RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center mb-6">
        <Link to="/" className="inline-block">
          <div className="text-primary-600 dark:text-primary-400 text-3xl font-bold flex items-center">
            <i className="ri-calendar-check-fill mr-1"></i>
            <span className="font-heading">Skedlii</span>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get started with Skedlii for free
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Or continue with
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="mr-2"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="mr-2 text-blue-600"
              >
                <path
                  fill="currentColor"
                  d="M7.05 2.006c-.28.008-.456.14-.586.586-.13.446-.101 2.86.082 3.136.2.364.364.388 1.724.267.892-.05 2.167-.151 2.842-.151.676 0 1.95.1 2.842.151 1.36.12 1.523.097 1.724-.267.183-.276.211-2.69.082-3.136-.13-.446-.305-.578-.586-.586-.48-.046-2.357.054-4.066.054-1.708 0-3.586-.1-4.066-.054zm-6.05 4.29v10.182c0 2.014.225 2.202 3.705 2.932 1.143.264 2.86.589 4.245.589s3.102-.325 4.245-.59c3.48-.729 3.705-.917 3.705-2.931V6.296c0-.325-.065-.65-.28-.785-.215-.135-.522-.085-.737.065-.26.13-.455.336-.455.65v9.532c0 1.3-.736 1.365-3.1 1.927-1.015.239-2.6.563-3.38.563-.78 0-2.365-.324-3.38-.563-2.364-.562-3.1-.628-3.1-1.927V6.226c0-.314-.195-.52-.455-.65-.215-.15-.521-.2-.736-.065-.216.135-.28.46-.28.785z"
                />
              </svg>
              Microsoft
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login">
          <span className="text-primary-600 dark:text-primary-400 hover:underline">
            Log in
          </span>
        </Link>
      </p>

      <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        By creating an account, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
