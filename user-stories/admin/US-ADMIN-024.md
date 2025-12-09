# US-ADMIN-024: View and restore deleted users

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Route**        | `/admin/users`                          |
| **Permission**   | `admin`                                 |
| **Precondition** | Logged in as admin, deleted users exist |
| **Test Data**    | Users with `deletedAt` set              |

**As an** admin
**I want to** view deleted users and restore them
**so that** I can recover accidentally deleted accounts

**Steps:**

1. Navigate to `/admin/users`
2. Click "Show deleted users" button
3. Dialog opens with list of deleted users
4. Click "Restore" button next to a deleted user

**Expected Result:**

- Deleted users dialog shows all soft-deleted users
- User is restored and removed from the deleted list
- Success toast "User restored" is shown
- User appears in the main user list again
- User can log in again

**Status:** ✅ Implemented
