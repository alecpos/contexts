Here is the updated `AGENTS.md` including logic for dependency resolution. The `CodexRefactorExecutorAgent` is now enhanced to handle missing dependencies by either running `npm install` locally or searching GitHub for up-to-date implementations when type or utility definitions are ambiguous or missing.

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

| File                      | Purpose                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `migration-plan.json`     | Baseline migration targets with statuses (`migrate`, `refactor`, `delete`, `inline`) |
| `call-graph.json`         | Maps interdependencies between utilities and their consumers                         |
| `link-check-results.json` | Identifies Markdown documentation URLs and their validity for update analysis        |

---

## 🤖 Agent Responsibilities

### 1. `CodexAuditParserAgent`

Parses and indexes all input files into a consistent, cross-referenced structure:

* Maps function symbols to files and usages.
* Links `migration-plan.json` and `call-graph.json` data.
* Flags broken documentation URLs.

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

Generates a structured migration checklist per utility:

* Creates mappings for refactor/move/delete/inlining actions.
* Tags high-impact utilities used in many files.
* Lists required documentation and test artifacts.

Example:

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

Validates all Markdown docs across the repo using:

* `link-check-results.json` to flag broken URLs
* `migration-plan.json` to find outdated references
* `call-graph.json` to suggest where examples should be updated

Output: file patch suggestions or inline comments.

---

### 4. `CodexRefactorExecutorAgent`

Automates utility migration and test generation.

#### Responsibilities:

* **Creates Typed Refactor Scaffolds:** Emits new function definitions with inferred types from usage.
* **Scaffolds Co-located Tests:** Creates `*.test.ts` for each utility using Vitest/Jest style.
* **Injects JSDoc:** Adds documentation headers using symbols and context from call graphs.
* **Handles Dependency Issues:**

  * 🧪 **Missing Node Modules (local run):**
    If test execution fails due to missing packages, automatically run:

    ```bash
    npm install <missing-package>
    ```

  * 🔍 **Missing or Ambiguous Type/Helper:**
    If type definition or helper is not found:

    1. Search GitHub with query:

       ```
       <symbol name> in:file language:TypeScript repo:<target org> or stars:>100
       ```
    2. Fetch and parse latest version of the file containing the export.
    3. Validate signature and data shape.
    4. Import or adapt to local codebase.

Example behavior:

```json
{
  "dependencyResolution": {
    "attempts": [
      "npm install lodash.clonedeep",
      "github search: `slugify in:file language:ts`"
    ],
    "fallback": "log error and prompt for manual definition"
  }
}
```

---

## 🛡 Testing & Safety

Every emitted function must:

* Use strict typing with no `any`
* Have complete test coverage including edge cases
* Pass CI with all dependencies resolved
* Fail gracefully and log assertive messages

---

## ✅ Completion Tracker

| Task                                | Status |
| ----------------------------------- | ------ |
| Parse JSON input into ASTs          | ☐      |
| Generate all function plans         | ☐      |
| Check and fix doc references        | ☐      |
| Scaffold typed utilities + tests    | ☐      |
| Resolve missing packages or imports | ☐      |
| Validate and run all migrated tests | ☐      |

---

## 🧩 Developer Notes

* Every function must be "pure" and side-effect free unless explicitly documented.
* Prefer domain folders like `string/`, `object/`, `pricing/`, etc.
* JSDoc format must match `TSDoc` spec with `@param`, `@returns`, and `@example`.

---

## 📤 Final Output

* `utils/modular/` with migrated code
* Fully typed `*.ts` files and `*.test.ts`
* `*.codex-plan.json` audit trails
* Updated `.md` files with correct utility references
* Automated patch suggestions or PR metadata

---

Let me know if you'd like a GitHub Actions job runner or a CLI agent scaffold (`bin/codex-migrate`) to kick off each phase.
