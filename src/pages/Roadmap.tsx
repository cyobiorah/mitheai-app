import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Roadmap() {
  return (
    <div className="min-h-screen flex flex-col" id="roadmap">
      <Header />
      <main className="flex-grow">
        <section className="py-24 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Skedlii Roadmap</h1>
          <p className="text-muted-foreground text-lg mb-6">
            We're building in public. Here's what's coming next.
          </p>
          <ul className="list-disc list-inside text-left mx-auto text-muted-foreground">
            <li>
              ✅ Twitter, Instagram, LinkedIn (text), and Threads posting
              supported
            </li>
            <li>✅ Unified post composer with scheduling + media handling</li>
            <li>✅ Free trial onboarding with credit card capture</li>
            <li>✅ OAuth flows and token refresh logic in production</li>
            <li>✅ LinkedIn media posting fully supported</li>
            <li>✅ TikTok integration and scheduling fully implemented</li>
            <li>⚠️ Facebook support in progress</li>
            <li>🔜 Analytics dashboard (Q3 target)</li>
            <li>🔜 Role-based team collaboration tools</li>
            <li>🔜 Post performance insights + content optimization AI</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
