# US-PROFILE-005: Register new passkey

| Field            | Value                                                 |
| ---------------- | ----------------------------------------------------- |
| **Route**        | `/profile`                                            |
| **Permission**   | `user`                                                |
| **Precondition** | Logged in, on profile page, browser supports WebAuthn |
| **Test Data**    | -                                                     |

**As a** user
**I want to** register a new passkey
**so that** I can log in without a password

**Steps:**

1. Navigate to `/profile`
2. In "Passkeys" section, click "Add Passkey"
3. Complete browser's WebAuthn registration prompt (fingerprint, Face ID, security key, etc.)

**Expected Result:**

- Browser shows WebAuthn registration prompt
- After successful registration:
  - Success toast: "Passkey registered successfully"
  - New passkey appears in the list
  - Passkey can be used for login

**Error Cases:**

- User cancels registration: No error, dialog closes
- WebAuthn not supported: Button disabled with tooltip

**Status:** ✅ Implemented
