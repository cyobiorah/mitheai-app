import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  User,
  Users,
  Building,
  Check,
  ArrowRight,
  Crown,
  Zap,
  Shield,
} from "lucide-react";

interface Solution {
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  price?: string;
  period?: string;
  cta: {
    text: string;
    href: string;
    variant:
      | "default"
      | "outline"
      | "secondary"
      | "ghost"
      | "destructive"
      | "link";
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  highlighted?: boolean;
  badge?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function Solutions() {
  const solutions: Solution[] = [
    {
      icon: <User className="h-6 w-6" />,
      secondaryIcon: <Zap className="h-5 w-5" />,
      title: "Individuals",
      description:
        "Perfect for creators and solo professionals managing their online presence.",
      price: "Free",
      period: "beta",
      features: [
        "Manage up to 5 social profiles",
        "Schedule content weeks in advance",
        "Basic analytics and engagement tracking",
        "AI post suggestions",
        "Mobile app access",
      ],
      cta: {
        text: "Join Waitlist",
        href: "/waitlist",
        variant: "outline",
      },
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-500",
    },
    {
      icon: <Users className="h-6 w-6" />,
      secondaryIcon: <Crown className="h-5 w-5" />,
      title: "Teams",
      description:
        "Designed for marketing teams and agencies managing multiple brands.",
      price: "Coming Soon",
      features: [
        "Unlimited team members",
        "Content approval workflows",
        "Asset library for team sharing",
        "Calendar view & content planning",
        "Advanced scheduling & automation",
        "Team roles & permissions",
      ],
      cta: {
        text: "Join Waitlist",
        href: "/waitlist",
        variant: "default",
      },
      secondaryCta: {
        text: "Learn more",
        href: "/#features",
      },
      highlighted: true,
      badge: "MOST POPULAR",
      gradientFrom: "from-secondary-500",
      gradientTo: "to-purple-600",
    },
    {
      icon: <Building className="h-6 w-6" />,
      secondaryIcon: <Shield className="h-5 w-5" />,
      title: "Enterprise",
      description:
        "Built for organizations with complex needs and multiple teams.",
      price: "Custom",
      period: "contact for pricing",
      features: [
        "SSO & advanced security",
        "Enterprise SLA & dedicated support",
        "Custom analytics & reporting",
        "API access & integrations",
        "Multi-team management",
        "Compliance & governance features",
      ],
      cta: {
        text: "Contact Sales",
        href: "/waitlist?plan=enterprise",
        variant: "outline",
      },
      gradientFrom: "from-indigo-500",
      gradientTo: "to-indigo-700",
    },
  ];

  return (
    <section id="solutions" className="py-24 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/10 dark:to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="badge badge-primary px-4 py-1.5 text-sm">
              Flexible Plans
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Solutions For <span className="gradient-heading">Everyone</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a solo creator, small team, or enterprise, Skedlii
            scales to meet your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-6 lg:gap-x-10">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className={`relative card-hover group ${
                solution.highlighted ? "md:-mt-6 md:mb-6 md:pb-6 z-10" : ""
              }`}
            >
              {/* Background card */}
              <div
                className={`absolute inset-0 rounded-2xl ${
                  solution.highlighted
                    ? "bg-gradient-to-b from-primary-100 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 shadow-xl"
                    : "bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800"
                }`}
              ></div>

              {/* Content container */}
              <div className="relative p-8">
                {/* Tag and price row */}
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${solution.gradientFrom} ${solution.gradientTo} text-white shadow-lg`}
                  >
                    {solution.icon}
                  </div>

                  {solution.badge && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300">
                      {solution.secondaryIcon && (
                        <span className="mr-1.5">{solution.secondaryIcon}</span>
                      )}
                      {solution.badge}
                    </span>
                  )}
                </div>

                {/* Plan info */}
                <h3 className="text-2xl font-bold mb-2 font-heading">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {solution.description}
                </p>

                {solution.price && (
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        {solution.price}
                      </span>
                      {solution.period && (
                        <span className="ml-2 text-muted-foreground text-sm">
                          {solution.period}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Features list */}
                <div className="mb-8">
                  <p className="text-sm font-medium mb-3">Includes:</p>
                  <ul className="space-y-3">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div
                          className={`mr-3 mt-1 rounded-full p-1 ${
                            solution.highlighted
                              ? "bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400"
                              : "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA buttons */}
                <div className="space-y-3">
                  <Link to={solution.cta.href} className="block">
                    <Button
                      variant={solution.cta.variant}
                      size="lg"
                      className={`w-full justify-between group ${
                        solution.highlighted
                          ? "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 border-0 text-white"
                          : ""
                      }`}
                    >
                      {solution.cta.text}
                      <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  {solution.secondaryCta && (
                    <Link to={solution.secondaryCta.href} className="block">
                      <Button variant="ghost" size="lg" className="w-full">
                        {solution.secondaryCta.text}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Highlight effect for featured plan */}
              {solution.highlighted && (
                <div className="absolute -inset-px rounded-2xl border-2 border-primary-500 dark:border-primary-400 opacity-100 blur-[2px] transition duration-300 group-hover:blur-0"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center glass-effect rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
          <p className="text-muted-foreground mb-6">
            We also offer tailored plans for specific industries and use cases.
            Tell us about your needs and we'll create a custom solution for you.
          </p>
          <Button variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
