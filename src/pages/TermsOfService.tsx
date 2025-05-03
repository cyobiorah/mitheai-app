import { HashLink } from "react-router-hash-link";
import ScrollToTop from "../components/layout/ScrollToTop";

const TermsOfService = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-sm text-gray-700 dark:text-gray-200">
      <ScrollToTop />
      <h1 className="text-3xl font-bold mb-2 text-primary-600 dark:text-primary-400">
        Terms of Service
      </h1>
      <p className="text-xs mb-8 text-gray-500 dark:text-gray-400">
        Effective Date: 03/05/2025
      </p>

      <p className="mb-4">
        These Terms of Service ("Terms") govern your access to and use of
        Skedlii ("we", "our", or "us") and its services.
      </p>
      <p className="mb-4">
        By using Skedlii, you agree to these Terms. If you do not agree, do not
        use the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Service</h2>
      <p className="mb-4">
        You may use Skedlii to manage and schedule social media content. You
        agree to provide accurate information and to not misuse or abuse the
        platform.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. Account Responsibilities
      </h2>
      <p className="mb-4">
        You are responsible for keeping your account credentials secure and for
        actions taken under your account.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Social Media Integration
      </h2>
      <p className="mb-4">
        By connecting accounts, you grant Skedlii permission to act on your
        behalf (e.g., posting, scheduling). You may disconnect accounts at any
        time.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Prohibited Use</h2>
      <p className="mb-2">You agree not to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Use Skedlii to violate laws or platform terms (e.g., Twitter or Meta
          policies)
        </li>
        <li>Harass or harm others</li>
        <li>Attempt to hack, overload, or disrupt the service</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access for violating these terms or any
        misuse of the platform.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        6. Intellectual Property
      </h2>
      <p className="mb-4">
        All rights to Skedlii’s branding, software, and design remain ours. You
        retain rights to your own content.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        7. Limitation of Liability
      </h2>
      <p className="mb-4">
        Skedlii is provided "as is". We are not liable for lost posts, downtime,
        or third-party service failures.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms. Continued use of the service means you accept
        the changes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Contact</h2>
      <p className="mb-4">
        For questions, reach us at:{" "}
        <a
          href="mailto:hello@skedlii.xyz"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          hello@skedlii.xyz
        </a>
      </p>

      <div className="mt-10">
        <HashLink
          smooth
          to="/"
          elementId="home"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          ← Back to Home
        </HashLink>
      </div>
    </div>
  );
};

export default TermsOfService;
