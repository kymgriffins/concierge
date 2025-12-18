import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Deterministic date formatting to avoid server/client hydration mismatches
export function formatDateUTC(
  dateString: string,
  opts: Intl.DateTimeFormatOptions = {},
  locale = "en-GB",
) {
  try {
    const d = new Date(dateString);
    const defaultOpts: Intl.DateTimeFormatOptions = {
      dateStyle: "medium",
      timeStyle: undefined,
    } as any;
    const merged = {
      ...defaultOpts,
      ...opts,
      timeZone: "UTC",
    } as Intl.DateTimeFormatOptions;
    return new Intl.DateTimeFormat(locale, merged).format(d);
  } catch (err) {
    return dateString;
  }
}

export function formatDateTimeUTC(
  dateString: string,
  opts: Intl.DateTimeFormatOptions = {},
  locale = "en-GB",
) {
  try {
    const d = new Date(dateString);
    const defaultOpts: Intl.DateTimeFormatOptions = {
      dateStyle: "medium",
      timeStyle: "short",
    } as any;
    const merged = {
      ...defaultOpts,
      ...opts,
      timeZone: "UTC",
    } as Intl.DateTimeFormatOptions;
    return new Intl.DateTimeFormat(locale, merged).format(d);
  } catch (err) {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string, status?: string): {
  text: string;
  color: string;
} {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const isFuture = diffMs > 0;
    const diffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
    const diffDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));

    let text: string;
    let color: string;

    // Status-based color coding
    if (status === "completed") {
      color = "text-green-600";
    } else if (status === "in_progress") {
      color = "text-orange-600";
    } else if (status === "cancelled") {
      color = "text-red-600";
    } else if (status === "new" || status === "contacted" || status === "confirmed") {
      color = "text-blue-600";
    } else if (status === "pending_review") {
      color = "text-yellow-600";
    } else {
      color = "text-muted-foreground";
    }

    // Time-based text formatting
    if (isFuture) {
      // Future events
      if (diffMinutes < 60) {
        text = `In ${diffMinutes}m`;
      } else if (diffHours < 24) {
        text = `In ${diffHours}h`;
      } else if (diffDays < 7) {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = date.getDate();
        text = diffDays === 1 ? `Tomorrow (${dayNum})` : `${dayName} (${dayNum})`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        text = weeks === 1 ? "Next week" : `In ${weeks} weeks`;
      } else {
        text = formatDateUTC(dateString, { dateStyle: "medium" });
      }
    } else {
      // Past events
      if (diffMinutes < 1) {
        text = "Just now";
      } else if (diffMinutes < 60) {
        text = `${diffMinutes}m ago`;
      } else if (diffHours < 24) {
        text = `${diffHours}h ago`;
      } else if (diffDays < 7) {
        text = diffDays === 1 ? "Yesterday" : `${diffDays}d ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        text = weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
      } else {
        text = formatDateUTC(dateString, { dateStyle: "medium" });
      }
    }

    return { text, color };
  } catch (err) {
    return { text: dateString, color: "text-muted-foreground" };
  }
}
