# US-PROFILE-001: View profile page

| Field            | Value      |
| ---------------- | ---------- |
| **Route**        | `/profile` |
| **Permission**   | `user`     |
| **Precondition** | Logged in  |
| **Test Data**    | -          |

**As a** user
**I want to** view my profile page
**so that** I can manage my account settings

**Steps:**

1. Log in to the application
2. Click on username in the header
3. Select "Profile" from the dropdown menu

**Expected Result:**

- Profile page is displayed with sections:
  - Appearance (theme settings)
  - Security (change password)
  - Passkeys (manage passkeys)

**Status:** ✅ Implemented
