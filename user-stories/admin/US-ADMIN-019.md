# US-ADMIN-019: View Paperless instance list

| Field            | Value                              |
| ---------------- | ---------------------------------- |
| **Route**        | `/admin/paperless-instances`       |
| **Permission**   | `admin`                            |
| **Precondition** | Logged in as admin                 |
| **Test Data**    | Multiple Paperless instances exist |

**As an** admin
**I want to** see a list of all Paperless instances
**so that** I can manage Paperless connections

**Steps:**

1. Log in as admin
2. Navigate to `/admin/paperless-instances`

**Expected Result:**

- Table with columns: Name, API URL, Created, Actions
- All instances are listed
- Pagination controls are visible

**Status:** ✅ Implemented
