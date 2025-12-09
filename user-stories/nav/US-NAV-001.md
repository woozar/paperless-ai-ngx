# US-NAV-001: Display home dashboard

| Field            | Value                 |
| ---------------- | --------------------- |
| **Route**        | `/`                   |
| **Permission**   | `user`                |
| **Precondition** | Logged in as testuser |
| **Test Data**    | -                     |

**As an** authenticated user
**I want to** see an overview page
**so that** I can quickly grasp the most important information

**Steps:**

1. Log in
2. Navigate to `/`

**Expected Result:**

- Dashboard page is displayed
- Cards for "Auto Processing", "Document Queue", "Configuration" are visible
- Navigation links to Dashboard, Documents, Settings are present

**Status:** ✅ Implemented
