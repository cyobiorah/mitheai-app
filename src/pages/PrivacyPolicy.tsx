import ScrollToTop from "../components/layout/ScrollToTop";
import { HashLink } from "react-router-hash-link";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-base text-gray-800 dark:text-gray-200 leading-relaxed">
      <ScrollToTop />
      <h1 className="text-4xl font-bold mb-3 text-primary-700 dark:text-primary-400">
        Privacy Policy
      </h1>
      <p className="text-sm mb-8 text-gray-600 dark:text-gray-400">
        Effective Date: May 29, 2025
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        Introduction
      </h2>
      <p className="mb-4">
        Welcome to Skedlii ("we", "us", "our"). We are committed to protecting
        the privacy and security of your personal information. This Privacy
        Policy describes how Ngote-Express, the owner and operator of Skedlii,
        collects, uses, processes, shares, and safeguards your information when
        you access or use our social media scheduling platform and related
        services (collectively, the "Service"). It also explains your data
        protection rights under applicable laws, including the EU General Data
        Protection Regulation (GDPR), the Nigeria Data Protection Regulation
        (NDPR), and principles relevant to regulations like the California
        Consumer Privacy Act (CCPA) as amended by the California Privacy Rights
        Act (CPRA).
      </p>
      <p className="mb-4">
        By using our Service, you acknowledge that you have read and understood
        this Privacy Policy. Please review it carefully. If you do not agree
        with our practices, please do not use the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        1. Data Controller Information
      </h2>
      <p className="mb-4">
        The data controller responsible for your personal information is:
      </p>
      <p className="mb-4">
        <strong>Ngote-Express</strong>
        <br />
        Registered in Nigeria
        <br />
        Website:{" "}
        <a
          href="https://ngote.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          https://ngote.xyz
        </a>
      </p>
      <p className="mb-4">
        Ngote-Express determines the purposes and means of processing personal
        data collected through the Skedlii Service. While currently registered
        in Nigeria, we aim for future incorporation in the United States and
        strive to adhere to relevant international data protection standards.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        2. Information We Collect
      </h2>
      <p className="mb-4">
        We collect information about you directly from you, automatically
        through your use of our Service, and sometimes from third parties (like
        the social media platforms you connect). The types of information we
        collect depend on how you interact with us and the Service.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        2.1 Information You Provide Directly
      </h3>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>Account Information:</strong> When you register for an
          account, we collect personal information such as your full name, email
          address, and a secure password. You may optionally provide other
          profile information.
        </li>
        <li>
          <strong>Content:</strong> We collect the content you create, schedule,
          or publish through the Service, including text, images, videos, links,
          and associated metadata.
        </li>
        <li>
          <strong>Communications:</strong> If you contact us directly (e.g., for
          customer support, feedback), we collect information related to your
          communication, such as your contact details and the content of your
          messages.
        </li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        2.2 Information Collected Automatically
      </h3>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>Usage Data:</strong> We automatically collect information
          about your interactions with the Service. This includes your Internet
          Protocol (IP) address, browser type and version, operating system,
          device type, pages visited, features used, time and date of access,
          referring/exit URLs, and other diagnostic data.
        </li>
        <li>
          <strong>Log Files:</strong> Our servers automatically record
          information created by your use of the Service, which may include
          information such as your IP address, browser type, operating system,
          the referring web page, pages visited, location, your mobile carrier,
          device identifiers, search terms, and cookie information.
        </li>
        <li>
          <strong>Cookies and Similar Technologies:</strong> We use cookies, web
          beacons, and similar tracking technologies to collect information
          about your browsing activities over time and across different websites
          following your use of our Service. This helps us operate the Service,
          understand usage, improve user experience, and manage our advertising.
          Please see Section 6 ("Cookies and Tracking Technologies") for more
          details.
        </li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        2.3 Information from Third Parties
      </h3>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>Social Media Platforms:</strong> When you connect your social
          media accounts (e.g., Facebook, X/Twitter, LinkedIn, Instagram,
          Threads) to Skedlii, we receive information from those platforms via
          their APIs. This typically includes authentication tokens,
          permissions, profile information (like your name or handle), and
          potentially other data necessary to provide the scheduling and
          publishing features. The specific information depends on the platform
          and your privacy settings on that platform. We only request the
          permissions necessary to operate the Service on your behalf.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        3. How We Use Your Information (Legal Basis)
      </h2>
      <p className="mb-4">
        We use the information we collect for various purposes, relying on
        specific legal bases under GDPR and NDPR. These include:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>To Provide and Maintain the Service:</strong> To operate,
          manage, and improve the Skedlii platform, including account creation,
          authentication, scheduling, publishing content to your connected
          social media accounts, and providing customer support. (Legal Basis:
          Performance of a contract, Legitimate interests)
        </li>
        <li>
          <strong>To Personalize Your Experience:</strong> To tailor content and
          features based on your usage and preferences. (Legal Basis: Legitimate
          interests, Consent where applicable)
        </li>
        <li>
          <strong>To Communicate with You:</strong> To send you important
          service-related updates, technical notices, security alerts,
          administrative messages, and respond to your inquiries. We may also
          send marketing communications if you opt-in. (Legal Basis: Performance
          of a contract, Legitimate interests, Consent for marketing)
        </li>
        <li>
          <strong>For Analytics and Improvement:</strong> To monitor and analyze
          usage trends, understand how users interact with the Service, gather
          demographic information, and improve the Service's functionality and
          user experience. (Legal Basis: Legitimate interests)
        </li>
        <li>
          <strong>For Security and Fraud Prevention:</strong> To detect,
          prevent, and respond to fraud, abuse, security risks, and technical
          issues, and to protect the rights, property, or safety of Skedlii, our
          users, or the public. (Legal Basis: Legitimate interests, Legal
          obligation)
        </li>
        <li>
          <strong>To Comply with Legal Obligations:</strong> To comply with
          applicable laws, regulations, legal processes, or governmental
          requests. (Legal Basis: Legal obligation)
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        4. How We Share Your Information
      </h2>
      <p className="mb-4">
        We do not sell your personal information. We may share your information
        in the following circumstances:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>With Social Media Platforms:</strong> We share your content
          and instructions with the social media platforms you connect to
          Skedlii, solely for the purpose of scheduling and publishing your
          posts as you direct. This sharing is governed by the respective
          platforms' APIs and terms of service.
        </li>
        <li>
          <strong>With Service Providers (Third-Party Processors):</strong> We
          engage trusted third-party companies and individuals to perform
          services on our behalf, such as website hosting, data storage,
          analytics, email delivery, payment processing (if applicable), and
          infrastructure support. These providers only have access to the
          information necessary to perform their tasks and are obligated not to
          disclose or use it for any other purpose. They are bound by strict
          data processing agreements.
        </li>
        <li>
          <strong>For Legal Reasons:</strong> We may disclose your information
          if required to do so by law or in response to valid requests by public
          authorities (e.g., a court or government agency), or if we believe in
          good faith that disclosure is necessary to comply with a legal
          obligation, protect and defend our rights or property, prevent or
          investigate possible wrongdoing in connection with the Service,
          protect the personal safety of users or the public, or protect against
          legal liability.
        </li>
        <li>
          <strong>Business Transfers:</strong> In connection with, or during
          negotiations of, any merger, sale of company assets, financing, or
          acquisition of all or a portion of our business by another company,
          your information may be transferred as part of that transaction,
          subject to standard confidentiality agreements.
        </li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        4.1 Our Third-Party Data Processors
      </h3>
      <p className="mb-4">
        We currently engage the following key third-party processors who may
        process personal or platform data to support our service infrastructure:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>Vercel Inc.:</strong> Frontend hosting, edge routing,
          serverless functions. May process user session data.
        </li>
        <li>
          <strong>Railway Inc.:</strong> Backend API infrastructure and
          scheduling engine hosting. Processes connected account tokens and
          scheduled content.
        </li>
        <li>
          <strong>MongoDB, Inc. (MongoDB Atlas):</strong> Cloud database
          provider storing user data, content, tokens, and metadata.
        </li>
        <li>
          <strong>Cloudinary Ltd.:</strong> Media asset storage, optimization,
          and delivery for user-generated content.
        </li>
      </ul>
      <p className="mb-4">
        These providers are carefully selected and have committed to upholding
        high standards of data protection and security, consistent with GDPR,
        NDPR, and other applicable regulations.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        5. International Data Transfers
      </h2>
      <p className="mb-4">
        Your information, including personal data, may be transferred to — and
        maintained on — computers located outside of your state, province,
        country, or other governmental jurisdiction where the data protection
        laws may differ from those in your jurisdiction (e.g., Nigeria, EU, US).
        Our service providers operate globally.
      </p>
      <p className="mb-4">
        If you are located outside the United States and Nigeria, please note
        that we transfer data, including personal data, to these countries and
        process it there. We will take all steps reasonably necessary to ensure
        that your data is treated securely and in accordance with this Privacy
        Policy. For transfers outside the European Economic Area (EEA) or
        Nigeria to countries not deemed adequate, we rely on appropriate
        safeguards, such as Standard Contractual Clauses approved by the
        European Commission or the relevant Nigerian authority, or other lawful
        transfer mechanisms.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        6. Cookies and Tracking Technologies
      </h2>
      <p className="mb-4">
        We use cookies and similar tracking technologies (like web beacons and
        pixels) to track activity on our Service and hold certain information.
        Cookies are small files placed on your device. They help us analyze web
        traffic, remember your preferences, understand usage patterns, and
        improve the Service.
      </p>
      <p className="mb-4">We use:</p>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>Essential Cookies:</strong> Necessary for the Service to
          function properly (e.g., authentication, security).
        </li>
        <li>
          <strong>Performance/Analytics Cookies:</strong> Help us understand how
          users interact with the Service, allowing us to improve performance.
        </li>
        <li>
          <strong>Functionality Cookies:</strong> Remember your choices and
          preferences to provide a more personalized experience.
        </li>
      </ul>
      <p className="mb-4">
        You can instruct your browser to refuse all cookies or to indicate when
        a cookie is being sent. However, if you do not accept cookies, you may
        not be able to use some parts of our Service. We may also use a cookie
        consent tool to manage your preferences where legally required.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        7. Data Retention
      </h2>
      <p className="mb-4">
        We retain your personal information for as long as necessary to fulfill
        the purposes outlined in this Privacy Policy, primarily for as long as
        your account is active or as needed to provide you with the Service. We
        will also retain and use your information to the extent necessary to
        comply with our legal obligations (e.g., if we are required to retain
        your data to comply with applicable laws), resolve disputes, and enforce
        our legal agreements and policies.
      </p>
      <p className="mb-4">
        When your information is no longer needed for these purposes, we will
        either delete it or anonymize it. You can request the deletion of your
        account and associated data as described in Section 8.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        8. Your Data Protection Rights
      </h2>
      <p className="mb-4">
        Depending on your location and applicable law (including GDPR, NDPR, and
        CCPA/CPRA), you may have the following rights regarding your personal
        information:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>Right to Access:</strong> You have the right to request copies
          of your personal information.
        </li>
        <li>
          <strong>Right to Rectification:</strong> You have the right to request
          that we correct any information you believe is inaccurate or complete
          information you believe is incomplete.
        </li>
        <li>
          <strong>Right to Erasure (Right to be Forgotten / Deletion):</strong>{" "}
          You have the right to request that we erase your personal information,
          under certain conditions.
        </li>
        <li>
          <strong>Right to Restrict Processing:</strong> You have the right to
          request that we restrict the processing of your personal information,
          under certain conditions.
        </li>
        <li>
          <strong>Right to Object to Processing:</strong> You have the right to
          object to our processing of your personal information based on
          legitimate interests, under certain conditions.
        </li>
        <li>
          <strong>Right to Data Portability:</strong> You have the right to
          request that we transfer the data that we have collected to another
          organization, or directly to you, under certain conditions.
        </li>
        <li>
          <strong>Right to Withdraw Consent:</strong> If we rely on your consent
          to process your personal information, you have the right to withdraw
          that consent at any time.
        </li>
        <li>
          <strong>Right to Opt-Out of Sale/Sharing (CCPA/CPRA):</strong> We do
          not sell your personal information. Under CCPA/CPRA, you may have the
          right to opt-out of the "sharing" of your personal information for
          cross-context behavioral advertising (if applicable).
        </li>
        <li>
          <strong>Right to Non-Discrimination:</strong> We will not discriminate
          against you for exercising any of your privacy rights.
        </li>
        <li>
          <strong>Right to Lodge a Complaint:</strong> You have the right to
          lodge a complaint with a supervisory authority, such as your local
          data protection authority or the Nigeria Data Protection Commission
          (NDPC) if you are in Nigeria.
        </li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        8.1 How to Exercise Your Rights (Including Data Deletion)
      </h3>
      <p className="mb-4">
        You can exercise many of your rights directly within your Skedlii
        account settings:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
        <li>
          <strong>Access and Update:</strong> You can review and update your
          account information through your dashboard settings.
        </li>
        <li>
          <strong>Disconnect Social Accounts:</strong> Go to{" "}
          <strong>Dashboard → Social Accounts</strong> to manage or disconnect
          linked platforms.
        </li>
        <li>
          <strong>Account Deletion:</strong> To permanently delete your account
          and all associated data (including personal information, content,
          tokens, and social permissions), navigate to{" "}
          <strong>Dashboard → Settings → Security</strong> and select the{" "}
          <em>“Delete My Account”</em> option. This action is irreversible.
        </li>
      </ul>
      <p className="mb-4">
        For requests not covered by the self-service options, or if you have
        questions about your rights, please contact us using the details
        provided in Section 11 ("Contact Us"). We will respond to your request
        in accordance with applicable law, typically within one month.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        9. Data Security
      </h2>
      <p className="mb-4">
        We take the security of your data very seriously. We implement
        appropriate technical and organizational measures designed to protect
        your personal information from unauthorized access, use, alteration,
        disclosure, or destruction. These measures include encryption (e.g.,
        SSL/TLS for data in transit), access controls, secure infrastructure,
        regular security assessments, and staff training.
      </p>
      <p className="mb-4">
        However, please remember that no method of transmission over the
        Internet or method of electronic storage is 100% secure. While we strive
        to use commercially acceptable means to protect your personal
        information, we cannot guarantee its absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        10. Children's Privacy
      </h2>
      <p className="mb-4">
        Our Service is not intended for use by individuals under the age of 16
        (or the relevant age of majority in your jurisdiction). We do not
        knowingly collect personal information from children under 16. If we
        become aware that we have collected personal information from a child
        under 16 without verification of parental consent, we will take steps to
        remove that information from our servers.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        11. Changes to This Privacy Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time to reflect changes
        in our practices, technology, legal requirements, or other factors. When
        we make changes, we will update the "Effective Date" at the top of this
        policy. If we make material changes, we will notify you through the
        Service or by other means (such as email) prior to the change becoming
        effective. We encourage you to review this Privacy Policy periodically
        for any updates.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-white">
        12. Contact Us
      </h2>
      <p className="mb-4">
        If you have any questions, concerns, or requests regarding this Privacy
        Policy or our data practices, please contact us at:
      </p>
      <p className="mb-4">
        <strong>Email:</strong>{" "}
        <a
          href="mailto:hello@skedlii.xyz"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          hello@skedlii.xyz
        </a>
      </p>
      <p className="mb-4">
        Please include "Privacy Policy Inquiry" in the subject line to help us
        route your request appropriately.
      </p>

      <div className="mt-12 border-t pt-6 border-gray-300 dark:border-gray-700">
        <HashLink
          smooth
          to="/"
          elementId="home"
          className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
        >
          ← Back to Home
        </HashLink>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
