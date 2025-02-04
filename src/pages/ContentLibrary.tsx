import React from 'react';

const ContentLibrary: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Content Library</h1>

      {/* Content Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 shadow-sm">
        <div className="flex gap-4">
          <select className="bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400">
            <option value="">All Categories</option>
            <option value="blogs">Blogs</option>
            <option value="ads">Ads</option>
            <option value="seo">SEO</option>
          </select>
          <select className="bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
          </select>
          <input
            type="search"
            placeholder="Search content..."
            className="bg-neutral-50 dark:bg-gray-700 text-neutral-900 dark:text-white px-4 py-2 rounded-lg border border-neutral-200 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 flex-grow placeholder-neutral-400 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Sample Content Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl text-neutral-900 dark:text-white">Sample Content Title</h3>
            <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-sm">Blog</span>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-neutral-600 dark:text-gray-400">Last edited: 2 days ago</p>
            <p className="text-neutral-600 dark:text-gray-400">Status: Draft</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-3 py-1 rounded transition-colors">Edit</button>
            <button className="bg-error-600 hover:bg-error-700 dark:bg-error-500 dark:hover:bg-error-600 text-white px-3 py-1 rounded transition-colors">Delete</button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl text-neutral-900 dark:text-white mb-4">Bulk Actions</h3>
        <div className="space-x-4">
          <button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors">Approve Selected</button>
          <button className="bg-error-600 hover:bg-error-700 dark:bg-error-500 dark:hover:bg-error-600 text-white px-4 py-2 rounded-lg transition-colors">Delete Selected</button>
          <button className="bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 text-white px-4 py-2 rounded-lg transition-colors">Schedule Selected</button>
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;
