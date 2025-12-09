# US-DOC-004: View AI analysis result

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/documents` |
| **Permission**   | `user`                                      |
| **Precondition** | Document has been analyzed                  |
| **Test Data**    | Processed document with analysis result     |

**As a** user
**I want to** view the AI analysis result
**so that** I can see what changes the AI suggests

**Steps:**

1. Navigate to the documents page
2. Click the "View Result" button next to a processed document

**Expected Result:**

- Dialog opens showing:
  - Processing date and AI provider
  - Token usage
  - Suggested changes (title, correspondent, document type, tags)
  - Tool calls made during analysis

**Status:** ✅ Implemented
