# US-ADMIN-007: Delete user

| Field            | Value                                     |
| ---------------- | ----------------------------------------- |
| **Route**        | `/admin/users`                            |
| **Permission**   | `admin`                                   |
| **Precondition** | Logged in as admin, deletable user exists |
| **Test Data**    | -                                         |

**As an** admin
**I want to** delete a user account
**so that** unused accounts are removed

**Steps:**

1. Navigate to `/admin/users`
2. Click delete icon next to user
3. Confirm deletion in dialog

**Expected Result:**

- Dialog closes
- User is removed from the list
- User can no longer log in

**Status:** ✅ Implemented
