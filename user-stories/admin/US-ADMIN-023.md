# US-ADMIN-023: Import documents from Paperless instance

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Route**        | `/admin/paperless-instances`            |
| **Permission**   | `admin`                                 |
| **Precondition** | Logged in as admin, instance configured |
| **Test Data**    | Instance with accessible documents      |

**As an** admin
**I want to** import documents from a Paperless instance
**so that** I can process them with AI

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click import icon next to instance
3. Wait for import to complete

**Expected Result:**

- Loading indicator shows during import
- Success toast shows number of imported documents
- DB: Documents are imported from Paperless

**Status:** ✅ Implemented
