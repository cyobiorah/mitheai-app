import ScrollToTop from "../components/layout/ScrollToTop";
import { HashLink } from "react-router-hash-link";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-sm text-gray-700 dark:text-gray-200">
      <ScrollToTop />
      <h1 className="text-3xl font-bold mb-2 text-primary-600 dark:text-primary-400">
        Privacy Policy
      </h1>
      <p className="text-xs mb-8 text-gray-500 dark:text-gray-400">
        Effective Date: 03/05/2025
      </p>

      <p className="mb-4">
        Skedlii ("we", "us", or "our") is committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you use our platform (the "Service").
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong>Personal Information</strong>: Name, email address, password
        </li>
        <li>
          <strong>Social Media Data</strong>: Tokens and permissions from
          connected social accounts (e.g., Facebook, X/Twitter, LinkedIn)
        </li>
        <li>
          <strong>Usage Data</strong>: Browser info, IP address, log files,
          device type
        </li>
        <li>
          <strong>Content</strong>: Posts you create or schedule through Skedlii
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. How We Use Your Data
      </h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Provide and improve the Service</li>
        <li>Authenticate and manage accounts</li>
        <li>Schedule and publish content on your behalf</li>
        <li>Send updates and service emails</li>
        <li>Detect and prevent fraud or abuse</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. How We Share Data</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>
          <strong>Social Media APIs</strong> (to schedule/publish content)
        </li>
        <li>
          <strong>Service providers</strong> (hosting, analytics, email
          delivery)
        </li>
        <li>Legal authorities (if required by law)</li>
      </ul>
      <p className="mb-4">We never sell your data.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Cookies & Tracking</h2>
      <p className="mb-4">
        We may use cookies and similar tracking tools for analytics and
        improving your experience. You can disable cookies in your browser.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Data Retention</h2>
      <p className="mb-4">
        We keep your data as long as your account is active, or as needed to
        provide the Service. You can request deletion at any time.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Your Rights</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Access or update your data</li>
        <li>Disconnect social accounts</li>
        <li>Request data deletion</li>
        <li>Opt-out of emails</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Security</h2>
      <p className="mb-4">
        We take data security seriously and use industry-standard encryption and
        safeguards.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        8. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy. Changes will be posted on this page
        with a revised "Effective Date".
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Contact Us</h2>
      <p className="mb-4">
        If you have questions, contact:{" "}
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

export default PrivacyPolicy;
