# US-AUTH-013: Passkey login not supported

| Field            | Value                             |
| ---------------- | --------------------------------- |
| **Route**        | `/login`                          |
| **Permission**   | `user`                            |
| **Precondition** | Browser does not support WebAuthn |
| **Test Data**    | -                                 |

**As a** user on an older browser
**I want to** see that passkey login is not available
**so that** I know to use password login instead

**Steps:**

1. Navigate to `/login` on a browser without WebAuthn support

**Expected Result:**

- "Sign in with Passkey" button is disabled
- Tooltip shows "Passkeys are not supported on this device"

**Status:** ✅ Implemented
