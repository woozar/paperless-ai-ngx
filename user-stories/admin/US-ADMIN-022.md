# US-ADMIN-022: Delete Paperless instance with document count warning

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Route**        | `/admin/paperless-instances`                       |
| **Permission**   | `admin`                                            |
| **Precondition** | Logged in as admin, instance with documents exists |
| **Test Data**    | Instance with imported documents                   |

**As an** admin
**I want to** see a warning with document count before deleting an instance
**so that** I understand the impact of deletion

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click delete icon next to instance with documents
3. Observe warning message with document count
4. Confirm deletion

**Expected Result:**

- Delete dialog shows document count warning
- After confirmation: Instance and associated documents are removed
- DB: Instance and documents are deleted

**Status:** ✅ Implemented
