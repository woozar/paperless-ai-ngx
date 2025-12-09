# US-ADMIN-009: Cannot demote last admin

| Field            | Value                            |
| ---------------- | -------------------------------- |
| **Route**        | `/admin/users`                   |
| **Permission**   | `admin`                          |
| **Precondition** | Logged in as the only admin user |
| **Test Data**    | -                                |

**As an** admin (last admin)
**I want to** be prevented from demoting or deactivating myself
**so that** the system always has at least one admin

**Steps:**

1. Navigate to `/admin/users`
2. Try to change own role to "User" or suspend self

**Expected Result:**

- Error message "Cannot modify the last admin user"
- Action is rejected

**Status:** ✅ Implemented
