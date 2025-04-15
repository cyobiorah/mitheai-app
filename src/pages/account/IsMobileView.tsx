const IsMobileView = ({
  steps,
  activeStep,
  getActiveStep,
}: {
  steps: any[];
  activeStep: number;
  getActiveStep: (index: number) => string;
}) => {
  return (
    <div className="space-y-4">
      {steps.map((step: any, index: number) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-2 ${getActiveStep(
              index
            )}`}
          >
            {index < activeStep ? (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <div className="ml-4 flex flex-col">
            <span
              className={`text-sm font-medium ${
                index <= activeStep
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-600 ml-5 mt-1"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IsMobileView;
