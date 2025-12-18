"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import TimePicker from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MockAPI, Booking, RosterShift, Agent } from "@/lib/mock-api";
import { useToast } from "@/components/ui/toast";
import { formatDateUTC, formatRelativeTime } from "@/lib/utils";
import DataTable, { Column } from "@/components/ui/data-table/data-table";
import { Tooltip } from "@/components/ui/tooltip";
import { List, Plus, Clock, CheckCircle, Eye, Phone, Mail, Plane, Calendar, Building, User, ChevronRight, Filter, Search as SearchIcon } from "lucide-react";
import { useResponsiveBreakpoints } from "@/lib/hooks";

// Mobile-specific bookings component
function MobileBookingsView({
  bookings,
  filteredBookings,
  onBookingClick,
  onStatusChange,
  serviceOptions,
  agents,
  getStatusColor,
  formatDateUTC,
  formatRelativeTime,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  showDateFilters,
  setShowDateFilters,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  serviceFilter,
  setServiceFilter,
  airlineFilter,
  setAirlineFilter,
  terminalFilter,
  setTerminalFilter,
  sourceFilter,
  setSourceFilter,
  airlineOptions,
  terminalOptions,
  sourceOptions,
}: {
  bookings: Booking[];
  filteredBookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onStatusChange: (id: string, status: Booking["status"]) => Promise<void>;
  serviceOptions: any[];
  agents: Agent[];
  getStatusColor: (status: Booking["status"]) => "default" | "secondary" | "outline" | "destructive";
  formatDateUTC: (date: string) => string;
  formatRelativeTime: (date: string, status: Booking["status"]) => { text: string; color: string };
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  showDateFilters: boolean;
  setShowDateFilters: (show: boolean) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
  serviceFilter: string;
  setServiceFilter: (filter: string) => void;
  airlineFilter: string;
  setAirlineFilter: (filter: string) => void;
  terminalFilter: string;
  setTerminalFilter: (filter: string) => void;
  sourceFilter: string;
  setSourceFilter: (filter: string) => void;
  airlineOptions: string[];
  terminalOptions: string[];
  sourceOptions: string[];
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const statusOptions = [
    { status: "all", label: "All", count: bookings.length, icon: List, color: "default" as const },
    { status: "new", label: "New", count: bookings.filter((b) => b.status === "new").length, icon: Plus, color: "secondary" as const },
    { status: "contacted", label: "Contacted", count: bookings.filter((b) => b.status === "contacted").length, icon: Plus, color: "secondary" as const },
    { status: "confirmed", label: "Confirmed", count: bookings.filter((b) => b.status === "confirmed").length, icon: Plus, color: "secondary" as const },
    { status: "in_progress", label: "In Progress", count: bookings.filter((b) => b.status === "in_progress").length, icon: Clock, color: "destructive" as const },
    { status: "pending_review", label: "Pending Review", count: bookings.filter((b) => b.status === "pending_review").length, icon: Clock, color: "secondary" as const },
    { status: "completed", label: "Completed", count: bookings.filter((b) => b.status === "completed").length, icon: CheckCircle, color: "default" as const },
  ];

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const { text, color } = formatRelativeTime(booking.date, booking.status);
    const service = serviceOptions.find((s) => s.id === booking.serviceId);

    // Status-based styling
    const getStatusBorderColor = (status: Booking["status"]) => {
      switch (status) {
        case "new": return "border-l-blue-500";
        case "contacted": return "border-l-yellow-500";
        case "confirmed": return "border-l-green-500";
        case "in_progress": return "border-l-orange-500";
        case "pending_review": return "border-l-purple-500";
        case "completed": return "border-l-gray-500";
        case "cancelled": return "border-l-red-500";
        default: return "border-l-gray-300";
      }
    };

    const getStatusIcon = (status: Booking["status"]) => {
      switch (status) {
        case "new": return "🆕";
        case "contacted": return "📞";
        case "confirmed": return "✅";
        case "in_progress": return "⏳";
        case "pending_review": return "👀";
        case "completed": return "🎉";
        case "cancelled": return "❌";
        default: return "📋";
      }
    };

    return (
      <Card className={`mb-3 touch-manipulation active:scale-[0.98] transition-all duration-200 border-l-4 ${getStatusBorderColor(booking.status)} shadow-sm hover:shadow-md`}>
        <CardContent className="p-4">
          {/* Compact Header with Status Indicator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-lg">{getStatusIcon(booking.status)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-foreground truncate">
                  {booking.passengerName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusColor(booking.status)} className="text-xs px-2 py-0.5">
                    {booking.status.replace("_", " ")}
                  </Badge>
                  <span className={`text-xs font-medium ${color}`}>
                    {text}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>

          {/* Flight Info - Compact Design */}
          <div className="flex items-center gap-3 mb-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/10">
            <div className="flex-shrink-0">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-primary">
                {booking.flightNumber}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {booking.airline} • Terminal {booking.terminal || "N/A"}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-medium text-foreground">
                {booking.time}
              </div>
            </div>
          </div>

          {/* Contact & Service - Horizontal Layout */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span className="text-xs truncate max-w-[80px]">{booking.phone}</span>
              </div>
              {booking.company && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Building className="h-3.5 w-3.5" />
                  <span className="text-xs truncate max-w-[80px]">{booking.company}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-background/50">
                {service?.icon} {service?.name || booking.serviceId}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookingClick(booking);
                }}
                className="touch-manipulation min-h-[36px] min-w-[36px] p-0 hover:bg-primary/10"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Bookings</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="touch-manipulation min-h-[44px] min-w-[44px]"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search passengers, flights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 touch-manipulation min-h-[44px] w-full"
            />
          </div>

        {/* Mobile Status Filter Dropdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Filter by Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 touch-manipulation min-h-[44px] bg-background">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(({ status, label, count, icon: Icon }) => (
                  <SelectItem key={status} value={status} className="touch-manipulation">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full ml-auto">
                        {count}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b bg-muted/20">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="touch-manipulation min-h-[44px] min-w-[44px]"
                >
                  ✕
                </Button>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <div className="flex gap-2">
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="From"
                    className="flex-1 touch-manipulation min-h-[44px]"
                  />
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="To"
                    className="flex-1 touch-manipulation min-h-[44px]"
                  />
                </div>
              </div>

              {/* Service Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="touch-manipulation min-h-[44px] w-full">
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {serviceOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Airline Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Airline</label>
                <Select value={airlineFilter} onValueChange={setAirlineFilter}>
                  <SelectTrigger className="touch-manipulation min-h-[44px] w-full">
                    <SelectValue placeholder="All Airlines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Airlines</SelectItem>
                    {airlineOptions.map((airline) => (
                      <SelectItem key={airline} value={airline}>
                        {airline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Terminal Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Terminal</label>
                <Select value={terminalFilter} onValueChange={setTerminalFilter}>
                  <SelectTrigger className="touch-manipulation min-h-[44px] w-full">
                    <SelectValue placeholder="All Terminals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Terminals</SelectItem>
                    {terminalOptions.map((terminal) => (
                      <SelectItem key={terminal} value={terminal}>
                        {terminal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(serviceFilter !== "all" || airlineFilter !== "all" || terminalFilter !== "all" || startDate || endDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setServiceFilter("all");
                    setAirlineFilter("all");
                    setTerminalFilter("all");
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  className="w-full touch-manipulation min-h-[44px]"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="flex-1">
        <div className="max-w-md mx-auto px-4 py-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">No bookings found</div>
              <div className="text-sm text-muted-foreground">
                Try adjusting your filters or search terms
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => onBookingClick(booking)}
                  className="cursor-pointer"
                >
                  <BookingCard booking={booking} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminBookings() {
  const { isMobile } = useResponsiveBreakpoints();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<"date" | "passenger" | "flight">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [serviceOptions, setServiceOptions] = useState<
    {
      id: string;
      name: string;
      description: string;
      icon: string;
      price?: number;
      active: boolean;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [terminalFilter, setTerminalFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [airlineOptions, setAirlineOptions] = useState<string[]>([]);
  const [terminalOptions, setTerminalOptions] = useState<string[]>([]);
  const [sourceOptions, setSourceOptions] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState<Partial<Booking>>({});
  const toast = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState<{
    canCreateBooking?: boolean;
    canDeleteBooking?: boolean;
    canUpdateBooking?: boolean;
  } | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    loadBookings();
    loadServiceOptions();
    loadAgents();
    (async () => setPermissions(await MockAPI.getPermissions()))();
  }, []);

  useEffect(() => {
    const airlines = [
      ...new Set(bookings.map((b) => b.airline).filter(Boolean) as string[]),
    ].sort();
    setAirlineOptions(airlines);
    const terminals = [
      ...new Set(bookings.map((b) => b.terminal).filter(Boolean) as string[]),
    ].sort();
    setTerminalOptions(terminals);
    const sources = [
      ...new Set(bookings.map((b) => b.source).filter(Boolean) as string[]),
    ].sort();
    setSourceOptions(sources);
  }, [bookings]);

  const loadServiceOptions = async () => {
    try {
      const opts = await MockAPI.getServiceOptions();
      setServiceOptions(
        opts.map((o) => ({
          id: o.id,
          name: o.name,
          description: o.description,
          icon: o.icon,
          price: o.price,
          active: o.active,
        })),
      );
    } catch (error) {
      console.error("Error loading service options:", error);
    }
  };

  const loadAgents = async () => {
    try {
      const agentsData = await MockAPI.getAgents();
      setAgents(agentsData);
    } catch (error) {
      console.error("Error loading agents:", error);
    }
  };

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  useEffect(() => {
    filterBookings();
  }, [startDate, endDate]);

  useEffect(() => {
    filterBookings();
  }, [sortBy, sortDir]);

  useEffect(() => {
    setPage(1); // reset page when filters change
  }, [
    searchTerm,
    statusFilter,
    startDate,
    endDate,
    serviceFilter,
    airlineFilter,
    terminalFilter,
    sourceFilter,
    perPage,
  ]);

  const loadBookings = async () => {
    try {
      const data = await MockAPI.getBookings("all", 1000); // Load all bookings (up to 1000)
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.passengerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.flightNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (booking.company && booking.company.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter((b) => b.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((b) => b.date <= endDate);
    }

    // Service filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.serviceId === serviceFilter,
      );
    }

    // Airline filter
    if (airlineFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.airline === airlineFilter,
      );
    }

    // Terminal filter
    if (terminalFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.terminal === terminalFilter,
      );
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((booking) => booking.source === sourceFilter);
    }

    // sort
    filtered = filtered.sort((a, b) => {
      let v = 0;
      if (sortBy === "date")
        v = (a.date + " " + a.time).localeCompare(b.date + " " + b.time);
      if (sortBy === "passenger")
        v = a.passengerName.localeCompare(b.passengerName);
      if (sortBy === "flight") v = a.flightNumber.localeCompare(b.flightNumber);
      return sortDir === "asc" ? v : -v;
    });

    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (
    bookingId: string,
    newStatus: Booking["status"],
  ) => {
    try {
      await MockAPI.updateBooking(bookingId, { status: newStatus });
      await MockAPI.createActivityLog({
        bookingId,
        action: "Status changed",
        user: "Staff",
        details: `Status changed to ${newStatus}`,
      });
      await loadBookings(); // Reload to get updated data
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const getStatusColor = (status: Booking["status"]): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case "new":
        return "default";
      case "contacted":
        return "secondary";
      case "confirmed":
        return "outline";
      case "in_progress":
        return "destructive";
      case "completed":
        return "outline";
      case "pending_review":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const resetForm = () => setForm({});

  const handleOpenCreate = () => {
    if (permissions && !permissions.canCreateBooking) {
      toast.showToast({
        title: "Permission denied",
        description: "You are not allowed to create bookings",
        type: "error",
      });
      return;
    }

    resetForm();
    setShowCreate(true);
    setEditing(false);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      // Required fields for createBooking signature
      const payload: any = {
        passengerName: form.passengerName || "",
        company: form.company || "",
        phone: form.phone || "",
        email: form.email || "",
        flightNumber: form.flightNumber || "",
        airline: form.airline || "",
        date: form.date || new Date().toISOString().split("T")[0],
        time: form.time || "00:00",
        terminal: form.terminal || "",
        passengerCount: form.passengerCount || 1,
        serviceId: form.serviceId || "",
        specialRequests: form.specialRequests || "",
        status: (form.status as Booking["status"]) || "new",
        source: (form.source as Booking["source"]) || "manual",
      };

      await MockAPI.createBooking(payload);
      await MockAPI.createActivityLog({
        bookingId: (bookings.length + 1).toString(),
        action: "Booking Created",
        user: "Staff",
        details: `Booking created for ${payload.passengerName}`,
      });
      await loadBookings();
      setShowCreate(false);
      resetForm();
      toast.showToast({
        title: "Booking created",
        description: `${payload.passengerName} created`,
        type: "success",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.showToast({
        title: "Create failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (booking: Booking) => {
    setForm({ ...booking });
    setSelectedBooking(booking);
    setEditing(true);
    setShowCreate(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setCreating(true);
    try {
      await MockAPI.updateBooking(selectedBooking.id, form as Partial<Booking>);
      await MockAPI.createActivityLog({
        bookingId: selectedBooking.id,
        action: "Booking Updated",
        user: "Staff",
        details: `Booking updated for ${form.passengerName || selectedBooking.passengerName}`,
      });
      await loadBookings();
      setShowCreate(false);
      setEditing(false);
      setSelectedBooking(null);
      resetForm();
      toast.showToast({
        title: "Booking updated",
        description: `${form.passengerName || selectedBooking.passengerName} updated`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.showToast({
        title: "Update failed",
        description: String(error),
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await MockAPI.deleteBooking(id);
      await MockAPI.createActivityLog({
        bookingId: id,
        action: "Booking Deleted",
        user: "Staff",
        details: `Booking ${id} deleted`,
      });
      await loadBookings();
      toast.showToast({
        title: "Booking deleted",
        description: `Booking ${id} removed`,
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.showToast({
        title: "Delete failed",
        description: String(error),
        type: "error",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return formatDateUTC(dateString);
  };

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / perPage));
  const paginated = filteredBookings.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  // Custom DataTable with filters
  const BookingsDataTable = () => {
    const [tableFilters, setTableFilters] = useState<{ [key: string]: string }>(
      {},
    );
    const [showDateFilters, setShowDateFilters] = useState(false);

    const columns: Column<Booking>[] = [
      {
        key: "passenger",
        header: "Passenger",
        accessor: (r) => r.passengerName,
        cell: (r) => (
          <div>
            <div className="font-medium">{r.passengerName}</div>
            <div className="text-sm text-muted-foreground">
              {r.phone} • {r.email}
            </div>
          </div>
        ),
        sortable: true,
        filterable: true,
        meta: {
          mobileCard: {
            label: "Passenger",
            value: (r) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">{r.passengerName}</div>
                  <Badge variant={getStatusColor(r.status)} className="text-xs">
                    {r.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {r.flightNumber} • {r.airline} • {r.terminal || "N/A"}
                </div>
                <div className="text-sm">
                  {formatDateUTC(r.date)} at {r.time}
                </div>
                <div className="text-sm text-muted-foreground">
                  {r.phone} • {r.email}
                </div>
                {r.company && (
                  <div className="text-sm text-muted-foreground">
                    Company: {r.company}
                  </div>
                )}
                <div className="text-sm">
                  <Badge variant="outline" className="text-xs">
                    {serviceOptions.find((s) => s.id === r.serviceId)?.name ||
                      r.serviceId}
                  </Badge>
                </div>
              </div>
            ),
          },
        },
      },
      {
        key: "flight",
        header: "Flight",
        accessor: (r) => r.flightNumber,
        cell: (r) => (
          <div>
            {r.flightNumber}
            <div className="text-sm text-muted-foreground">
              {r.airline} • {r.time}
            </div>
          </div>
        ),
        sortable: true,
        filterable: true,
      },
      {
        key: "date",
        header: "Booking Date & Time",
        accessor: (r) => `${r.date} ${r.time}`,
        cell: (r) => {
          const { text, color } = formatRelativeTime(r.date, r.status);
          return (
            <div>
              <div className={color}>{text}</div>
              <div className="text-sm text-muted-foreground">{r.time}</div>
            </div>
          );
        },
        sortable: true,
        meta: {
          hideOnMobile: false,
          hideOnTablet: false,
        },
      },

      {
        key: "service",
        header: "Service",
        cell: (r) => (
          <Badge variant="outline" className="text-xs">
            {serviceOptions.find((s) => s.id === r.serviceId)?.name ||
              r.serviceId}
          </Badge>
        ),
        meta: {
          hideOnMobile: false,
          hideOnTablet: false,
        },
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge variant={getStatusColor(r.status)}>
            {r.status.replace("_", " ")}
          </Badge>
        ),
        sortable: true,
        filterable: true,
      },
      {
        key: "source",
        header: "Source",
        accessor: (r) => r.source,
        meta: {
          hideOnMobile: true,
          hideOnTablet: true,
        },
      },
      {
        key: "createdDate",
        header: "Created Date",
        accessor: (r) => r.createdAt,
        cell: (r) => (
          <div className="text-sm">
            {r.createdAt ? (
              <div>
                <div>{new Date(r.createdAt).toLocaleDateString()}</div>
                <div className="text-muted-foreground">
                  {new Date(r.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ) : (
              "—"
            )}
          </div>
        ),
        sortable: true,
        meta: {
          hideOnMobile: true,
          hideOnTablet: false,
        },
      },
      {
        key: "createdBy",
        header: "Created By",
        cell: (r) => {
          const agent = agents.find((a) => a.id === r.createdBy);
          return (
            <div className="text-sm">
              {agent ? agent.name : r.createdBy || "Unknown"}
            </div>
          );
        },
        meta: {
          hideOnMobile: true,
          hideOnTablet: true,
        },
      },
      {
        key: "supervisedBy",
        header: "Supervised By",
        cell: (r) => {
          const agent = agents.find((a) => a.id === r.supervisedBy);
          return (
            <div className="text-sm">
              {agent ? agent.name : r.supervisedBy || "—"}
            </div>
          );
        },
        meta: {
          hideOnMobile: true,
          hideOnTablet: true,
        },
      },
      {
        key: "createdAt",
        header: "Created",
        cell: (r) => (
          <div className="text-sm text-muted-foreground">
            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
          </div>
        ),
        meta: {
          hideOnMobile: true,
          hideOnTablet: true,
        },
      },
      {
        key: "updatedAt",
        header: "Updated",
        cell: (r) => (
          <div className="text-sm text-muted-foreground">
            {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : "—"}
          </div>
        ),
        meta: {
          hideOnMobile: true,
          hideOnTablet: true,
        },
      },
      {
        key: "actions",
        header: "",
        cell: (r) => (
          <div className="flex gap-2">
            <Tooltip
              content={`${r.passengerName} - ${r.flightNumber} ${r.airline} - ${formatDateUTC(r.date)} ${r.time} - ${r.company || "N/A"} - Status: ${r.status.replace("_", " ")}`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBooking(r)}
                className="touch-manipulation min-h-[44px] min-w-[44px]"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        ),
      },
    ];

    return (
      <div className="space-y-4">
        {/* Toggle button for date filters */}
        <div className="flex items-center gap-2">
          <button
            className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-0 sm:border transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              showDateFilters
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background hover:bg-muted/50 sm:border-border text-foreground"
            }`}
            onClick={() => setShowDateFilters(!showDateFilters)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                {showDateFilters ? "Hide Date Filters" : "Filter by Date"}
              </span>
            </div>
          </button>
          {(startDate || endDate) && showDateFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            >
              Clear dates
            </Button>
          )}
        </div>

        {/* Date range filters (shown when toggle is active) */}
        {showDateFilters && (
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Date Range:</label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="From"
                className="w-32"
              />
              <span className="text-muted-foreground">-</span>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="To"
                className="w-32"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {serviceOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={airlineFilter} onValueChange={setAirlineFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Airline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Airlines</SelectItem>
                  {airlineOptions.map((airline) => (
                    <SelectItem key={airline} value={airline}>
                      {airline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={terminalFilter} onValueChange={setTerminalFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Terminal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terminals</SelectItem>
                  {terminalOptions.map((terminal) => (
                    <SelectItem key={terminal} value={terminal}>
                      {terminal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sourceOptions.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(serviceFilter !== "all" ||
              airlineFilter !== "all" ||
              terminalFilter !== "all" ||
              sourceFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setServiceFilter("all");
                  setAirlineFilter("all");
                  setTerminalFilter("all");
                  setSourceFilter("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredBookings}
          defaultPageSize={perPage}
          pageSizeOptions={[10, 25, 50, 100]}
          onRowClick={(r) => router.push(`/admin/bookings/${r.id}`)}
          searchable={true}
          exportable={true}
          emptyMessage="No bookings found matching your criteria"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Use mobile component for smartphones
  if (isMobile) {
    return (
      <MobileBookingsView
        bookings={bookings}
        filteredBookings={filteredBookings}
        onBookingClick={(booking) => router.push(`/admin/bookings/${booking.id}`)}
        onStatusChange={handleStatusChange}
        serviceOptions={serviceOptions}
        agents={agents}
        getStatusColor={getStatusColor}
        formatDateUTC={formatDateUTC}
        formatRelativeTime={formatRelativeTime}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showDateFilters={false}
        setShowDateFilters={() => {}}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        airlineFilter={airlineFilter}
        setAirlineFilter={setAirlineFilter}
        terminalFilter={terminalFilter}
        setTerminalFilter={setTerminalFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        airlineOptions={airlineOptions}
        terminalOptions={terminalOptions}
        sourceOptions={sourceOptions}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Bookings Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage all airport concierge bookings
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-initial touch-manipulation"
          >
            <span className="mr-2">+</span>
            New Booking
          </Button>
        </div>
      </div>

      {/* Dynamic Status Tabs */}
      <div className="w-full">
        <div className="flex overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {[
              {
                status: "all",
                label: "All",
                count: bookings.length,
                icon: List,
                color: "default",
              },
              {
                status: "new",
                label: "New",
                count: bookings.filter((b) => b.status === "new").length,
                icon: Plus,
                color: "secondary",
              },
              {
                status: "contacted",
                label: "Contacted",
                count: bookings.filter((b) => b.status === "contacted").length,
                icon: Plus,
                color: "secondary",
              },
              {
                status: "confirmed",
                label: "Confirmed",
                count: bookings.filter((b) => b.status === "confirmed").length,
                icon: Plus,
                color: "secondary",
              },
              {
                status: "in_progress",
                label: "In Progress",
                count: bookings.filter((b) => b.status === "in_progress")
                  .length,
                icon: Clock,
                color: "destructive",
              },
              {
                status: "pending_review",
                label: "Pending Review",
                count: bookings.filter((b) => b.status === "pending_review")
                  .length,
                icon: Clock,
                color: "secondary",
              },
              {
                status: "completed",
                label: "Completed",
                count: bookings.filter((b) => b.status === "completed").length,
                icon: CheckCircle,
                color: "default",
              },
            ].map(({ status, label, count, icon: Icon, color }) => (
              <button
                key={status}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-0 sm:border transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background hover:bg-muted/50 sm:border-border text-foreground"
                }`}
                onClick={() => setStatusFilter(status)}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 ${statusFilter === status ? "text-primary-foreground" : "text-primary"}`}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {label}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      statusFilter === status
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {/* Create / Edit form (full-screen modal) */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editing ? "Edit Booking" : "Create Booking"}
                    </h2>
                    <p className="text-muted-foreground">
                      {editing
                        ? "Update booking details"
                        : "Add a new booking to the system"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreate(false);
                      setEditing(false);
                      setSelectedBooking(null);
                      resetForm();
                    }}
                  >
                    ✕
                  </Button>
                </div>

                <form
                  onSubmit={editing ? handleSubmitEdit : handleSubmitCreate}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Passenger name"
                      value={form.passengerName || ""}
                      onChange={(e) =>
                        setForm({ ...form, passengerName: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={form.company || ""}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Phone"
                      value={form.phone || ""}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Email"
                      value={form.email || ""}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Flight number"
                      value={form.flightNumber || ""}
                      onChange={(e) =>
                        setForm({ ...form, flightNumber: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Airline"
                      value={form.airline || ""}
                      onChange={(e) =>
                        setForm({ ...form, airline: e.target.value })
                      }
                    />
                    <DatePicker
                      value={form.date || null}
                      onChange={(d) => setForm({ ...form, date: d || "" })}
                      placeholder="Select date"
                    />
                    <TimePicker
                      value={form.time || null}
                      onChange={(t) => setForm({ ...form, time: t || "" })}
                      placeholder="Select time"
                    />
                    <Input
                      placeholder="Terminal"
                      value={form.terminal || ""}
                      onChange={(e) =>
                        setForm({ ...form, terminal: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      min={1}
                      placeholder="Passengers"
                      value={form.passengerCount?.toString() || "1"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          passengerCount: Number(e.target.value),
                        })
                      }
                    />
                    <Select
                      value={form.status || "new"}
                      onValueChange={(val: string) =>
                        setForm({ ...form, status: val as Booking["status"] })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Service
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {serviceOptions
                        .filter((opt) => opt.active)
                        .map((opt) => (
                          <label
                            key={opt.id}
                            className="flex items-center gap-3 p-3 border-0 sm:border rounded-lg hover:bg-muted/50 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="service"
                              value={opt.id}
                              checked={form.serviceId === opt.id}
                              onChange={(e) =>
                                setForm({ ...form, serviceId: e.target.value })
                              }
                              className="text-primary"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{opt.icon}</span>
                                <span className="text-sm font-medium">
                                  {opt.name}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {opt.description}
                              </p>
                              <p className="text-xs font-semibold text-primary mt-1">
                                ${opt.price}
                              </p>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Special Requests
                    </label>
                    <Input
                      placeholder="Special requests"
                      value={form.specialRequests || ""}
                      onChange={(e) =>
                        setForm({ ...form, specialRequests: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={creating} size="lg">
                      {creating
                        ? "Saving..."
                        : editing
                          ? "Update booking"
                          : "Create booking"}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setShowCreate(false);
                        setEditing(false);
                        setSelectedBooking(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Per page:</label>
              <Select
                value={perPage.toString()}
                onValueChange={(v: string) => setPerPage(Number(v))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <div className="ml-4 flex items-center gap-2">
                <label className="text-sm">Sort:</label>
                <Select
                  value={sortBy}
                  onValueChange={(v: string) =>
                    setSortBy(v as "date" | "passenger" | "flight")
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="passenger">Passenger</SelectItem>
                    <SelectItem value="flight">Flight</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setSortDir((dir) => (dir === "asc" ? "desc" : "asc"))
                  }
                >
                  {sortDir === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                }}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              >
                Next
              </Button>
            </div>
          </div>

          <BookingsDataTable />
        </CardContent>
      </Card>

      {/* Pagination placeholder */}
      {filteredBookings.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page 1 of {Math.ceil(filteredBookings.length / 10)}
            </span>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
