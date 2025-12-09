# US-ADMIN-021: Edit Paperless instance

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| **Route**        | `/admin/paperless-instances`        |
| **Permission**   | `admin`                             |
| **Precondition** | Logged in as admin, instance exists |
| **Test Data**    | `newName: "Updated Instance"`       |

**As an** admin
**I want to** edit a Paperless instance's details
**so that** I can update connection settings

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click edit icon next to instance
3. Modify name, API URL, or API token
4. Click "Save"

**Expected Result:**

- Dialog closes
- Instance list shows updated details
- DB: Instance record is updated

**Status:** ✅ Implemented
