# US-SETTINGS-001: View settings page

| Field            | Value              |
| ---------------- | ------------------ |
| **Route**        | `/admin/settings`  |
| **Permission**   | `admin`            |
| **Precondition** | Logged in as admin |
| **Test Data**    | -                  |

**As an** admin
**I want to** view all application settings
**so that** I can configure the application

**Steps:**

1. Log in as admin
2. Navigate to `/admin/settings`

**Expected Result:**

- Settings page is displayed
- All configurable settings are shown with current values
- Settings are grouped by category

**Status:** ✅ Implemented
