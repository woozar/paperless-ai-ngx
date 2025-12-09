# US-ADMIN-006: Activate suspended user

| Field            | Value                                     |
| ---------------- | ----------------------------------------- |
| **Route**        | `/admin/users`                            |
| **Permission**   | `admin`                                   |
| **Precondition** | Logged in as admin, suspended user exists |
| **Test Data**    | -                                         |

**As an** admin
**I want to** reactivate a suspended user
**so that** they can access the application again

**Steps:**

1. Navigate to `/admin/users`
2. Click activate icon (checkmark) next to a suspended user

**Expected Result:**

- User's status badge changes to "Active"
- User can log in again

**Status:** ✅ Implemented
