# US-AUTH-006: Change password - Success

| Field            | Value                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **Route**        | `/change-password`                                                                            |
| **Permission**   | `user`                                                                                        |
| **Precondition** | Logged in as testuser                                                                         |
| **Test Data**    | `currentPassword: "oldPass123"`, `newPassword: "newPass456"`, `confirmPassword: "newPass456"` |

**As an** authenticated user
**I want to** change my password
**so that** I keep my account secure

**Steps:**

1. Log in and navigate to `/change-password`
2. Enter current password in the "Current Password" field
3. Enter new password in the "New Password" field
4. Enter new password again in the "Confirm Password" field
5. Click the "Change Password" button

**Expected Result:**

- Success message is displayed
- Redirect to `/`
- DB: User password hash has changed
- Login with new password succeeds

**Status:** ✅ Implemented
