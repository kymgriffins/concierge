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
