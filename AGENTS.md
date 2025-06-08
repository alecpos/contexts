Here is your new `AGENTS.md` tailored to instruct Codex to parse and act on your audit results in a modular, centralized fashion, based on your original CODEX.md structure and the data provided in the `*.json` artifacts:

---

# 🧠 AGENTS.md — Autonomous Utility Migration Agents

**Last Updated:** 2025-06-08
**Maintainer:** Engineering Team
**Status:** Active
**Scope:** Codex agents responsible for parsing audit outputs and generating modular migration instructions across the utility layer.

---

## 🎯 Objective

Automate the ingestion, classification, and actionable migration steps from raw audit data (`call-graph.json`, `link-check-results.json`, `migration-plan.json`) to help ensure centralization, modularity, and maintainability in the `utils/modular/` refactor initiative.

---

## 📂 Input Files

The agents should ingest and normalize the following structured artifacts:

| File                      | Purpose                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `migration-plan.json`     | Baseline migration targets with statuses (`migrate`, `refactor`, `delete`, `inline`) |
| `call-graph.json`         | Maps interdependencies between utilities and their consumers                         |
| `link-check-results.json` | Identifies Markdown documentation URLs and their validity for update analysis        |

---

## 🤖 Agent Responsibilities

### 1. `CodexAuditParserAgent`

Parses and indexes all input files into a consistent, cross-referenced structure.

* Extracts symbols, file paths, usage contexts from `call-graph.json`
* Links source → target migration mappings from `migration-plan.json`
* Flags unreachable or broken documentation references from `link-check-results.json`

Output:

```ts
type ParsedAuditData = {
  symbol: string
  sourcePath: string
  destinationPath?: string
  migrationStatus: "migrate" | "refactor" | "delete" | "inline"
  usedIn?: string[]
  docsToUpdate?: string[]
  docURLsBroken?: string[]
}
```

---

### 2. `CodexMigrationPlannerAgent`

Synthesizes parsed data into clear action plans per file.

For each entry:

* If status = `refactor` or `migrate`, emit:

  * New file path (in `utils/modular/`)
  * JSDoc template stub
  * Required test file location
* If status = `delete` or unused in `call-graph.json`, emit:

  * `PRUNE CANDIDATE`
* Flag any utility used in multiple domains (`usedIn.length > 3`) for review

Output example:

```ts
{
  action: "refactor",
  path: "utils/modular/string/slugify.ts",
  needs: ["addTests", "rewriteWithTypes", "updateImports", "addJSDoc"],
  referencedBy: ["marketing/page.tsx"]
}
```

---

### 3. `CodexDocumentationAgent`

Correlates outdated utility references in `.md` files using:

* Broken links from `link-check-results.json`
* Deprecated function paths from `migration-plan.json`
* Symbol usage mapping from `call-graph.json`

Then recommends or optionally autogenerates:

* Inline doc updates
* URL rewrites
* Dead section removals (e.g., "Helper Functions (OLD)")

---

### 4. `CodexRefactorExecutorAgent`

This agent will auto-generate:

* New TS utility function stubs in `utils/modular/{domain}/`
* Associated `*.test.ts` scaffolds
* Inline JSDoc from usage inference
* Rewrite plan for imports across all `usedIn` sources

---

## ✅ Completion Targets

| Task                                                  | Status |
| ----------------------------------------------------- | ------ |
| Codex parses `*.json` files into normalized memory    | ☐      |
| All legacy utility files receive action plans         | ☐      |
| All `.md` references are checked & flagged for update | ☐      |
| All rewrite/import mappings are staged                | ☐      |
| New modular utilities follow typed, tested contract   | ☐      |

---

## 🔧 Agent Notes

* Prefer pure functions with no side effects
* Localize utilities into semantic domains (`string/`, `object/`, `dates/`)
* Codex should prioritize functions used >1x for preservation
* Codex should emit PR-ready patches for `refactor` and `migrate`
* Use call graph metadata for contextual rename suggestions

---

## 📤 Output Formats

Each agent should emit `*.codex-plan.json` artifacts (one per phase) and a final PR summary.

---

Let me know if you'd like Codex to emit patches, GitHub PR templates, or inline CLI-ready lint rules as part of output automation.
