type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function isRateLimited(
  scope: string,
  request: Request,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const key = `${scope}:${getRequestIp(request)}`;
  const existing = buckets.get(key);

  if (!existing || existing.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return false;
  }

  if (existing.count >= limit) return true;

  existing.count += 1;
  return false;
}

export function clearRateLimits(): void {
  buckets.clear();
}
