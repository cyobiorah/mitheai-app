import { Link } from "react-router-dom";

export default function Testimonials() {
  return (
    <section className="pb-24 relative overflow-hidden" id="testimonials">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full bg-secondary-100/30 dark:bg-secondary-900/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-40 w-80 h-80 rounded-full bg-primary-100/30 dark:bg-primary-900/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="badge badge-secondary px-4 py-1.5 text-sm">
              For Creators, By Creators
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Built with Real Feedback
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Skedlii is actively evolving with insights from content creators,
            teams, and social media managers. We're building the scheduling
            platform we always wished existed.
          </p>
        </div>

        <div className="text-center mt-10">
          <Link to="/register">
            <button className="px-6 py-3 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-md hover:scale-105 transition-transform text-base font-medium">
              Start Your Free Trial
            </button>
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Full access. Card required. Cancel anytime during trial.
          </p>
        </div>
      </div>
    </section>
  );
}
