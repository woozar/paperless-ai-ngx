# US-ADMIN-005: Suspend user

| Field            | Value                                  |
| ---------------- | -------------------------------------- |
| **Route**        | `/admin/users`                         |
| **Permission**   | `admin`                                |
| **Precondition** | Logged in as admin, active user exists |
| **Test Data**    | -                                      |

**As an** admin
**I want to** suspend a user account
**so that** they can no longer access the application

**Steps:**

1. Navigate to `/admin/users`
2. Click suspend icon (ban) next to an active user

**Expected Result:**

- User's status badge changes to "Suspended"
- User can no longer log in
- Login attempt shows "account suspended" error

**Status:** ✅ Implemented
