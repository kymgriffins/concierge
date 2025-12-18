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
            <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Reports section coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
}
