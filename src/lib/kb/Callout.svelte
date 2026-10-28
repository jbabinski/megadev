<script lang="ts">
  import type { Snippet } from 'svelte';

  let { kind = 'note', children }: { kind?: 'note' | 'warn'; children: Snippet } = $props();
</script>

<aside class={kind}>{@render children()}</aside>

<style>
  aside { border-left: 4px solid var(--accent); padding: 0.5rem 1rem; margin: 1rem 0; background: var(--note-bg); }
  aside.warn { border-color: var(--warn); background: var(--warn-bg); }
</style>
