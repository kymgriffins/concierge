"use client";

import { useState } from "react";
import { AdminBookings } from "./admin-bookings";
import { AdminBookingAssignments } from "./admin-booking-assignments";
import { AdminCustomers } from "./admin-customers";
import { AdminDashboard } from "./admin-dashboard";
import { AdminServices } from "./admin-services";
import { AdminActivity } from "./admin-activity";
import { AdminConversations } from "./admin-conversations";
import { AdminRoster } from "./admin-roster";
import { AdminTasks } from "./admin-tasks";
import { AdminLayout } from "./admin-layout";

export function AdminPanel() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard />;
      case "bookings":
        return <AdminBookings />;
      case "booking-assignments":
        return <AdminBookingAssignments />;
      case "customers":
        return <AdminCustomers />;
      case "services":
        return <AdminServices />;
      case "conversations":
        return <AdminConversations />;
      case "roster":
        return <AdminRoster />;
      case "tasks":
        return <AdminTasks />;
      case "activity":
        return <AdminActivity />;
      case "analytics":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold">Total Bookings</h3>
                <p className="text-3xl font-bold text-primary">1,234</p>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold">Active Services</h3>
                <p className="text-3xl font-bold text-primary">89</p>
                <p className="text-sm text-muted-foreground">+5% from last week</p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold">Customer Satisfaction</h3>
                <p className="text-3xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">Based on 567 reviews</p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold">Revenue</h3>
                <p className="text-3xl font-bold text-primary">$45,678</p>
                <p className="text-sm text-muted-foreground">+8% from last month</p>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
              <div className="h-64 bg-muted/20 rounded flex items-center justify-center">
                <p className="text-muted-foreground">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <select className="w-full p-2 border rounded">
                      <option>Booking Summary</option>
                      <option>Revenue Report</option>
                      <option>Customer Analysis</option>
                      <option>Service Performance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date Range</label>
                    <div className="flex gap-2">
                      <input type="date" className="flex-1 p-2 border rounded" />
                      <input type="date" className="flex-1 p-2 border rounded" />
                    </div>
                  </div>
                  <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
                    Generate Report
                  </button>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Weekly Booking Summary</span>
                    <button className="text-primary hover:underline">Download</button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Monthly Revenue Report</span>
                    <button className="text-primary hover:underline">Download</button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Customer Satisfaction Analysis</span>
                    <button className="text-primary hover:underline">Download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input type="text" defaultValue="Airport Concierge" className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                    <input type="email" defaultValue="admin@airport.com" className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Zone</label>
                    <select className="w-full p-2 border rounded">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-6 (Central Time)</option>
                      <option>UTC-7 (Mountain Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Booking Reminders</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">API Integrations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">WhatsApp API</h4>
                    <p className="text-sm text-muted-foreground">Connect your WhatsApp Business account</p>
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
                    Configure
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h4 className="font-medium">Email Service</h4>
                    <p className="text-sm text-muted-foreground">Configure SMTP settings</p>
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout>
      {renderPage()}
    </AdminLayout>
  );
}
