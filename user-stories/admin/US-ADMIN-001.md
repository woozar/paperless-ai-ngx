# US-ADMIN-001: View user list

| Field            | Value                            |
| ---------------- | -------------------------------- |
| **Route**        | `/admin/users`                   |
| **Permission**   | `admin`                          |
| **Precondition** | Logged in as admin               |
| **Test Data**    | Multiple users exist in database |

**As an** admin
**I want to** see a list of all users
**so that** I can manage user accounts

**Steps:**

1. Log in as admin
2. Navigate to `/admin/users`

**Expected Result:**

- Table with columns: Username, Role, Status, Created, Actions
- All users are listed
- Current user's status badge shows "Active" or "Suspended"

**Status:** ✅ Implemented
