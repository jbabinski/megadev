// Where a report comes from: its tenant, with the locale they write dates in and the booking form
// they run. Intake never looks this up.
import type { Report, Tenant } from '#lib/kb/causes';

// The desk's tenant directory, one file per tenant.
const tenants = Object.values(import.meta.glob<Tenant>('/src/lib/data/tenants/*.json', { eager: true, import: 'default' }));

const byHandle = new Map(tenants.map((t) => [t.handle, t] as const));

export function tenantOf(r: Pick<Report, 'tenant'>): Tenant | undefined {
  return byHandle.get(r.tenant);
}

// Every tenant on file, by handle.
export const tenantHandles = (): string[] => [...byHandle.keys()].sort();
