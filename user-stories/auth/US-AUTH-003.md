# US-AUTH-003: Login with suspended account

| Field            | Value                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| **Route**        | `/login`                                                                     |
| **Permission**   | `user`                                                                       |
| **Precondition** | Not logged in                                                                |
| **Test Data**    | `username: "blockeduser"`, `password: "validPassword123"`, `isActive: false` |

**As a** suspended user
**I want to** see an error message
**so that** I know my account is suspended

**Steps:**

1. Navigate to `/login`
2. Enter username of the suspended user
3. Enter correct password
4. Click the "Login" button

**Expected Result:**

- Error message is displayed (text contains "suspended")
- No redirect, user stays on `/login`

**Status:** ✅ Implemented
