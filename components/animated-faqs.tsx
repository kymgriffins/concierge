'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    question: "How does the smooth scrolling work?",
    answer: "Lenis provides buttery smooth scrolling by using advanced easing functions and requestAnimationFrame for optimal performance. It works seamlessly with Framer Motion animations."
  },
  {
    question: "Is this design system responsive?",
    answer: "Absolutely! The design tokens use fluid typography with clamp() functions and responsive spacing that adapts perfectly to all screen sizes."
  },
  {
    question: "Can I customize the color palette?",
    answer: "Yes! The design tokens are built with CSS custom properties, making it easy to customize colors, spacing, and typography to match your brand."
  },
  {
    question: "How performant are the animations?",
    answer: "All animations use GPU acceleration and are optimized for 60fps performance. Framer Motion automatically uses transform and opacity properties for smooth animations."
  },
  {
    question: "Does it support dark mode?",
    answer: "The design system is built with dark mode in mind. You can easily extend the color tokens to include dark mode variants using Tailwind's dark: prefix."
  }
];

export default function AnimatedFAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-section-y px-section-x bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-h1 font-display font-bold text-black mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-body font-body text-gray-800 max-w-2xl mx-auto">
            Everything you need to know about our design system and animations.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-h2 font-display font-semibold text-black pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-body font-body text-gray-800 leading-normal">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
