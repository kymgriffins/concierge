import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Premium Airport Concierge
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Elevate your travel experience with our comprehensive concierge
            services. From meet & greet to VIP lounge access, we handle every
            detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-in">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Premium Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">✈️ Meet & Greet</h3>
              <p className="text-muted-foreground mb-4">
                Personalized airport assistance from arrival to departure
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Dedicated concierge at arrival</li>
                <li>• Fast track through security</li>
                <li>• VIP lounge access</li>
                <li>• Real-time flight updates</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">🚗 Transportation</h3>
              <p className="text-muted-foreground mb-4">
                Premium ground transportation services
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Luxury vehicle fleet</li>
                <li>• Professional chauffeurs</li>
                <li>• Airport transfers</li>
                <li>• City tours available</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">🏨 Concierge Services</h3>
              <p className="text-muted-foreground mb-4">
                Complete travel assistance and support
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Hotel reservations</li>
                <li>• Restaurant bookings</li>
                <li>• Event planning</li>
                <li>• 24/7 support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
