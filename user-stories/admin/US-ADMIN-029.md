# US-ADMIN-029: Manually add document to processing queue

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/documents` |
| **Permission**   | `admin` or instance owner                   |
| **Precondition** | Logged in, Paperless instance has documents |
| **Test Data**    | Unprocessed documents in Paperless          |

**As an** admin or instance owner
**I want to** manually add a document to the processing queue
**so that** I can prioritize specific documents for AI analysis

**Steps:**

1. Navigate to `/admin/paperless-instances/[id]/documents`
2. Find an unprocessed document in the list
3. Click "Analyze" button on the document row
4. Select AI bot from dropdown (or use default)
5. Click "Start Analysis" in the dialog

**Expected Result:**

- Document is added to the processing queue with:
  - Status: "pending"
  - Priority: 10 (higher than auto-scanned documents at priority 0)
  - Selected AI bot or instance default
  - Scheduled for immediate processing
- Success toast "Document added to queue" is shown
- Document will be processed within 30 seconds
- Cannot add same document twice if already pending or processing
- Error toast "Document already in queue" if duplicate attempt

**Status:** ✅ Implemented
