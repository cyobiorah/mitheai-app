import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  UserIcon,
  BarChart2,
  PieChartIcon,
  Activity,
  Calendar,
} from "lucide-react";
import { mockService, AnalyticsData } from "../../lib/mockData";

// Color palette for charts
const colors = {
  primary: "#4B8EF0",
  secondary: "#57D8A5",
  accent: "#A78BFA",
  warning: "#FFD966",
  error: "#FC8181",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  tiktok: "#000000",
  threads: "#444444",
};

const PLATFORM_COLORS = [
  colors.instagram,
  colors.twitter,
  colors.facebook,
  colors.linkedin,
  colors.tiktok,
  colors.threads,
];

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await mockService.getAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Format platform data for the pie chart
  const platformPostsData = Object.entries(analyticsData.posts.byPlatform).map(
    ([name, value], index) => ({
      name,
      value,
      color: PLATFORM_COLORS[index % PLATFORM_COLORS.length],
    })
  );

  // Format platform engagement data for the bar chart
  const platformEngagementData = Object.entries(
    analyticsData.engagement.byPlatform
  ).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate engagement rate change
  const engagementChange =
    ((analyticsData.engagement.total -
      analyticsData.engagement.previousPeriod) /
      analyticsData.engagement.previousPeriod) *
    100;

  // Calculate reach change
  const reachChange =
    ((analyticsData.reach.total - analyticsData.reach.previousPeriod) /
      analyticsData.reach.previousPeriod) *
    100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your performance and engagement across all platforms
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Tabs
            defaultValue={timeRange}
            onValueChange={setTimeRange}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
              <TabsTrigger value="7d">Last 7 days</TabsTrigger>
              <TabsTrigger value="30d">Last 30 days</TabsTrigger>
              <TabsTrigger value="90d">Last 90 days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Engagement
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.engagement.total.toLocaleString()}
            </div>
            <div className="flex items-center pt-1">
              {engagementChange >= 0 ? (
                <>
                  <ArrowUpIcon className="h-4 w-4 text-success-700 mr-1" />
                  <p className="text-xs text-success-700">
                    +{engagementChange.toFixed(1)}%
                  </p>
                </>
              ) : (
                <>
                  <ArrowDownIcon className="h-4 w-4 text-error mr-1" />
                  <p className="text-xs text-error">
                    {engagementChange.toFixed(1)}%
                  </p>
                </>
              )}
              <p className="text-xs text-muted-foreground ml-2">
                vs. previous period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.reach.total.toLocaleString()}
            </div>
            <div className="flex items-center pt-1">
              {reachChange >= 0 ? (
                <>
                  <ArrowUpIcon className="h-4 w-4 text-success-700 mr-1" />
                  <p className="text-xs text-success-700">
                    +{reachChange.toFixed(1)}%
                  </p>
                </>
              ) : (
                <>
                  <ArrowDownIcon className="h-4 w-4 text-error mr-1" />
                  <p className="text-xs text-error">
                    {reachChange.toFixed(1)}%
                  </p>
                </>
              )}
              <p className="text-xs text-muted-foreground ml-2">
                vs. previous period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Audience Growth
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{analyticsData.audienceGrowth.overall.toFixed(1)}%
            </div>
            <div className="flex items-center pt-1">
              <p className="text-xs text-muted-foreground">
                Across all platforms
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.posts.total}
            </div>
            <div className="flex items-center pt-1">
              <p className="text-xs text-muted-foreground">
                {analyticsData.posts.scheduled} scheduled
              </p>
              <span className="mx-1 text-muted-foreground">•</span>
              <p className="text-xs text-muted-foreground">
                {analyticsData.posts.published} published
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Over Time Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
            <CardDescription>
              Daily engagement across all platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData.engagement.history}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="engagementGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Engagement",
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString();
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.primary}
                  fillOpacity={1}
                  fill="url(#engagementGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reach Over Time Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reach Over Time</CardTitle>
            <CardDescription>
              Daily content reach across all platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData.reach.history}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="reachGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors.accent}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.accent}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Reach",
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString();
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.accent}
                  fillOpacity={1}
                  fill="url(#reachGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution Chart */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Posts by Platform</CardTitle>
              <CardDescription>
                Distribution of posts across platforms
              </CardDescription>
            </div>
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformPostsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {platformPostsData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Posts",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement by Platform Chart */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Engagement by Platform</CardTitle>
              <CardDescription>
                Total engagement across different platforms
              </CardDescription>
            </div>
            <BarChart2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformEngagementData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={36}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.1}
                  vertical={false}
                />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Engagement",
                  ]}
                />
                <Bar dataKey="value" name="Engagement" radius={[4, 4, 0, 0]}>
                  {platformEngagementData.map((entry) => {
                    const platform = entry.name.toLowerCase();
                    let color = colors.primary;

                    if (platform === "instagram") color = colors.instagram;
                    else if (platform === "twitter") color = colors.twitter;
                    else if (platform === "facebook") color = colors.facebook;
                    else if (platform === "linkedin") color = colors.linkedin;
                    else if (platform === "tiktok") color = colors.tiktok;
                    else if (platform === "threads") color = colors.threads;

                    return <Cell key={`cell-${platform}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>
            Your best content based on engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.topPosts.map((post) => (
              <div
                key={post.id}
                className="overflow-hidden rounded-lg border bg-card"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        post.platform === "instagram"
                          ? "bg-[#E1306C]"
                          : post.platform === "twitter"
                          ? "bg-[#1DA1F2]"
                          : post.platform === "facebook"
                          ? "bg-[#1877F2]"
                          : post.platform === "linkedin"
                          ? "bg-[#0A66C2]"
                          : post.platform === "tiktok"
                          ? "bg-black"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="text-xs font-medium capitalize">
                      {post.platform}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 mb-3">{post.caption}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>{post.engagement.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      <span>{post.reach.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
