import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Integrations from "../components/home/Integrations";
import Features from "../components/home/Features";
import Solutions from "../components/home/Solutions";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";
import { Button } from "../components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" id="home">
      <Header />

      <main className="flex-1">
        <Hero />
        <Integrations />
        <Features />
        <Solutions />
        <Testimonials />

        <section
          id="waitlist"
          className="py-16 bg-primary-600 text-white dark:bg-primary-900"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Join Our Waitlist
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Be among the first to experience Skedlii. Early access members
              receive extended trial periods and special pricing.
            </p>
            <Link to="/waitlist">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Get Early Access
              </Button>
            </Link>
          </div>
        </section>

        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
