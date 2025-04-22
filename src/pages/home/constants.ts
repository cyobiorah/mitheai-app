import {
  SparklesIcon,
  AdjustmentsVerticalIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const logos = [
  {
    name: "Google",
    url: "https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
  },
  {
    name: "Microsoft",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    name: "IBM",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    name: "AWS",
    url: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
  },
  {
    name: "Hankali Intel",
    url: "https://avatars.githubusercontent.com/u/112755597?s=280&v=4",
  },
];

export const testimonials = [
  {
    quote:
      "MitheAi transformed how we handle content creation. It's a game changer!",
    author: "— Alex M., Digital Agency Director",
  },
  {
    quote:
      "No more bottlenecks. Our content pipeline is faster and smarter with MitheAi.",
    author: "— Chidera N., SaaS Co-Founder",
  },
  {
    quote:
      "From multilingual content to visual automation, MitheAi has it all.",
    author: "— Marie L., Global Marketing Head",
  },
];

export const services = [
  {
    icon: SparklesIcon,
    title: "AI-Powered Content Generation",
    description:
      "Generate articles, blogs, social posts, scripts, and product descriptions with our advanced language models.",
  },
  {
    icon: AdjustmentsVerticalIcon,
    title: "Content Workflow Management",
    description:
      "Organize, review, and approve content with collaborative tools for teams and enterprises.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "SEO Optimization Tools",
    description:
      "Optimize content automatically for search engines and improve your global reach.",
  },
  {
    icon: PhotoIcon,
    title: "Media & Visual AI",
    description:
      "Generate and enhance images, thumbnails, and branded visuals using generative AI.",
  },
  {
    icon: GlobeAltIcon,
    title: "Multilingual Capabilities",
    description:
      "Create and manage content in multiple languages with precision translation and localization tools.",
  },
  {
    icon: ChartBarIcon,
    title: "Analytics & Insights",
    description:
      "Track content performance and engagement with AI-driven dashboards and KPIs.",
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: 0,
    yearly: 0,
    badge: "Free Forever",
    badgeColor: "green",
    features: [
      "1 social account",
      "10 posts/month",
      "Basic AI features",
      "Community support",
    ],
    button: "Start Free",
    buttonColor: "bg-green-600",
    trial: "Free Forever",
    socialAccounts: 1,
    monthlyPosts: 10,
    aiFeatures: "Basic",
    team: "-",
    support: "Community",
  },
  {
    name: "Starter",
    price: 4.99,
    yearly: 48,
    badge: "7-day Free Trial",
    badgeColor: "indigo",
    features: [
      "5 social accounts",
      "100 posts/month",
      "Basic AI features",
      "Email support",
    ],
    button: "Start Free Trial",
    buttonColor: "bg-indigo-600",
    trial: "7 days",
    socialAccounts: 5,
    monthlyPosts: 100,
    aiFeatures: "Basic",
    team: "-",
    support: "Email",
  },
  {
    name: "Pro",
    price: 14.99,
    yearly: 144,
    badge: "7-day Free Trial",
    badgeColor: "indigo",
    features: [
      "25 social accounts",
      "500 posts/month",
      "Advanced AI features",
      "Team collaboration",
      "Priority support",
    ],
    button: "Start Free Trial",
    buttonColor: "bg-indigo-600",
    trial: "7 days",
    socialAccounts: 25,
    monthlyPosts: 500,
    aiFeatures: "Advanced",
    team: "-",
    support: "Priority",
  },
  {
    name: "Business",
    price: 39,
    yearly: 374,
    badge: "7-day Free Trial",
    badgeColor: "yellow",
    features: [
      "Unlimited social accounts",
      "Unlimited posts",
      "All AI features",
      "Premium support",
      "Custom onboarding",
    ],
    button: "Start Free Trial",
    buttonColor: "bg-yellow-600",
    trial: "7 days",
    socialAccounts: "Unlimited",
    monthlyPosts: "Unlimited",
    aiFeatures: "All",
    team: "-",
    support: "Premium",
  },
];

export const featureRows = [
  { label: "Social Accounts", key: "socialAccounts" },
  { label: "Monthly Posts", key: "monthlyPosts" },
  { label: "AI Features", key: "aiFeatures" },
  { label: "Team Collaboration", key: "team" },
  { label: "Support", key: "support" },
  { label: "Trial", key: "trial" },
];
