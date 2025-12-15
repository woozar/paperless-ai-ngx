# US-ADMIN-027: Retry failed queue items

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/queue` |
| **Permission**   | `admin` or instance owner               |
| **Precondition** | Logged in, queue has failed items       |
| **Test Data**    | Queue items with status "failed"        |

**As an** admin or instance owner
**I want to** retry failed queue items
**so that** temporarily failed documents can be processed again

**Steps:**

**Single Item Retry:**

1. Navigate to `/admin/paperless-instances/[id]/queue`
2. Filter by "Failed" status
3. Click "Retry" button (↻ icon) on a failed item row

**Bulk Retry:**

1. Navigate to `/admin/paperless-instances/[id]/queue`
2. Click "Retry All Failed" button in the toolbar

**Expected Result:**

**Single Item:**

- Queue item status changes from "failed" to "pending"
- Attempts counter resets to "0/3"
- Last error is cleared
- Scheduled time is set to now
- Item will be processed by queue processor within 30 seconds
- Success toast "Item scheduled for retry" is shown

**Bulk Retry:**

- All failed items are reset to pending status
- Success toast shows "3 items scheduled for retry"
- Failed count in stats cards updates to 0
- Pending count increases accordingly

**Status:** ✅ Implemented
