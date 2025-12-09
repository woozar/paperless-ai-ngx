# US-ADMIN-014: Delete AI provider

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| **Route**        | `/admin/ai-providers`               |
| **Permission**   | `admin`                             |
| **Precondition** | Logged in as admin, provider exists |
| **Test Data**    | -                                   |

**As an** admin
**I want to** delete an AI provider
**so that** I can remove unused configurations

**Steps:**

1. Navigate to `/admin/ai-providers`
2. Click delete icon next to provider
3. Confirm deletion in dialog

**Expected Result:**

- Dialog closes
- Provider is removed from the list
- DB: Provider record is deleted

**Status:** ✅ Implemented
