# US-SETTINGS-003: Change theme (Light/Dark/System)

| Field            | Value             |
| ---------------- | ----------------- |
| **Route**        | `/admin/settings` |
| **Permission**   | `user`            |
| **Precondition** | Logged in         |
| **Test Data**    | -                 |

**As a** user
**I want to** switch between light, dark, and system theme
**so that** I can use the app in my preferred visual mode

**Steps:**

1. Navigate to `/admin/settings`
2. Find the "Appearance" section with "Theme" setting
3. Click the theme dropdown
4. Select "Light", "Dark", or "System"

**Expected Result:**

- Theme changes immediately upon selection
- "Light": App uses light color scheme
- "Dark": App uses dark color scheme
- "System": App follows OS/browser preference
- Setting persists across page reloads
- Setting is stored locally (no server sync)

**Status:** ✅ Implemented
