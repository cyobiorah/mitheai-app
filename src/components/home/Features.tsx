import {
  Calendar,
  Users,
  FolderHeart,
  BarChart2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function Features() {
  const features: Feature[] = [
    {
      icon: <Calendar className="h-7 w-7" />,
      title: "Smart Scheduling",
      description:
        "Plan your content calendar with AI-powered recommendations for optimal posting times.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Team Collaboration (Coming Soon)",
      description:
        "Work together with your team to create, approve, and schedule content seamlessly.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <FolderHeart className="h-7 w-7" />,
      title: "Content Collections",
      description:
        "Organize your posts into thematic collections for campaigns, products, or events.",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: <BarChart2 className="h-7 w-7" />,
      title: "Analytics Dashboard (Coming Soon)",
      description:
        "Track performance metrics across all platforms in one comprehensive view.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: "Multi-Platform Publishing",
      description:
        "Create once, publish everywhere with platform-specific formatting and previews.",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: <ShieldCheck className="h-7 w-7" />,
      title: "Role-Based Access (Coming Soon)",
      description:
        "Control who can create, approve, and publish with granular permission settings.",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary-100/50 dark:bg-primary-900/20 blur-3xl"></div>
        <div className="absolute top-24 right-0 w-96 h-96 rounded-full bg-secondary-100/30 dark:bg-secondary-900/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="badge badge-primary px-4 py-1.5 text-sm">
              Powerful Features
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Your Social Media Workflow,{" "}
            <span className="gradient-heading">Reimagined</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Skedlii brings all your social media management needs into one
            powerful, intuitive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-hover glass-effect rounded-2xl p-8 relative overflow-hidden group"
            >
              {/* Gradient background indicator */}
              <div
                className="absolute inset-0 w-2 bg-gradient-to-b opacity-50 transition-all duration-300 group-hover:w-full group-hover:opacity-5"
                style={{
                  backgroundImage: `linear-gradient(to bottom, var(--${
                    feature.color.split("-")[1]
                  }-500), var(--${feature.color.split("-")[3]}))`,
                }}
              ></div>

              {/* Icon with gradient circle background */}
              <div className="relative mb-6">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                >
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 font-heading relative">
                {feature.title}
              </h3>
              <p className="text-muted-foreground relative">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block glass-effect rounded-full px-8 py-2.5 shadow-lg">
            <p className="text-muted-foreground">
              Ready to streamline your social media workflow?{" "}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Start your free trial
              </Link>{" "}
              — card required, cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
