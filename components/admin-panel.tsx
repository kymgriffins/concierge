"use client";

import { useState } from "react";
import { AdminBookings } from "./admin-bookings";
import { AdminCustomers } from "./admin-customers";
import { AdminDashboard } from "./admin-dashboard";
import { AdminLayout } from "./admin-layout";

export function AdminPanel() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard />;
      case "bookings":
        return <AdminBookings />;
      case "customers":
        return <AdminCustomers />;
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
