# US-AUTH-005: Login with redirect parameter

| Field            | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| **Route**        | `/login?redirect=/settings`                            |
| **Permission**   | `user`                                                 |
| **Precondition** | Not logged in, user exists and is active               |
| **Test Data**    | `username: "testuser"`, `password: "validPassword123"` |

**As a** user
**I want to** be redirected to the originally requested page after login
**so that** I don't have to navigate manually

**Steps:**

1. Navigate directly to `/login?redirect=/settings`
2. Enter valid credentials
3. Click the "Login" button

**Expected Result:**

- Redirect to `/settings` (not to `/`)

**Status:** ✅ Implemented
