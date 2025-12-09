# US-SHARING-004: Remove share

| Field            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Route**        | `/admin/ai-providers`, `/admin/ai-bots`, `/admin/paperless-instances` |
| **Permission**   | `user` (owner or FULL permission on resource)                         |
| **Precondition** | Resource has existing shares                                          |
| **Test Data**    | Resource with shares exists                                           |

**As a** resource owner
**I want to** remove a share
**so that** I can revoke access from a user

**Steps:**

1. Open the Share dialog for a resource
2. Find the share entry to remove
3. Click the trash icon next to it

**Expected Result:**

- Share is removed from the list
- Success toast "Share removed" is shown
- User can no longer access the resource (unless they have access through "all users" share)

**Status:** ✅ Implemented
