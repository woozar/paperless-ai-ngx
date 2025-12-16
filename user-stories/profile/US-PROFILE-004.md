# US-PROFILE-004: View registered passkeys

| Field            | Value                         |
| ---------------- | ----------------------------- |
| **Route**        | `/profile`                    |
| **Permission**   | `user`                        |
| **Precondition** | Logged in, on profile page    |
| **Test Data**    | User with registered passkeys |

**As a** user
**I want to** see all my registered passkeys
**so that** I know which devices can log in to my account

**Steps:**

1. Navigate to `/profile`
2. Scroll to "Passkeys" section

**Expected Result:**

- List of registered passkeys is displayed
- Each passkey shows:
  - Name (or "Passkey" if unnamed)
  - Registration date
  - Last used date
  - Device type indicator (single device / multi-device)
- "Add Passkey" button is visible

**Empty State:**

- If no passkeys registered: "No passkeys registered yet" message shown

**Status:** ✅ Implemented
