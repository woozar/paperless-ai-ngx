# US-PROFILE-003: Change password

| Field            | Value                                               |
| ---------------- | --------------------------------------------------- |
| **Route**        | `/profile`                                          |
| **Permission**   | `user`                                              |
| **Precondition** | Logged in, on profile page                          |
| **Test Data**    | Current password, new password meeting requirements |

**As a** user
**I want to** change my password
**so that** I can keep my account secure

**Steps:**

1. Navigate to `/profile`
2. In the "Security" section, fill in:
   - Current password
   - New password (min 8 characters)
   - Confirm new password
3. Click "Change Password" button

**Expected Result:**

- Success toast: "Password changed successfully"
- Form is cleared
- User can log in with new password

**Error Cases:**

- Wrong current password: Error toast shown
- Passwords don't match: Error toast shown
- New password too short: Error toast shown

**Status:** ✅ Implemented
