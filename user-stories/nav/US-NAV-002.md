# US-NAV-002: Protected route without login - Home

| Field            | Value         |
| ---------------- | ------------- |
| **Route**        | `/`           |
| **Permission**   | `anonymous`   |
| **Precondition** | Not logged in |
| **Test Data**    | -             |

**As an** unauthenticated user
**I want to** be redirected to login
**so that** unauthorized access is prevented

**Steps:**

1. Make sure you are not logged in (e.g., in incognito mode)
2. Navigate directly to `/`

**Expected Result:**

- Redirect to `/login?redirect=%2F`
- Login form is displayed

**Status:** ✅ Implemented
