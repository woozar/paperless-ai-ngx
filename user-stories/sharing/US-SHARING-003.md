# US-SHARING-003: Change share permission

| Field            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Route**        | `/admin/ai-providers`, `/admin/ai-bots`, `/admin/paperless-instances` |
| **Permission**   | `user` (owner or FULL permission on resource)                         |
| **Precondition** | Resource has existing shares                                          |
| **Test Data**    | Resource with shares exists                                           |

**As a** resource owner
**I want to** change the permission level of an existing share
**so that** I can adjust access as needed

**Steps:**

1. Open the Share dialog for a resource
2. Find an existing share entry
3. Click the permission dropdown
4. Select a different permission level

**Expected Result:**

- Permission is updated immediately
- Success toast "Share updated" is shown
- User's access level changes accordingly

**Status:** ✅ Implemented
