import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Help() {
  return (
    <div className="min-h-screen flex flex-col" id="help">
      <Header />
      <main className="flex-grow">
        <section className="py-24 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Find answers to your questions and learn how to get the most out of
            Skedlii.
          </p>
          <p className="text-muted-foreground text-base">
            Check out our help center for answers to common questions and
            tutorials to help you get started.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
