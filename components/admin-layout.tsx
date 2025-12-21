"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Package,
  Home,
  Menu,
  X
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: Home },
  { name: "Bookings", id: "bookings", icon: Calendar },
  { name: "Roster", id: "roster", icon: Calendar },
  { name: "Services", id: "services", icon: Package },
  { name: "Reports", id: "reports", icon: FileText },
];

export function AdminLayout({ children, currentPage, onPageChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">✈️</div>
              <h1 className="text-xl font-bold">Willis Concierge</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onPageChange(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>

              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold capitalize">{currentPage}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
