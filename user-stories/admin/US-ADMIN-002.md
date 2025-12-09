# US-ADMIN-002: Create new user

| Field            | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Route**        | `/admin/users`                                               |
| **Permission**   | `admin`                                                      |
| **Precondition** | Logged in as admin                                           |
| **Test Data**    | `username: "newuser"`, `password: "password123"`, role: User |

**As an** admin
**I want to** create a new user account
**so that** new users can access the application

**Steps:**

1. Navigate to `/admin/users`
2. Click "Create User" button
3. Fill in username, password, and select role
4. Click "Create User" in dialog

**Expected Result:**

- Dialog closes
- New user appears in the list
- DB: User has `mustChangePassword: true`
- New user can log in with the provided credentials

**Status:** ✅ Implemented
