// Mock API for Airport Concierge App
// Simulates backend data and operations

export interface Booking {
  id: string;
  passengerName: string;
  company: string;
  phone: string;
  email: string;
  flightNumber: string;
  airline: string;
  date: string;
  time: string;
  terminal?: string;
  passengerCount: number;
  services: string[];
  specialRequests: string;
  status: 'new' | 'contacted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  source: 'manual' | 'whatsapp' | 'email';
  createdAt: string;
  updatedAt: string;
  notes: string[];
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
}

// Mock Data
const mockBookings: Booking[] = [
  {
    id: '1',
    passengerName: 'John Smith',
    company: 'TechCorp Inc.',
    phone: '+1-555-0123',
    email: 'john.smith@techcorp.com',
    flightNumber: 'UA 457',
    airline: 'United Airlines',
    date: '2025-01-15',
    time: '14:30',
    terminal: 'T1',
    passengerCount: 2,
    services: ['meet_greet', 'fast_track', 'lounge'],
    specialRequests: 'VIP passenger, prefers quiet lounge',
    status: 'confirmed',
    source: 'whatsapp',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-14T16:30:00Z',
    notes: ['Confirmed VIP status', 'Met at Gate B12 at 14:25']
  },
  {
    id: '2',
    passengerName: 'Sarah Johnson',
    company: 'Global Solutions',
    phone: '+1-555-0456',
    email: 'sarah.j@globalsolutions.com',
    flightNumber: 'DL 892',
    airline: 'Delta Airlines',
    date: '2025-01-15',
    time: '16:15',
    terminal: 'T2',
    passengerCount: 1,
    services: ['fast_track', 'lounge', 'porter'],
    specialRequests: 'Business class, needs assistance with 2 suitcases',
    status: 'confirmed',
    source: 'email',
    createdAt: '2025-01-12T08:15:00Z',
    updatedAt: '2025-01-14T14:20:00Z',
    notes: ['Porter assigned - 2 large suitcases', 'Lounge access granted']
  },
  {
    id: '3',
    passengerName: 'Michael Chen',
    company: 'Private Client',
    phone: '+1-555-0789',
    email: 'mchen@email.com',
    flightNumber: 'AA 234',
    airline: 'American Airlines',
    date: '2025-01-15',
    time: '18:45',
    terminal: 'T3',
    passengerCount: 3,
    services: ['meet_greet', 'chauffeur', 'vip_package'],
    specialRequests: 'Family with children, need stroller assistance',
    status: 'new',
    source: 'manual',
    createdAt: '2025-01-14T20:00:00Z',
    updatedAt: '2025-01-14T20:00:00Z',
    notes: []
  },
  {
    id: '4',
    passengerName: 'Emma Rodriguez',
    company: 'TechStart Ltd',
    phone: '+1-555-0321',
    email: 'emma@techstart.com',
    flightNumber: 'SW 567',
    airline: 'Southwest Airlines',
    date: '2025-01-16',
    time: '09:20',
    terminal: 'T4',
    passengerCount: 1,
    services: ['fast_track'],
    specialRequests: 'Early morning flight, coffee preferred',
    status: 'contacted',
    source: 'whatsapp',
    createdAt: '2025-01-13T11:30:00Z',
    updatedAt: '2025-01-15T07:45:00Z',
    notes: ['Confirmed coffee preference', 'Fast track arranged']
  },
  {
    id: '5',
    passengerName: 'David Wilson',
    company: 'Enterprise Corp',
    phone: '+1-555-0654',
    email: 'dwilson@enterprise.com',
    flightNumber: 'UA 789',
    airline: 'United Airlines',
    date: '2025-01-16',
    time: '12:10',
    terminal: 'T1',
    passengerCount: 4,
    services: ['meet_greet', 'porter', 'lounge'],
    specialRequests: 'Group booking, separate lounge reservations needed',
    status: 'in_progress',
    source: 'email',
    createdAt: '2025-01-11T14:20:00Z',
    updatedAt: '2025-01-15T10:15:00Z',
    notes: ['Group of 4 confirmed', 'Separate lounge access arranged', 'Porter meeting at baggage claim']
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    bookingId: '1',
    action: 'Booking Confirmed',
    timestamp: '2025-01-14T16:30:00Z',
    user: 'Staff Member A',
    details: 'VIP booking confirmed for John Smith'
  },
  {
    id: '2',
    bookingId: '1',
    action: 'Passenger Met',
    timestamp: '2025-01-15T14:25:00Z',
    user: 'Staff Member B',
    details: 'Met passenger at Gate B12, proceeding to lounge'
  },
  {
    id: '3',
    bookingId: '2',
    action: 'Lounge Access Granted',
    timestamp: '2025-01-15T15:45:00Z',
    user: 'Staff Member C',
    details: 'Sarah Johnson granted access to premium lounge'
  },
  {
    id: '4',
    bookingId: '4',
    action: 'Fast Track Arranged',
    timestamp: '2025-01-15T08:30:00Z',
    user: 'Staff Member A',
    details: 'Early morning fast track security arranged'
  },
  {
    id: '5',
    bookingId: '5',
    action: 'Group Booking Updated',
    timestamp: '2025-01-15T11:00:00Z',
    user: 'Staff Member B',
    details: 'Updated group booking with separate lounge access'
  }
];

const mockServiceOptions: ServiceOption[] = [
  {
    id: 'meet_greet',
    name: 'Meet & Greet',
    description: 'Personalized airport assistance',
    icon: '✈️',
    price: 150
  },
  {
    id: 'fast_track',
    name: 'Fast Track',
    description: 'Priority security and boarding',
    icon: '⚡',
    price: 75
  },
  {
    id: 'lounge',
    name: 'Lounge Access',
    description: 'VIP lounge with amenities',
    icon: '🍸',
    price: 120
  },
  {
    id: 'porter',
    name: 'Porter Service',
    description: 'Professional baggage handling',
    icon: '🛎️',
    price: 50
  },
  {
    id: 'chauffeur',
    name: 'Chauffeur',
    description: 'Luxury ground transportation',
    icon: '🚗',
    price: 200
  },
  {
    id: 'vip_package',
    name: 'VIP Package',
    description: 'Complete premium experience',
    icon: '👑',
    price: 500
  }
];

// ... (previous service options)

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'active' | 'inactive';
  totalBookings: number;
  lastBookingDate: string;
  notes: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Inc.',
    role: 'VIP',
    status: 'active',
    totalBookings: 12,
    lastBookingDate: '2025-01-15',
    notes: 'Prefers aisle seats'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@globalsolutions.com',
    phone: '+1-555-0456',
    company: 'Global Solutions',
    role: 'Regular',
    status: 'active',
    totalBookings: 5,
    lastBookingDate: '2025-01-15',
    notes: ''
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '+1-555-0789',
    company: 'Private Client',
    role: 'VIP',
    status: 'active',
    totalBookings: 8,
    lastBookingDate: '2025-01-14',
    notes: 'Family travels frequently'
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    email: 'emma@techstart.com',
    phone: '+1-555-0321',
    company: 'TechStart Ltd',
    role: 'Corporate',
    status: 'inactive',
    totalBookings: 2,
    lastBookingDate: '2024-12-10',
    notes: ''
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'dwilson@enterprise.com',
    phone: '+1-555-0654',
    company: 'Enterprise Corp',
    role: 'Corporate',
    status: 'active',
    totalBookings: 15,
    lastBookingDate: '2025-01-16',
    notes: 'Group coordinator'
  }
];

// Mock API Functions
export class MockAPI {
  private static delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication
  static async login(username: string, password: string): Promise<{ success: boolean; token?: string; user?: any }> {
    await this.delay();

    if (username && password) {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          name: 'Staff Member',
          role: 'concierge',
          email: 'staff@airportconcierge.com'
        }
      };
    }

    return { success: false };
  }

  // Bookings
  static async getBookings(status?: string, limit: number = 50): Promise<Booking[]> {
    await this.delay();

    let filtered = mockBookings;
    if (status && status !== 'all') {
      filtered = mockBookings.filter(booking => booking.status === status);
    }

    return filtered.slice(0, limit);
  }

  static async getBookingById(id: string): Promise<Booking | null> {
    await this.delay();
    return mockBookings.find(booking => booking.id === id) || null;
  }

  static async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): Promise<Booking> {
    await this.delay();

    const newBooking: Booking = {
      ...bookingData,
      id: (mockBookings.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: []
    };

    mockBookings.push(newBooking);
    return newBooking;
  }

  static async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    await this.delay();

    const index = mockBookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      mockBookings[index] = {
        ...mockBookings[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return mockBookings[index];
    }

    return null;
  }

  static async deleteBooking(id: string): Promise<boolean> {
    await this.delay();

    const index = mockBookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      mockBookings.splice(index, 1);
      return true;
    }

    return false;
  }

  // Dashboard Stats
  static async getDashboardStats(): Promise<DashboardStats> {
    await this.delay();

    const totalBookings = mockBookings.length;
    const completedBookings = mockBookings.filter(b => b.status === 'completed').length;
    const todayBookings = mockBookings.filter(b =>
      b.date === new Date().toISOString().split('T')[0] && b.status === 'confirmed'
    ).length;

    return {
      totalBookings,
      completedBookings,
      satisfactionRate: 98,
      todayBookings,
      pendingSync: Math.floor(Math.random() * 10),
      lastSyncTime: new Date(Date.now() - Math.random() * 3600000).toISOString()
    };
  }

  // Activity Logs
  static async getActivityLogs(limit: number = 20): Promise<ActivityLog[]> {
    await this.delay();
    return mockActivityLogs.slice(0, limit);
  }

  // Service Options
  static async getServiceOptions(): Promise<ServiceOption[]> {
    await this.delay();
    return mockServiceOptions;
  }

  // Sync Operations
  static async syncData(): Promise<{ success: boolean; syncedItems: number }> {
    await this.delay(2000); // Simulate longer sync operation

    return {
      success: true,
      syncedItems: Math.floor(Math.random() * 15) + 5
    };
  }

  // Search and Filter
  static async searchBookings(query: string, filters: any = {}): Promise<Booking[]> {
    await this.delay();

    let results = mockBookings.filter(booking =>
      booking.passengerName.toLowerCase().includes(query.toLowerCase()) ||
      booking.flightNumber.toLowerCase().includes(query.toLowerCase()) ||
      booking.company.toLowerCase().includes(query.toLowerCase())
    );

    if (filters.status) {
      results = results.filter(booking => booking.status === filters.status);
    }

    if (filters.date) {
      results = results.filter(booking => booking.date === filters.date);
    }

    return results;
  }

  // Today's Schedule
  static async getTodaySchedule(): Promise<Booking[]> {
    await this.delay();

    const today = new Date().toISOString().split('T')[0];
    return mockBookings
      .filter(booking => booking.date === today && booking.status === 'confirmed')
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

    const today = new Date().toISOString().split('T')[0];

    return {
      newBookings: mockBookings.filter(b => b.status === 'new').length,
      todayConfirmed: mockBookings.filter(b => b.date === today && b.status === 'confirmed').length,
      inProgress: mockBookings.filter(b => b.status === 'in_progress').length,
      completedToday: mockBookings.filter(b => b.status === 'completed' &&
        b.updatedAt.startsWith(today)).length
    };
  }

  // Customers
  static async getCustomers(query: string = ''): Promise<Customer[]> {
    await this.delay();

    let results = mockCustomers;
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.company.toLowerCase().includes(lowerQuery)
      );
    }

    return results;
  }

  static async getCustomerById(id: string): Promise<Customer | null> {
    await this.delay();
    return mockCustomers.find(c => c.id === id) || null;
  }

  static async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    await this.delay();
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCustomers[index] = { ...mockCustomers[index], ...updates };
      return mockCustomers[index];
    }
    return null;
  }

  static async deleteCustomer(id: string): Promise<boolean> {
    await this.delay();
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCustomers.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default MockAPI;


