import React from 'react';

const Scheduling: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Content Scheduling</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Platform Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl text-neutral-900 dark:text-white mb-4">Platforms</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="form-checkbox text-primary-600 dark:text-primary-400 h-5 w-5 dark:bg-gray-700 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400" 
                />
                <span className="text-neutral-900 dark:text-white">Facebook</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="form-checkbox text-primary-600 dark:text-primary-400 h-5 w-5 dark:bg-gray-700 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400" 
                />
                <span className="text-neutral-900 dark:text-white">Twitter</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="form-checkbox text-primary-600 dark:text-primary-400 h-5 w-5 dark:bg-gray-700 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400" 
                />
                <span className="text-neutral-900 dark:text-white">LinkedIn</span>
              </label>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="form-checkbox text-primary-600 dark:text-primary-400 h-5 w-5 dark:bg-gray-700 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400" 
                />
                <span className="text-neutral-900 dark:text-white">Instagram</span>
              </label>
            </div>

            <div className="mt-6">
              <h3 className="text-lg text-neutral-900 dark:text-white mb-3">Integration Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-900 dark:text-white">Facebook</span>
                  <span className="text-secondary-600 dark:text-secondary-400">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-900 dark:text-white">Twitter</span>
                  <span className="text-error-600 dark:text-error-400">Not Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-neutral-900 dark:text-white">Calendar</h2>
              <div className="flex gap-2">
                <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">Month</button>
                <button className="bg-neutral-100 hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-neutral-900 dark:text-white px-4 py-2 rounded-lg transition-colors">Week</button>
                <button className="bg-neutral-100 hover:bg-neutral-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-neutral-900 dark:text-white px-4 py-2 rounded-lg transition-colors">Day</button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-50 dark:bg-gray-700 hover:bg-neutral-100 dark:hover:bg-gray-600 p-2 rounded-lg text-neutral-900 dark:text-white transition-colors cursor-pointer"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Schedule Setup */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h2 className="text-xl text-neutral-900 dark:text-white mb-4">Recurring Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select className="bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
          <select className="bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400">
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            {/* Add other days */}
          </select>
          <input
            type="time"
            className="bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          />
          <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
            Add Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
