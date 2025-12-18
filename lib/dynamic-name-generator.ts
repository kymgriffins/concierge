// Dynamic Random Name Generator for Airport Concierge System
// Generates diverse, realistic names for populating booking data tables

export interface GeneratedName {
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface GeneratedContact {
  name: GeneratedName;
  phone: string;
  email: string;
}

export class DynamicNameGenerator {
  private generatedNames: Set<string> = new Set();

  // Base name components for dynamic generation
  private readonly firstNamePrefixes = [
    'Alex', 'Chris', 'Pat', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley',
    'Avery', 'Blake', 'Cameron', 'Dakota', 'Emerson', 'Finley', 'Gray', 'Hayden',
    'Jamie', 'Kendall', 'Logan', 'Madison', 'Nico', 'Owen', 'Parker', 'Quinn',
    'Reese', 'Sage', 'Tristan', 'Val', 'Willow', 'Xander', 'Yara', 'Zane'
  ];

  private readonly firstNameSuffixes = [
    'ander', 'ton', 'son', 'ford', 'field', 'brook', 'ridge', 'wood', 'worth',
    'ville', 'berg', 'burg', 'ville', 'port', 'mouth', 'shire', 'ham', 'ton',
    'ley', 'ford', 'field', 'brook', 'ridge', 'wood', 'worth', 'ville', 'berg'
  ];

  private readonly lastNamePrefixes = [
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

  private readonly lastNameSuffixes = [
    'son', 'sen', 'man', 'berg', 'burg', 'ville', 'ford', 'field', 'brook',
    'ridge', 'wood', 'worth', 'ville', 'port', 'mouth', 'shire', 'ham', 'ton',
    'ley', 'ford', 'field', 'brook', 'ridge', 'wood', 'worth', 'ville', 'berg',
    'ski', 'ski', 'wicz', 'vicz', 'enko', 'chuk', 'enko', 'chuk', 'yan', 'yan'
  ];

  // International names for diversity
  private readonly internationalFirstNames = [
    'Ahmed', 'Maria', 'Juan', 'Li', 'Anna', 'Mohammed', 'Fatima', 'Carlos',
    'Wei', 'Elena', 'Pedro', 'Mei', 'Luca', 'Sara', 'Diego', 'Yuki', 'Marco',
    'Aisha', 'Antonio', 'Hana', 'Luis', 'Chen', 'Sofia', 'Raj', 'Isabella',
    'Miguel', 'Priya', 'Gabriel', 'Zara', 'Lucas', 'Amir', 'Olivia', 'Hassan',
    'Emma', 'Omar', 'Sophia', 'Ali', 'Mia', 'Fatma', 'Noah', 'Layla', 'David'
  ];

  private readonly internationalLastNames = [
    'Garcia', 'Rodriguez', 'Gonzalez', 'Hernandez', 'Lopez', 'Martinez', 'Sanchez',
    'Perez', 'Torres', 'Ramirez', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Morales',
    'Ortiz', 'Gutierrez', 'Chavez', 'Ramos', 'Hernandez', 'Jimenez', 'Ruiz',
    'Fernandez', 'Moreno', 'Alvarez', 'Romero', 'Vargas', 'Castillo', 'Guerrero',
    'Santos', 'Aguilar', 'Vega', 'Santiago', 'Dominguez', 'Herrera', 'Medina',
    'Castro', 'Vazquez', 'Soto', 'Delgado', 'Pena', 'Reyes', 'Guillen', 'Guerra'
  ];

  // Predefined names for consistency
  private readonly commonFirstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Jennifer',
    'James', 'Mary', 'William', 'Patricia', 'Christopher', 'Linda', 'Daniel',
    'Barbara', 'Matthew', 'Elizabeth', 'Anthony', 'Susan', 'Joseph', 'Margaret',
    'Charles', 'Dorothy', 'Thomas', 'Andrew', 'Nancy', 'Mark', 'Karen', 'Steven',
    'Betty', 'Paul', 'Helen', 'Kevin', 'Sandra', 'Brian', 'Donna', 'George',
    'Carol', 'Edward', 'Ruth', 'Ronald', 'Sharon', 'Timothy', 'Michelle', 'Jason'
  ];

  private readonly commonLastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
    'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Hall',
    'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson'
  ];

  // Email domains
  private readonly emailDomains = [
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
    'aol.com', 'protonmail.com', 'mail.com'
  ];

  constructor() {
    this.reset();
  }

  /**
   * Generate a random first name
   */
  generateFirstName(): string {
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
  generateLastName(): string {
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
  generateFullName(): GeneratedName {
    let attempts = 0;
    let firstName: string;
    let lastName: string;
    let fullName: string;

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
  generatePhone(): string {
    const areaCode = this.randomInt(200, 999);
    const exchange = this.randomInt(200, 999);
    const number = this.randomInt(1000, 9999);
    return `+1-${areaCode}-${exchange.toString().padStart(3, '0')}-${number.toString().padStart(4, '0')}`;
  }

  /**
   * Generate a realistic email address
   */
  generateEmail(firstName: string, lastName: string, company?: string): string {
    const first = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const last = lastName.toLowerCase().replace(/[^a-z]/g, '');

    let domain: string;
    if (company && Math.random() < 0.6) {
      // Use company domain
      domain = company.toLowerCase().replace(/[^a-z]/g, '') + '.com';
    } else {
      // Use common email domain
      domain = this.randomChoice(this.emailDomains);
    }

    const formats = [
      `${first}.${last}@${domain}`,
      `${first}${last}@${domain}`,
      `${first[0]}${last}@${domain}`,
      `${first}_${last}@${domain}`,
      `${last}${first[0]}@${domain}`
    ];

    return this.randomChoice(formats);
  }

  /**
   * Generate complete contact information
   */
  generateContact(company?: string): GeneratedContact {
    const name = this.generateFullName();
    const phone = this.generatePhone();
    const email = this.generateEmail(name.firstName, name.lastName, company);

    return {
      name,
      phone,
      email
    };
  }

  /**
   * Generate multiple unique names
   */
  generateMultipleNames(count: number): GeneratedName[] {
    const names: GeneratedName[] = [];
    for (let i = 0; i < count; i++) {
      names.push(this.generateFullName());
    }
    return names;
  }

  /**
   * Generate multiple contacts
   */
  generateMultipleContacts(count: number, companies?: string[]): GeneratedContact[] {
    const contacts: GeneratedContact[] = [];
    for (let i = 0; i < count; i++) {
      const company = companies ? this.randomChoice(companies) : undefined;
      contacts.push(this.generateContact(company));
    }
    return contacts;
  }

  /**
   * Reset the generator (clear used names cache)
   */
  reset(): void {
    this.generatedNames.clear();
  }

  /**
   * Get statistics about generated names
   */
  getStats(): { totalGenerated: number; uniqueNames: number } {
    return {
      totalGenerated: this.generatedNames.size,
      uniqueNames: this.generatedNames.size
    };
  }

  /**
   * Utility method for random choice from array
   */
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Utility method for random integer
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// Export singleton instance for easy use
export const nameGenerator = new DynamicNameGenerator();

// Export utility functions for common use cases
export function generateRandomName(): GeneratedName {
  return nameGenerator.generateFullName();
}

export function generateRandomContact(company?: string): GeneratedContact {
  return nameGenerator.generateContact(company);
}

export function generateRandomNames(count: number): GeneratedName[] {
  return nameGenerator.generateMultipleNames(count);
}

export function generateRandomContacts(count: number, companies?: string[]): GeneratedContact[] {
  return nameGenerator.generateMultipleContacts(count, companies);
}
