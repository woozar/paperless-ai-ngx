# US-ADMIN-028: Delete queue items

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Route**        | `/admin/paperless-instances/[id]/queue` |
| **Permission**   | `admin` or instance owner               |
| **Precondition** | Logged in, queue has items              |
| **Test Data**    | Queue items with various statuses       |

**As an** admin or instance owner
**I want to** delete queue items
**so that** I can clean up completed items or remove unwanted pending items

**Steps:**

**Delete Single Item:**

1. Navigate to `/admin/paperless-instances/[id]/queue`
2. Click "Delete" button (🗑 icon) on a queue item row
3. Confirm deletion in dialog

**Delete All Completed:**

1. Navigate to `/admin/paperless-instances/[id]/queue`
2. Click "Clear Completed" button in the toolbar (only visible when completed items exist)

**Expected Result:**

**Single Item:**

- Item is removed from the queue
- Cannot delete items with status "processing" (button disabled)
- Table updates to remove the deleted item
- Success toast "Item removed from queue" is shown

**Bulk Delete Completed:**

- All completed items are removed from queue
- Success toast shows "5 items deleted"
- Completed count in stats cards updates to 0
- Table refreshes to show remaining items
- Button disappears when no completed items remain

**Status:** ✅ Implemented
