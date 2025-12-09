# US-SETTINGS-002: Edit settings

| Field            | Value                |
| ---------------- | -------------------- |
| **Route**        | `/admin/settings`    |
| **Permission**   | `admin`              |
| **Precondition** | Logged in as admin   |
| **Test Data**    | Setting value change |

**As an** admin
**I want to** edit application settings
**so that** I can customize the application behavior

**Steps:**

1. Navigate to `/admin/settings`
2. Modify a setting value
3. Save changes

**Expected Result:**

- Success notification is shown
- Setting is updated
- DB: Setting value is persisted

**Status:** ✅ Implemented
