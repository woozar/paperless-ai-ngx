# US-ADMIN-026: View and manage processing queue

| Field            | Value                                                 |
| ---------------- | ----------------------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/queue`               |
| **Permission**   | `admin` or instance owner                             |
| **Precondition** | Logged in, Paperless instance exists, queue not empty |
| **Test Data**    | Queue items with different statuses                   |

**As an** admin or instance owner
**I want to** view and manage the processing queue for my Paperless instance
**so that** I can monitor which documents are being processed and their status

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click "Queue" button on an instance row
3. View queue page with status filters and queue items table

**Expected Result:**

- Queue page shows stats cards (Pending, Processing, Completed, Failed counts)
- Table displays queue items with columns:
  - Document title (or ID if title unavailable)
  - Status badge (color-coded)
  - AI Bot name
  - Attempts (e.g., "2/3")
  - Scheduled time
  - Actions (Retry/Delete button)
- Status filter tabs: All, Pending, Processing, Failed, Completed
- Clicking a filter tab updates the table
- Empty state shown when no items match filter
- Back button navigates to instances list

**Status:** ✅ Implemented
