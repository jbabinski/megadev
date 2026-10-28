<script lang="ts">
  import { daysSince, isoDay, STALE_AFTER_DAYS, type Day } from '#lib/kb/staleness';

  type Meta = { title: string; owner: string; status: string; reviewed: Day };
  const pages = import.meta.glob<{ metadata: Meta }>('/src/routes/kb/*/**/+page.svx', { eager: true });

  const rows = Object.entries(pages)
    .map(([path, mod]) => ({ href: path.replace('/src/routes', '').replace('/+page.svx', ''), ...mod.metadata }))
    .sort((x, y) => x.href.localeCompare(y.href));
</script>

<table>
  <thead><tr><th>page</th><th>owner</th><th>status</th><th>reviewed</th></tr></thead>
  <tbody>
    {#each rows as r (r.href)}
      <tr>
        <td><a href={r.href}>{r.title}</a></td>
        <td>{r.owner}</td>
        <td>{r.status}</td>
        <td class:stale={daysSince(r.reviewed) > STALE_AFTER_DAYS}>{isoDay(r.reviewed)}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .stale { color: var(--warn); font-weight: 600; }
</style>
