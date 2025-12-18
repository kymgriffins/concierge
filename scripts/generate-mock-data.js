// Script to generate 200 mock passenger bookings
// Run with: node scripts/generate-mock-data.js

const fs = require("fs");
const path = require("path");

// Import the dynamic name generator from the lib directory
const { nameGenerator } = require("../lib/dynamic-name-generator.js");

// Dynamic Random Name Generator
class DynamicNameGenerator {
  constructor() {
    // Base name components for dynamic generation
    this.firstNamePrefixes = [
      "Alex",
      "Chris",
      "Pat",
      "Jordan",
      "Taylor",
      "Morgan",
      "Casey",
      "Riley",
      "Avery",
      "Blake",
      "Cameron",
      "Dakota",
      "Emerson",
      "Finley",
      "Gray",
      "Hayden",
      "Jamie",
      "Kendall",
      "Logan",
      "Madison",
      "Nico",
      "Owen",
      "Parker",
      "Quinn",
      "Reese",
      "Sage",
      "Tristan",
      "Val",
      "Willow",
      "Xander",
      "Yara",
      "Zane",
    ];

    this.firstNameSuffixes = [
      "ander",
      "ton",
      "son",
      "ford",
      "field",
      "brook",
      "ridge",
      "wood",
      "worth",
      "ville",
      "berg",
      "burg",
      "ville",
      "port",
      "mouth",
      "shire",
      "ham",
      "ton",
      "ley",
      "ford",
      "field",
      "brook",
      "ridge",
      "wood",
      "worth",
      "ville",
      "berg",
    ];

    this.lastNamePrefixes = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
      "Anderson",
      "Thomas",
      "Taylor",
      "Moore",
      "Jackson",
      "Martin",
      "Lee",
      "Perez",
      "Thompson",
      "White",
      "Harris",
      "Sanchez",
      "Clark",
      "Ramirez",
      "Lewis",
      "Robinson",
      "Walker",
      "Young",
      "Allen",
      "King",
      "Wright",
      "Scott",
      "Torres",
      "Nguyen",
      "Hill",
      "Flores",
      "Green",
      "Adams",
      "Nelson",
      "Baker",
      "Hall",
      "Rivera",
      "Campbell",
      "Mitchell",
      "Carter",
      "Roberts",
      "Gomez",
      "Phillips",
      "Evans",
      "Turner",
      "Diaz",
      "Parker",
      "Cruz",
      "Edwards",
      "Collins",
      "Reyes",
      "Stewart",
      "Morris",
      "Morales",
      "Murphy",
      "Cook",
      "Rogers",
      "Gutierrez",
      "Ortiz",
      "Morgan",
      "Cooper",
      "Peterson",
      "Bailey",
      "Reed",
      "Kelly",
      "Howard",
      "Ramos",
      "Kim",
      "Cox",
      "Ward",
      "Richardson",
      "Watson",
      "Brooks",
      "Chavez",
      "Wood",
      "James",
      "Bennett",
      "Gray",
      "Mendoza",
      "Ruiz",
      "Hughes",
      "Price",
      "Alvarez",
      "Castillo",
      "Sanders",
      "Patel",
      "Myers",
      "Long",
      "Ross",
      "Foster",
      "Jimenez",
      "Powell",
      "Jenkins",
      "Perry",
      "Russell",
      "Sullivan",
    ];

    this.lastNameSuffixes = [
      "son",
      "sen",
      "man",
      "berg",
      "burg",
      "ville",
      "ford",
      "field",
      "brook",
      "ridge",
      "wood",
      "worth",
      "ville",
      "port",
      "mouth",
      "shire",
      "ham",
      "ton",
      "ley",
      "ford",
      "field",
      "brook",
      "ridge",
      "wood",
      "worth",
      "ville",
      "berg",
      "ski",
      "ski",
      "wicz",
      "vicz",
      "enko",
      "chuk",
      "enko",
      "chuk",
      "yan",
      "yan",
    ];

    // International names for diversity
    this.internationalFirstNames = [
      "Ahmed",
      "Maria",
      "Juan",
      "Li",
      "Anna",
      "Mohammed",
      "Fatima",
      "Carlos",
      "Wei",
      "Elena",
      "Pedro",
      "Mei",
      "Luca",
      "Sara",
      "Diego",
      "Yuki",
      "Marco",
      "Aisha",
      "Antonio",
      "Hana",
      "Luis",
      "Chen",
      "Sofia",
      "Raj",
      "Isabella",
      "Miguel",
      "Priya",
      "Gabriel",
      "Zara",
      "Lucas",
      "Amir",
      "Olivia",
      "Hassan",
      "Emma",
      "Omar",
      "Sophia",
      "Ali",
      "Mia",
      "Fatma",
      "Noah",
      "Layla",
      "David",
    ];

    this.internationalLastNames = [
      "Garcia",
      "Rodriguez",
      "Gonzalez",
      "Hernandez",
      "Lopez",
      "Martinez",
      "Sanchez",
      "Perez",
      "Torres",
      "Ramirez",
      "Flores",
      "Rivera",
      "Gomez",
      "Diaz",
      "Morales",
      "Ortiz",
      "Gutierrez",
      "Chavez",
      "Ramos",
      "Hernandez",
      "Jimenez",
      "Ruiz",
      "Fernandez",
      "Moreno",
      "Alvarez",
      "Romero",
      "Vargas",
      "Castillo",
      "Guerrero",
      "Santos",
      "Aguilar",
      "Vega",
      "Santiago",
      "Dominguez",
      "Herrera",
      "Medina",
      "Castro",
      "Vazquez",
      "Soto",
      "Delgado",
      "Pena",
      "Reyes",
      "Guillen",
      "Guerra",
    ];

    // Predefined names for consistency
    this.commonFirstNames = [
      "John",
      "Jane",
      "Michael",
      "Sarah",
      "David",
      "Lisa",
      "Robert",
      "Jennifer",
      "James",
      "Mary",
      "William",
      "Patricia",
      "Christopher",
      "Linda",
      "Daniel",
      "Barbara",
      "Matthew",
      "Elizabeth",
      "Anthony",
      "Susan",
      "Joseph",
      "Margaret",
      "Charles",
      "Dorothy",
      "Thomas",
      "Andrew",
      "Nancy",
      "Mark",
      "Karen",
      "Steven",
      "Betty",
      "Paul",
      "Helen",
      "Kevin",
      "Sandra",
      "Brian",
      "Donna",
      "George",
      "Carol",
      "Edward",
      "Ruth",
      "Ronald",
      "Sharon",
      "Timothy",
      "Michelle",
      "Jason",
    ];

    this.commonLastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Miller",
      "Davis",
      "Garcia",
      "Wilson",
      "Anderson",
      "Thomas",
      "Taylor",
      "Moore",
      "Jackson",
      "Martin",
      "Lee",
      "Thompson",
      "White",
      "Harris",
      "Clark",
      "Lewis",
      "Robinson",
      "Walker",
      "Hall",
      "Allen",
      "Young",
      "King",
      "Wright",
      "Scott",
      "Green",
      "Adams",
      "Baker",
      "Nelson",
    ];

    // Cache for generated names to ensure uniqueness
    this.generatedNames = new Set();
  }

  generateFirstName() {
    // 40% chance of common name, 30% international, 30% dynamically generated
    const rand = Math.random();
    if (rand < 0.4) {
      return randomChoice(this.commonFirstNames);
    } else if (rand < 0.7) {
      return randomChoice(this.internationalFirstNames);
    } else {
      // Generate dynamic name
      const prefix = randomChoice(this.firstNamePrefixes);
      const suffix = randomChoice(this.firstNameSuffixes);
      return prefix + suffix;
    }
  }

  generateLastName() {
    // 50% chance of common name, 30% international, 20% dynamically generated
    const rand = Math.random();
    if (rand < 0.5) {
      return randomChoice(this.commonLastNames);
    } else if (rand < 0.8) {
      return randomChoice(this.internationalLastNames);
    } else {
      // Generate dynamic name
      const prefix = randomChoice(this.lastNamePrefixes);
      const suffix = randomChoice(this.lastNameSuffixes);
      return prefix + suffix;
    }
  }

  generateFullName() {
    let attempts = 0;
    let firstName, lastName, fullName;

    do {
      firstName = this.generateFirstName();
      lastName = this.generateLastName();
      fullName = `${firstName} ${lastName}`;
      attempts++;
    } while (this.generatedNames.has(fullName) && attempts < 50);

    // If we can't find a unique name after 50 attempts, just use it anyway
    this.generatedNames.add(fullName);
    return { firstName, lastName, fullName };
  }

  reset() {
    this.generatedNames.clear();
  }
}

// Use imported nameGenerator instance

// Legacy arrays for backward compatibility
const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Sarah",
  "David",
  "Lisa",
  "Robert",
  "Jennifer",
  "James",
  "Mary",
  "William",
  "Patricia",
  "Christopher",
  "Linda",
  "Daniel",
  "Barbara",
  "Matthew",
  "Elizabeth",
  "Anthony",
  "Susan",
  "Joseph",
  "Margaret",
  "Charles",
  "Dorothy",
  "Thomas",
  "Lisa",
  "Andrew",
  "Nancy",
  "Mark",
  "Karen",
  "Steven",
  "Betty",
  "Paul",
  "Helen",
  "Kevin",
  "Sandra",
  "Brian",
  "Donna",
  "George",
  "Carol",
  "Edward",
  "Ruth",
  "Ronald",
  "Sharon",
  "Timothy",
  "Michelle",
  "Jason",
  "Laura",
  "Jeffrey",
  "Sarah",
  "Ryan",
  "Kimberly",
  "Jacob",
  "Deborah",
  "Nicholas",
  "Jessica",
  "Eric",
  "Shirley",
  "Jonathan",
  "Cynthia",
  "Stephen",
  "Angela",
  "Larry",
  "Melissa",
  "Justin",
  "Brenda",
  "Scott",
  "Amy",
  "Brandon",
  "Anna",
  "Benjamin",
  "Rebecca",
  "Samuel",
  "Virginia",
  "Gregory",
  "Kathleen",
  "Alexander",
  "Pamela",
  "Patrick",
  "Martha",
  "Jack",
  "Debra",
  "Dennis",
  "Amanda",
  "Jerry",
  "Stephanie",
  "Tyler",
  "Carolyn",
  "Aaron",
  "Christine",
  "Jose",
  "Marie",
  "Adam",
  "Janet",
  "Nathan",
  "Catherine",
  "Henry",
  "Frances",
  "Zachary",
  "Ann",
  "Douglas",
  "Joyce",
  "Peter",
  "Diane",
  "Kyle",
  "Alice",
  "Noah",
  "Julie",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
  "Edwards",
  "Collins",
  "Reyes",
  "Stewart",
  "Morris",
  "Morales",
  "Murphy",
  "Cook",
  "Rogers",
  "Gutierrez",
  "Ortiz",
  "Morgan",
  "Cooper",
  "Peterson",
  "Bailey",
  "Reed",
  "Kelly",
  "Howard",
  "Ramos",
  "Kim",
  "Cox",
  "Ward",
  "Richardson",
  "Watson",
  "Brooks",
  "Chavez",
  "Wood",
  "James",
  "Bennett",
  "Gray",
  "Mendoza",
  "Ruiz",
  "Hughes",
  "Price",
  "Alvarez",
  "Castillo",
  "Sanders",
  "Patel",
  "Myers",
  "Long",
  "Ross",
  "Foster",
  "Jimenez",
  "Powell",
  "Jenkins",
  "Perry",
  "Russell",
  "Sullivan",
];



const airlines = [
  "American Airlines",
  "Delta Airlines",
  "United Airlines",
  "Southwest Airlines",
  "JetBlue Airways",
  "Alaska Airlines",
  "Spirit Airlines",
  "Frontier Airlines",
  "Allegiant Air",
  "Hawaiian Airlines",
  "Sun Country Airlines",
];

const airlineCodes = {
  "American Airlines": "AA",
  "Delta Airlines": "DL",
  "United Airlines": "UA",
  "Southwest Airlines": "SW",
  "JetBlue Airways": "B6",
  "Alaska Airlines": "AS",
  "Spirit Airlines": "NK",
  "Frontier Airlines": "F9",
  "Allegiant Air": "G4",
  "Hawaiian Airlines": "HA",
  "Sun Country Airlines": "SY",
};

const serviceIds = ["arrival", "departure", "transit"];
const statuses = [
  "new",
  "contacted",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];
const sources = ["manual", "whatsapp", "email"];
const terminals = ["T1", "T2", "T3", "T4"];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhone() {
  return `+1-555-${randomInt(100, 999).toString().padStart(3, "0")}`;
}

function generateEmail(firstName, lastName) {
  const domains = ["gmail.com", "yahoo.com", "outlook.com"];
  const first = firstName.toLowerCase();
  const last = lastName.toLowerCase();

  const formats = [
    `${first}.${last}@${randomChoice(domains)}`,
    `${first}${last}@${randomChoice(domains)}`,
    `${first[0]}${last}@${randomChoice(domains)}`,
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
  const start = new Date("2023-01-01");
  const end = new Date("2025-12-31");
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split("T")[0];
}

function generateTime() {
  const hour = randomInt(6, 22); // 6 AM to 10 PM
  const minute = randomInt(0, 59);
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

function generateSpecialRequests() {
  const requests = [
    "VIP passenger, prefers quiet lounge",
    "Business class, needs assistance with 2 suitcases",
    "Family with children, need stroller assistance",
    "Early morning flight, coffee preferred",
    "Group booking, separate lounge reservations needed",
    "Wheelchair assistance required",
    "Dietary restrictions - vegetarian meals",
    "Pet in cabin, needs special handling",
    "Connecting flight assistance needed",
    "Premium economy, lounge access requested",
    "Medical assistance may be needed",
    "Extra legroom preferred",
    "Bulkhead seat required",
    "Child meal required",
    "Special occasion - anniversary trip",
    "Frequent flyer, priority boarding",
    "Large group coordination needed",
    "Corporate VIP treatment",
    "Media/press credentials",
    "Diplomatic passenger",
  ];

  return randomChoice(requests);
}

function generateBooking(id) {
  // Use dynamic name generator for more variety
  const {
    firstName,
    lastName,
    fullName: passengerName,
  } = nameGenerator.generateFullName();
  const airline = randomChoice(airlines);
  const date = generateDate();
  const time = generateTime();

  // Status distribution: more completed/cancelled for past dates, more new/confirmed for future
  const isPast = new Date(`${date}T${time}`) < new Date();
  let statusWeights;
  if (isPast) {
    statusWeights = [
      "completed",
      "completed",
      "completed",
      "cancelled",
      "in_progress",
      "confirmed",
    ];
  } else {
    statusWeights = [
      "new",
      "new",
      "contacted",
      "confirmed",
      "confirmed",
      "confirmed",
    ];
  }

  const status = randomChoice(statusWeights);
  const source = randomChoice(sources);

  // Generate createdAt as some time before the flight
  const flightDateTime = new Date(`${date}T${time}`);
  const createdDaysBefore = randomInt(1, 30);
  const createdAt = new Date(
    flightDateTime.getTime() - createdDaysBefore * 24 * 60 * 60 * 1000,
  );

  // Generate passenger count first
  const passengerCount = randomInt(1, 4);

  // Enhanced admin data
  const serviceId = randomChoice(serviceIds);
  const servicePrices = { arrival: 150, departure: 175, transit: 200 };
  const serviceFee = servicePrices[serviceId] || 150;
  const additionalCharges = Math.random() < 0.6 ? randomInt(0, 100) : 0;
  const totalRevenue = serviceFee + additionalCharges;

  // Priority based on passenger count and special requests
  let priority = "normal";
  if (passengerCount > 2) {
    priority = Math.random() < 0.3 ? "high" : "normal";
  }

  // Customer type - now based on passenger count and random chance
  let customerType = "individual";
  if (passengerCount > 2) {
    customerType = "corporate";
  } else if (Math.random() < 0.1) {
    customerType = "frequent_flyer";
  }

  // Equipment needed based on special requests
  const equipmentOptions = [
    "wheelchair",
    "stroller",
    "porter",
    "electric_cart",
  ];
  const equipmentNeeded =
    Math.random() < 0.3 ? [randomChoice(equipmentOptions)] : [];

  // Special handling
  const specialHandlingOptions = [
    "vip",
    "medical",
    "diplomatic",
    "family",
    "business",
    "group",
  ];
  const specialHandling =
    Math.random() < 0.4 ? [randomChoice(specialHandlingOptions)] : [];

  // Processing time for completed bookings
  const processingTime =
    status === "completed" ? randomInt(60, 2880) : undefined; // 1 hour to 2 days
  const actualDuration =
    status === "completed" ? randomInt(20, 120) : undefined; // 20-120 minutes

  // Customer satisfaction for completed bookings
  const customerSatisfaction =
    status === "completed" ? randomInt(3, 5) : undefined;

  // Tags for filtering
  const tagOptions = [
    "vip",
    "corporate",
    "family",
    "business",
    "group",
    "medical",
    "wheelchair",
    "porter",
    "lounge",
  ];
  const tags = [];
  if (priority === "vip") tags.push("vip");
  if (customerType === "corporate") tags.push("corporate");
  if (equipmentNeeded.includes("wheelchair")) tags.push("wheelchair");
  if (equipmentNeeded.includes("porter")) tags.push("porter");
  if (specialHandling.includes("family")) tags.push("family");
  if (specialHandling.includes("group")) tags.push("group");
  if (Math.random() < 0.2)
    tags.push(randomChoice(tagOptions.filter((t) => !tags.includes(t))));

  // Loyalty programs
  const loyaltyPrograms = [
    "Mileage Plus",
    "SkyMiles",
    "Executive Club",
    "Aer Lingus",
    "Flying Blue",
  ];
  const loyaltyProgram =
    Math.random() < 0.4 ? randomChoice(loyaltyPrograms) : undefined;
  const frequentFlyerNumber = loyaltyProgram
    ? `${loyaltyProgram.substring(0, 2).toUpperCase()}${randomInt(100000, 999999)}`
    : undefined;

  // Follow-up requirements
  const followUpRequired = Math.random() < 0.3;
  const followUpDate = followUpRequired
    ? new Date(flightDateTime.getTime() + randomInt(1, 7) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : undefined;

  // Internal notes
  const internalNotesOptions = [
    "High-value client, ensure premium service",
    "Frequent business traveler",
    "New client, monitor satisfaction",
    "Requires special coordination",
    "VIP treatment requested",
    "Medical assistance may be needed",
    "Large corporate group, ensure coordination",
    "Family travel, prioritize comfort",
  ];
  const internalNotes =
    Math.random() < 0.4 ? randomChoice(internalNotesOptions) : undefined;

  // Agent assignments (random from available agents)
  const agentIds = ["a1", "a2", "a3", "a4", "s1"];
  const createdBy = randomChoice(agentIds);
  const lastModifiedBy =
    Math.random() < 0.7 ? randomChoice(agentIds) : undefined;

  // Supervisor assignments - set if created by supervisor or for completed/reviewed bookings
  let supervisedBy = undefined;
  if (createdBy === "s1") {
    supervisedBy = "s1"; // Supervisor created this booking
  } else if (status === "completed" && Math.random() < 0.6) {
    supervisedBy = "s1"; // Supervisor reviewed this completed booking
  }

  const booking = {
    id: id.toString(),
    passengerName,
    phone: generatePhone(),
    email: generateEmail(firstName, lastName),
    flightNumber: generateFlightNumber(airline),
    airline,
    date,
    time,
    terminal: randomChoice(terminals),
    passengerCount,
    serviceId,
    specialRequests: Math.random() < 0.7 ? generateSpecialRequests() : "",
    status,
    source,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    notes: [],
    // Enhanced admin fields
    priority,
    customerType,
    estimatedDuration: randomInt(30, 90), // 30-90 minutes
    actualDuration,
    serviceFee,
    additionalCharges,
    totalRevenue,
    customerSatisfaction,
    processingTime,
    equipmentNeeded,
    specialHandling,
    createdBy,
    lastModifiedBy,
    supervisedBy,
    tags,
    internalNotes,
    followUpRequired,
    followUpDate,
    loyaltyProgram,
    frequentFlyerNumber,
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

  bookings.forEach((booking) => {
    const year = new Date(booking.date).getFullYear();
    if (!yearlyStats[year]) {
      yearlyStats[year] = {
        total: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
      };
    }

    yearlyStats[year].total++;
    if (booking.status === "completed") yearlyStats[year].completed++;
    if (booking.status === "cancelled") yearlyStats[year].cancelled++;

    // Rough revenue estimate (service prices from mock data)
    const servicePrices = { arrival: 150, departure: 175, transit: 200 };
    yearlyStats[year].revenue += servicePrices[booking.serviceId] || 150;
  });

  console.log("\n=== AIRPORT CONCIERGE CAPACITY ANALYSIS ===\n");

  Object.keys(yearlyStats)
    .sort()
    .forEach((year) => {
      const stats = yearlyStats[year];
      const completionRate = (
        (stats.completed / (stats.total - stats.cancelled)) *
        100
      ).toFixed(1);

      console.log(`Year ${year}:`);
      console.log(`  Total Bookings: ${stats.total}`);
      console.log(`  Completed: ${stats.completed}`);
      console.log(`  Cancelled: ${stats.cancelled}`);
      console.log(`  Completion Rate: ${completionRate}%`);
      console.log(`  Estimated Revenue: $${stats.revenue.toLocaleString()}`);
      console.log(
        `  Monthly Average: ${Math.round(stats.total / 12)} bookings`,
      );
      console.log(`  Daily Average: ${Math.round(stats.total / 365)} bookings`);
      console.log();
    });

  // Overall capacity recommendations
  const totalBookings = Object.values(yearlyStats).reduce(
    (sum, stats) => sum + stats.total,
    0,
  );
  const avgMonthly = Math.round(
    totalBookings / (Object.keys(yearlyStats).length * 12),
  );
  const avgDaily = Math.round(
    totalBookings / (Object.keys(yearlyStats).length * 365),
  );

  console.log("CAPACITY RECOMMENDATIONS:");
  console.log(`  Monthly Capacity Needed: ${avgMonthly} bookings`);
  console.log(`  Daily Capacity Needed: ${avgDaily} bookings`);
  console.log(
    `  Peak Hour Capacity: ${Math.round(avgDaily / 16)} bookings/hour (assuming 16-hour operations)`,
  );
  console.log(
    `  Staff Required (5 bookings/agent/day): ${Math.ceil(avgDaily / 5)} agents per day`,
  );
  console.log(
    `  Annual Revenue Potential: $${Object.values(yearlyStats)
      .reduce((sum, stats) => sum + stats.revenue, 0)
      .toLocaleString()}`,
  );
}

// Main execution
const bookings = generateBookings(200);

// Load existing mockdb.json
const mockdbPath = path.join(__dirname, "..", "data", "mockdb.json");
let mockdb = JSON.parse(fs.readFileSync(mockdbPath, "utf8"));

// Replace bookings array
mockdb.bookings = bookings;

// Write back to file
fs.writeFileSync(mockdbPath, JSON.stringify(mockdb, null, 2));

console.log(`✅ Generated ${bookings.length} mock passenger bookings`);
console.log(`📁 Updated ${mockdbPath}`);

// Analyze capacity
analyzeCapacity(bookings);
