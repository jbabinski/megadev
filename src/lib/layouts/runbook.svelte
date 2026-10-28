<script lang="ts">
  import type { Snippet } from 'svelte';
  import { daysSince, isoDay, STALE_AFTER_DAYS, type Day } from '#lib/kb/staleness';

  // Every kb page: frontmatter in, the same frame out.
  let {
    title,
    owner,
    status,
    reviewed,
    children,
  }: { title: string; owner: string; status: string; reviewed: Day; children: Snippet } = $props();

  const age = $derived(daysSince(reviewed));
  const stale = $derived(age > STALE_AFTER_DAYS);
</script>

<svelte:head><title>{title} · support kb</title></svelte:head>

<div class="kb">
  <header>
    <a class="crumb" href="/kb">support desk · kb</a>
    <h1>{title}</h1>
    <p class="meta">
      <span>owner <b>{owner}</b></span>
      <span class="status {status}">{status}</span>
      <span class:stale>reviewed {isoDay(reviewed)} · {age} days ago{stale ? ' · stale' : ''}</span>
    </p>
  </header>
  {#if stale}
    <p class="banner">Nobody has re-read this page in {age} days. Check it against the live views before you rely on it.</p>
  {/if}
  <main>{@render children()}</main>
  <footer>Pages are written by people. Tables and charts are built from data at render time.</footer>
</div>

<style>
  :global(:root) {
    --bg: #fbfaf7; --fg: #1d1d1b; --muted: #6b6a66; --line: #e3e0d8;
    --accent: #2f6f5e; --warn: #b4501f; --warn-bg: #fbeee6; --note-bg: #eef5f2;
    --mono: ui-monospace, 'Cascadia Code', Menlo, monospace;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root) {
      --bg: #171716; --fg: #ecebe6; --muted: #9c9a93; --line: #34332f;
      --accent: #6fbfa6; --warn: #f0905d; --warn-bg: #3a2418; --note-bg: #1d2c27;
    }
  }
  :global(body) { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.6 system-ui, sans-serif; }
  :global(.kb table) { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.92rem; }
  :global(.kb th), :global(.kb td) { border-bottom: 1px solid var(--line); padding: 0.35rem 0.5rem; text-align: left; }
  :global(.kb code) { font-family: var(--mono); font-size: 0.88em; }
  :global(.kb a) { color: var(--accent); }
  .kb { max-width: 760px; margin: 0 auto; padding: 2rem 16px 4rem; }
  .crumb { font: 0.8rem var(--mono); text-decoration: none; color: var(--muted); }
  h1 { margin: 0.25rem 0 0.5rem; line-height: 1.2; }
  .meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; color: var(--muted); font-size: 0.85rem; margin: 0; }
  .status { border: 1px solid var(--line); border-radius: 99px; padding: 0 0.6rem; }
  .stale { color: var(--warn); font-weight: 600; }
  .banner { background: var(--warn-bg); color: var(--warn); padding: 0.6rem 1rem; border-radius: 6px; }
  footer { margin-top: 3rem; color: var(--muted); font-size: 0.8rem; border-top: 1px solid var(--line); padding-top: 1rem; }
</style>
