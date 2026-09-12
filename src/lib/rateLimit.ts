/**
 * EchoSoul In-Memory Sliding-Window Rate Limiter (Phase 19)
 * 
 * Protects AI inference and API endpoints against denial-of-service,
 * rapid-fire spam, and downstream OpenRouter quota exhaustion.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

// Cleanup stale keys every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 300000).unref?.();
}

export interface RateLimitOptions {
  /** Time window in milliseconds (default: 60,000ms = 1 minute) */
  windowMs?: number;
  /** Max requests allowed within the window (default: 30) */
  max?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Check if an identifier (IP address or user_id) is within allowed rate limits.
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs ?? 60000;
  const max = options.max ?? 30;
  const now = Date.now();

  let record = store.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    store.set(identifier, record);
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= max) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldestTimestamp));
    return {
      success: false,
      limit: max,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  const remaining = max - record.timestamps.length;
  const resetMs = windowMs;

  return {
    success: true,
    limit: max,
    remaining,
    resetMs,
  };
}
