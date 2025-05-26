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
      question: "When will Skedlii be available?",
      answer:
        "We're currently in private beta with a limited number of users. We plan to launch publicly in Q1 2023. Join our waitlist to be notified when we launch!",
    },
    {
      question: "Which social media platforms do you support?",
      answer:
        "We currently support Twitter, Instagram, LinkedIn, Facebook, and Threads. We're actively working on adding more platforms based on user demand.",
    },
    {
      question: "How does pricing work?",
      answer:
        "Skedlii will offer tiered pricing for individuals, teams, and enterprises. Full pricing details will be announced closer to our public launch. Early waitlist members will receive special discounts.",
    },
    {
      question: "How do teams and permissions work?",
      answer:
        "Skedlii offers flexible team structures with customizable permissions. Admins can create teams, assign members, and set permissions for content creation, approval, and publishing.",
    },
    {
      question: "Can I migrate from another social media management tool?",
      answer:
        "Yes! We're building migration tools to help you easily transfer your content and settings from other platforms. Our support team will also be available to assist with the transition.",
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
                key={index}
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
