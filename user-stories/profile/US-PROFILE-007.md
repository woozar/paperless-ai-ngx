# US-PROFILE-007: Delete passkey

| Field            | Value                             |
| ---------------- | --------------------------------- |
| **Route**        | `/profile`                        |
| **Permission**   | `user`                            |
| **Precondition** | Logged in, has registered passkey |
| **Test Data**    | Existing passkey                  |

**As a** user
**I want to** delete a passkey
**so that** I can remove access from a lost or old device

**Steps:**

1. Navigate to `/profile`
2. In "Passkeys" section, click the menu button on a passkey
3. Select "Delete"
4. Confirm deletion in the confirmation dialog

**Expected Result:**

- Confirmation dialog shows passkey name
- After confirming:
  - Success toast: "Passkey deleted successfully"
  - Passkey is removed from the list
  - Deleted passkey can no longer be used for login

**Status:** ✅ Implemented
