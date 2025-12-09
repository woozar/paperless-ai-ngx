# US-NAV-004: Header shows user info and navigation

| Field            | Value     |
| ---------------- | --------- |
| **Route**        | `/`       |
| **Permission**   | `user`    |
| **Precondition** | Logged in |
| **Test Data**    | -         |

**As a** logged-in user
**I want to** see my user info and navigation in the header
**so that** I can navigate the app and know who I'm logged in as

**Steps:**

1. Log in
2. Observe the header bar

**Expected Result:**

- App logo and name are displayed on the left
- Navigation links are shown (Dashboard, Paperless Instances, AI Providers, AI Bots)
- Admin-only links (Users, Settings) are visible only for admins
- User avatar with initials is displayed on the right
- Username is shown
- Logout button is visible
- GitHub link with version tooltip is present
- On mobile: Navigation collapses into a hamburger menu

**Status:** ✅ Implemented
