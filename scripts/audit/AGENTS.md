# AGENTS – Audit Scripts

Scripts in this folder generate code audit reports, call graphs and link checks. Run `npm run audit` to produce a new report in `.audit-history`. Avoid committing large intermediate files outside of that directory and keep dependencies minimal. The `endpoint-trace.ts` script resolves all API endpoints reachable from each TypeScript file by analyzing `call-graph.json`.
