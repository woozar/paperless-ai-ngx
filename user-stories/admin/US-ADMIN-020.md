# US-ADMIN-020: Create Paperless instance

| Field            | Value                                                             |
| ---------------- | ----------------------------------------------------------------- |
| **Route**        | `/admin/paperless-instances`                                      |
| **Permission**   | `admin`                                                           |
| **Precondition** | Logged in as admin                                                |
| **Test Data**    | `name: "Home Server"`, `apiUrl: "https://..."`, `apiToken: "..."` |

**As an** admin
**I want to** create a new Paperless instance connection
**so that** I can integrate with Paperless-ngx servers

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click "Create Instance" button
3. Fill in name, API URL, and API token
4. Click "Create" in dialog

**Expected Result:**

- Dialog closes
- New instance appears in the list
- DB: Instance is created with encrypted API token

**Status:** ✅ Implemented
