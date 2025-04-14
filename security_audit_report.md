# 🔐 Security Audit Report

**Application:** AggieSeek  
**Audited by:** Team 2 (John Ledet, Casey Nance, Maxim Mouget)  
**Date:** April 2025  

---

## ✅ Overview
This document provides a comprehensive security audit of the AggieSeek application, based on manual inspection of the code (specifically `route.ts` files), behavior observed from the browser console, and supplemental review of the final project PDF report.

The following vulnerabilities were identified, reproduced, and reviewed for severity and exploitability.

---

## ⚡ 1. SQL Injection
**File Affected:** `src/app/api/search/route.ts`  
**Endpoint:** `/api/search`

### 🔥 Exploit Summary:
- Input field `query` is passed directly into Prisma `findMany` without sanitization.
- Query payload like `"' OR 1=1 --"` returns 112,290 records.

### 🔧 Fix Recommendation:
- Use input validation schema (e.g., Zod) to sanitize and constrain `query`.
- Avoid interpolating raw user input in queries.

---

## ❌ 2. Broken Access Control
**File Affected:** `src/app/api/users/sections/route.ts`

### 🔥 Exploit Summary:
- While user session is checked, there is no deep authorization to confirm a user owns the record they attempt to delete.

### 🔧 Fix Recommendation:
- Ensure `userId` from session is always used to filter deletions.
- Add ownership validation at the start of any sensitive data mutation.

---

## ⚠️ 3. DOMException from Unhandled Input
**File Affected:** `src/app/api/search/route.ts`, `src/app/api/users/sections/route.ts`

### 🔥 Exploit Summary:
- Invalid or malformed input triggers JSON parsing errors on the frontend.
- Message: `DOMException: The operation was aborted.`

### 🔧 Fix Recommendation:
- Always return JSON from API responses (including errors).
- Frontend should verify `res.ok` before parsing `res.json()`.

---

## ⛔ 4. Resource Exhaustion / Denial of Service
**File Affected:** `src/app/api/search/route.ts`

### 🔥 Exploit Summary:
- No pagination or result limits.
- Query returns 112k+ results, causing potential DoS.

### 🔧 Fix Recommendation:
- Enforce hard limits (e.g., 100 rows max).
- Implement pagination (`take`, `skip` in Prisma).

---

## 🔐 5. Sensitive Data Exposure
**Files Possibly Affected:** Any user-related API route

### 🔥 Exploit Summary:
- Possibility of returning user objects in full, including emails, tokens, etc.
- Potential exposure of `myApp.token` in global browser scope previously noted.

### 🔧 Fix Recommendation:
- Use `.select` in Prisma to control exposed fields.
- Avoid exposing tokens or backend-only data in the frontend context.

---

## ❎ 6. Unauthorized Deletion
**File Affected:** `src/app/api/users/route.ts`, `src/app/api/users/sections/route.ts`

### 🔥 Exploit Summary:
- No confirmation prompts or second-step validation for account or section deletions.

### 🔧 Fix Recommendation:
- Add CSRF protection and/or secondary confirmation.
- Verify exact user ownership via `userId` scoping.

---

## 📣 Recommendations Summary
| Risk                      | Fix Status | Suggested Fix |
|---------------------------|------------|----------------|
| SQL Injection             | ❌ Open       | Validate + sanitize user input |
| Broken Access Control     | ❌ Open       | Match all records to `userId` |
| DOMException / Unhandled  | ⚠️ Partial   | Return valid JSON on error |
| Resource Exhaustion       | ❌ Open       | Limit + paginate results |
| Sensitive Data Exposure   | ⚠️ Likely   | Use `.select` and hide tokens |
| Unauthorized Deletion     | ❌ Open       | Confirm identity + intent |

---

## 🔧 Action Plan
- [ ] Refactor `/api/search` to sanitize `query` input
- [ ] Limit results to 100 max and add pagination
- [ ] Update `DELETE` logic to double-check userId ownership
- [ ] Audit all `res.json()` calls to prevent frontend errors
- [ ] Strip sensitive fields from any Prisma `find` operations
- [ ] Add logging + rate limiting (middleware)

---

## 📄 References
- [OWASP Top 10 2023](https://owasp.org/Top10/)
- [Prisma Secure Queries](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access)
- Team 2 Final Report PDF (April 2025)

---

**End of Audit Report**
