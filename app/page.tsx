import { AuthView } from '@neondatabase/auth/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Willis Protocol and Concierge Details */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Willis Protocol Concierge
            </h1>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Experience premium airport concierge services designed for the modern traveler.
                Our protocol combines cutting-edge technology with personalized service to ensure
                every aspect of your journey is seamless and exceptional.
              </p>
              <p>
                From AI-powered booking assistance to real-time flight monitoring and VIP lounge access,
                Willis Protocol delivers the ultimate concierge experience.
              </p>
              <p>
                Join our network of discerning travelers who demand nothing less than perfection
                in their travel arrangements.
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <AuthView path="sign-up" />
            </div>
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
