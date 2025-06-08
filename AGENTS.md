---

# 🧠 AGENTS.md — Utility Modernization & Modularization Playbook

**Last Updated:** 2025-06-08
**Maintainer:** Engineering Team
**Status:** In Progress
**Scope:** Migrate, validate, and modularize all utility functions from `utils/unvalidatedUtils/` to `utils/modular/`

---

## 🎯 Project Mission

Refactor and modernize all legacy utility logic into a clean, fully validated utility system organized under `utils/modular/`. This process addresses major tech debt originating from copy-pasted or unvetted functions that lack context, tests, or structure.

**Core Objectives:**

* Eliminate unvalidated or dead logic
* Improve traceability and usage visibility
* Enforce typed, composable utilities with focused domains
* Adopt test-driven utility development going forward

---

## 📦 Migration Scope

**Source:** `utils/unvalidatedUtils/`
**Destination:** `utils/modular/`

**Primary Issues Identified:**

* Lack of test coverage or validation guarantees
* Poor cohesion in utility responsibility
* Duplicated functionality with inconsistent names
* Silent failures and impure side effects

---

## 🧱 Utility Design System

### File System Conventions

```
utils/
└── modular/
    ├── string/
    ├── array/
    ├── date/
    ├── object/
    ├── validation/
    ├── url/
    ├── math/
    └── meta/
```

### Principles

1. **Single-responsibility**: One module, one job.
2. **Pure functions**: No side effects; all utils are deterministic.
3. **Named exports only**: No `default` exports.
4. **Typed**: Full TypeScript support, no `any` allowed.
5. **Composable**: Utility functions must work in isolation.
6. **Tests-first**: Every utility gets coverage and edge case testing.
7. **Docs inline**: Use `/** */` JSDoc-style comments for every function.

---

## 🔍 PHASE 1: Utility Inventory & Classification

| Step | Task                                                   |
| ---- | ------------------------------------------------------ |
| 1️⃣  | Enumerate all `.ts` files in `utils/unvalidatedUtils/` |
| 2️⃣  | Extract all exported function names                    |
| 3️⃣  | Classify each: `keep`, `refactor`, `delete`            |
| 4️⃣  | Map each to its target `utils/modular` folder          |
| 5️⃣  | Audit usage across codebase                            |

Example plan (output from audit script):

```json
[
  {
    "source": "utils/unvalidatedUtils/deepMerge.ts",
    "destination": "utils/modular/object/deepMerge.ts",
    "status": "refactor",
    "usedIn": ["supply-selection.tsx", "checkout/route.ts"]
  }
]
```

---

## 🔨 PHASE 2: Refactor & Rewrite

For each `keep` or `refactor` item:

* [ ] Move to a domain-based folder under `modular/`
* [ ] Rewrite in modern, idiomatic TypeScript
* [ ] Add a dedicated unit test file (prefer colocated `*.test.ts`)
* [ ] Document using JSDoc-style headers
* [ ] Replace all legacy import paths across the codebase

For each `delete` item:

* [ ] Remove safely with confirmation from static usage audit

Optional:

* Use `migration-plan.json` to track status for CI validation

---

## 🧪 PHASE 3: Validation and Testing

Minimum requirements for every utility:

* [ ] 100% unit test coverage
* [ ] Snapshot output for non-deterministic return values
* [ ] Edge case coverage for empty/null inputs
* [ ] Regression cases if utility previously caused a bug
* [ ] Tests must be colocated or discoverable by test runner

Suggested tools: `vitest`, `jest`, `uvu`, `tsd`

---

## 📘 PHASE 4: Documentation Integration

Each validated utility should be documented inline and optionally included in a `UTILS_CATALOG.md` index.

Format:

```ts
/**
 * Deeply merges two objects.
 * @param a First input object
 * @param b Second input object
 * @returns Combined object
 */
export function deepMerge<T extends object, U extends object>(a: T, b: U): T & U { ... }
```

---

## 🚧 PHASE 5: CI Integration & Regression Prevention

* [ ] Add lint rule to reject imports from `utils/unvalidatedUtils/`
* [ ] Add test to validate all utils have matching tests and JSDoc
* [ ] Optional: Add codemod to auto-migrate legacy import paths

---

## ✅ Completion Checklist

| Task                                  | Status |
| ------------------------------------- | ------ |
| All functions audited and categorized | ☐      |
| All functions rewritten or deleted    | ☐      |
| All legacy import paths removed       | ☐      |
| 100% utility test coverage            | ☐      |
| CI rules enforcing new structure      | ☐      |
| UTILS\_CATALOG.md updated             | ☐      |

---

## 🧠 Notes & Best Practices

* Prefer `const` declarations and return early
* If two utils differ only by parameter signature, unify via overloads
* Use TS generics where object types vary
* Avoid dependencies unless utility calls for it (e.g. date parsing)
* Do not export utilities that are overly specific to one domain — inline them instead

---

## 📤 Final Deliverables

* `utils/modular/` with clean, typed, and tested files
* `migration-plan.json` or migration summary table
* Updated documentation for all utilities
* Lint/test rules preventing regression into legacy patterns

---

Let the engineering team know when a function’s behavior is ambiguous or unused — ambiguity is a red flag and should be pruned or clarified before migration.
