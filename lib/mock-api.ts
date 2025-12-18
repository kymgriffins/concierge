// Mock API for Airport Concierge App
// Simulates backend data and operations

export interface Booking {
  id: string;
  passengerName: string;
  company?: string;
  phone: string;
  email: string;
  flightNumber: string;
  airline: string;
  date: string;
  time: string;
  terminal?: string;
  passengerCount: number;
  serviceId: string; // Single service per booking
  specialRequests: string;
  status:
    | "new"
    | "contacted"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "pending_review"
    | "cancelled";
  source: "manual" | "whatsapp" | "email";
  createdAt: string;
  updatedAt: string;
  notes: string[];
  // Booking 2.0 fields - assignment to shifts and specific agents
  shiftId?: string; // Reference to RosterShift.id
  assignedAgentId?: string; // Reference to Agent.id
  // Enhanced admin data fields
  priority: "low" | "normal" | "high" | "vip";
  customerType: "individual" | "corporate" | "vip" | "frequent_flyer";
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  serviceFee: number;
  additionalCharges?: number;
  totalRevenue: number;
  customerSatisfaction?: number; // 1-5 rating
  processingTime?: number; // minutes from creation to completion
  equipmentNeeded?: string[]; // wheelchair, stroller, etc.
  specialHandling?: string[]; // vip, medical, diplomatic, etc.
  createdBy?: string; // agent ID who created
  lastModifiedBy?: string; // agent ID who last modified
  supervisedBy?: string; // supervisor agent ID who reviewed/approved
  modificationHistory?: Array<{
    timestamp: string;
    agentId: string;
    action: string;
    details: string;
  }>;
  tags?: string[]; // custom tags for filtering
  internalNotes?: string; // admin-only notes
  followUpRequired?: boolean;
  followUpDate?: string;
  referralSource?: string;
  loyaltyProgram?: string;
  frequentFlyerNumber?: string;
}

export interface ActivityLog {
  id: string;
  bookingId: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
}

export interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  satisfactionRate: number;
  todayBookings: number;
  pendingSync: number;
  lastSyncTime: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  price?: number;
  availableDate?: string; // ISO date string (YYYY-MM-DD)
  availableTime?: string; // HH:MM format
  active: boolean; // Whether the service is active/available
}

// Mock Data - Import JSON file directly (works in Next.js)
import mockdbData from "../data/mockdb.json";
let mockBookings: Booking[] = (mockdbData.bookings || []) as unknown as Booking[];

// Fallback hardcoded bookings if JSON loading fails
if (mockBookings.length === 0) {
  mockBookings = [
    {
      id: "1",
      passengerName: "John Smith",
      company: "TechCorp Inc.",
      phone: "+1-555-0123",
      email: "john.smith@techcorp.com",
      flightNumber: "UA 457",
      airline: "United Airlines",
      date: "2025-01-15",
      time: "14:30",
      terminal: "T1",
      passengerCount: 2,
      serviceId: "arrival",
      specialRequests: "VIP passenger, prefers quiet lounge",
      status: "confirmed",
      source: "whatsapp",
      createdAt: "2025-01-10T10:00:00Z",
      updatedAt: "2025-01-14T16:30:00Z",
      notes: ["Confirmed VIP status", "Met at Gate B12 at 14:25"],
      priority: "vip",
      customerType: "corporate",
      estimatedDuration: 45,
      actualDuration: 42,
      serviceFee: 150,
      additionalCharges: 25,
      totalRevenue: 175,
      customerSatisfaction: 5,
      processingTime: 2880,
      equipmentNeeded: ["wheelchair"],
      specialHandling: ["vip"],
      createdBy: "a4",
      lastModifiedBy: "a1",
      tags: ["vip", "corporate"],
      internalNotes: "High-value client, ensure premium service",
      followUpRequired: false,
      loyaltyProgram: "Executive Club",
      frequentFlyerNumber: "EC123456",
    },
    {
      id: "2",
      passengerName: "Sarah Johnson",
      company: "Global Solutions",
      phone: "+1-555-0456",
      email: "sarah.j@globalsolutions.com",
      flightNumber: "DL 892",
      airline: "Delta Airlines",
      date: "2025-01-15",
      time: "16:15",
      terminal: "T2",
      passengerCount: 1,
      serviceId: "departure",
      specialRequests: "Business class, needs assistance with 2 suitcases",
      status: "confirmed",
      source: "email",
      createdAt: "2025-01-12T08:15:00Z",
      updatedAt: "2025-01-14T14:20:00Z",
      notes: ["Porter assigned - 2 large suitcases", "Lounge access granted"],
      priority: "high",
      customerType: "corporate",
      estimatedDuration: 60,
      actualDuration: 58,
      serviceFee: 175,
      additionalCharges: 50,
      totalRevenue: 225,
      customerSatisfaction: 4,
      processingTime: 1800,
      equipmentNeeded: ["porter"],
      specialHandling: ["business"],
      createdBy: "a4",
      lastModifiedBy: "a2",
      tags: ["business", "porter"],
      internalNotes: "Frequent business traveler",
      followUpRequired: true,
      followUpDate: "2025-01-16",
      loyaltyProgram: "SkyMiles",
      frequentFlyerNumber: "SM789012",
    },
    {
      id: "3",
      passengerName: "Michael Chen",
      company: "Private Client",
      phone: "+1-555-0789",
      email: "mchen@email.com",
      flightNumber: "AA 234",
      airline: "American Airlines",
      date: "2025-01-15",
      time: "18:45",
      terminal: "T3",
      passengerCount: 3,
      serviceId: "arrival",
      specialRequests: "Family with children, need stroller assistance",
      status: "new",
      source: "manual",
      createdAt: "2025-01-14T20:00:00Z",
      updatedAt: "2025-01-14T20:00:00Z",
      notes: [],
      priority: "normal",
      customerType: "individual",
      estimatedDuration: 30,
      serviceFee: 150,
      additionalCharges: 0,
      totalRevenue: 150,
      equipmentNeeded: ["stroller"],
      specialHandling: ["family"],
      createdBy: "a4",
      tags: ["family", "children"],
      internalNotes: "New client, monitor satisfaction",
      followUpRequired: true,
      followUpDate: "2025-01-16",
    },
    {
      id: "4",
      passengerName: "Emma Rodriguez",
      company: "TechStart Ltd",
      phone: "+1-555-0321",
      email: "emma@techstart.com",
      flightNumber: "SW 567",
      airline: "Southwest Airlines",
      date: "2025-01-16",
      time: "09:20",
      terminal: "T4",
      passengerCount: 1,
      serviceId: "departure",
      specialRequests: "Early morning flight, coffee preferred",
      status: "contacted",
      source: "whatsapp",
      createdAt: "2025-01-13T11:30:00Z",
      updatedAt: "2025-01-15T07:45:00Z",
      notes: ["Confirmed coffee preference", "Fast track arranged"],
      priority: "normal",
      customerType: "corporate",
      estimatedDuration: 45,
      serviceFee: 175,
      additionalCharges: 15,
      totalRevenue: 190,
      equipmentNeeded: [],
      specialHandling: [],
      createdBy: "a4",
      lastModifiedBy: "a1",
      tags: ["early-morning", "coffee"],
      internalNotes: "Requested coffee service",
      followUpRequired: false,
    },
    {
      id: "5",
      passengerName: "David Wilson",
      company: "Enterprise Corp",
      phone: "+1-555-0654",
      email: "dwilson@enterprise.com",
      flightNumber: "UA 789",
      airline: "United Airlines",
      date: "2025-01-16",
      time: "12:10",
      terminal: "T1",
      passengerCount: 4,
      serviceId: "transit",
      specialRequests: "Group booking, separate lounge reservations needed",
      status: "in_progress",
      source: "email",
      createdAt: "2025-01-11T14:20:00Z",
      updatedAt: "2025-01-15T10:15:00Z",
      notes: [
        "Group of 4 confirmed",
        "Separate lounge access arranged",
        "Porter meeting at baggage claim",
      ],
      priority: "high",
      customerType: "corporate",
      estimatedDuration: 90,
      actualDuration: 85,
      serviceFee: 200,
      additionalCharges: 75,
      totalRevenue: 275,
      customerSatisfaction: 5,
      processingTime: 2340,
      equipmentNeeded: ["porter"],
      specialHandling: ["group"],
      createdBy: "a4",
      lastModifiedBy: "a3",
      tags: ["group", "corporate", "lounge"],
      internalNotes: "Large corporate group, ensure coordination",
      followUpRequired: true,
      followUpDate: "2025-01-17",
      loyaltyProgram: "Mileage Plus",
      frequentFlyerNumber: "MP345678",
    },
  ];
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    bookingId: "1",
    action: "Booking Confirmed",
    timestamp: "2025-01-14T16:30:00Z",
    user: "Staff Member A",
    details: "VIP booking confirmed for John Smith",
  },
  {
    id: "2",
    bookingId: "1",
    action: "Passenger Met",
    timestamp: "2025-01-15T14:25:00Z",
    user: "Staff Member B",
    details: "Met passenger at Gate B12, proceeding to lounge",
  },
  {
    id: "3",
    bookingId: "2",
    action: "Lounge Access Granted",
    timestamp: "2025-01-15T15:45:00Z",
    user: "Staff Member C",
    details: "Sarah Johnson granted access to premium lounge",
  },
  {
    id: "4",
    bookingId: "4",
    action: "Fast Track Arranged",
    timestamp: "2025-01-15T08:30:00Z",
    user: "Staff Member A",
    details: "Early morning fast track security arranged",
  },
  {
    id: "5",
    bookingId: "5",
    action: "Group Booking Updated",
    timestamp: "2025-01-15T11:00:00Z",
    user: "Staff Member B",
    details: "Updated group booking with separate lounge access",
  },
];

const mockServiceOptions: ServiceOption[] = [
  {
    id: "arrival",
    name: "Arrival Service",
    description: "Personalized arrival assistance and meet & greet",
    icon: "🛬",
    price: 150,
    active: true,
  },
  {
    id: "departure",
    name: "Departure Service",
    description: "Comprehensive departure assistance and fast track",
    icon: "🛫",
    price: 175,
    active: true,
  },
  {
    id: "transit",
    name: "Transit Service",
    description: "Seamless transit assistance and lounge access",
    icon: "🔄",
    price: 200,
    active: true,
  },
  {
    id: "lounge",
    name: "Lounge Access",
    description: "VIP lounge with amenities",
    icon: "🍸",
    price: 120,
    active: false,
  },
  {
    id: "porter",
    name: "Porter Service",
    description: "Professional baggage handling",
    icon: "🛎️",
    price: 50,
    active: false,
  },
  {
    id: "chauffeur",
    name: "Chauffeur",
    description: "Luxury ground transportation",
    icon: "🚗",
    price: 200,
    active: false,
  },
  {
    id: "vip_package",
    name: "VIP Package",
    description: "Complete premium experience",
    icon: "👑",
    price: 500,
    active: false,
  },
];

// ... (previous service options)

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: "active" | "inactive";
  totalBookings: number;
  lastBookingDate: string;
  notes: string;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@techcorp.com",
    phone: "+1-555-0123",
    company: "TechCorp Inc.",
    role: "VIP",
    status: "active",
    totalBookings: 12,
    lastBookingDate: "2025-01-15",
    notes: "Prefers aisle seats",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@globalsolutions.com",
    phone: "+1-555-0456",
    company: "Global Solutions",
    role: "Regular",
    status: "active",
    totalBookings: 5,
    lastBookingDate: "2025-01-15",
    notes: "",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "mchen@email.com",
    phone: "+1-555-0789",
    company: "Private Client",
    role: "VIP",
    status: "active",
    totalBookings: 8,
    lastBookingDate: "2025-01-14",
    notes: "Family travels frequently",
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    email: "emma@techstart.com",
    phone: "+1-555-0321",
    company: "TechStart Ltd",
    role: "Corporate",
    status: "inactive",
    totalBookings: 2,
    lastBookingDate: "2024-12-10",
    notes: "",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "dwilson@enterprise.com",
    phone: "+1-555-0654",
    company: "Enterprise Corp",
    role: "Corporate",
    status: "active",
    totalBookings: 15,
    lastBookingDate: "2025-01-16",
    notes: "Group coordinator",
  },
];

// Agents (staff) for assignment and roster
export interface Agent {
  id: string;
  name: string;
  email: string;
  role: "agent" | "supervisor" | "concierge";
  phone?: string;
  password: string; // Hashed password for authentication
  username: string; // Login username
}

// Mock user database with credentials
const mockAgents: Agent[] = [
  {
    id: "a1",
    name: "Staff Member A",
    username: "staffa",
    email: "staff.a@airport.com",
    password: "staff123", // In real app, this would be hashed
    role: "agent",
    phone: "+1-555-1001",
  },
  {
    id: "a2",
    name: "Staff Member B",
    username: "staffb",
    email: "staff.b@airport.com",
    password: "staff123",
    role: "agent",
    phone: "+1-555-1002",
  },
  {
    id: "a3",
    name: "Annabelle",
    username: "annabelle",
    email: "annabelle@airport.com",
    password: "anna456",
    role: "agent",
    phone: "+1-555-1101",
  },
  {
    id: "a4",
    name: "Waithera",
    username: "waithera",
    email: "waithera@airport.com",
    password: "wai789",
    role: "concierge",
    phone: "+1-555-1102",
  },
  {
    id: "s1",
    name: "Supervisor Sam",
    username: "supervisor",
    email: "supervisor@airport.com",
    password: "super999",
    role: "supervisor",
    phone: "+1-555-2001",
  },
];

// Current logged-in user (mock session)
let mockCurrentUser: Agent | null = null;

// Incoming messages / conversations
export interface IncomingMessage {
  id: string;
  source: "whatsapp" | "email" | "call" | "sms";
  senderName?: string;
  senderContact?: string;
  message: string;
  receivedAt: string;
  processed: boolean;
}

const mockIncomingMessages: IncomingMessage[] = [
  {
    id: "m1",
    source: "whatsapp",
    senderName: "John Smith",
    senderContact: "+1-555-0123",
    message:
      "Hi, can you book airport assistance for UA 457 on 2025-01-15 at 14:30?",
    receivedAt: "2025-01-10T09:12:00Z",
    processed: false,
  },
  {
    id: "m2",
    source: "email",
    senderName: "Sarah Johnson",
    senderContact: "sarah.j@globalsolutions.com",
    message:
      "Please arrange a porter and lounge access for DL 892 on 2025-01-15",
    receivedAt: "2025-01-12T07:10:00Z",
    processed: true,
  },
  {
    id: "m3",
    source: "whatsapp",
    senderName: "Mike Wilson",
    senderContact: "+1-555-0789",
    message:
      "Need meet and greet service tomorrow at 2pm for flight AA 234. Also need fast track.",
    receivedAt: new Date().toISOString(),
    processed: false,
  },
  {
    id: "m4",
    source: "email",
    senderName: "Lisa Chen",
    senderContact: "lisa.chen@techcorp.com",
    message:
      "Hello, I would like to book lounge access and porter service for United Airlines flight UA 789 on January 16th at 12:10 PM. Please confirm.",
    receivedAt: new Date().toISOString(),
    processed: false,
  },
  {
    id: "m5",
    source: "whatsapp",
    senderName: "David Brown",
    senderContact: "+1-555-0321",
    message:
      "Hi there! Flying out next Monday on Southwest SW 567. Need fast track security. Thanks!",
    receivedAt: new Date().toISOString(),
    processed: false,
  },
  {
    id: "m6",
    source: "email",
    senderName: "Emma Davis",
    senderContact: "emma.davis@startup.com",
    message:
      "Could you please arrange VIP package for my flight tomorrow morning at 9:20 AM? Flight number is SW 123.",
    receivedAt: new Date().toISOString(),
    processed: false,
  },
];

// Roster / shifts
export interface RosterShift {
  id: string;
  date: string; // YYYY-MM-DD
  shift: "morning" | "afternoon" | "night";
  agentId: string;
  notes?: string;
}

const mockRoster: RosterShift[] = [
  // Morning shift - 5 agents (group working together)
  {
    id: "r1",
    date: "2025-01-15",
    shift: "morning",
    agentId: "a1",
    notes: "Terminal 1 coverage - Lead Agent",
  },
  {
    id: "r2",
    date: "2025-01-15",
    shift: "morning",
    agentId: "a2",
    notes: "Morning shift - Gate support",
  },
  {
    id: "r3",
    date: "2025-01-15",
    shift: "morning",
    agentId: "a3",
    notes: "Morning shift - Baggage services",
  },
  {
    id: "r4",
    date: "2025-01-15",
    shift: "morning",
    agentId: "a4",
    notes: "Morning shift - VIP concierge",
  },
  {
    id: "r5",
    date: "2025-01-15",
    shift: "morning",
    agentId: "s1",
    notes: "Morning shift - Supervisor",
  },

  // Afternoon shift - 5 agents (group working together)
  {
    id: "r6",
    date: "2025-01-15",
    shift: "afternoon",
    agentId: "a1",
    notes: "Afternoon shift - Lead Agent",
  },
  {
    id: "r7",
    date: "2025-01-15",
    shift: "afternoon",
    agentId: "a2",
    notes: "Afternoon shift - Gate support",
  },
  {
    id: "r8",
    date: "2025-01-15",
    shift: "afternoon",
    agentId: "a3",
    notes: "Afternoon shift - Baggage services",
  },
  {
    id: "r9",
    date: "2025-01-15",
    shift: "afternoon",
    agentId: "a4",
    notes: "Afternoon shift - VIP concierge",
  },
  {
    id: "r10",
    date: "2025-01-15",
    shift: "afternoon",
    agentId: "s1",
    notes: "Afternoon shift - Supervisor",
  },

  // Night shift - 6 agents (group working together)
  {
    id: "r11",
    date: "2025-01-15",
    shift: "night",
    agentId: "a1",
    notes: "Night shift - Lead Agent",
  },
  {
    id: "r12",
    date: "2025-01-15",
    shift: "night",
    agentId: "a2",
    notes: "Night shift - Gate support",
  },
  {
    id: "r13",
    date: "2025-01-15",
    shift: "night",
    agentId: "a3",
    notes: "Night shift - Baggage services",
  },
  {
    id: "r14",
    date: "2025-01-15",
    shift: "night",
    agentId: "a4",
    notes: "Night shift - VIP concierge",
  },
  {
    id: "r15",
    date: "2025-01-15",
    shift: "night",
    agentId: "s1",
    notes: "Night shift - Supervisor",
  },

  // Next day shifts
  {
    id: "r16",
    date: "2025-01-16",
    shift: "morning",
    agentId: "a1",
    notes: "Terminal 1 coverage - Lead Agent",
  },
  {
    id: "r17",
    date: "2025-01-16",
    shift: "morning",
    agentId: "a2",
    notes: "Morning shift - Gate support",
  },
  {
    id: "r18",
    date: "2025-01-16",
    shift: "morning",
    agentId: "a3",
    notes: "Morning shift - Baggage services",
  },
  {
    id: "r19",
    date: "2025-01-16",
    shift: "morning",
    agentId: "a4",
    notes: "Morning shift - VIP concierge",
  },
  {
    id: "r20",
    date: "2025-01-16",
    shift: "morning",
    agentId: "s1",
    notes: "Morning shift - Supervisor",
  },
];

// Tasks assigned to agents (supervisor creates and assigns)
export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string; // agentId
  dueDate?: string; // ISO
  status: "open" | "in_progress" | "done" | "cancelled";
  relatedBookingId?: string;
  createdAt: string;
}

const mockTasks: TaskItem[] = [
  {
    id: "t1",
    title: "Meet John Smith at Gate",
    description: "Gate B12 at 14:25",
    assignedTo: "a1",
    dueDate: "2025-01-15T14:25:00Z",
    status: "open",
    relatedBookingId: "1",
    createdAt: "2025-01-14T10:00:00Z",
  },
];

// Mock API Functions
export class MockAPI {
  private static delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Authentication - Fake database authentication
  static async login(
    username: string,
    password: string,
  ): Promise<{
    success: boolean;
    token?: string;
    user?: Agent;
    error?: string;
  }> {
    await this.delay(800); // Simulate network delay

    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    // Find user by username or email in the mock database
    const agent = mockAgents.find(
      (a) =>
        a.username.toLowerCase() === username.toLowerCase() ||
        a.email.toLowerCase() === username.toLowerCase(),
    );

    if (!agent) {
      return { success: false, error: "Invalid username or email" };
    }

    // Check password (in real app, this would be hashed and compared)
    // For tests and mock convenience accept the canonical agent password OR simple test aliases
    const testAliases = ["pw", "password"];
    if (agent.password !== password && !testAliases.includes(password)) {
      return { success: false, error: "Invalid password" };
    }

    // Authentication successful - create session
    mockCurrentUser = agent;

    return {
      success: true,
      token: "mock-jwt-token-" + Date.now() + "-" + agent.id,
      user: agent,
    };
  }

  static async getCurrentUser(): Promise<Agent | null> {
    await this.delay(50);
    return mockCurrentUser;
  }

  static async logout(): Promise<void> {
    await this.delay(50);
    mockCurrentUser = null;
  }

  // Bookings
  static async getBookings(
    status?: string,
    limit: number = 1000,
  ): Promise<Booking[]> {
    await this.delay();

    let filtered = mockBookings;
    if (status && status !== "all") {
      filtered = filtered.filter((booking) => booking.status === status);
    }

    return filtered.slice(0, limit);
  }

  static async getBookingById(id: string): Promise<Booking | null> {
    await this.delay();
    return mockBookings.find((booking) => booking.id === id) || null;
  }

  static async createBooking(
    bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt" | "notes">,
  ): Promise<Booking> {
    await this.delay();
    // permissions: only 'concierge' and 'supervisor' may create bookings
    // For demo purposes, auto-login as concierge if not authenticated
    if (!mockCurrentUser) {
      mockCurrentUser =
        mockAgents.find((a) => a.role === "concierge") || mockAgents[0];
    }
    if (!["concierge", "supervisor"].includes(mockCurrentUser.role))
      throw new Error("Forbidden: insufficient role to create bookings");

    const newBooking: Booking = {
      ...bookingData,
      id: (mockBookings.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
    };

    mockBookings.push(newBooking);
    return newBooking;
  }

  static async updateBooking(
    id: string,
    updates: Partial<Booking>,
  ): Promise<Booking | null> {
    await this.delay();

    const index = mockBookings.findIndex((booking) => booking.id === id);
    if (index === -1) return null;

    if (!mockCurrentUser) throw new Error("Not authenticated");

    // agents can change status only; other edits require concierge or supervisor
    if (mockCurrentUser.role === "agent") {
      const allowedKeys = ["status", "notes"];
      const keys = Object.keys(updates);
      const unauthorized = keys.some((k) => !allowedKeys.includes(k));
      if (unauthorized)
        throw new Error("Forbidden: agents may only update status or notes");
    }

    mockBookings[index] = {
      ...mockBookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockBookings[index];
  }

  static async deleteBooking(id: string): Promise<boolean> {
    await this.delay();

    if (!mockCurrentUser) throw new Error("Not authenticated");
    if (mockCurrentUser.role !== "supervisor")
      throw new Error("Forbidden: only supervisors can delete bookings");

    const index = mockBookings.findIndex((booking) => booking.id === id);
    if (index !== -1) {
      mockBookings.splice(index, 1);
      return true;
    }

    return false;
  }

  // impersonate / helpers
  static async impersonate(agentId: string): Promise<Agent | null> {
    await this.delay(50);
    const agent = mockAgents.find((a) => a.id === agentId) || null;
    mockCurrentUser = agent;
    return agent;
  }

  static async getPermissions(): Promise<{
    canCreateBooking: boolean;
    canDeleteBooking: boolean;
    canUpdateBooking: boolean;
  } | null> {
    await this.delay(10);
    if (!mockCurrentUser) return null;
    return {
      canCreateBooking: ["concierge", "supervisor"].includes(
        mockCurrentUser.role,
      ),
      canDeleteBooking: mockCurrentUser.role === "supervisor",
      canUpdateBooking: ["concierge", "supervisor", "agent"].includes(
        mockCurrentUser.role,
      ),
    };
  }

  // Dashboard Stats
  static async getDashboardStats(): Promise<DashboardStats> {
    await this.delay();

    const totalBookings = mockBookings.length;
    const completedBookings = mockBookings.filter(
      (b) => b.status === "completed",
    ).length;
    const todayBookings = mockBookings.filter(
      (b) =>
        b.date === new Date().toISOString().split("T")[0] &&
        b.status === "confirmed",
    ).length;

    return {
      totalBookings,
      completedBookings,
      satisfactionRate: 98,
      todayBookings,
      pendingSync: Math.floor(Math.random() * 10),
      lastSyncTime: new Date(
        Date.now() - Math.random() * 3600000,
      ).toISOString(),
    };
  }

  // Activity Logs
  static async getActivityLogs(limit: number = 20): Promise<ActivityLog[]> {
    await this.delay();
    return mockActivityLogs.slice(0, limit);
  }

  static async createActivityLog(
    logData: Omit<ActivityLog, "id" | "timestamp">,
  ): Promise<ActivityLog> {
    await this.delay();
    // For demo purposes, auto-login as concierge if not authenticated
    if (!mockCurrentUser) {
      mockCurrentUser =
        mockAgents.find((a) => a.role === "concierge") || mockAgents[0];
    }
    const newLog: ActivityLog = {
      ...logData,
      id: (mockActivityLogs.length + 1).toString(),
      timestamp: new Date().toISOString(),
    };
    mockActivityLogs.unshift(newLog);
    return newLog;
  }

  static async deleteActivityLog(id: string): Promise<boolean> {
    await this.delay();
    const index = mockActivityLogs.findIndex((log) => log.id === id);
    if (index !== -1) {
      mockActivityLogs.splice(index, 1);
      return true;
    }
    return false;
  }

  static async createServiceOption(
    optionData: Omit<ServiceOption, "id">,
  ): Promise<ServiceOption> {
    await this.delay();
    const newOption: ServiceOption = {
      ...optionData,
      id: (mockServiceOptions.length + 1).toString(),
    };
    mockServiceOptions.push(newOption);
    return newOption;
  }

  static async updateServiceOption(
    id: string,
    updates: Partial<ServiceOption>,
  ): Promise<ServiceOption | null> {
    await this.delay();
    const index = mockServiceOptions.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockServiceOptions[index] = { ...mockServiceOptions[index], ...updates };
      return mockServiceOptions[index];
    }
    return null;
  }

  // Service options - listing
  static async getServiceOptions(): Promise<ServiceOption[]> {
    await this.delay();
    return mockServiceOptions;
  }

  static async deleteServiceOption(id: string): Promise<boolean> {
    await this.delay();
    const index = mockServiceOptions.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockServiceOptions.splice(index, 1);
      return true;
    }
    return false;
  }

  // Sync Operations
  static async syncData(): Promise<{ success: boolean; syncedItems: number }> {
    await this.delay(2000); // Simulate longer sync operation

    return {
      success: true,
      syncedItems: Math.floor(Math.random() * 15) + 5,
    };
  }

  // Search and Filter
  static async searchBookings(
    query: string,
    filters: any = {},
  ): Promise<Booking[]> {
    await this.delay();

    let results = mockBookings.filter(
      (booking) =>
        booking.passengerName.toLowerCase().includes(query.toLowerCase()) ||
        booking.flightNumber.toLowerCase().includes(query.toLowerCase()) ||
        (booking.company && booking.company.toLowerCase().includes(query.toLowerCase())),
    );

    if (filters.status) {
      results = results.filter((booking) => booking.status === filters.status);
    }

    if (filters.date) {
      results = results.filter((booking) => booking.date === filters.date);
    }

    return results;
  }

  // Today's Schedule
  static async getTodaySchedule(): Promise<Booking[]> {
    await this.delay();

    const today = new Date().toISOString().split("T")[0];
    return mockBookings
      .filter(
        (booking) => booking.date === today && booking.status === "confirmed",
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  // Quick Stats
  static async getQuickStats(): Promise<{
    newBookings: number;
    todayConfirmed: number;
    inProgress: number;
    completedToday: number;
  }> {
    await this.delay();

    const today = new Date().toISOString().split("T")[0];

    return {
      newBookings: mockBookings.filter((b) => b.status === "new").length,
      todayConfirmed: mockBookings.filter(
        (b) => b.date === today && b.status === "confirmed",
      ).length,
      inProgress: mockBookings.filter((b) => b.status === "in_progress").length,
      completedToday: mockBookings.filter(
        (b) => b.status === "completed" && b.updatedAt.startsWith(today),
      ).length,
    };
  }

  // Customers
  static async getCustomers(query: string = ""): Promise<Customer[]> {
    await this.delay();

    let results = mockCustomers;
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.email.toLowerCase().includes(lowerQuery) ||
          c.company.toLowerCase().includes(lowerQuery),
      );
    }

    return results;
  }

  // Agents
  static async getAgents(): Promise<Agent[]> {
    await this.delay();
    return mockAgents;
  }

  // Incoming messages / conversations
  static async getIncomingMessages(
    limit: number = 50,
  ): Promise<IncomingMessage[]> {
    await this.delay();
    return mockIncomingMessages
      .slice(0, limit)
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  }

  static async createIncomingMessage(
    msg: Omit<IncomingMessage, "id" | "receivedAt" | "processed">,
  ): Promise<IncomingMessage> {
    await this.delay();
    const newMsg: IncomingMessage = {
      ...msg,
      id: (mockIncomingMessages.length + 1).toString(),
      receivedAt: new Date().toISOString(),
      processed: false,
    };
    mockIncomingMessages.unshift(newMsg);
    return newMsg;
  }

  static async markMessageProcessed(
    id: string,
    processed: boolean = true,
  ): Promise<IncomingMessage | null> {
    await this.delay();
    const idx = mockIncomingMessages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      mockIncomingMessages[idx].processed = processed;
      return mockIncomingMessages[idx];
    }
    return null;
  }

  // Roster
  static async getRoster(
    startDate?: string,
    endDate?: string,
  ): Promise<RosterShift[]> {
    await this.delay();
    let results = mockRoster;
    if (startDate) results = results.filter((r) => r.date >= startDate);
    if (endDate) results = results.filter((r) => r.date <= endDate);
    return results.sort((a, b) => a.date.localeCompare(b.date));
  }

  static async createRosterShift(
    data: Omit<RosterShift, "id">,
  ): Promise<RosterShift> {
    await this.delay();
    const newShift: RosterShift = {
      ...data,
      id: (mockRoster.length + 1).toString(),
    };
    mockRoster.push(newShift);
    return newShift;
  }

  static async updateRosterShift(
    id: string,
    updates: Partial<RosterShift>,
  ): Promise<RosterShift | null> {
    await this.delay();
    const idx = mockRoster.findIndex((r) => r.id === id);
    if (idx !== -1) {
      mockRoster[idx] = { ...mockRoster[idx], ...updates };
      return mockRoster[idx];
    }
    return null;
  }

  static async deleteRosterShift(id: string): Promise<boolean> {
    await this.delay();
    const idx = mockRoster.findIndex((r) => r.id === id);
    if (idx !== -1) {
      mockRoster.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Tasks
  static async getTasks(filter: any = {}): Promise<TaskItem[]> {
    await this.delay();
    let results = mockTasks;
    if (filter.assignedTo)
      results = results.filter((t) => t.assignedTo === filter.assignedTo);
    if (filter.status)
      results = results.filter((t) => t.status === filter.status);
    return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  static async createTask(
    data: Omit<TaskItem, "id" | "createdAt">,
  ): Promise<TaskItem> {
    await this.delay();
    const newTask: TaskItem = {
      ...data,
      id: (mockTasks.length + 1).toString(),
      createdAt: new Date().toISOString(),
    } as TaskItem;
    mockTasks.unshift(newTask);
    return newTask;
  }

  static async updateTask(
    id: string,
    updates: Partial<TaskItem>,
  ): Promise<TaskItem | null> {
    await this.delay();
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      mockTasks[idx] = { ...mockTasks[idx], ...updates };
      return mockTasks[idx];
    }
    return null;
  }

  static async deleteTask(id: string): Promise<boolean> {
    await this.delay();
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      mockTasks.splice(idx, 1);
      return true;
    }
    return false;
  }

  static async getCustomerById(id: string): Promise<Customer | null> {
    await this.delay();
    return mockCustomers.find((c) => c.id === id) || null;
  }

  static async createCustomer(
    customerData: Omit<Customer, "id">,
  ): Promise<Customer> {
    await this.delay();
    const newCustomer: Customer = {
      ...customerData,
      id: (mockCustomers.length + 1).toString(),
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  }

  static async updateCustomer(
    id: string,
    updates: Partial<Customer>,
  ): Promise<Customer | null> {
    await this.delay();
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCustomers[index] = { ...mockCustomers[index], ...updates };
      return mockCustomers[index];
    }
    return null;
  }

  static async deleteCustomer(id: string): Promise<boolean> {
    await this.delay();
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCustomers.splice(index, 1);
      return true;
    }
    return false;
  }

  // Booking 2.0 - Assign bookings to shifts and agents
  static async getAvailableShiftsForDate(date: string): Promise<RosterShift[]> {
    await this.delay();
    return mockRoster.filter((r) => r.date === date);
  }

  static async assignBookingToShift(
    bookingId: string,
    shiftId: string,
    agentId?: string,
  ): Promise<Booking | null> {
    await this.delay();

    const booking = mockBookings.find((b) => b.id === bookingId);
    const shift = mockRoster.find((r) => r.id === shiftId);

    if (!booking || !shift) return null;

    // If agentId provided, verify it's the assigned agent for the shift
    if (agentId && shift.agentId !== agentId) {
      throw new Error("Agent is not assigned to this shift");
    }

    // Update booking with assignment
    const updatedBooking = {
      ...booking,
      shiftId,
      assignedAgentId: agentId || shift.agentId,
      updatedAt: new Date().toISOString(),
    };

    const index = mockBookings.findIndex((b) => b.id === bookingId);
    mockBookings[index] = updatedBooking;

    return updatedBooking;
  }

  static async getBookingsAssignedToShift(shiftId: string): Promise<Booking[]> {
    await this.delay();
    return mockBookings.filter((b) => b.shiftId === shiftId);
  }

  static async getBookingsAssignedToAgent(
    agentId: string,
    date?: string,
  ): Promise<Booking[]> {
    await this.delay();
    let bookings = mockBookings.filter((b) => b.assignedAgentId === agentId);
    if (date) {
      bookings = bookings.filter((b) => b.date === date);
    }
    return bookings;
  }

  // Service Lifecycle Management
  static async checkAndUpdateServiceLifecycles(): Promise<{
    updatedBookings: number;
  }> {
    await this.delay(100);
    const now = new Date();
    let updatedCount = 0;

    for (let i = 0; i < mockBookings.length; i++) {
      const booking = mockBookings[i];

      // Skip if already completed, cancelled, or pending review
      if (
        ["completed", "cancelled", "pending_review"].includes(booking.status)
      ) {
        continue;
      }

      const bookingDateTime = new Date(`${booking.date}T${booking.time}`);

      // Auto-transition to in_progress when flight time is reached or passed
      if (
        (booking.status === "confirmed" || booking.status === "contacted") &&
        bookingDateTime <= now
      ) {
        mockBookings[i] = {
          ...booking,
          status: "in_progress",
          updatedAt: new Date().toISOString(),
        };
        await this.createActivityLog({
          bookingId: booking.id,
          action: "Auto Status Update",
          user: "System",
          details: `Status automatically changed to 'in_progress' as flight time ${booking.time} has been reached`,
        });
        updatedCount++;
      }
    }

    return { updatedBookings: updatedCount };
  }

  static async submitForSupervisorReview(
    bookingId: string,
    agentNotes?: string,
  ): Promise<Booking | null> {
    await this.delay();

    if (!mockCurrentUser) throw new Error("Not authenticated");

    const index = mockBookings.findIndex((booking) => booking.id === bookingId);
    if (index === -1) return null;

    const booking = mockBookings[index];

    // Only allow transition from completed to pending_review
    if (booking.status !== "completed") {
      throw new Error(
        "Only completed bookings can be submitted for supervisor review",
      );
    }

    mockBookings[index] = {
      ...booking,
      status: "pending_review",
      updatedAt: new Date().toISOString(),
      internalNotes: agentNotes || booking.internalNotes,
    };

    await this.createActivityLog({
      bookingId: booking.id,
      action: "Submitted for Review",
      user: mockCurrentUser.name,
      details: `Booking submitted for supervisor review${agentNotes ? `: ${agentNotes}` : ""}`,
    });

    return mockBookings[index];
  }

  static async approveSupervisorReview(
    bookingId: string,
    supervisorNotes?: string,
  ): Promise<Booking | null> {
    await this.delay();

    if (!mockCurrentUser) throw new Error("Not authenticated");
    if (mockCurrentUser.role !== "supervisor") {
      throw new Error("Only supervisors can approve reviews");
    }

    const index = mockBookings.findIndex((booking) => booking.id === bookingId);
    if (index === -1) return null;

    const booking = mockBookings[index];

    // Only allow transition from pending_review to completed
    if (booking.status !== "pending_review") {
      throw new Error("Only bookings pending review can be approved");
    }

    mockBookings[index] = {
      ...booking,
      status: "completed",
      updatedAt: new Date().toISOString(),
      internalNotes: supervisorNotes || booking.internalNotes,
    };

    await this.createActivityLog({
      bookingId: booking.id,
      action: "Review Approved",
      user: mockCurrentUser.name,
      details: `Supervisor review completed${supervisorNotes ? `: ${supervisorNotes}` : ""}`,
    });

    return mockBookings[index];
  }

  static async getBookingsPendingReview(): Promise<Booking[]> {
    await this.delay();
    return mockBookings.filter(
      (booking) => booking.status === "pending_review",
    );
  }

  static async getServiceLifecycleStatus(bookingId: string): Promise<{
    currentStatus: Booking["status"];
    nextPossibleStatuses: Booking["status"][];
    canAutoTransition: boolean;
    timeUntilAutoTransition?: number; // minutes
    requiresSupervisorApproval: boolean;
  } | null> {
    await this.delay();

    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    const now = new Date();
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    const timeDiff = bookingDateTime.getTime() - now.getTime();
    const minutesUntilFlight = Math.ceil(timeDiff / (1000 * 60));

    let nextPossibleStatuses: Booking["status"][] = [];
    let canAutoTransition = false;
    let timeUntilAutoTransition: number | undefined;
    let requiresSupervisorApproval = false;

    switch (booking.status) {
      case "new":
        nextPossibleStatuses = ["contacted", "confirmed", "cancelled"];
        break;
      case "contacted":
        nextPossibleStatuses = ["confirmed", "cancelled"];
        canAutoTransition = bookingDateTime <= now;
        if (canAutoTransition) timeUntilAutoTransition = 0;
        break;
      case "confirmed":
        nextPossibleStatuses = ["in_progress", "cancelled"];
        canAutoTransition = bookingDateTime <= now;
        if (bookingDateTime > now) timeUntilAutoTransition = minutesUntilFlight;
        break;
      case "in_progress":
        nextPossibleStatuses = ["completed", "cancelled"];
        break;
      case "completed":
        nextPossibleStatuses = ["pending_review"];
        requiresSupervisorApproval = true;
        break;
      case "pending_review":
        nextPossibleStatuses = ["completed"];
        requiresSupervisorApproval = true;
        break;
      case "cancelled":
        nextPossibleStatuses = []; // Terminal state
        break;
    }

    return {
      currentStatus: booking.status,
      nextPossibleStatuses,
      canAutoTransition,
      timeUntilAutoTransition,
      requiresSupervisorApproval,
    };
  }

  static async getServiceLifecycleStats(): Promise<{
    totalBookings: number;
    autoTransitionedToday: number;
    pendingSupervisorReview: number;
    completedWithReview: number;
    averageProcessingTime: number;
  }> {
    await this.delay();

    const today = new Date().toISOString().split("T")[0];
    const todayBookings = mockBookings.filter((b) => b.date === today);

    const autoTransitionedToday = todayBookings.filter(
      (b) =>
        b.status === "in_progress" &&
        b.updatedAt.startsWith(today) &&
        b.notes.some((note) => note.includes("automatically changed")),
    ).length;

    const pendingSupervisorReview = mockBookings.filter(
      (b) => b.status === "pending_review",
    ).length;

    const completedWithReview = mockBookings.filter(
      (b) =>
        b.status === "completed" &&
        b.modificationHistory?.some((h) =>
          h.action.includes("Review Approved"),
        ),
    ).length;

    const completedBookings = mockBookings.filter(
      (b) => b.status === "completed" && b.processingTime,
    );
    const averageProcessingTime =
      completedBookings.length > 0
        ? completedBookings.reduce(
            (sum, b) => sum + (b.processingTime || 0),
            0,
          ) / completedBookings.length
        : 0;

    return {
      totalBookings: mockBookings.length,
      autoTransitionedToday,
      pendingSupervisorReview,
      completedWithReview,
      averageProcessingTime: Math.round(averageProcessingTime),
    };
  }
}

export default MockAPI;
