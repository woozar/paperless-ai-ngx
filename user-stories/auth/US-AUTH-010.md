# US-AUTH-010: Forced password change

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| **Route**        | `/`                                               |
| **Permission**   | `user`                                            |
| **Precondition** | Logged in as user with `mustChangePassword: true` |
| **Test Data**    | User with initial password                        |

**As a** new user (with initial password)
**I want to** be forced to change my password
**so that** only I know my password

**Steps:**

1. Log in with a user who has `mustChangePassword: true`
2. Observe the redirect
3. Try to manually navigate to `/`

**Expected Result:**

- Automatic redirect to `/change-password` after login
- On manual navigation attempt: Redirect back to `/change-password`
- After successful password change: DB: `mustChangePassword` is set to `false`

**Status:** ✅ Implemented
