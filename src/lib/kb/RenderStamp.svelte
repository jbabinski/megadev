<script lang="ts">
  import { deskRef } from '#lib/kb/desk-ref';

  // Pass the page's frontmatter signature: <RenderStamp {signature} />
  let { signature }: { signature?: string } = $props();

  const ref = $derived(signature ? deskRef(signature) : null);
</script>

{#if ref}
  <p class="stamp">desk ref <b>{ref}</b></p>
{:else}
  <p class="stamp missing">no desk ref: this page isn't signed (no <code>signature</code> in its frontmatter)</p>
{/if}

<style>
  .stamp { margin: 2rem 0 0; font: 0.85rem var(--mono); color: var(--muted); }
  .stamp b { color: var(--accent); letter-spacing: 0.04em; }
  .missing { color: var(--warn); }
</style>
