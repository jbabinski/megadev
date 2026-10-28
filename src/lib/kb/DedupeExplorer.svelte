<script lang="ts">
  import { DEDUPE_CASES } from '#lib/kb/dedupe-cases';
  import { causeOf, sameCause } from '#lib/kb/causes';
  import { tenantHandles, tenantOf } from '#lib/kb/locales';

  const CHANNELS = ['app', 'email', 'form'] as const;
  type Side = { tenant: string; channel: (typeof CHANNELS)[number]; subject: string };
  let a: Side = $state({ tenant: 'alder.physio', channel: 'form', subject: 'Booking on the wrong date' });
  let b: Side = $state({ tenant: 'kettle.books', channel: 'form', subject: 'Booking on the wrong date' });
  const same = (x: Side, y: Side) => sameCause(x, tenantOf(x), y, tenantOf(y));
</script>

<div class="try">
  {#each [a, b] as side, i (i)}
    <fieldset>
      <legend>report {i === 0 ? 'A' : 'B'}</legend>
      <select bind:value={side.tenant} aria-label="tenant">
        {#each tenantHandles() as handle (handle)}<option>{handle}</option>{/each}
      </select>
      <select bind:value={side.channel} aria-label="channel">
        {#each CHANNELS as channel (channel)}<option>{channel}</option>{/each}
      </select>
      <input bind:value={side.subject} aria-label="subject" />
      <code>{causeOf(side, tenantOf(side)) ?? 'no cause'}</code>
    </fieldset>
  {/each}
  <p class="verdict" class:dup={same(a, b)}>{same(a, b) ? 'same cause — merge' : 'different causes — keep apart'}</p>
</div>

<table>
  <thead><tr><th>case</th><th>same subject</th><th>same cause</th></tr></thead>
  <tbody>
    {#each DEDUPE_CASES as c (c.why)}
      <tr>
        <td>{c.why}</td>
        <td>{c.a.subject === c.b.subject ? 'yes' : 'no'}</td>
        <td class:dup={same(c.a, c.b)}>{same(c.a, c.b) ? 'yes' : 'no'}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .try { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin: 1rem 0; }
  fieldset { display: grid; gap: 0.4rem; border: 1px solid var(--line); border-radius: 6px; }
  .verdict { grid-column: 1 / -1; margin: 0; font-weight: 600; color: var(--muted); }
  .dup { color: var(--accent); font-weight: 600; }
</style>
