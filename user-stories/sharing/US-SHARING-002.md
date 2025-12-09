# US-SHARING-002: Share resource with all users

| Field            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Route**        | `/admin/ai-providers`, `/admin/ai-bots`, `/admin/paperless-instances` |
| **Permission**   | `user` (owner or FULL permission on resource)                         |
| **Precondition** | Logged in, user owns a resource or has FULL permission                |
| **Test Data**    | Resource exists                                                       |

**As a** resource owner
**I want to** share my resource with all users
**so that** everyone can access it

**Steps:**

1. Navigate to the resource list page
2. Click the share icon next to a resource you own
3. In the Share dialog, click the "Add share" dropdown
4. Select "All users"
5. Select a permission level
6. Click the confirm button

**Expected Result:**

- Share entry for "All users" is added to the list
- All users in the system can now access the resource
- "All users" option is no longer available in dropdown (only one "all users" share allowed)

**Status:** ✅ Implemented
