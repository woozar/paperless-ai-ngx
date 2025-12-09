# US-AUTH-011: Session persistence

| Field            | Value                 |
| ---------------- | --------------------- |
| **Route**        | `/`                   |
| **Permission**   | `user`                |
| **Precondition** | Logged in as testuser |
| **Test Data**    | -                     |

**As an** authenticated user
**I want to** stay logged in when I reload the page
**so that** I don't have to log in constantly

**Steps:**

1. Log in
2. Verify that dashboard is displayed
3. Reload the page (F5 or browser refresh)

**Expected Result:**

- User stays logged in
- Dashboard is displayed again (no redirect to `/login`)

**Status:** ✅ Implemented
