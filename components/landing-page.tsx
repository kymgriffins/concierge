"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero Section */}
      <motion.section
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-20 px-6 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden"
      >
        {/* Background decorative elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-10 w-24 h-24 bg-primary/10 rounded-full blur-lg"
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-2 bg-black text-white border-white">
              Premium Airport Concierge Services
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-black leading-tight"
          >
            Willis Concierge
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            From meet & greet to VIP lounge access, we handle every detail of your airport journey with premium concierge services.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-shadow bg-[#ff224d] hover:bg-[#ff224d]/90 text-white">
                  Access Dashboard
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-2 border-black text-black hover:bg-[#ff224d] hover:text-white hover:border-[#ff224d] transition-all">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        id="services"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive concierge solutions designed for discerning travelers
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={scaleIn}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4"
                  >
                    ✈️
                  </motion.div>
                  <CardTitle>Meet & Greet</CardTitle>
                  <CardDescription>
                    Personalized airport assistance from arrival to departure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Dedicated concierge at arrival</li>
                    <li>• Fast track through security</li>
                    <li>• VIP lounge access</li>
                    <li>• Real-time flight updates</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4"
                  >
                    🛎️
                  </motion.div>
                  <CardTitle>Porter Services</CardTitle>
                  <CardDescription>
                    Professional baggage handling and assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Baggage collection and transport</li>
                    <li>• Check-in assistance</li>
                    <li>• Priority boarding</li>
                    <li>• Gate-to-gate support</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4"
                  >
                    🚗
                  </motion.div>
                  <CardTitle>Chauffeur Service</CardTitle>
                  <CardDescription>
                    Luxury ground transportation solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Premium vehicle fleet</li>
                    <li>• Professional drivers</li>
                    <li>• Airport transfers</li>
                    <li>• City transportation</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4"
                  >
                    🍸
                  </motion.div>
                  <CardTitle>Lounge Access</CardTitle>
                  <CardDescription>
                    Exclusive airport lounge experiences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Premium lounge access</li>
                    <li>• Gourmet dining</li>
                    <li>• Business facilities</li>
                    <li>• Relaxation areas</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4"
                  >
                    📋
                  </motion.div>
                  <CardTitle>VIP Packages</CardTitle>
                  <CardDescription>
                    Comprehensive travel solutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Full concierge service</li>
                    <li>• Priority everything</li>
                    <li>• Custom itineraries</li>
                    <li>• 24/7 support</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4"
                  >
                    🔄
                  </motion.div>
                  <CardTitle>Real-time Updates</CardTitle>
                  <CardDescription>
                    Stay informed throughout your journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Flight status monitoring</li>
                    <li>• Gate change alerts</li>
                    <li>• Delay notifications</li>
                    <li>• Connection assistance</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-20 px-6 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Willis Concierge</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Redefining luxury travel with personalized airport concierge services since 2010
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Our Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                Willis Concierge was founded with a simple mission: to eliminate the stress and hassle of air travel for discerning travelers. Our team of experienced professionals understands that every journey is unique, and we tailor our services to meet your specific needs.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With over a decade of experience serving VIP clients, business executives, and luxury travelers worldwide, we've built a reputation for excellence, reliability, and personalized service that goes above and beyond expectations.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff224d] mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">Years of Service</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff224d] mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Travelers</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={scaleIn} className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#ff224d]/10 to-primary/5 rounded-2xl flex items-center justify-center">
                <div className="text-8xl">✈️</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to experience premium airport concierge services? Contact us today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={scaleIn}>
              <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4 mx-auto"
                  >
                    📞
                  </motion.div>
                  <CardTitle>Phone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground mt-2">24/7 Available</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4 mx-auto"
                  >
                    ✉️
                  </motion.div>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">hello@willisconcierge.com</p>
                  <p className="text-sm text-muted-foreground mt-2">We'll respond within 2 hours</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="text-4xl mb-4 mx-auto"
                  >
                    📍
                  </motion.div>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Serving Major Airports Worldwide</p>
                  <p className="text-sm text-muted-foreground mt-2">Global Coverage</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-20 px-6 bg-muted/50 relative overflow-hidden"
      >
        {/* Background pattern */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, hsl(var(--primary)) 2px, transparent 2px)",
            backgroundSize: "50px 50px"
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready for Premium Service?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-muted-foreground mb-8"
          >
            Join thousands of satisfied travelers who trust us with their airport experience.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-[#ff224d] hover:bg-[#ff224d]/90 text-white">
                  Access Management Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-12 px-6 border-t bg-background/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.4 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
              className="text-2xl"
            >
              ✈️
            </motion.div>
            <span className="text-xl font-bold text-black">Willis Concierge</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-black/70"
          >
            Premium airport concierge services for discerning travelers worldwide.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}
