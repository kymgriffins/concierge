"use client";

import { useState } from "react";
import { AdminBookings } from "./admin-bookings";
import { AdminDashboard } from "./admin-dashboard";
import { AdminServices } from "./admin-services";
import { AdminRoster } from "./admin-roster";
import { AdminReports } from "./admin-reports";
import { AdminLayout } from "./admin-layout";

export function AdminPanel() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard />;
      case "bookings":
        return <AdminBookings />;
      case "roster":
        return <AdminRoster />;
      case "services":
        return <AdminServices />;
      case "reports":
        return <AdminReports />;
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
