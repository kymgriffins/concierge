// Dynamic Random Name Generator for Airport Concierge System (JavaScript version)
// Generates diverse, realistic names for populating booking data tables

class DynamicNameGenerator {
  constructor() {
    this.generatedNames = new Set();

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

    // Email domains
    this.emailDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "aol.com",
      "protonmail.com",
      "mail.com",
    ];
  }

  /**
   * Generate a random first name
   */
  generateFirstName() {
    // 40% chance of common name, 30% international, 30% dynamically generated
    const rand = Math.random();
    if (rand < 0.4) {
      return this.randomChoice(this.commonFirstNames);
    } else if (rand < 0.7) {
      return this.randomChoice(this.internationalFirstNames);
    } else {
      // Generate dynamic name
      const prefix = this.randomChoice(this.firstNamePrefixes);
      const suffix = this.randomChoice(this.firstNameSuffixes);
      return prefix + suffix;
    }
  }

  /**
   * Generate a random last name
   */
  generateLastName() {
    // 50% chance of common name, 30% international, 20% dynamically generated
    const rand = Math.random();
    if (rand < 0.5) {
      return this.randomChoice(this.commonLastNames);
    } else if (rand < 0.8) {
      return this.randomChoice(this.internationalLastNames);
    } else {
      // Generate dynamic name
      const prefix = this.randomChoice(this.lastNamePrefixes);
      const suffix = this.randomChoice(this.lastNameSuffixes);
      return prefix + suffix;
    }
  }

  /**
   * Generate a unique full name
   */
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

  /**
   * Generate a random phone number
   */
  generatePhone() {
    const areaCode = this.randomInt(200, 999);
    const exchange = this.randomInt(200, 999);
    const number = this.randomInt(1000, 9999);
    return `+1-${areaCode}-${exchange.toString().padStart(3, "0")}-${number.toString().padStart(4, "0")}`;
  }

  /**
   * Generate a realistic email address
   */
  generateEmail(firstName, lastName, company) {
    const first = firstName.toLowerCase().replace(/[^a-z]/g, "");
    const last = lastName.toLowerCase().replace(/[^a-z]/g, "");

    let domain;
    if (company && Math.random() < 0.6) {
      // Use company domain
      domain = company.toLowerCase().replace(/[^a-z]/g, "") + ".com";
    } else {
      // Use common email domain
      domain = this.randomChoice(this.emailDomains);
    }

    const formats = [
      `${first}.${last}@${domain}`,
      `${first}${last}@${domain}`,
      `${first[0]}${last}@${domain}`,
      `${first}_${last}@${domain}`,
      `${last}${first[0]}@${domain}`,
    ];

    return this.randomChoice(formats);
  }

  /**
   * Generate complete contact information
   */
  generateContact(company) {
    const name = this.generateFullName();
    const phone = this.generatePhone();
    const email = this.generateEmail(name.firstName, name.lastName, company);

    return {
      name,
      phone,
      email,
    };
  }

  /**
   * Generate multiple unique names
   */
  generateMultipleNames(count) {
    const names = [];
    for (let i = 0; i < count; i++) {
      names.push(this.generateFullName());
    }
    return names;
  }

  /**
   * Generate multiple contacts
   */
  generateMultipleContacts(count, companies) {
    const contacts = [];
    for (let i = 0; i < count; i++) {
      const company = companies ? this.randomChoice(companies) : undefined;
      contacts.push(this.generateContact(company));
    }
    return contacts;
  }

  /**
   * Reset the generator (clear used names cache)
   */
  reset() {
    this.generatedNames.clear();
  }

  /**
   * Get statistics about generated names
   */
  getStats() {
    return {
      totalGenerated: this.generatedNames.size,
      uniqueNames: this.generatedNames.size,
    };
  }

  /**
   * Utility method for random choice from array
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Utility method for random integer
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// Export for use in other modules
module.exports = { DynamicNameGenerator };

// Create singleton instance for easy use
const nameGenerator = new DynamicNameGenerator();

module.exports.nameGenerator = nameGenerator;

// Export utility functions for common use cases
module.exports.generateRandomName = () => nameGenerator.generateFullName();
module.exports.generateRandomContact = (company) =>
  nameGenerator.generateContact(company);
module.exports.generateRandomNames = (count) =>
  nameGenerator.generateMultipleNames(count);
module.exports.generateRandomContacts = (count, companies) =>
  nameGenerator.generateMultipleContacts(count, companies);
