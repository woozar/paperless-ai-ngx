# US-ADMIN-018: Delete AI bot

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Route**        | `/admin/ai-bots`               |
| **Permission**   | `admin`                        |
| **Precondition** | Logged in as admin, bot exists |
| **Test Data**    | -                              |

**As an** admin
**I want to** delete an AI bot
**so that** I can remove unused bots

**Steps:**

1. Navigate to `/admin/ai-bots`
2. Click delete icon next to bot
3. Confirm deletion in dialog

**Expected Result:**

- Dialog closes
- Bot is removed from the list
- DB: Bot record is deleted

**Status:** ✅ Implemented
