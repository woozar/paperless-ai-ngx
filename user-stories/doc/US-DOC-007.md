# US-DOC-007: Sort documents by column

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/documents` |
| **Permission**   | `user`                                      |
| **Precondition** | Multiple documents exist                    |
| **Test Data**    | Documents with different titles and dates   |

**As a** user
**I want to** sort documents by different columns
**so that** I can organize the document list to my needs

**Steps:**

1. Navigate to the documents page
2. Click on a column header (Title, Status, or Imported At)

**Expected Result:**

- Documents are sorted by the selected column
- Clicking again reverses the sort order
- Sort indicator shows current sort direction
- Sort persists while navigating pages

**Status:** Implemented
