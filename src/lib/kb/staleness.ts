// A page nobody has re-read in half a year is a claim, not a fact.
export const STALE_AFTER_DAYS = 180;

// Frontmatter dates arrive as Date (YAML) or string, depending on quoting.
export type Day = string | Date;

export function isoDay(d: Day): string {
  return new Date(d).toISOString().slice(0, 10);
}

export function daysSince(d: Day, now = new Date()): number {
  return Math.floor((now.getTime() - new Date(d).getTime()) / 86_400_000);
}
