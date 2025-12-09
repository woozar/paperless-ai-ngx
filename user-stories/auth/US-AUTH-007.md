# US-AUTH-007: Change password - Passwords don't match

| Field            | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| **Route**        | `/change-password`                                              |
| **Permission**   | `user`                                                          |
| **Precondition** | Logged in as testuser                                           |
| **Test Data**    | `newPassword: "newPass456"`, `confirmPassword: "differentPass"` |

**As a** user
**I want to** see an error when passwords don't match
**so that** I know what to correct

**Steps:**

1. Log in and navigate to `/change-password`
2. Enter current password
3. Enter "newPass456" in the "New Password" field
4. Enter "differentPass" in the "Confirm Password" field
5. Click the "Change Password" button

**Expected Result:**

- Error message "Passwords don't match" is displayed
- No redirect
- DB: User password hash has NOT changed

**Status:** ✅ Implemented
