import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const root = fileURLToPath(new URL('.', import.meta.url));

await build({
  root,
  configFile: false,
  resolve: { alias: { '#lib': `${root}src/lib` } },
  plugins: [
    svelte({
      extensions: ['.svelte', '.svx'],
      preprocess: mdsvex({
        extensions: ['.svx'],
        layout: { runbook: `${root}src/lib/layouts/runbook.svelte` },
      }),
    }),
  ],
  ssr: { noExternal: ['svelte'] },
  build: {
    ssr: 'render.mjs',
    outDir: '.build',
    ssrEmitAssets: true,
    cssCodeSplit: false,
  },
});

const { default: renderPage } = await import('./.build/render.js');
const { body, head } = renderPage();
const sourceBase = 'https://github.com/jbabinski/megadev-s01e03/blob/main/src/routes';
const kbLinks = [...body.matchAll(/href="(\/kb(?:\/[^"]*)?)"/g)];
for (const [, route] of kbLinks) {
  await readFile(`${root}src/routes${route}/+page.svx`, 'utf8');
}
const snapshotBody = body.replace(/href="(\/kb(?:\/[^"]*)?)"/g, (_, route) =>
  `href="${sourceBase}${route}/%2Bpage.svx"`,
);
const assets = await readdir(`${root}.build/assets`);
const styles = await Promise.all(
  assets.filter((name) => name.endsWith('.css')).map((name) => readFile(`${root}.build/assets/${name}`, 'utf8')),
);
assert.ok(styles.length > 0, 'The rendered page must include its component and layout styles');

const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${head}<style>${styles.join('\n')}</style></head>
<body>${snapshotBody}</body>
</html>
`;

assert.equal((html.match(/<!doctype html>/gi) ?? []).length, 1);
assert.equal((html.match(/<html\b/g) ?? []).length, 1);
assert.equal((html.match(/desk ref/g) ?? []).length, 1);
assert.match(html, /DR-97K1-GKHT/);
assert.match(body, /<strong>412<\/strong>/);
assert.match(body, /<strong>2<\/strong>/);
assert.match(body, /<td\b[^>]*>379<\/td>/);
assert.match(body, /<td\b[^>]*>33<\/td>/);
assert.match(body, /<td\b[^>]*>11<\/td>/);
assert.match(body, /<td\b[^>]*>3<\/td>/);
assert.match(body, /<code>parser<\/code>[\s\S]*?<td\b[^>]*>#1<\/td>/);
assert.match(body, /<code>hint<\/code>[\s\S]*?<td\b[^>]*>#2<\/td>/);
assert.match(body, /5 reports read as a one-day move/);
assert.match(body, /hint ×23/);
assert.match(body, /parser ×15/);
assert.match(body, /closed as completed/);
assert.match(body, /closed as not planned/);
assert.doesNotMatch(body, /no ticket of its own|no desk ref/);
assert.doesNotMatch(body, /<tr class="wrong/);
assert.doesNotMatch(html, /href="\/kb(?:\/|")/);
for (const [, route] of kbLinks) {
  assert.ok(html.includes(`href="${sourceBase}${route}/%2Bpage.svx"`));
}

await writeFile(`${root}4471-date-causes.html`, html);
console.log('Verified actual mdsvex/Svelte render: 412 reports, 379 parser, 33 hint, signed once.');
