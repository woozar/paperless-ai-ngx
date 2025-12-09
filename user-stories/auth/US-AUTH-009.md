# US-AUTH-009: Change password - Wrong current password

| Field            | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| **Route**        | `/change-password`                                              |
| **Permission**   | `user`                                                          |
| **Precondition** | Logged in as testuser                                           |
| **Test Data**    | `currentPassword: "wrongPassword"`, `newPassword: "newPass456"` |

**As a** user
**I want to** see an error when my current password is wrong
**so that** I can correct it

**Steps:**

1. Log in and navigate to `/change-password`
2. Enter wrong current password
3. Enter valid new password in both fields
4. Click the "Change Password" button

**Expected Result:**

- Error message "current password is incorrect" is displayed
- No redirect
- DB: User password hash has NOT changed

**Status:** ✅ Implemented
