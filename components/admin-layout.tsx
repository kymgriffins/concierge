"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Bell,
  Calendar,
  FileText,
  Package,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  X,
  Zap,
  Target
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MockAPI, Agent, Booking, Customer } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { AutoBookingSidebar } from "@/components/auto-booking-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: Home },
  { name: "Bookings", id: "bookings", icon: Calendar },
  { name: "Booking Assignments", id: "booking-assignments", icon: Target },
    { name: "Conversations", id: "conversations", icon: FileText },
  { name: "Customers", id: "customers", icon: Users },
    { name: "Roster", id: "roster", icon: Calendar },
  { name: "Services", id: "services", icon: Package },
    { name: "Tasks", id: "tasks", icon: FileText },
  { name: "Activity", id: "activity", icon: Bell },
  { name: "Analytics", id: "analytics", icon: BarChart3 },
  { name: "Reports", id: "reports", icon: FileText },
  { name: "Settings", id: "settings", icon: Settings },
];

export function AdminLayout({ children, currentPage, onPageChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoBookingSidebarOpen, setAutoBookingSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ bookings: Booking[]; customers: Customer[] }>({ bookings: [], customers: [] });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentUser, setCurrentUser] = useState<Agent | null>(null);
  const toast = useToast();

  const doSearch = async () => {
    try {
      const [bookings, customers] = await Promise.all([
        MockAPI.searchBookings(query || ''),
        MockAPI.getCustomers(query || '')
      ]);
      setResults({ bookings, customers });
    } catch (err) {
      console.error('Search error', err);
      toast.showToast({ title: 'Search failed', description: String(err), type: 'error' } as any);
    }
  };

  useEffect(() => {
    const init = async () => {
      const a = await MockAPI.getAgents();
      setAgents(a);
      const u = await MockAPI.getCurrentUser();
      setCurrentUser(u);
    };
    init();
  }, []);

  const impersonate = async (agentId: string) => {
    try {
      const agent = (await MockAPI.getAgents()).find((x: Agent) => x.id === agentId);
      if (agent) {
        // login by email to reuse existing login flow
        await MockAPI.login(agent.email, 'pw');
        const u = await MockAPI.getCurrentUser();
        setCurrentUser(u);
        toast.showToast({ title: 'Switched user', description: `Now impersonating ${agent.name}`, type: 'info' } as any);
      }
    } catch (err) {
      console.error('Impersonation failed', err);
      toast.showToast({ title: 'Impersonate failed', description: String(err), type: 'error' } as any);
    }
  };

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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-xl font-bold">Airport Concierge</h1>
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

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Waithera</p>
                <p className="text-xs text-muted-foreground truncate">waithera@airport.com</p>
              </div>
            </div>
          </div>
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
              {/* Auto-Booking Sidebar Toggle */}
              <Button
                variant={autoBookingSidebarOpen ? "default" : "ghost"}
                size="sm"
                onClick={() => setAutoBookingSidebarOpen(!autoBookingSidebarOpen)}
                title="Toggle Auto-Booking"
              >
                <Zap className="h-4 w-4" />
              </Button>

              {/* Search */}
              <div>
                <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => setSearchOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
                {searchOpen && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] sm:w-96 z-50">
                    <Card>
                      <CardContent>
                        <div className="flex gap-2">
                          <Input placeholder="Search bookings or customers..." value={query} onChange={(e) => setQuery(e.target.value)} />
                          <Button onClick={doSearch}>Search</Button>
                          <Button variant="ghost" onClick={() => { setSearchOpen(false); setQuery(''); setResults({ bookings: [], customers: [] }); }}>Close</Button>
                        </div>
                        <div className="mt-3 space-y-2 max-h-64 overflow-auto">
                          {results.bookings.map(b => (
                            <div key={b.id} className="p-2 hover:bg-muted rounded">{b.passengerName} • {b.flightNumber}</div>
                          ))}
                          {results.customers.map(c => (
                            <div key={c.id} className="p-2 hover:bg-muted rounded">{c.name} • {c.company}</div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h4 className="font-medium">Notifications</h4>
                  </div>
                  <Separator />
                  <div className="p-2">
                    <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                      <p className="text-sm font-medium">New booking received</p>
                      <p className="text-xs text-muted-foreground">John Smith - UA 457</p>
                    </div>
                    <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                      <p className="text-sm font-medium">Flight delayed</p>
                      <p className="text-xs text-muted-foreground">DL 892 - 30 min delay</p>
                    </div>
                    <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                      <p className="text-sm font-medium">Service completed</p>
                      <p className="text-xs text-muted-foreground">Sarah Johnson - Lounge access</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{currentUser?.name ? currentUser.name.split(' ').map((n: string) => n[0]).slice(0,2).join('') : 'SM'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="p-3">
                    <div className="text-sm font-medium">{currentUser?.name || 'Not signed in'}</div>
                    <div className="text-xs text-muted-foreground">Role: {currentUser?.role || 'n/a'}</div>
                  </div>
                  <Separator />
                  <div className="p-2">
                    <div className="text-xs text-muted-foreground mb-2">Impersonate:</div>
                    <div className="max-h-40 overflow-auto">
                      {agents.map(a => (
                        <div key={a.id} className="py-1">
                          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => impersonate(a.id)}>{a.name} <span className="ml-2 text-xs text-muted-foreground">{a.role}</span></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex">
          <main className={`flex-1 p-4 sm:p-6 ${autoBookingSidebarOpen ? 'lg:mr-96' : ''}`}>
            {children}
          </main>

          {/* Auto-Booking Sidebar */}
          {autoBookingSidebarOpen && (
            <div className="fixed right-0 top-16 bottom-0 z-40">
              <AutoBookingSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
