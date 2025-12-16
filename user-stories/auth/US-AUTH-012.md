# US-AUTH-012: Login with passkey

| Field            | Value                                      |
| ---------------- | ------------------------------------------ |
| **Route**        | `/login`                                   |
| **Permission**   | `user`                                     |
| **Precondition** | Not logged in, user has registered passkey |
| **Test Data**    | User with registered WebAuthn credential   |

**As a** user
**I want to** log in with my passkey
**so that** I can access the application without typing a password

**Steps:**

1. Navigate to `/login`
2. Click the "Sign in with Passkey" button
3. Complete the browser's WebAuthn authentication prompt (fingerprint, Face ID, etc.)

**Expected Result:**

- Browser shows WebAuthn authentication prompt
- After successful authentication, redirect to `/` (Home)
- Dashboard is displayed

**Status:** ✅ Implemented
