# US-ADMIN-011: View AI provider list

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Route**        | `/admin/ai-providers`                   |
| **Permission**   | `admin`                                 |
| **Precondition** | Logged in as admin                      |
| **Test Data**    | Multiple AI providers exist in database |

**As an** admin
**I want to** see a list of all AI providers
**so that** I can manage AI integrations

**Steps:**

1. Log in as admin
2. Navigate to `/admin/ai-providers`

**Expected Result:**

- Table with columns: Name, Provider, Model, Created, Actions
- All AI providers are listed
- Pagination controls are visible

**Status:** ✅ Implemented
