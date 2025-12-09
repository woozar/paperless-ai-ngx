# US-ADMIN-010: Non-admin cannot access user management

| Field            | Value                       |
| ---------------- | --------------------------- |
| **Route**        | `/admin/users`              |
| **Permission**   | `user`                      |
| **Precondition** | Logged in as non-admin user |
| **Test Data**    | -                           |

**As a** regular user
**I want to** be prevented from accessing admin pages
**so that** only admins can manage users

**Steps:**

1. Log in as a non-admin user
2. Navigate directly to `/admin/users`

**Expected Result:**

- Redirect to `/` (home)
- No access to user management

**Status:** ✅ Implemented
