# US-AUTH-008: Change password - Password too short

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Route**        | `/change-password`                                 |
| **Permission**   | `user`                                             |
| **Precondition** | Logged in as testuser                              |
| **Test Data**    | `newPassword: "short"`, `confirmPassword: "short"` |

**As a** user
**I want to** see an error when the password is too short
**so that** I choose a secure password

**Steps:**

1. Log in and navigate to `/change-password`
2. Enter current password
3. Enter "short" (less than 8 characters) in both new password fields
4. Click the "Change Password" button

**Expected Result:**

- Error message "at least 8 characters" is displayed
- No redirect
- DB: User password hash has NOT changed

**Status:** ✅ Implemented
