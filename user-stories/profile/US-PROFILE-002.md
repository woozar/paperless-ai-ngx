# US-PROFILE-002: Change theme

| Field            | Value                      |
| ---------------- | -------------------------- |
| **Route**        | `/profile`                 |
| **Permission**   | `user`                     |
| **Precondition** | Logged in, on profile page |
| **Test Data**    | -                          |

**As a** user
**I want to** change the application theme
**so that** I can use the application in light or dark mode

**Steps:**

1. Navigate to `/profile`
2. In the "Appearance" section, select a theme option:
   - Light
   - Dark
   - System (follows OS preference)

**Expected Result:**

- Theme changes immediately
- Selected theme is persisted in local storage
- Theme persists across page reloads and sessions

**Status:** ✅ Implemented
