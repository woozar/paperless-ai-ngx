# US-AUTH-001: Login with valid credentials

| Field            | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| **Route**        | `/login`                                               |
| **Permission**   | `user`                                                 |
| **Precondition** | Not logged in, user exists and is active               |
| **Test Data**    | `username: "testuser"`, `password: "validPassword123"` |

**As a** user
**I want to** log in with username and password
**so that** I can access the application

**Steps:**

1. Navigate to `/login`
2. Enter username in the "Username" field
3. Enter password in the "Password" field
4. Click the "Login" button

**Expected Result:**

- Redirect to `/` (Home)
- Dashboard is displayed

**Status:** ✅ Implemented
