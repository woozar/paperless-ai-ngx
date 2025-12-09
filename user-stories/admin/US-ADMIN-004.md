# US-ADMIN-004: Reset user password

| Field            | Value                                |
| ---------------- | ------------------------------------ |
| **Route**        | `/admin/users`                       |
| **Permission**   | `admin`                              |
| **Precondition** | Logged in as admin, test user exists |
| **Test Data**    | `resetPassword: "newInitialPass123"` |

**As an** admin
**I want to** reset a user's password
**so that** they can regain access if they forgot their password

**Steps:**

1. Navigate to `/admin/users`
2. Click edit icon next to user
3. Enter new password in "Reset Password" field
4. Click "Save"

**Expected Result:**

- Dialog closes
- User's badge shows "Must Change Password"
- User can log in with new password
- User is redirected to `/change-password` after login

**Status:** ✅ Implemented
