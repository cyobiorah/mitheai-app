import { useState } from "react";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  AdjustmentsVerticalIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import "./index.css";

function App() {
  const [yearly, setYearly] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "MitheAi transformed how we handle content creation. It's a game changer!",
      author: "— Alex M., Digital Agency Director",
    },
    {
      quote:
        "No more bottlenecks. Our content pipeline is faster and smarter with MitheAi.",
      author: "— Chidera N., SaaS Co-Founder",
    },
    {
      quote:
        "From multilingual content to visual automation, MitheAi has it all.",
      author: "— Marie L., Global Marketing Head",
    },
  ];

  const services = [
    {
      icon: SparklesIcon,
      title: "AI-Powered Content Generation",
      description:
        "Generate articles, blogs, social posts, scripts, and product descriptions with our advanced language models.",
    },
    {
      icon: AdjustmentsVerticalIcon,
      title: "Content Workflow Management",
      description:
        "Organize, review, and approve content with collaborative tools for teams and enterprises.",
    },
    {
      icon: MagnifyingGlassIcon,
      title: "SEO Optimization Tools",
      description:
        "Optimize content automatically for search engines and improve your global reach.",
    },
    {
      icon: PhotoIcon,
      title: "Media & Visual AI",
      description:
        "Generate and enhance images, thumbnails, and branded visuals using generative AI.",
    },
    {
      icon: GlobeAltIcon,
      title: "Multilingual Capabilities",
      description:
        "Create and manage content in multiple languages with precision translation and localization tools.",
    },
    {
      icon: ChartBarIcon,
      title: "Analytics & Insights",
      description:
        "Track content performance and engagement with AI-driven dashboards and KPIs.",
    },
  ];

  const logos = [
    {
      name: "Google",
      url: "https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
    },
    {
      name: "Microsoft",
      url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      name: "IBM",
      url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    },
    {
      name: "AWS",
      url: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
    },
    {
      name: "Hankali Intel",
      url: "https://avatars.githubusercontent.com/u/112755597?s=280&v=4",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800" id="home">
      {/* Navbar */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">
            <a href="#home" className="hover:text-indigo-600 transition-colors">
              MitheAi
            </a>
          </h1>
          <nav className="space-x-8 text-sm font-medium">
            <a
              href="#services"
              className="hover:text-indigo-600 transition-colors"
            >
              Services
            </a>
            <a
              href="#plans"
              className="hover:text-indigo-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-indigo-600 transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#partners"
              className="hover:text-indigo-600 transition-colors"
            >
              Clients
            </a>
            <a
              href="#about"
              className="hover:text-indigo-600 transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Create Smarter,
            <br />
            Manage Better
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
            MitheAi is a global platform for AI-powered content creation and
            intelligent content management tailored to businesses of all sizes.
          </p>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 inline-block bg-white text-indigo-600 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Explore Services
          </motion.a>
          <motion.a
            href="/login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 ml-4 inline-block border border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-indigo-600 transition-all"
          >
            Get Started
          </motion.a>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 gradient-text"
          >
            Our Services
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="service-card glass-card p-8 rounded-2xl hover-scale"
              >
                <service.icon className="w-12 h-12 text-indigo-600 mb-4 service-icon" />
                <h4 className="text-xl font-semibold mb-3">{service.title}</h4>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 gradient-text"
          >
            Payment Plans
          </motion.h3>
          <div className="mb-12 flex justify-center items-center gap-4">
            <span className="font-medium">Monthly</span>
            <label htmlFor="yearly" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">Toggle yearly billing</span>
              <input
                type="checkbox"
                id="yearly"
                className="sr-only peer"
                checked={yearly}
                onChange={(e) => setYearly(e.target.checked)}
              />
              <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-all"></div>
              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-all"></div>
            </label>
            <span className="font-medium text-indigo-600">
              Yearly (Save 20%)
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pricing-card glass-card p-8 rounded-2xl"
            >
              <h4 className="text-2xl font-semibold mb-4">Starter</h4>
              <p className="text-4xl font-bold mb-6">
                <span>{yearly ? "$79" : "$99"}</span>
                <span className="text-base font-normal text-gray-600">/mo</span>
              </p>
              <ul className="space-y-4 mb-8 text-gray-600">
                <li className="flex items-center">
                  <SparklesIcon className="w-5 h-5 text-indigo-600 mr-2" /> 20
                  Content Pieces
                </li>
                <li className="flex items-center">
                  <AdjustmentsVerticalIcon className="w-5 h-5 text-indigo-600 mr-2" />{" "}
                  Workflow Tools
                </li>
                <li className="flex items-center">
                  <GlobeAltIcon className="w-5 h-5 text-indigo-600 mr-2" />{" "}
                  Email Support
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
              >
                Choose Plan
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="pricing-card glass-card p-8 rounded-2xl border-2 border-indigo-600 transform scale-105"
            >
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-xl text-sm">
                Popular
              </div>
              <h4 className="text-2xl font-semibold mb-4">Pro</h4>
              <p className="text-4xl font-bold mb-6">
                <span>{yearly ? "$199" : "$249"}</span>
                <span className="text-base font-normal text-gray-600">/mo</span>
              </p>
              <ul className="space-y-4 mb-8 text-gray-600">
                <li className="flex items-center">
                  <SparklesIcon className="w-5 h-5 text-indigo-600 mr-2" />{" "}
                  Unlimited Content
                </li>
                <li className="flex items-center">
                  <MagnifyingGlassIcon className="w-5 h-5 text-indigo-600 mr-2" />{" "}
                  SEO Tools
                </li>
                <li className="flex items-center">
                  <GlobeAltIcon className="w-5 h-5 text-indigo-600 mr-2" />{" "}
                  Priority Support
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
              >
                Choose Plan
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="pricing-card glass-card p-8 rounded-2xl"
            >
              <h4 className="text-2xl font-semibold mb-4">Enterprise</h4>
              <p className="text-4xl font-bold mb-6">Custom</p>
              <ul className="space-y-4 mb-8 text-gray-600">
                <li className="flex items-center">
                  <SparklesIcon className="w-5 h-5 text-indigo-600 mr-2" />{" "}
                  Dedicated AI Models
                </li>
                <li className="flex items-center">
                  <AdjustmentsVerticalIcon className="w-5 h-5 text-indigo-600 mr-2" />{" "}
                  Admin & Team Roles
                </li>
                <li className="flex items-center">
                  <GlobeAltIcon className="w-5 h-5 text-indigo-600 mr-2" /> 24/7
                  Support
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
              >
                Contact Us
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 gradient-text"
          >
            What Our Clients Say
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="testimonial-card glass-card p-8 rounded-2xl text-lg">
              <p className="italic mb-6">
                {testimonials[activeTestimonialIndex].quote}
              </p>
              <p className="font-semibold text-indigo-600">
                {testimonials[activeTestimonialIndex].author}
              </p>
            </div>
            <div className="flex justify-center mt-8 space-x-4">
              {testimonials.map((_, index) => (
                <button
                  key={_.author}
                  onClick={() => setActiveTestimonialIndex(index)}
                  className={`w-4 h-4 rounded-full transition-all ${
                    index === activeTestimonialIndex
                      ? "bg-indigo-600 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clients Section */}
      <section id="partners" className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 gradient-text"
          >
            Trusted by Global Leaders
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-16"
          >
            {logos.map((logo, index) => (
              <motion.img
                key={logo.name}
                src={logo.url}
                alt={logo.name}
                className="h-12 opacity-70 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-4xl font-bold mb-8 gradient-text">
              Why MitheAi?
            </h3>
            <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
              MitheAi is a comprehensive AI content creation and management
              platform for global businesses. We help teams produce, organize,
              and optimize content faster, smarter, and more collaboratively.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-4xl font-bold mb-8 gradient-text">
              Get in Touch
            </h3>
            <p className="mb-12 text-gray-700 max-w-2xl mx-auto text-lg">
              Let's explore how MitheAi can elevate your content and scale your
              workflow. Our team is ready to connect.
            </p>
            <motion.a
              href="mailto:hello@mitheai.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-indigo-600 text-white font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all"
            >
              Contact Us
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">&copy; 2025 MitheAi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
