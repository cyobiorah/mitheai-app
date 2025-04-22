import "./index.css";
import { motion } from "framer-motion";
import {
  About,
  ClientsSection,
  Contact,
  Services,
  Testimonials,
} from "./Sections";
import Pricing from "./Pricing";

const HomePage = () => {
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
      <Services />

      {/* Pricing Section */}
      <Pricing />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Clients Section */}
      <ClientsSection />

      {/* About Section */}
      <About />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">&copy; 2025 MitheAi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
