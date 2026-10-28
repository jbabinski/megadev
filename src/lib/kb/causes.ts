// How the support desk tells which cause a report belongs to. Pages explain it; this file is what runs.

// `meta.intakeTag` is what intake guessed from the reporter's browser, the moment the report came
// in. It is a guess. The cause depends on the tenant: where they are, and which booking form they
// run (locales.ts). The two disagree more often than intake would like.
export type Report = {
  id: string;
  receivedAt: string;
  tenant: string;
  channel: 'app' | 'email' | 'form';
  subject: string;
  body: string;
  meta: { browserLocale: string; intakeTag: string };
  mergedInto: number | null;
  mergedAt: string | null;
};

export type Tenant = { handle: string; name: string; locale: string; form: 'booking-v2' | 'booking-v3' };

export type Cause = 'parser' | 'hint';
export const CAUSES: readonly Cause[] = ['parser', 'hint'];

// What each booking form prints under its date field.
const DATE_HINT: Record<Tenant['form'], string> = {
  'booking-v2': 'DD/MM/YYYY',
  'booking-v3': 'MM/DD/YYYY',
};

// Does this locale write the day before the month? Asked of the platform, never typed in a list.
export function dayFirst(locale: string): boolean {
  const order = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date(Date.UTC(2026, 0, 2, 12)))
    .map((p) => p.type);
  return order.indexOf('day') < order.indexOf('month');
}

// The shared parser reads every date month first. A day-first tenant's dates come out flipped:
// that is `parser`. Through booking-v3's form the tenant's people type what the hint tells them,
// month first, and the form reads it the tenant's way: that is `hint`, a different bug.
export function causeOf(r: Pick<Report, 'channel'>, t: Tenant | undefined): Cause | null {
  if (!t || !dayFirst(t.locale)) return null;
  return r.channel === 'form' && DATE_HINT[t.form].startsWith('MM') ? 'hint' : 'parser';
}

export function sameCause(a: Pick<Report, 'channel'>, ta: Tenant | undefined, b: Pick<Report, 'channel'>, tb: Tenant | undefined): boolean {
  const ca = causeOf(a, ta);
  return ca !== null && ca === causeOf(b, tb);
}

// The ticket system exports in pages that overlap: a report can come twice. One id, one report.
export function uniqueById(reports: Report[]): Report[] {
  return [...new Map(reports.map((r) => [r.id, r])).values()];
}

export type CauseGroup = {
  cause: Cause | 'unplaced';
  reports: Report[];
  // What intake tagged these reports as: tag → count.
  taggedAs: Record<string, number>;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
  mergedInto: number[];
};

export function groupByCause(reports: Report[], tenantOf: (r: Report) => Tenant | undefined): CauseGroup[] {
  const byCause = new Map<CauseGroup['cause'], Report[]>();
  for (const r of reports) {
    const cause = causeOf(r, tenantOf(r)) ?? 'unplaced';
    byCause.set(cause, [...(byCause.get(cause) ?? []), r]);
  }
  return [...byCause.entries()]
    .map(([cause, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        cause,
        reports: rs,
        taggedAs: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.meta.intakeTag]: (n[r.meta.intakeTag] ?? 0) + 1 }), {}),
        tenants: new Set(rs.map((r) => r.tenant)).size,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        mergedInto: [...new Set(rs.flatMap((r) => (r.mergedInto ? [r.mergedInto] : [])))],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}

// A ticket is the cause most of its reports share; the rest were merged into the wrong place.
export function ticketCause(groups: CauseGroup[], ticket: number): CauseGroup['cause'] | null {
  return groups.find((g) => g.mergedInto.includes(ticket))?.cause ?? null;
}

// Reports the desk read differently from their cause (desk-notes.json): counted where they're filed,
// footnoted under it.
export function readAs(g: CauseGroup, ids: readonly string[]): number {
  return g.reports.filter((r) => ids.includes(r.id)).length;
}
