// Script to generate 10000 mock passenger bookings
// Run with: node scripts/generate-mock-data.js

const fs = require('fs');
const path = require('path');

// Random name generator data
const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Jennifer',
  'James', 'Mary', 'William', 'Patricia', 'Christopher', 'Linda', 'Daniel',
  'Barbara', 'Matthew', 'Elizabeth', 'Anthony', 'Susan', 'Joseph', 'Margaret',
  'Charles', 'Dorothy', 'Thomas', 'Lisa', 'Andrew', 'Nancy', 'Mark', 'Karen',
  'Steven', 'Betty', 'Paul', 'Helen', 'Kevin', 'Sandra', 'Brian', 'Donna',
  'George', 'Carol', 'Edward', 'Ruth', 'Ronald', 'Sharon', 'Timothy', 'Michelle',
  'Jason', 'Laura', 'Jeffrey', 'Sarah', 'Ryan', 'Kimberly', 'Jacob', 'Deborah',
  'Nicholas', 'Jessica', 'Eric', 'Shirley', 'Jonathan', 'Cynthia', 'Stephen',
  'Angela', 'Larry', 'Melissa', 'Justin', 'Brenda', 'Scott', 'Amy', 'Brandon',
  'Anna', 'Benjamin', 'Rebecca', 'Samuel', 'Virginia', 'Gregory', 'Kathleen',
  'Alexander', 'Pamela', 'Patrick', 'Martha', 'Jack', 'Debra', 'Dennis', 'Amanda',
  'Jerry', 'Stephanie', 'Tyler', 'Carolyn', 'Aaron', 'Christine', 'Jose', 'Marie',
  'Adam', 'Janet', 'Nathan', 'Catherine', 'Henry', 'Frances', 'Zachary', 'Ann',
  'Douglas', 'Joyce', 'Peter', 'Diane', 'Kyle', 'Alice', 'Noah', 'Julie'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson',
  'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz',
  'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long',
  'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan'
];

const companies = [
  'TechCorp Inc.', 'Global Solutions', 'Enterprise Corp', 'Innovative Systems',
  'Digital Dynamics', 'Future Tech', 'Smart Solutions', 'Advanced Analytics',
  'Cloud Services Ltd', 'DataTech', 'InfoSys', 'NetWorks', 'SecureTech',
  'WebSolutions', 'TechStart Ltd', 'GlobalTech', 'InnovateCorp', 'DataFlow',
  'CloudNine', 'TechHub', 'InfoTech Solutions', 'NetSecure', 'DataGuard',
  'WebTech', 'StartUp Inc', 'GlobalNet', 'InnovateLab', 'DataStream',
  'CloudTech', 'TechSolutions', 'InfoNet', 'NetTech', 'SecureNet', 'WebCorp',
  'StartCorp', 'GlobalHub', 'InnovateTech', 'DataTech Solutions', 'CloudSecure',
  'Private Client', 'VIP Customer', 'Executive Services', 'Premium Client'
];

const airlines = [
  'American Airlines', 'Delta Airlines', 'United Airlines', 'Southwest Airlines',
  'JetBlue Airways', 'Alaska Airlines', 'Spirit Airlines', 'Frontier Airlines',
  'Allegiant Air', 'Hawaiian Airlines', 'Sun Country Airlines'
];

const airlineCodes = {
  'American Airlines': 'AA',
  'Delta Airlines': 'DL',
  'United Airlines': 'UA',
  'Southwest Airlines': 'SW',
  'JetBlue Airways': 'B6',
  'Alaska Airlines': 'AS',
  'Spirit Airlines': 'NK',
  'Frontier Airlines': 'F9',
  'Allegiant Air': 'G4',
  'Hawaiian Airlines': 'HA',
  'Sun Country Airlines': 'SY'
};

const serviceIds = ['arrival', 'departure', 'transit'];
const statuses = ['new', 'contacted', 'confirmed', 'in_progress', 'completed', 'cancelled'];
const sources = ['manual', 'whatsapp', 'email'];
const terminals = ['T1', 'T2', 'T3', 'T4'];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhone() {
  return `+1-555-${randomInt(100, 999).toString().padStart(3, '0')}`;
}

function generateEmail(firstName, lastName, company) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
  const first = firstName.toLowerCase();
  const last = lastName.toLowerCase();
  const companyDomain = company.toLowerCase().replace(/[^a-z]/g, '') + '.com';

  const formats = [
    `${first}.${last}@${companyDomain}`,
    `${first}${last}@${companyDomain}`,
    `${first[0]}${last}@${companyDomain}`,
    `${first}.${last}@${randomChoice(domains)}`
  ];

  return randomChoice(formats);
}

function generateFlightNumber(airline) {
  const code = airlineCodes[airline];
  const number = randomInt(100, 999);
  return `${code} ${number}`;
}

function generateDate() {
  // Generate dates from 2023-01-01 to 2025-12-31
  const start = new Date('2023-01-01');
  const end = new Date('2025-12-31');
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

function generateTime() {
  const hour = randomInt(6, 22); // 6 AM to 10 PM
  const minute = randomInt(0, 59);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function generateSpecialRequests() {
  const requests = [
    'VIP passenger, prefers quiet lounge',
    'Business class, needs assistance with 2 suitcases',
    'Family with children, need stroller assistance',
    'Early morning flight, coffee preferred',
    'Group booking, separate lounge reservations needed',
    'Wheelchair assistance required',
    'Dietary restrictions - vegetarian meals',
    'Pet in cabin, needs special handling',
    'Connecting flight assistance needed',
    'Premium economy, lounge access requested',
    'Medical assistance may be needed',
    'Extra legroom preferred',
    'Bulkhead seat required',
    'Child meal required',
    'Special occasion - anniversary trip',
    'Frequent flyer, priority boarding',
    'Large group coordination needed',
    'Corporate VIP treatment',
    'Media/press credentials',
    'Diplomatic passenger'
  ];

  return randomChoice(requests);
}

function generateBooking(id) {
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  const passengerName = `${firstName} ${lastName}`;
  const company = randomChoice(companies);
  const airline = randomChoice(airlines);
  const date = generateDate();
  const time = generateTime();

  // Status distribution: more completed/cancelled for past dates, more new/confirmed for future
  const isPast = new Date(`${date}T${time}`) < new Date();
  let statusWeights;
  if (isPast) {
    statusWeights = ['completed', 'completed', 'completed', 'cancelled', 'in_progress', 'confirmed'];
  } else {
    statusWeights = ['new', 'new', 'contacted', 'confirmed', 'confirmed', 'confirmed'];
  }

  const status = randomChoice(statusWeights);
  const source = randomChoice(sources);

  // Generate createdAt as some time before the flight
  const flightDateTime = new Date(`${date}T${time}`);
  const createdDaysBefore = randomInt(1, 30);
  const createdAt = new Date(flightDateTime.getTime() - (createdDaysBefore * 24 * 60 * 60 * 1000));

  const booking = {
    id: id.toString(),
    passengerName,
    company,
    phone: generatePhone(),
    email: generateEmail(firstName, lastName, company),
    flightNumber: generateFlightNumber(airline),
    airline,
    date,
    time,
    terminal: randomChoice(terminals),
    passengerCount: randomInt(1, 4),
    serviceId: randomChoice(serviceIds),
    specialRequests: Math.random() < 0.7 ? generateSpecialRequests() : '',
    status,
    source,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    notes: []
  };

  return booking;
}

function generateBookings(count) {
  const bookings = [];
  for (let i = 1; i <= count; i++) {
    bookings.push(generateBooking(i));
  }
  return bookings;
}

// Generate capacity analysis
function analyzeCapacity(bookings) {
  const yearlyStats = {};

  bookings.forEach(booking => {
    const year = new Date(booking.date).getFullYear();
    if (!yearlyStats[year]) {
      yearlyStats[year] = {
        total: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0
      };
    }

    yearlyStats[year].total++;
    if (booking.status === 'completed') yearlyStats[year].completed++;
    if (booking.status === 'cancelled') yearlyStats[year].cancelled++;

    // Rough revenue estimate (service prices from mock data)
    const servicePrices = { arrival: 150, departure: 175, transit: 200 };
    yearlyStats[year].revenue += servicePrices[booking.serviceId] || 150;
  });

  console.log('\n=== AIRPORT CONCIERGE CAPACITY ANALYSIS ===\n');

  Object.keys(yearlyStats).sort().forEach(year => {
    const stats = yearlyStats[year];
    const completionRate = ((stats.completed / (stats.total - stats.cancelled)) * 100).toFixed(1);

    console.log(`Year ${year}:`);
    console.log(`  Total Bookings: ${stats.total}`);
    console.log(`  Completed: ${stats.completed}`);
    console.log(`  Cancelled: ${stats.cancelled}`);
    console.log(`  Completion Rate: ${completionRate}%`);
    console.log(`  Estimated Revenue: $${stats.revenue.toLocaleString()}`);
    console.log(`  Monthly Average: ${Math.round(stats.total / 12)} bookings`);
    console.log(`  Daily Average: ${Math.round(stats.total / 365)} bookings`);
    console.log();
  });

  // Overall capacity recommendations
  const totalBookings = Object.values(yearlyStats).reduce((sum, stats) => sum + stats.total, 0);
  const avgMonthly = Math.round(totalBookings / (Object.keys(yearlyStats).length * 12));
  const avgDaily = Math.round(totalBookings / (Object.keys(yearlyStats).length * 365));

  console.log('CAPACITY RECOMMENDATIONS:');
  console.log(`  Monthly Capacity Needed: ${avgMonthly} bookings`);
  console.log(`  Daily Capacity Needed: ${avgDaily} bookings`);
  console.log(`  Peak Hour Capacity: ${Math.round(avgDaily / 16)} bookings/hour (assuming 16-hour operations)`);
  console.log(`  Staff Required (5 bookings/agent/day): ${Math.ceil(avgDaily / 5)} agents per day`);
  console.log(`  Annual Revenue Potential: $${Object.values(yearlyStats).reduce((sum, stats) => sum + stats.revenue, 0).toLocaleString()}`);
}

// Main execution
const bookings = generateBookings(10000);

// Load existing mockdb.json
const mockdbPath = path.join(__dirname, '..', 'data', 'mockdb.json');
let mockdb = JSON.parse(fs.readFileSync(mockdbPath, 'utf8'));

// Replace bookings array
mockdb.bookings = bookings;

// Write back to file
fs.writeFileSync(mockdbPath, JSON.stringify(mockdb, null, 2));

console.log(`✅ Generated ${bookings.length} mock passenger bookings`);
console.log(`📁 Updated ${mockdbPath}`);

// Analyze capacity
analyzeCapacity(bookings);
