# Project Documentation Analysis

This document summarizes the Markdown files and external links found in the repository.

## Documentation Inventory

- Total Markdown files scanned (excluding `node_modules`): **48**
- Key documentation directories:
  - `docs/` – general guides and Stripe references
  - `services/` – service module docs
  - `providers/` – provider usage docs
  - Root `README.md` and `AGENTS.md`

## External Links Overview

A quick scan detected **2463** external links across all docs. The most common domains were:

| Domain | Count |
|-------|------|
| `docs.stripe.com` | 1345 |
| `registry.npmjs.org` | 558 |
| `api.stripe.com` | 303 |
| `stripe.com` | 24 |
| `dashboard.stripe.com` | 21 |
| `support.stripe.com` | 19 |
| `example.com` | 14 |
| `en.wikipedia.org` | 6 |

A sample check of 50 random URLs returned **36** OK (200) responses, **6** unauthorized (401), and **6** not found (404). Broken links were mostly older Stripe docs that have moved.

## Database Dump

The file `SupabaseFullDump.csv` contains **312** `CREATE TABLE` statements spanning multiple schemas. The largest schemas are `node_prod` (142 tables) and `public` (97 tables). Other schemas include `_rudderstack`, `auth`, `storage`, and `pgsodium`.

## Utility Directory

`utils/unvalidatedUtils/` contains over 240 TypeScript files across folders like `actions/`, `functions/`, `classes/`, and `hooks/`. Many utilities overlap in purpose and are difficult to discover. A clear migration path is required to reduce technical debt.

## Recommended Actions

1. **Refactor utilities** – Move validated and reusable functions from `utils/unvalidatedUtils/` into a new `utils/modular/` directory. Organize by purpose (e.g., `dates/`, `strings/`, `supabase/`). Each module should expose well-typed helpers with tests.
2. **Documentation cleanup** – Update outdated Stripe links and replace references to removed pages. Prioritize files with high link counts such as:
   - `docs/stripe/api/error-handling/advanced-error-handling.md`
   - `docs/stripe/api/payment_intents/update.md`
3. **Link verification automation** – Add a CI script (`npm run check:links`) to validate URLs in documentation. Fail the pipeline if any links respond with status >=400.
4. **Stripe alignment** – Cross‑check guides with the latest Stripe docs for API keys, webhooks, testing tokens, and security advice.

