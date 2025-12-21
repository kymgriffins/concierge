'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: 'Smooth Animations',
    description: 'Fluid motion with Framer Motion for engaging user experiences.',
    icon: '🎭'
  },
  {
    title: 'Modern Design',
    description: 'Clean black and white aesthetic with subtle gray accents.',
    icon: '🎨'
  },
  {
    title: 'Responsive Layout',
    description: 'Perfect on all devices with adaptive design patterns.',
    icon: '📱'
  },
  {
    title: 'Performance First',
    description: 'Optimized animations that don\'t compromise on speed.',
    icon: '⚡'
  },
  {
    title: 'Accessibility',
    description: 'Inclusive design that works for everyone.',
    icon: '♿'
  },
  {
    title: 'TypeScript Ready',
    description: 'Full type safety with modern development practices.',
    icon: '🔷'
  }
];

export default function AnimatedFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-section-y px-section-x bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-h1 font-display font-bold text-black mb-6">
            Powerful Features
          </h2>
          <p className="text-body font-body text-gray-800 max-w-2xl mx-auto">
            Discover the tools and techniques that make modern web development exceptional.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-card-gap"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group bg-white p-8 rounded-xl shadow-card border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-h2 font-display font-semibold text-black mb-3">
                {feature.title}
              </h3>
              <p className="text-body font-body text-gray-800 leading-normal">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
