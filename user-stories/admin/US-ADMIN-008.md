# US-ADMIN-008: Cannot delete self

| Field            | Value              |
| ---------------- | ------------------ |
| **Route**        | `/admin/users`     |
| **Permission**   | `admin`            |
| **Precondition** | Logged in as admin |
| **Test Data**    | -                  |

**As an** admin
**I want to** be prevented from deleting my own account
**so that** I don't accidentally lock myself out

**Steps:**

1. Navigate to `/admin/users`
2. Try to click delete icon next to own user

**Expected Result:**

- Delete button is disabled for own user
- Cannot delete self

**Status:** ✅ Implemented
