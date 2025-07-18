import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FrequentlyAskedQuestions() {
  const faqs: FAQItem[] = [
    {
      question: "Is Skedlii available now?",
      answer:
        "Yes! Skedlii is live and available to all users. You can start your free trial today — with full access and no feature restrictions during the trial.",
    },
    {
      question: "Do I need a credit card to start the trial?",
      answer:
        "Yes. We require a valid credit card to begin your 7-day free trial. You won’t be charged until the trial ends, and you can cancel anytime.",
    },
    {
      question: "Which social media platforms do you support?",
      answer:
        "Skedlii currently supports Twitter, Instagram, LinkedIn, Facebook, and Threads. We're actively working to add TikTok and more based on demand.",
    },
    {
      question: "How does pricing work?",
      answer:
        "Skedlii offers simple, transparent pricing. After your trial, you can choose from plans designed for individuals, teams, and agencies — all billed monthly.",
    },
    {
      question: "Can I migrate from another social media tool?",
      answer:
        "Yes. While full migration tools are in progress, our support team can assist with manual content transfers and setup during onboarding.",
    },
    {
      question: "What happens after my trial ends?",
      answer:
        "At the end of your 7-day trial, your selected subscription plan will automatically begin unless you cancel beforehand. You can manage your billing or cancel anytime from your account settings.",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about Skedlii.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={`${faq.question}-${index}`}
                value={`item-${index}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-6"
              >
                <AccordionTrigger className="text-xl font-bold font-heading py-4 dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
