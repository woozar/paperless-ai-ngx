# US-DOC-005: AI bot response language setting

| Field            | Value                                    |
| ---------------- | ---------------------------------------- |
| **Route**        | `/admin/ai-bots`                         |
| **Permission**   | `user`                                   |
| **Precondition** | Creating or editing an AI bot            |
| **Test Data**    | Bot with response language set to German |

**As a** user
**I want to** configure the response language for an AI bot
**so that** analysis results are in my preferred language

**Steps:**

1. Navigate to `/admin/ai-bots`
2. Create or edit an AI bot
3. Select "Response Language": Document, German, or English
4. Save the bot

**Expected Result:**

- "Document" uses the document's original language
- "German" forces responses in German
- "English" forces responses in English
- Setting is saved and used during analysis

**Status:** ✅ Implemented
