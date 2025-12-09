# US-DOC-003: Analyze document with AI

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/documents` |
| **Permission**   | `user`                                      |
| **Precondition** | Document and AI bot exist                   |
| **Test Data**    | Unprocessed document, configured AI bot     |

**As a** user
**I want to** analyze a document using an AI bot
**so that** I can get suggestions for tags, correspondent, and document type

**Steps:**

1. Navigate to the documents page
2. Click the "Analyze" button next to a document
3. Select an AI bot from the dropdown
4. Click "Start Analysis"

**Expected Result:**

- Loading indicator shows during analysis
- Success message when analysis completes
- Document status changes to "Processed"
- Analysis result is stored

**Status:** ✅ Implemented
