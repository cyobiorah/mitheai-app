import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Analytics Dashboard</h1>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">Total Posts</h3>
          <p className="text-4xl text-primary-600 dark:text-primary-400">245</p>
          <p className="text-neutral-600 dark:text-gray-400 mt-2">+12% from last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">Engagement Rate</h3>
          <p className="text-4xl text-primary-600 dark:text-primary-400">4.8%</p>
          <p className="text-neutral-600 dark:text-gray-400 mt-2">+0.5% from last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">Active Categories</h3>
          <p className="text-4xl text-primary-600 dark:text-primary-400">5</p>
          <p className="text-neutral-600 dark:text-gray-400 mt-2">Most active: Blogs</p>
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl text-neutral-900 dark:text-white mb-4">Engagement Trends</h2>
          <div className="h-64 flex items-center justify-center border border-neutral-200 dark:border-gray-700 rounded">
            <p className="text-neutral-600 dark:text-gray-400">Line chart will be implemented here</p>
          </div>
          <div className="flex justify-between mt-4">
            <button className="text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Last 7 days</button>
            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Last 30 days</button>
            <button className="text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Last 90 days</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl text-neutral-900 dark:text-white mb-4">Category Performance</h2>
          <div className="h-64 flex items-center justify-center border border-neutral-200 dark:border-gray-700 rounded">
            <p className="text-neutral-600 dark:text-gray-400">Pie chart will be implemented here</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-600 dark:bg-primary-500"></div>
              <span className="text-neutral-900 dark:text-white">Blogs (45%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary-600 dark:bg-secondary-500"></div>
              <span className="text-neutral-900 dark:text-white">Ads (30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-600 dark:bg-accent-500"></div>
              <span className="text-neutral-900 dark:text-white">SEO (15%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-400 dark:bg-neutral-500"></div>
              <span className="text-neutral-900 dark:text-white">Other (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform-Specific Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">Twitter</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Followers</span>
              <span className="text-neutral-900 dark:text-white">12.5K</span>
            </p>
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Engagement</span>
              <span className="text-neutral-900 dark:text-white">3.2%</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">Facebook</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Followers</span>
              <span className="text-neutral-900 dark:text-white">25.8K</span>
            </p>
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Engagement</span>
              <span className="text-neutral-900 dark:text-white">4.5%</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">LinkedIn</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Followers</span>
              <span className="text-neutral-900 dark:text-white">15.2K</span>
            </p>
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Engagement</span>
              <span className="text-neutral-900 dark:text-white">2.8%</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">Instagram</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Followers</span>
              <span className="text-neutral-900 dark:text-white">30.1K</span>
            </p>
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Engagement</span>
              <span className="text-neutral-900 dark:text-white">5.1%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Export Reports */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-neutral-900 dark:text-white">Export Reports</h2>
          <div className="flex gap-4">
            <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
              Export as PDF
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">
              Export as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
