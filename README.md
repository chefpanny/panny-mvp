# Panny MVP prototype

Clickable, mobile-first prototype for user testing. Runs entirely in the browser on **sample data**; no server, accounts or network calls.

```bash
npm install
npm run dev      # http://localhost:3000 (regenerates CSS tokens first)
npm test         # unit tests: goal bar, plan, list, swap/move/skip/undo
```

- `design/` holds the source designs: the v2 screens, the README, the tokens and the component notes.
- `src/styles/tokens.css` is generated from `design/system/tokens.json` by `scripts/gen-tokens.mjs`. Don't edit it by hand.
- `src/data/` holds the goal config, the LDL-friendly thresholds (DRAFT, pending RD review), 12 sample recipes, 11 foods and the setup options.
- `src/lib/` holds the pure logic (`plan.ts`, `list.ts`, `amounts.ts`, `goalBar.ts`), the reducer, the store (`localStorage` key `panny:v1`) and the `track()` analytics stub (key `panny:events`).
- `/debug` is a hidden page that shows the event log and the state JSON, and has a Start over button.
