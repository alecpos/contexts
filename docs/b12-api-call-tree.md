# B12 Injection Call Tree

This document cross references `b12-injection-flow.md` with `migration-plan.json` and `call-graph.json` to surface every imported module reachable from the root API calls used in the B12 intake flow.

Run the helper script with:

```bash
npx ts-node scripts/analysis/crossRef.ts
```

It outputs `docs/b12-api-modules.json` which lists, for each function referenced in the flow docs, all modules it calls (recursively) according to `call-graph.json`.

