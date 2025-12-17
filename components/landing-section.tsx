"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function LandingSection() {
  const [currentView, setCurrentView] = useState<"landing" | "login" | "dashboard">("landing");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, integrate with auth provider
    if (username && password) {
      setCurrentView("dashboard");
    }
  };

  const handleGetStarted = () => {
    setCurrentView("login");
  };

  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Premium Airport Concierge
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Elevate your travel experience with our comprehensive concierge services.
              From meet & greet to VIP lounge access, we handle every detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted}>
                Get Started
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
            <h2 className="text-4xl font-bold text-center mb-12">Our Premium Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ✈️ Meet & Greet
                  </CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🛎️ Porter Services
                  </CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🚗 Chauffeur Service
                  </CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🍸 Lounge Access
                  </CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📋 VIP Packages
                  </CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔄 Real-time Updates
                  </CardTitle>
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
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready for Premium Service?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied travelers who trust us with their airport experience.
            </p>
            <Button size="lg" onClick={handleGetStarted}>
              Start Your Journey
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (currentView === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Airport Concierge Portal</CardTitle>
            <CardDescription>Login to manage bookings and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Airport Concierge Dashboard</h1>
            <p className="text-muted-foreground">
              Manage bookings, monitor operations, and ensure seamless service delivery.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Unified Inbox */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 row-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📬 Unified Inbox
                  <Badge variant="secondary">3 new</Badge>
                </CardTitle>
                <CardDescription>
                  All inquiries from WhatsApp, Email, and manual entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">John Smith - UA 457</p>
                      <p className="text-sm text-muted-foreground">WhatsApp • 2 pax • Meet & Greet</p>
                    </div>
                    <Badge>New</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Sarah Johnson - DL 892</p>
                      <p className="text-sm text-muted-foreground">Email • 1 pax • Fast Track + Lounge</p>
                    </div>
                    <Badge>Contacted</Badge>
                  </div>
                  <Button className="w-full">View All Entries</Button>
                </div>
              </CardContent>
            </Card>

            {/* New Booking */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>✈️ New Booking</CardTitle>
                <CardDescription>Create a new service booking</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Create Booking</Button>
              </CardContent>
            </Card>

            {/* Day View */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>📅 Today's Schedule</CardTitle>
                <CardDescription>8 bookings confirmed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>UA 457 - 14:30</span>
                    <Badge variant="outline">On Time</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>DL 892 - 16:15</span>
                    <Badge variant="outline">Delayed</Badge>
                  </div>
                  <Separator />
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Day
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sync Status */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>🔄 Sync Status</CardTitle>
                <CardDescription>Offline-first operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Online - Last synced 2 min ago</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  5 local changes pending sync
                </p>
              </CardContent>
            </Card>

            {/* Service Menu */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
              <CardHeader>
                <CardTitle>🛎️ Quick Services</CardTitle>
                <CardDescription>Common service combinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">Meet & Greet</Button>
                  <Button variant="outline" size="sm">Fast Track</Button>
                  <Button variant="outline" size="sm">Lounge Access</Button>
                  <Button variant="outline" size="sm">Porter Service</Button>
                  <Button variant="outline" size="sm">Chauffeur</Button>
                  <Button variant="outline" size="sm">VIP Package</Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
              <CardHeader>
                <CardTitle>📋 Recent Activity</CardTitle>
                <CardDescription>Latest updates and completions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Booking #1234 confirmed - John Smith</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Passenger met at Gate B12 - Sarah Johnson</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Lounge access granted - UA 457</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>📊 Stats</CardTitle>
                <CardDescription>This week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bookings:</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction:</span>
                    <span className="font-medium">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
