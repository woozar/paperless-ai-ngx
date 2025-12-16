# US-PROFILE-006: Rename passkey

| Field            | Value                             |
| ---------------- | --------------------------------- |
| **Route**        | `/profile`                        |
| **Permission**   | `user`                            |
| **Precondition** | Logged in, has registered passkey |
| **Test Data**    | Existing passkey                  |

**As a** user
**I want to** rename a passkey
**so that** I can identify which device it belongs to

**Steps:**

1. Navigate to `/profile`
2. In "Passkeys" section, click the menu button on a passkey
3. Select "Rename"
4. Enter new name in the dialog
5. Click "Save"

**Expected Result:**

- Rename dialog opens with current name pre-filled
- After saving:
  - Success toast: "Passkey renamed successfully"
  - Passkey list shows updated name

**Status:** ✅ Implemented
