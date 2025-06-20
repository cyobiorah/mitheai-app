import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col" id="pricing">
      <Header />
      <main className="flex-grow">
        <section className="py-24 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Simple, transparent pricing. Choose the plan that fits your
            workflow.
          </p>
          <p className="text-muted-foreground text-base">
            Actual pricing tiers coming soon. For now, all accounts start with a
            7-day free trial.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
