# US-DOC-008: Search documents by title

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/documents` |
| **Permission**   | `user`                                      |
| **Precondition** | Multiple documents exist                    |
| **Test Data**    | Documents with different titles             |

**As a** user
**I want to** search documents by title
**so that** I can quickly find specific documents

**Steps:**

1. Navigate to the documents page
2. Enter a search term in the search input field

**Expected Result:**

- Document list filters to show only matching documents
- Search is case-insensitive
- Partial matches are included
- Document count updates to reflect filtered results
- Clearing the search shows all documents again

**Status:** Implemented
