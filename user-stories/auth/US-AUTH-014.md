# US-AUTH-014: Passkey login with no registered passkeys

| Field            | Value                                 |
| ---------------- | ------------------------------------- |
| **Route**        | `/login`                              |
| **Permission**   | `user`                                |
| **Precondition** | Not logged in, no passkeys registered |
| **Test Data**    | -                                     |

**As a** user without registered passkeys
**I want to** attempt passkey login and see an appropriate message
**so that** I understand I need to register a passkey first

**Steps:**

1. Navigate to `/login`
2. Click the "Sign in with Passkey" button
3. Cancel the browser's WebAuthn prompt or no credentials available

**Expected Result:**

- Error toast shows "No passkey found. Please log in with your password."
- User remains on login page

**Status:** ✅ Implemented
