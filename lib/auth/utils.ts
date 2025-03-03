import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Compares two strings in constant time to prevent timing attacks
 * Used for comparing security-sensitive values like tokens
 */
export function timingSafeCompare(a: string, b: string): boolean {
  // If either input isn't a string or lengths differ, return false
  // But process this check in constant time for maximum security
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }

  // Early length check helps with performance but doesn't leak timing info
  // since token lengths are typically fixed and publicly known
  if (a.length !== b.length) {
    return false;
  }

  // Convert strings to Uint8Arrays for timingSafeEqual
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);

  try {
    // Node's timingSafeEqual ensures constant-time comparison
    return timingSafeEqual(aBytes, bBytes);
  } catch (error) {
    // Handle any unexpected errors without revealing details
    console.error("Error in timingSafeCompare:", error);
    return false;
  }
}
