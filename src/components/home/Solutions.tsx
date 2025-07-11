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

export default function Solutions({
  skedliiPlans,
  loading,
}: {
  skedliiPlans: any[];
  loading: boolean;
}) {
  const creatorPlan = skedliiPlans.find((plan) => plan.id === "creator");
  const proPlan = skedliiPlans.find((plan) => plan.id === "pro");
  const solutions = [
    {
      icon: <User className="h-6 w-6" />,
      secondaryIcon: <Zap className="h-5 w-5" />,
      title: creatorPlan?.name,
      description: creatorPlan?.description,
      price: `$${creatorPlan?.priceMonthly}/mo`,
      period: "7-day free trial",
      features: creatorPlan?.features,
      cta: {
        text: "Start Free Trial",
        href: "/register",
        variant: "outline",
      },
      badge: creatorPlan?.badge,
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-500",
    },
    {
      icon: <Users className="h-6 w-6" />,
      secondaryIcon: <Crown className="h-5 w-5" />,
      title: proPlan?.name,
      description: proPlan?.description,
      price: `$${proPlan?.priceMonthly}/mo`,
      features: proPlan?.features,
      cta: {
        text: "Upgrade Now",
        href: "/register",
        variant: "default",
      },
      badge: proPlan?.badge,
      highlighted: true,
      gradientFrom: "from-purple-500",
      gradientTo: "to-fuchsia-600",
    },
    {
      icon: <Building className="h-6 w-6" />,
      secondaryIcon: <Shield className="h-5 w-5" />,
      title: "Enterprise",
      description:
        "Built for organizations with complex needs and multiple teams.",
      price: "Custom",
      period: "Contact for pricing",
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
        href: "/contact",
        variant: "outline",
      },
      gradientFrom: "from-indigo-500",
      gradientTo: "to-indigo-700",
    },
  ];

  return (
    <section id="solutions" className="py-24 relative">
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
            Whether you're a solo creator, growing influencer, or enterprise,
            Skedlii scales to meet your needs.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-6 lg:gap-x-10">
            {solutions.map((solution, index) => (
              <div
                key={`${solution.title}-${index}`}
                className={`relative card-hover group ${
                  solution.highlighted ? "md:-mt-6 md:mb-6 md:pb-6 z-10" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl ${
                    solution.highlighted
                      ? "bg-gradient-to-b from-primary-100 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 shadow-xl"
                      : "bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800"
                  }`}
                ></div>

                <div className="relative p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${solution.gradientFrom} ${solution.gradientTo} text-white shadow-lg`}
                    >
                      {solution.icon}
                    </div>

                    {solution.badge && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300">
                        {solution.secondaryIcon && (
                          <span className="mr-1.5">
                            {solution.secondaryIcon}
                          </span>
                        )}
                        {solution.badge}
                      </span>
                    )}
                  </div>

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

                  <div className="mb-8">
                    <p className="text-sm font-medium mb-3">Includes:</p>
                    <ul className="space-y-3">
                      {solution?.features?.map((feature: string) => (
                        <li
                          key={feature + solution?.title}
                          className="flex items-start"
                        >
                          <div
                            className={`mr-3 mt-1 rounded-full p-1 ${
                              solution?.highlighted
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

                  <div className="space-y-3">
                    <Link to={solution.cta.href} className="block">
                      <Button
                        variant={solution.cta.variant as any}
                        size="lg"
                        className={`w-full justify-between group ${
                          solution?.highlighted
                            ? "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 border-0 text-white"
                            : ""
                        }`}
                      >
                        {solution.cta.text}
                        <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {solution?.highlighted && (
                  <div className="absolute -inset-px rounded-2xl border-2 border-primary-500 dark:border-primary-400 opacity-100 blur-[2px] transition duration-300 group-hover:blur-0"></div>
                )}
              </div>
            ))}
          </div>
        )}

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
