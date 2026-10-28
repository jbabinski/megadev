# MEGA.dev S01E03 — #4471

This repository contains the support knowledge-base export, two tickets for the
date problems in #4471, and a signed page that counts them from the exported data.

## Deliverables

- [Signed kb page (.svx)](./src/routes/kb/incidents/4471-date-causes/+page.svx)
- [Rendered page (.html)](./4471-date-causes.html)
- [Full-page screenshot](./rendered/4471-date-causes.png)
- [Parser ticket: 379 reports](https://github.com/jbabinski/megadev-s01e03/issues/1)
- [Booking-v3 hint ticket: 33 reports](https://github.com/jbabinski/megadev-s01e03/issues/2)

The page computes the 412 unique report count and its two cause groups from the
kb export. Its one-day-move footnote follows the export's classifier, which files
those five reports under `parser`.

The standalone HTML is generated from the `.svx` source, the kb layout, and
components. To rebuild with Node.js 22.12 or later:

```sh
npm ci
npm run check
npm run build
```

The rendered file is generated at the repository root.

---

# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.
