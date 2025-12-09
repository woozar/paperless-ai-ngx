# US-AUTH-002: Login with invalid credentials

| Field            | Value                                               |
| ---------------- | --------------------------------------------------- |
| **Route**        | `/login`                                            |
| **Permission**   | `anonymous`                                         |
| **Precondition** | Not logged in                                       |
| **Test Data**    | `username: "testuser"`, `password: "wrongPassword"` |

**As a** user
**I want to** see an error message when my credentials are wrong
**so that** I know I made a typo

**Steps:**

1. Navigate to `/login`
2. Enter username
3. Enter wrong password
4. Click the "Login" button

**Expected Result:**

- Error message is displayed (text contains "invalid")
- No redirect, user stays on `/login`

**Status:** ✅ Implemented
