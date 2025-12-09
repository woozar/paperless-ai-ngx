# US-ADMIN-016: Create AI bot

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Route**        | `/admin/ai-bots`                                   |
| **Permission**   | `admin`                                            |
| **Precondition** | Logged in as admin, AI provider exists             |
| **Test Data**    | `name: "Document Classifier"`, `providerId: "..."` |

**As an** admin
**I want to** create a new AI bot
**so that** I can configure document processing bots

**Steps:**

1. Navigate to `/admin/ai-bots`
2. Click "Create Bot" button
3. Fill in name and select AI provider
4. Click "Create" in dialog

**Expected Result:**

- Dialog closes
- New bot appears in the list
- DB: Bot is created with provider reference

**Status:** ✅ Implemented
