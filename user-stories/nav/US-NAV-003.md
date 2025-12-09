# US-NAV-003: Protected route without login - Settings

| Field            | Value         |
| ---------------- | ------------- |
| **Route**        | `/settings`   |
| **Permission**   | `anonymous`   |
| **Precondition** | Not logged in |
| **Test Data**    | -             |

**As an** unauthenticated user
**I want to** be redirected to login when accessing /settings
**so that** settings are protected

**Steps:**

1. Make sure you are not logged in
2. Navigate directly to `/settings`

**Expected Result:**

- Redirect to `/login?redirect=%2Fsettings`

**Status:** ✅ Implemented
