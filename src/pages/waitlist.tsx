import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WaitlistForm from "../components/waitlist/WaitlistForm";

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 bg-primary-600 text-white dark:bg-primary-900">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Join Our Waitlist
              </h1>
              <p className="text-lg text-primary-100 mb-8">
                Be among the first to experience Skedlii. Early access members
                receive extended trial periods and special pricing.
              </p>

              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
