import { Star, StarHalf } from "lucide-react";
import { useState, useEffect } from "react";

interface Testimonial {
  content: string;
  author: {
    name: string;
    role: string;
    company?: string;
    avatarColor?: string;
  };
  rating: number;
  highlight?: string;
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials: Testimonial[] = [
    {
      content:
        "Skedlii has completely transformed how our marketing team manages social content. The collaboration features are intuitive and powerful, and we've seen a significant improvement in our workflow efficiency.",
      author: {
        name: "Sarah Johnson",
        role: "Marketing Director",
        company: "TechCorp",
        avatarColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      },
      rating: 5,
      highlight: "transformed",
    },
    {
      content:
        "As a content creator, I need tools that don't get in my way. Skedlii's interface is clean, fast, and helps me focus on creating great content rather than managing posting schedules.",
      author: {
        name: "Alex Rivera",
        role: "Social Media Influencer",
        avatarColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
      },
      rating: 5,
      highlight: "clean, fast",
    },
    {
      content:
        "The analytics dashboard gives us insights we couldn't find anywhere else. We've increased our engagement by 37% since switching to Skedlii, and the platform makes it easy to understand what's working.",
      author: {
        name: "Michael Chen",
        role: "Social Media Manager",
        company: "GrowthBrand",
        avatarColor: "bg-gradient-to-br from-amber-500 to-orange-500",
      },
      rating: 4.5,
      highlight: "increased our engagement by 37%",
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-current" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="h-5 w-5 stroke-current fill-transparent"
        />
      );
    }

    return stars;
  };

  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span
          key={i}
          className="font-semibold text-primary-600 dark:text-primary-400"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section className="py-24 relative overflow-hidden" id="testimonials">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full bg-secondary-100/30 dark:bg-secondary-900/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-40 w-80 h-80 rounded-full bg-primary-100/30 dark:bg-primary-900/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="badge badge-secondary px-4 py-1.5 text-sm">
              User Success Stories
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            What Our <span className="gradient-heading">Beta Users</span> Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Early access users are already seeing the benefits of Skedlii's
            streamlined approach.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop testimonials grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`glass-effect rounded-2xl p-8 transition-all duration-300 ${
                  activeIndex === index
                    ? "ring-2 ring-primary/50 dark:ring-primary/30 shadow-xl scale-105 z-10"
                    : "hover:shadow-lg"
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="text-amber-400 flex">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 relative">
                  <span className="absolute -top-3 -left-2 text-5xl opacity-20 font-serif">
                    "
                  </span>
                  {highlightText(testimonial.content, testimonial.highlight)}
                  <span className="absolute -bottom-6 -right-2 text-5xl opacity-20 font-serif">
                    "
                  </span>
                </p>
                <div className="flex items-center mt-8">
                  <div
                    className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-medium ${
                      testimonial.author.avatarColor || "bg-primary-500"
                    }`}
                  >
                    {testimonial.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.author.role}
                      {testimonial.author.company &&
                        `, ${testimonial.author.company}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile testimonial carousel */}
          <div className="md:hidden">
            <div className="glass-effect rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-amber-400 flex">
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 relative min-h-[100px]">
                <span className="absolute -top-3 -left-2 text-5xl opacity-20 font-serif">
                  "
                </span>
                {highlightText(
                  testimonials[activeIndex].content,
                  testimonials[activeIndex].highlight
                )}
                <span className="absolute -bottom-6 -right-2 text-5xl opacity-20 font-serif">
                  "
                </span>
              </p>
              <div className="flex items-center mt-8">
                <div
                  className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-medium ${
                    testimonials[activeIndex].author.avatarColor ||
                    "bg-primary-500"
                  }`}
                >
                  {testimonials[activeIndex].author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">
                    {testimonials[activeIndex].author.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[activeIndex].author.role}
                    {testimonials[activeIndex].author.company &&
                      `, ${testimonials[activeIndex].author.company}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile pagination dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index
                      ? "w-8 bg-primary-500"
                      : "w-2.5 bg-gray-300 dark:bg-gray-700"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Stats section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="glass-effect rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-heading">
                97%
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Satisfaction Rate
              </p>
            </div>
            <div className="glass-effect rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-heading">
                42%
              </p>
              <p className="text-sm text-muted-foreground mt-2">Time Saved</p>
            </div>
            <div className="glass-effect rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-heading">
                1,200+
              </p>
              <p className="text-sm text-muted-foreground mt-2">Beta Users</p>
            </div>
            <div className="glass-effect rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-heading">
                25K+
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Posts Scheduled
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
