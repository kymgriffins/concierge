// Message Parsing Engine for Auto-Booking System
// Extracts booking information from natural language messages

export interface ParsedBookingData {
  passengerName?: string;
  company?: string;
  phone?: string;
  email?: string;
  flightNumber?: string;
  airline?: string;
  date?: string;
  time?: string;
  terminal?: string;
  passengerCount?: number;
  services: string[];
  specialRequests?: string;
  confidence: {
    overall: "high" | "medium" | "low";
    passengerName: number; // 0-1 confidence score
    flight: number;
    dateTime: number;
    contact: number;
    services: number;
  };
  extractedEntities: {
    names: string[];
    flightNumbers: string[];
    dates: string[];
    times: string[];
    phones: string[];
    emails: string[];
    services: string[];
  };
}

export interface MessageParseResult {
  success: boolean;
  data?: ParsedBookingData;
  error?: string;
  suggestions?: string[];
}

// Service keywords mapping
const SERVICE_KEYWORDS = {
  meet_greet: [
    "meet",
    "greet",
    "meet and greet",
    "meeting",
    "greeting",
    "pickup",
  ],
  fast_track: [
    "fast track",
    "priority",
    "express",
    "quick security",
    "fast security",
  ],
  lounge: ["lounge", "vip lounge", "business lounge", "executive lounge"],
  porter: ["porter", "baggage", "luggage", "carry", "porter service"],
  chauffeur: [
    "chauffeur",
    "driver",
    "car",
    "transport",
    "limo",
    "ground transport",
  ],
  vip_package: [
    "vip package",
    "complete",
    "full service",
    "premium",
    "all services",
  ],
};

// Airline codes mapping
const AIRLINE_CODES = {
  UA: "United Airlines",
  DL: "Delta Airlines",
  AA: "American Airlines",
  SW: "Southwest Airlines",
  WN: "Southwest Airlines",
  AS: "Alaska Airlines",
  B6: "JetBlue Airways",
  F9: "Frontier Airlines",
  NK: "Spirit Airlines",
  G4: "Allegiant Air",
};

export class MessageParser {
  private static readonly DATE_PATTERNS = [
    /\b(\d{4}-\d{2}-\d{2})\b/g, // YYYY-MM-DD
    /\b(\d{2}\/\d{2}\/\d{4})\b/g, // MM/DD/YYYY
    /\b(\d{2}\/\d{2}\/\d{2})\b/g, // MM/DD/YY
    /\b(\d{1,2}\/\d{1,2})\b/g, // MM/DD (current year assumed)
    /\btomorrow\b/gi,
    /\btoday\b/gi,
    /\bnext\s+(\w+)\b/gi,
  ];

  private static readonly TIME_PATTERNS = [
    /\b(\d{1,2}:\d{2})\b/g, // HH:MM
    /\b(\d{1,2}:\d{2}\s*(?:am|pm))\b/gi, // HH:MM AM/PM
    /\b(\d{1,2}\s*(?:am|pm))\b/gi, // HH AM/PM
    /\b(\d{1,2})\s*o'clock\b/gi,
  ];

  private static readonly FLIGHT_PATTERNS = [
    /\b([A-Z]{2,3})\s*(\d{3,4})\b/g, // AA 123 or UA 4567
    /\b(flight\s+[A-Z]{2,3}\s*\d{3,4})\b/gi,
  ];

  private static readonly PHONE_PATTERNS = [
    /\b(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g,
    /\b(\+?\d{10,15})\b/g,
  ];

  private static readonly EMAIL_PATTERNS = [
    /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
  ];

  static parse(message: string): MessageParseResult {
    try {
      const cleanMessage = message.toLowerCase().trim();

      // Extract all entities
      const extractedEntities = this.extractEntities(cleanMessage);

      // Parse booking data
      const bookingData = this.extractBookingData(
        cleanMessage,
        extractedEntities,
      );

      // Calculate confidence scores
      const confidence = this.calculateConfidence(
        bookingData,
        extractedEntities,
      );

      // Determine if we have enough information for a booking
      const hasMinimumData =
        bookingData.flightNumber && (bookingData.date || bookingData.time);

      if (!hasMinimumData) {
        return {
          success: false,
          error: "Insufficient booking information extracted",
          suggestions: this.generateSuggestions(extractedEntities),
        };
      }

      return {
        success: true,
        data: {
          ...bookingData,
          confidence,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  private static extractEntities(
    message: string,
  ): ParsedBookingData["extractedEntities"] {
    return {
      names: this.extractNames(message),
      flightNumbers: this.extractFlightNumbers(message),
      dates: this.extractDates(message),
      times: this.extractTimes(message),
      phones: this.extractPhones(message),
      emails: this.extractEmails(message),
      services: this.extractServices(message),
    };
  }

  private static extractNames(message: string): string[] {
    // Simple name extraction - look for capitalized words that aren't common words
    const commonWords = [
      "the",
      "and",
      "for",
      "with",
      "from",
      "this",
      "that",
      "book",
      "flight",
      "airport",
      "please",
      "hi",
      "hello",
    ];
    const words = message.split(/\s+/);
    const names: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      // Capitalized word that's not a common word and not a number
      if (
        word.length > 1 &&
        word[0] === word[0].toUpperCase() &&
        !commonWords.includes(word.toLowerCase()) &&
        !/\d/.test(word)
      ) {
        // Check if next word is also capitalized (likely part of name)
        if (
          i + 1 < words.length &&
          words[i + 1][0] === words[i + 1][0].toUpperCase()
        ) {
          names.push(`${word} ${words[i + 1]}`);
          i++; // Skip next word
        } else {
          names.push(word);
        }
      }
    }

    return [...new Set(names)]; // Remove duplicates
  }

  private static extractFlightNumbers(message: string): string[] {
    const flights: string[] = [];

    for (const pattern of this.FLIGHT_PATTERNS) {
      const matches = message.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          // Clean up the match
          const cleanMatch = match.replace(/\bflight\s+/gi, "").trim();
          flights.push(cleanMatch.toUpperCase());
        });
      }
    }

    return [...new Set(flights)];
  }

  private static extractDates(message: string): string[] {
    const dates: string[] = [];

    for (const pattern of this.DATE_PATTERNS) {
      const matches = message.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          let dateStr = match;

          // Handle relative dates
          if (match.toLowerCase() === "today") {
            dateStr = new Date().toISOString().split("T")[0];
          } else if (match.toLowerCase() === "tomorrow") {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateStr = tomorrow.toISOString().split("T")[0];
          } else if (match.match(/\bnext\s+(\w+)\b/gi)) {
            // Handle "next Monday", "next week", etc.
            dateStr = this.parseRelativeDate(match);
          }

          dates.push(dateStr);
        });
      }
    }

    return [...new Set(dates)];
  }

  private static parseRelativeDate(relativeStr: string): string {
    // Simple relative date parsing - could be expanded
    const today = new Date();
    const match = relativeStr.match(/\bnext\s+(\w+)\b/gi);

    if (match) {
      const day = match[1].toLowerCase();
      const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      if (days.includes(day)) {
        const targetDay = days.indexOf(day);
        const currentDay = today.getDay();
        let daysAhead = targetDay - currentDay;

        if (daysAhead <= 0) {
          daysAhead += 7;
        }

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysAhead);
        return targetDate.toISOString().split("T")[0];
      }
    }

    return relativeStr; // Return original if can't parse
  }

  private static extractTimes(message: string): string[] {
    const times: string[] = [];

    for (const pattern of this.TIME_PATTERNS) {
      const matches = message.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          let timeStr = match.replace(/\s*o'clock\b/gi, ":00");

          // Convert 12-hour to 24-hour format
          if (timeStr.match(/\b(\d{1,2})\s*(am|pm)\b/gi)) {
            timeStr = this.convertTo24Hour(timeStr);
          }

          // Ensure HH:MM format
          if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
            times.push(timeStr);
          } else if (timeStr.match(/^\d{1,2}$/)) {
            times.push(`${timeStr}:00`);
          }
        });
      }
    }

    return [...new Set(times)];
  }

  private static convertTo24Hour(timeStr: string): string {
    const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
    if (!match) return timeStr;

    let hours = parseInt(match[1]);
    const minutes = match[2] || "00";
    const period = match[3].toLowerCase();

    if (period === "pm" && hours !== 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  private static extractPhones(message: string): string[] {
    const phones: string[] = [];

    for (const pattern of this.PHONE_PATTERNS) {
      const matches = message.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          // Clean phone number
          const cleanPhone = match.replace(/[\s\-\(\)\.]/g, "");
          if (cleanPhone.length >= 10) {
            phones.push(cleanPhone);
          }
        });
      }
    }

    return [...new Set(phones)];
  }

  private static extractEmails(message: string): string[] {
    const emails: string[] = [];

    for (const pattern of this.EMAIL_PATTERNS) {
      const matches = message.match(pattern);
      if (matches) {
        emails.push(...matches);
      }
    }

    return [...new Set(emails)];
  }

  private static extractServices(
    message: string,
    activeServices?: string[],
  ): string[] {
    const services: string[] = [];

    for (const [serviceId, keywords] of Object.entries(SERVICE_KEYWORDS)) {
      // Skip inactive services if activeServices list is provided
      if (activeServices && !activeServices.includes(serviceId)) {
        continue;
      }

      for (const keyword of keywords) {
        if (message.includes(keyword)) {
          services.push(serviceId);
          break; // Only add each service once
        }
      }
    }

    return [...new Set(services)];
  }

  private static extractBookingData(
    message: string,
    entities: ParsedBookingData["extractedEntities"],
  ): Omit<ParsedBookingData, "confidence"> {
    // Extract flight info
    let flightNumber: string | undefined;
    let airline: string | undefined;

    if (entities.flightNumbers.length > 0) {
      const flightMatch = entities.flightNumbers[0].match(
        /([A-Z]{2,3})\s*(\d{3,4})/,
      );
      if (flightMatch) {
        const code = flightMatch[1];
        const number = flightMatch[2];
        flightNumber = `${code} ${number}`;
        airline = AIRLINE_CODES[code as keyof typeof AIRLINE_CODES] || code;
      }
    }

    // Extract passenger info
    const passengerName =
      entities.names.length > 0 ? entities.names[0] : undefined;

    // Extract contact info
    const phone = entities.phones.length > 0 ? entities.phones[0] : undefined;
    const email = entities.emails.length > 0 ? entities.emails[0] : undefined;

    // Extract date/time
    const date = entities.dates.length > 0 ? entities.dates[0] : undefined;
    const time = entities.times.length > 0 ? entities.times[0] : undefined;

    // Extract passenger count (look for numbers near words like "passengers", "people", etc.)
    let passengerCount: number | undefined;
    const passengerMatch = message.match(
      /(\d+)\s*(?:passengers?|people|travelers?|guests?)/i,
    );
    if (passengerMatch) {
      passengerCount = parseInt(passengerMatch[1]);
    }

    // Extract terminal (look for T1, T2, etc. or "terminal 1", etc.)
    let terminal: string | undefined;
    const terminalMatch = message.match(/\b(?:terminal|t)\s*(\d+|[A-Z])\b/i);
    if (terminalMatch) {
      terminal = `T${terminalMatch[1].toUpperCase()}`;
    }

    // Extract special requests (anything after common phrases)
    let specialRequests: string | undefined;
    const requestPatterns = [
      /(?:please|can you|need|i want|i would like)\s+(.+)/i,
      /(?:special requests?|notes?|additional|also)\s*:\s*(.+)/i,
    ];

    for (const pattern of requestPatterns) {
      const match = message.match(pattern);
      if (match) {
        specialRequests = match[1].trim();
        break;
      }
    }

    return {
      passengerName,
      phone,
      email,
      flightNumber,
      airline,
      date,
      time,
      terminal,
      passengerCount: passengerCount || 1,
      services: entities.services,
      specialRequests,
      extractedEntities: entities,
    };
  }

  private static calculateConfidence(
    data: Omit<ParsedBookingData, "confidence">,
    entities: ParsedBookingData["extractedEntities"],
  ): ParsedBookingData["confidence"] {
    const scores = {
      passengerName: entities.names.length > 0 ? 0.9 : 0,
      flight:
        (entities.flightNumbers.length > 0 ? 0.95 : 0) *
        (data.airline ? 1.0 : 0.8),
      dateTime: Math.min(
        (entities.dates.length + entities.times.length) * 0.5,
        1.0,
      ),
      contact: entities.phones.length + entities.emails.length > 0 ? 0.9 : 0,
      services: entities.services.length > 0 ? 0.8 : 0.5,
    };

    const overallScore =
      scores.passengerName * 0.2 +
      scores.flight * 0.3 +
      scores.dateTime * 0.25 +
      scores.contact * 0.15 +
      scores.services * 0.1;

    let overall: "high" | "medium" | "low";
    if (overallScore >= 0.8) overall = "high";
    else if (overallScore >= 0.6) overall = "medium";
    else overall = "low";

    return {
      overall,
      ...scores,
    };
  }

  private static generateSuggestions(
    entities: ParsedBookingData["extractedEntities"],
  ): string[] {
    const suggestions: string[] = [];

    if (entities.flightNumbers.length === 0) {
      suggestions.push('Include flight number (e.g., "UA 457" or "Delta 892")');
    }

    if (entities.dates.length === 0 && entities.times.length === 0) {
      suggestions.push(
        'Include date and/or time (e.g., "tomorrow at 2:30 PM" or "2025-01-15")',
      );
    }

    if (entities.names.length === 0) {
      suggestions.push("Include passenger name");
    }

    if (entities.phones.length === 0 && entities.emails.length === 0) {
      suggestions.push("Include contact information (phone or email)");
    }

    return suggestions;
  }
}
