# US-ADMIN-013: Edit AI provider

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| **Route**        | `/admin/ai-providers`               |
| **Permission**   | `admin`                             |
| **Precondition** | Logged in as admin, provider exists |
| **Test Data**    | `newName: "Updated Provider"`       |

**As an** admin
**I want to** edit an AI provider's details
**so that** I can update configuration

**Steps:**

1. Navigate to `/admin/ai-providers`
2. Click edit icon next to provider
3. Modify name, model, or API key
4. Click "Save"

**Expected Result:**

- Dialog closes
- Provider list shows updated details
- DB: Provider record is updated

**Status:** ✅ Implemented
