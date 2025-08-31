import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a string is a valid URL using the native URL constructor.
 * @param url The string to validate.
 * @returns True if the URL is valid, false otherwise.
 */
export function isValidUrl(url: string): boolean {
  if (!url) return true; // Don't validate empty strings
  try {
    new URL(url);
    return true;
  } catch (_) {
    try {
      // Try again with a default protocol
      new URL(`https://${url}`);
      return true;
    } catch (e) {
      return false;
    }
  }
}

/**
 * Normalizes a URL by trimming whitespace and adding https:// if a protocol is missing.
 * @param url The URL string to normalize.
 * @returns The normalized URL string.
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  
  try {
    // If it's already a valid URL, return as is.
    new URL(trimmed);
    return trimmed;
  } catch {
    // If not, try adding a protocol.
    if (!/^(?:f|ht)tps?:\/\//i.test(trimmed)) {
      return "https://" + trimmed;
    }
  }
  
  return trimmed; // Return original if it's unfixable
}
