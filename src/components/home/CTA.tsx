import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-16 bg-primary-50 dark:bg-primary-900/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-4">
          Ready to Transform Your Social Media Workflow?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Start your 7-day free trial and experience Skedlii's full power. Card required. Cancel anytime.
        </p>
        <Link to="/register">
          <Button size="lg" className="text-lg px-8">
            Start Free Trial
          </Button>
        </Link>
      </div>
    </section>
  );
}
