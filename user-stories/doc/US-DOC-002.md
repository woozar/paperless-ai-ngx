# US-DOC-002: Filter documents by processing status

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/documents` |
| **Permission**   | `user`                                      |
| **Precondition** | Documents exist with different statuses     |
| **Test Data**    | Mix of processed and unprocessed documents  |

**As a** user
**I want to** filter documents by their processing status
**so that** I can focus on unprocessed documents

**Steps:**

1. Navigate to the documents page
2. Click the "All", "Unprocessed", or "Processed" tab

**Expected Result:**

- "All" shows all documents
- "Unprocessed" shows only documents without AI analysis
- "Processed" shows only documents with AI analysis
- Document count updates accordingly

**Status:** ✅ Implemented
