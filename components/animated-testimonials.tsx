'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "This design system transformed our workflow. The animations are smooth and the black-and-white aesthetic is timeless.",
    author: "Sarah Chen",
    role: "Product Designer",
    company: "TechFlow"
  },
  {
    quote: "The attention to detail in the typography and spacing is incredible. Every pixel feels intentional.",
    author: "Marcus Rodriguez",
    role: "Frontend Developer",
    company: "InnovateLab"
  },
  {
    quote: "Our users love the smooth scrolling experience. It's the little details like this that make a big difference.",
    author: "Emma Thompson",
    role: "UX Researcher",
    company: "DigitalFirst"
  }
];

export default function AnimatedTestimonials() {
  return (
    <section className="py-section-y px-section-x bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-h1 font-display font-bold text-black mb-6">
            What People Say
          </h2>
          <p className="text-body font-body text-gray-800 max-w-2xl mx-auto">
            Hear from developers and designers who have experienced the difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl border border-gray-200"
            >
              <div className="text-4xl text-gray-300 mb-4">"</div>
              <p className="text-body font-body text-gray-800 italic leading-normal mb-6">
                {testimonial.quote}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-display font-semibold text-black">
                  {testimonial.author}
                </p>
                <p className="text-caption font-body text-gray-800">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
