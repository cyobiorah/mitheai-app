import { motion } from "framer-motion";
import { useState } from "react";

import { logos, services, testimonials } from "./constants";

const Testimonials = () => {
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  return (
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
  );
};

const Services = () => {
  return (
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
  );
};

const ClientsSection = () => {
  return (
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
  );
};

const About = () => {
  return (
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
            platform for global businesses. We help teams produce, organize, and
            optimize content faster, smarter, and more collaboratively.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
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
  );
};

export { Testimonials, Services, ClientsSection, About, Contact };
