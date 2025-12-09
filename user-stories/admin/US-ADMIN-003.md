# US-ADMIN-003: Edit user

| Field            | Value                                     |
| ---------------- | ----------------------------------------- |
| **Route**        | `/admin/users`                            |
| **Permission**   | `admin`                                   |
| **Precondition** | Logged in as admin, test user exists      |
| **Test Data**    | `newUsername: "renameduser"`, role: Admin |

**As an** admin
**I want to** edit a user's details
**so that** I can update their information

**Steps:**

1. Navigate to `/admin/users`
2. Click edit icon next to user
3. Change username and/or role
4. Click "Save"

**Expected Result:**

- Dialog closes
- User list shows updated username/role
- DB: User record is updated

**Status:** ✅ Implemented
