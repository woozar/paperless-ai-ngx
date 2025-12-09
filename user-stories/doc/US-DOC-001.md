# US-DOC-001: View documents of a Paperless instance

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/documents`        |
| **Permission**   | `user` (owner or shared access to instance)        |
| **Precondition** | Logged in, instance exists with imported documents |
| **Test Data**    | Instance with documents imported                   |

**As a** user
**I want to** see all documents from a Paperless instance
**so that** I can manage and analyze them

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click the "Documents" link/button for an instance

**Expected Result:**

- Document list page is displayed
- Table shows: Title, Status, Imported At, Actions
- Documents are paginated
- Back button to return to instances list

**Status:** ✅ Implemented
