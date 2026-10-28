<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { uniqueById, type Report } from '#lib/kb/causes';

  let { ticket, from = '2026-03-30', to = '2026-10-05' }: { ticket: number; from?: string; to?: string } = $props();

  const WEEK = 7 * 86_400_000;
  const day = (iso: string) => Date.parse(iso.slice(0, 10));

  // Received vs merged, per week (Monday to Sunday, the desk's weeks).
  const weeks = $derived.by(() => {
    const start = day(from);
    const count = Math.ceil((day(to) - start) / WEEK);
    const rows = Array.from({ length: count }, (_, i) => ({ at: start + i * WEEK, received: 0, merged: 0 }));
    const weekOf = (iso: string) => rows[Math.floor((day(iso) - start) / WEEK)];
    for (const r of uniqueById(reports as Report[])) {
      if (r.mergedInto !== ticket) continue;
      const rIn = weekOf(r.receivedAt);
      if (rIn) rIn.received++;
      const rMerged = r.mergedAt ? weekOf(r.mergedAt) : undefined;
      if (rMerged) rMerged.merged++;
    }
    return rows;
  });
  const max = $derived(Math.max(...weeks.flatMap((w) => [w.received, w.merged])));
  const label = (ms: number) => new Date(ms).toISOString().slice(5, 10);
  const h = (n: number) => (n / max) * 100;
</script>

<figure>
  <svg viewBox="0 0 {weeks.length * 24} 140" role="img" aria-label="reports received and merged into #{ticket}, per week">
    {#each weeks as w, i (w.at)}
      <rect class="in" x={i * 24 + 2} y={110 - h(w.received)} width="9" height={h(w.received)} />
      <rect class="merged" x={i * 24 + 12} y={110 - h(w.merged)} width="9" height={h(w.merged)} />
      {#if i % 4 === 0}<text x={i * 24 + 12} y="128">{label(w.at)}</text>{/if}
    {/each}
  </svg>
  <figcaption><span class="key in"></span> received · <span class="key merged"></span> merged into #{ticket} · per week</figcaption>
</figure>

<style>
  svg { width: 100%; max-width: 640px; }
  .in { fill: var(--warn); }
  .merged { fill: var(--accent); }
  text { font: 8px var(--mono); fill: var(--muted); text-anchor: middle; }
  figcaption { color: var(--muted); font-size: 0.85rem; }
  .key { display: inline-block; width: 0.7em; height: 0.7em; border-radius: 2px; }
  .key.in { background: var(--warn); }
  .key.merged { background: var(--accent); }
</style>
