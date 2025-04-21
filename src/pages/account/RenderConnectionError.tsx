const RenderConnectionError = ({
  connectionError,
  setConnectionError,
}: {
  connectionError: any;
  setConnectionError: (error: any) => void;
}) => {
  if (!connectionError) return null;

  return (
    <div
      className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg p-4 relative"
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium">Connection Error</h3>
          <div className="mt-1 text-sm">
            {connectionError.message}
            {connectionError.details?.connectedToUserId && (
              <p className="mt-1">
                This account is already connected to another user or
                organization.
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 rounded-lg focus:ring-2 focus:ring-red-400 dark:focus:ring-red-700 p-1.5 hover:bg-red-200 dark:hover:bg-red-800 inline-flex items-center justify-center h-8 w-8"
          onClick={() => setConnectionError(null)}
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RenderConnectionError;
