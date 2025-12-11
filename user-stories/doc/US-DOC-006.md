# US-DOC-006: Preview document with PDF viewer

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/documents` |
| **Permission**   | `user`                                      |
| **Precondition** | Document exists in the instance             |
| **Test Data**    | Document with PDF content                   |

**As a** user
**I want to** preview a document directly in the application
**so that** I can view its content without leaving the page

**Steps:**

1. Navigate to the documents page
2. Click the "Preview" button next to a document

**Expected Result:**

- Modal opens with embedded PDF viewer
- PDF content is displayed
- User can scroll through pages
- Close button to dismiss the preview

**Status:** Implemented
