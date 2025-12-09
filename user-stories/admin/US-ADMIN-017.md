# US-ADMIN-017: Edit AI bot

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Route**        | `/admin/ai-bots`               |
| **Permission**   | `admin`                        |
| **Precondition** | Logged in as admin, bot exists |
| **Test Data**    | `newName: "Updated Bot"`       |

**As an** admin
**I want to** edit an AI bot's details
**so that** I can update configuration

**Steps:**

1. Navigate to `/admin/ai-bots`
2. Click edit icon next to bot
3. Modify name or AI provider
4. Click "Save"

**Expected Result:**

- Dialog closes
- Bot list shows updated details
- DB: Bot record is updated

**Status:** ✅ Implemented
