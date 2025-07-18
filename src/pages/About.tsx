import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" id="about">
      <Header />
      <main className="flex-grow">
        <section className="py-24 px-4 bg-background text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-4">
              <div className="badge badge-secondary px-4 py-1.5 text-sm">
                Meet Skedlii
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              About Skedlii
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              Skedlii is built to simplify social media content planning,
              publishing, and automation. Whether you're a creator, agency, or
              brand — our goal is to give you powerful tools without complexity.
            </p>
            <p className="text-muted-foreground text-base">
              We're a small team of makers passionate about empowering modern
              storytellers through elegant software, thoughtful automation, and
              user-first design.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
