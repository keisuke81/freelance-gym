import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimitPerMinute: Ratelimit | null = null;
let ratelimitPerHour: Ratelimit | null = null;
let ratelimitPerDay: Ratelimit | null = null;

function getRatelimiters() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  if (!ratelimitPerMinute) {
    const redis = new Redis({ url, token });
    ratelimitPerMinute = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 m'),
      prefix: 'rl:min',
    });
    ratelimitPerHour = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, '1 h'),
      prefix: 'rl:hr',
    });
    ratelimitPerDay = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 d'),
      prefix: 'rl:day',
    });
  }

  return { ratelimitPerMinute, ratelimitPerHour, ratelimitPerDay };
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; reason: 'minute' | 'hour' | 'day' | 'site' };

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const limiters = getRatelimiters();

  // Upstash未設定の場合はスルー
  if (!limiters) return { ok: true };

  const { ratelimitPerMinute, ratelimitPerHour, ratelimitPerDay } = limiters;

  const [min, hr, day] = await Promise.all([
    ratelimitPerMinute!.limit(ip),
    ratelimitPerHour!.limit(ip),
    ratelimitPerDay!.limit(ip),
  ]);

  if (!min.success) return { ok: false, reason: 'minute' };
  if (!hr.success) return { ok: false, reason: 'hour' };
  if (!day.success) return { ok: false, reason: 'day' };

  return { ok: true };
}
