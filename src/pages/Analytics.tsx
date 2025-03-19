import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchApiAnalytics, fetchApiPlatformAnalytics, fetchApiExportAnalytics } from "../api/analytics";

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [analytics, setAnalytics] = useState<any>(null);
  const [platformData, setPlatformData] = useState<any>({});
  const [exportFormat, setExportFormat] = useState("json");
  const [error, setError] = useState<string | null>(null);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchApiAnalytics(period);
        setAnalytics(response.data);

        // Fetch Twitter platform data
        try {
          const twitterResponse = await fetchApiPlatformAnalytics("twitter");
          setPlatformData((prev: any) => ({ ...prev, twitter: twitterResponse.data }));
        } catch (platformError: any) {
          console.log("Platform data not available:", platformError.response?.data?.error || platformError.message);
          // Don't set error state for platform data - just log it
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching analytics:", error);
        setError(error.response?.data?.error || "Failed to load analytics data");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  // Handle export
  const handleExport = async (format: string) => {
    try {
      const response = await fetchApiExportAnalytics(format);
      
      if (format === "csv") {
        // For CSV, create a download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analytics_export.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // For JSON, open in new tab
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `analytics_export.${format}`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  // Format data for charts
  const formatCategoryData = () => {
    if (!analytics?.postsByCategory) return [];

    return Object.entries(analytics.postsByCategory).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const formatTrendData = () => {
    if (!analytics?.postsByDate) return [];

    return Object.entries(analytics.postsByDate)
      .map(([date, count]) => ({
        date,
        posts: count,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
          Error
        </h1>
        <p className="text-lg text-neutral-600 dark:text-gray-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
        Analytics Dashboard
      </h1>

      {/* Period Selection */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              period === "week"
                ? "bg-primary-600 text-white"
                : "bg-white text-neutral-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 text-sm font-medium ${
              period === "month"
                ? "bg-primary-600 text-white"
                : "bg-white text-neutral-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setPeriod("quarter")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              period === "quarter"
                ? "bg-primary-600 text-white"
                : "bg-white text-neutral-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            Last 90 days
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">
            Total Posts
          </h3>
          <p className="text-4xl text-primary-600 dark:text-primary-400">
            {analytics?.totalPosts || 0}
          </p>
          <p className="text-neutral-600 dark:text-gray-400 mt-2">
            +12% from last period
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">
            Engagement Rate
          </h3>
          <p className="text-4xl text-primary-600 dark:text-primary-400">
            {analytics?.engagementRate || 0}%
          </p>
          <p className="text-neutral-600 dark:text-gray-400 mt-2">
            +0.5% from last period
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">
            Active Categories
          </h3>
          <p className="text-4xl text-primary-600 dark:text-primary-400">
            {Object.keys(analytics?.postsByCategory || {}).length}
          </p>
          <p className="text-neutral-600 dark:text-gray-400 mt-2">
            Most active:{" "}
            {Object.entries(analytics?.postsByCategory || {})
              .sort((a: any, b: any) => b[1] - a[1])
              .map(([category]) => category)[0] || "None"}
          </p>
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl text-neutral-900 dark:text-white mb-4">
            Content Trends
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formatTrendData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="posts"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl text-neutral-900 dark:text-white mb-4">
            Category Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatCategoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {formatCategoryData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Platform-Specific Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg text-neutral-900 dark:text-white mb-2">
            Twitter
          </h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">
                Followers
              </span>
              <span className="text-neutral-900 dark:text-white">
                {platformData?.twitter?.accountInfo?.followers?.toLocaleString() ||
                  "0"}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">
                Engagement
              </span>
              <span className="text-neutral-900 dark:text-white">
                {platformData?.twitter?.accountInfo?.engagement || "0"}%
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-neutral-600 dark:text-gray-400">Posts</span>
              <span className="text-neutral-900 dark:text-white">
                {platformData?.twitter?.contentMetrics?.totalPosts || "0"}
              </span>
            </p>
          </div>
        </div>
        {/* Additional platform cards would go here */}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl text-neutral-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {analytics?.recentActivity
                ?.slice(0, 5)
                .map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.platform || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : item.status === "scheduled"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Reports */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-xl text-neutral-900 dark:text-white mb-4 md:mb-0">
            Export Reports
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleExport("pdf")}
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Export as PDF
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Export as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
