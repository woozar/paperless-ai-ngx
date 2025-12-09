# US-ADMIN-012: Create AI provider

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| **Route**        | `/admin/ai-providers`                                            |
| **Permission**   | `admin`                                                          |
| **Precondition** | Logged in as admin                                               |
| **Test Data**    | `name: "OpenAI GPT-4"`, `provider: "openai"`, `apiKey: "sk-..."` |

**As an** admin
**I want to** create a new AI provider
**so that** I can configure AI services

**Steps:**

1. Navigate to `/admin/ai-providers`
2. Click "Create Provider" button
3. Fill in name, provider type, model, and API key
4. Click "Create" in dialog

**Expected Result:**

- Dialog closes
- New provider appears in the list
- DB: Provider is created with encrypted API key

**Status:** ✅ Implemented
