# US-SHARING-001: Share resource with specific user

| Field            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Route**        | `/admin/ai-providers`, `/admin/ai-bots`, `/admin/paperless-instances` |
| **Permission**   | `user` (owner or FULL permission on resource)                         |
| **Precondition** | Logged in, user owns a resource or has FULL permission                |
| **Test Data**    | Resource exists, other users exist                                    |

**As a** resource owner
**I want to** share my resource with a specific user
**so that** they can access it with defined permissions

**Steps:**

1. Navigate to the resource list page (AI Providers, AI Bots, or Paperless Instances)
2. Click the share icon next to a resource you own
3. In the Share dialog, click the "Add share" dropdown
4. Select a user from the list
5. Select a permission level (READ, WRITE, or FULL)
6. Click the confirm button

**Expected Result:**

- Share is added to the list
- Success toast "Share added" is shown
- User can now access the resource with the selected permission level
- READ: User can view the resource
- WRITE: User can view and edit the resource
- FULL: User can view, edit, and reshare the resource

**Status:** ✅ Implemented
