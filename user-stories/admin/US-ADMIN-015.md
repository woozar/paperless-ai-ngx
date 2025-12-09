# US-ADMIN-015: View AI bot list

| Field            | Value                              |
| ---------------- | ---------------------------------- |
| **Route**        | `/admin/ai-bots`                   |
| **Permission**   | `admin`                            |
| **Precondition** | Logged in as admin                 |
| **Test Data**    | Multiple AI bots exist in database |

**As an** admin
**I want to** see a list of all AI bots
**so that** I can manage bot configurations

**Steps:**

1. Log in as admin
2. Navigate to `/admin/ai-bots`

**Expected Result:**

- Table with columns: Name, AI Provider, Created, Actions
- All AI bots are listed
- Pagination controls are visible

**Status:** ✅ Implemented
