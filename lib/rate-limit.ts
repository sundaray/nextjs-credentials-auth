import { Redis } from "@upstash/redis";

// Initialize the Redis client with credentials from environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// These values determine how many requests a user can make within a time window
const MAX_AUTH_REQUESTS = 5; // Allow 5 requests
const WINDOW_IN_SECONDS = 60; // Within a 60-second window

/************************************************
 *
 * Auth rate limit
 *
 ************************************************/

type RateLimitResult =
  | {
      limited: false;
    }
  | {
      limited: true;
      retryAfter: number;
      message: string;
    };

export async function authRateLimit(ip: string): Promise<RateLimitResult> {
  const key = `auth:${ip}`;
  const now = Date.now();

  // Get the current rate limit data for this IP
  const currentLimit = await redis.get<{ count: number; lastRequest: number }>(
    key,
  );

  if (!currentLimit) {
    // First time request for this IP
    // Initialize their counter and start their window
    // Set the key to expire after the window to automatically clean up
    await redis.set(
      key,
      {
        count: 1,
        lastRequest: now,
      },
      { ex: WINDOW_IN_SECONDS },
    );

    return { limited: false };
  }

  // Convert our window from seconds to milliseconds for comparison
  const windowMs = WINDOW_IN_SECONDS * 1000;

  // Calculate when the current window expires
  const windowExpiry = currentLimit.lastRequest + windowMs;

  if (now > windowExpiry) {
    // The previous window has expired
    // Start a fresh window with a reset counter
    await redis.set(
      key,
      {
        count: 1,
        lastRequest: now,
      },
      { ex: WINDOW_IN_SECONDS },
    );

    return { limited: false };
  }

  // We're still in the current window
  // Check if the user has exceeded their request limit
  if (currentLimit.count >= MAX_AUTH_REQUESTS) {
    // User has made too many requests
    const retryAfter = Math.ceil((windowExpiry - now) / 1000);
    return {
      limited: true,
      retryAfter,
      message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
    };
  }

  // User hasn't exceeded their limit
  // Increment their counter but keep them in the same window
  // Calculate the remaining time in the current window for expiry
  const remainingWindowSeconds = Math.ceil((windowExpiry - now) / 1000);

  await redis.set(
    key,
    {
      count: currentLimit.count + 1,
      lastRequest: currentLimit.lastRequest,
    },
    { ex: remainingWindowSeconds },
  );

  return { limited: false };
}
