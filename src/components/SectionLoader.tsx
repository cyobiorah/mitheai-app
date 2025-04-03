const SectionLoader = () => {
  return (
    <div className="px-6 py-4">
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-neutral-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-neutral-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="mt-2 h-3 bg-neutral-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SectionLoader;
