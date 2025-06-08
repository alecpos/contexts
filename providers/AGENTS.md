# 🏦 Providers Directory Agents

**Last Updated:** 2024-03-19
**Maintainer:** Engineering Team
**Status:** Active
**Scope:** Provider agents responsible for integrating third-party services and managing their lifecycle.

---

## 🎯 Objective

Manage and coordinate integrations with external services (like Stripe) while ensuring proper error handling, type safety, and environment-specific behavior.

---

## 🤖 Provider Agents

### 1. `StripeProviderAgent`

Manages Stripe integration lifecycle and operations.

**Responsibilities:**
- Customer management (create, update, delete)
- Payment method handling
- Subscription lifecycle
- Payment intent processing
- Environment validation (test vs production keys)

**Key Features:**
- Server-side only execution
- Environment-aware key validation
- Comprehensive error handling
- Type-safe API interactions

**Security Checks:**
- Validates STRIPE_SK presence
- Enforces production key usage in production
- Prevents client-side execution

---

## ✅ Provider Requirements

| Requirement | Status |
|------------|--------|
| Environment variable validation | ✅ |
| Server-side execution enforcement | ✅ |
| Production key validation | ✅ |
| Type safety | ✅ |
| Error handling | ✅ |
| Test coverage | ✅ |

---

## 🔧 Implementation Notes

- Providers must be server-side only
- Environment variables must be properly typed
- Test keys are prohibited in production
- All operations must be properly error-handled
- Comprehensive test coverage required

---

## 📤 Output Formats

Each provider should:
- Export a typed provider component
- Include comprehensive test suite
- Document environment requirements
- Provide clear error messages 