# User Stories - Paperless AI NGX

This file documents all implemented user stories of the application.
Each user story is structured so that an E2E test can be created from it.

> **Note:** This file must be updated with every UI change.
> **Important:** Only include stories for features that are fully operable via the UI.

---

## Test Setup Prerequisites

For E2E tests, the following conditions must be met:

1. **Salt Setting in DB:** The setting `security.password.salt` must exist in the `Setting` table
2. **Password Hashing:** All test user passwords must be hashed with SHA-256 + Salt

---

## Permissions

| Permission  | Description             |
| ----------- | ----------------------- |
| `anonymous` | Not logged in           |
| `user`      | Any registered user     |
| `admin`     | User with `role: ADMIN` |

---

## Authentication

### US-AUTH-001: Login with valid credentials

| Field            | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| **Route**        | `/login`                                               |
| **Permission**   | `user`                                                 |
| **Precondition** | Not logged in, user exists and is active               |
| **Test Data**    | `username: "testuser"`, `password: "validPassword123"` |

**As a** user
**I want to** log in with username and password
**so that** I can access the application

**Steps:**

1. Navigate to `/login`
2. Enter username in the "Username" field
3. Enter password in the "Password" field
4. Click the "Login" button

**Expected Result:**

- Redirect to `/` (Home)
- Dashboard is displayed

**Status:** ✅ Implemented

---

### US-AUTH-002: Login with invalid credentials

| Field            | Value                                               |
| ---------------- | --------------------------------------------------- |
| **Route**        | `/login`                                            |
| **Permission**   | `anonymous`                                         |
| **Precondition** | Not logged in                                       |
| **Test Data**    | `username: "testuser"`, `password: "wrongPassword"` |

**As a** user
**I want to** see an error message when my credentials are wrong
**so that** I know I made a typo

**Steps:**

1. Navigate to `/login`
2. Enter username
3. Enter wrong password
4. Click the "Login" button

**Expected Result:**

- Error message is displayed (text contains "invalid")
- No redirect, user stays on `/login`

**Status:** ✅ Implemented

---

### US-AUTH-003: Login with suspended account

| Field            | Value                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| **Route**        | `/login`                                                                     |
| **Permission**   | `user`                                                                       |
| **Precondition** | Not logged in                                                                |
| **Test Data**    | `username: "blockeduser"`, `password: "validPassword123"`, `isActive: false` |

**As a** suspended user
**I want to** see an error message
**so that** I know my account is suspended

**Steps:**

1. Navigate to `/login`
2. Enter username of the suspended user
3. Enter correct password
4. Click the "Login" button

**Expected Result:**

- Error message is displayed (text contains "suspended")
- No redirect, user stays on `/login`

**Status:** ✅ Implemented

---

### US-AUTH-004: Password visibility toggle

| Field            | Value         |
| ---------------- | ------------- |
| **Route**        | `/login`      |
| **Permission**   | `anonymous`   |
| **Precondition** | Not logged in |
| **Test Data**    | -             |

**As a** user
**I want to** show/hide my password
**so that** I can detect typos

**Steps:**

1. Navigate to `/login`
2. Enter text in the password field
3. Observe: Password is masked (only dots visible)
4. Click the eye icon on the right side of the password field
5. Observe: Password is now readable
6. Click the eye icon again
7. Observe: Password is masked again

**Expected Result:**

- Password toggles between masked and visible
- Icon toggles between "eye" and "eye with slash"

**Status:** ✅ Implemented

---

### US-AUTH-005: Login with redirect parameter

| Field            | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| **Route**        | `/login?redirect=/settings`                            |
| **Permission**   | `user`                                                 |
| **Precondition** | Not logged in, user exists and is active               |
| **Test Data**    | `username: "testuser"`, `password: "validPassword123"` |

**As a** user
**I want to** be redirected to the originally requested page after login
**so that** I don't have to navigate manually

**Steps:**

1. Navigate directly to `/login?redirect=/settings`
2. Enter valid credentials
3. Click the "Login" button

**Expected Result:**

- Redirect to `/settings` (not to `/`)

**Status:** ✅ Implemented

---

### US-AUTH-006: Change password - Success

| Field            | Value                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **Route**        | `/change-password`                                                                            |
| **Permission**   | `user`                                                                                        |
| **Precondition** | Logged in as testuser                                                                         |
| **Test Data**    | `currentPassword: "oldPass123"`, `newPassword: "newPass456"`, `confirmPassword: "newPass456"` |

**As an** authenticated user
**I want to** change my password
**so that** I keep my account secure

**Steps:**

1. Log in and navigate to `/change-password`
2. Enter current password in the "Current Password" field
3. Enter new password in the "New Password" field
4. Enter new password again in the "Confirm Password" field
5. Click the "Change Password" button

**Expected Result:**

- Success message is displayed
- Redirect to `/`
- DB: User password hash has changed
- Login with new password succeeds

**Status:** ✅ Implemented

---

### US-AUTH-007: Change password - Passwords don't match

| Field            | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| **Route**        | `/change-password`                                              |
| **Permission**   | `user`                                                          |
| **Precondition** | Logged in as testuser                                           |
| **Test Data**    | `newPassword: "newPass456"`, `confirmPassword: "differentPass"` |

**As a** user
**I want to** see an error when passwords don't match
**so that** I know what to correct

**Steps:**

1. Log in and navigate to `/change-password`
2. Enter current password
3. Enter "newPass456" in the "New Password" field
4. Enter "differentPass" in the "Confirm Password" field
5. Click the "Change Password" button

**Expected Result:**

- Error message "Passwords don't match" is displayed
- No redirect
- DB: User password hash has NOT changed

**Status:** ✅ Implemented

---

### US-AUTH-008: Change password - Password too short

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Route**        | `/change-password`                                 |
| **Permission**   | `user`                                             |
| **Precondition** | Logged in as testuser                              |
| **Test Data**    | `newPassword: "short"`, `confirmPassword: "short"` |

**As a** user
**I want to** see an error when the password is too short
**so that** I choose a secure password

**Steps:**

1. Log in and navigate to `/change-password`
2. Enter current password
3. Enter "short" (less than 8 characters) in both new password fields
4. Click the "Change Password" button

**Expected Result:**

- Error message "at least 8 characters" is displayed
- No redirect
- DB: User password hash has NOT changed

**Status:** ✅ Implemented

---

### US-AUTH-009: Change password - Wrong current password

| Field            | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| **Route**        | `/change-password`                                              |
| **Permission**   | `user`                                                          |
| **Precondition** | Logged in as testuser                                           |
| **Test Data**    | `currentPassword: "wrongPassword"`, `newPassword: "newPass456"` |

**As a** user
**I want to** see an error when my current password is wrong
**so that** I can correct it

**Steps:**

1. Log in and navigate to `/change-password`
2. Enter wrong current password
3. Enter valid new password in both fields
4. Click the "Change Password" button

**Expected Result:**

- Error message "current password is incorrect" is displayed
- No redirect
- DB: User password hash has NOT changed

**Status:** ✅ Implemented

---

### US-AUTH-010: Forced password change

| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| **Route**        | `/`                                               |
| **Permission**   | `user`                                            |
| **Precondition** | Logged in as user with `mustChangePassword: true` |
| **Test Data**    | User with initial password                        |

**As a** new user (with initial password)
**I want to** be forced to change my password
**so that** only I know my password

**Steps:**

1. Log in with a user who has `mustChangePassword: true`
2. Observe the redirect
3. Try to manually navigate to `/`

**Expected Result:**

- Automatic redirect to `/change-password` after login
- On manual navigation attempt: Redirect back to `/change-password`
- After successful password change: DB: `mustChangePassword` is set to `false`

**Status:** ✅ Implemented

---

### US-AUTH-011: Session persistence

| Field            | Value                 |
| ---------------- | --------------------- |
| **Route**        | `/`                   |
| **Permission**   | `user`                |
| **Precondition** | Logged in as testuser |
| **Test Data**    | -                     |

**As an** authenticated user
**I want to** stay logged in when I reload the page
**so that** I don't have to log in constantly

**Steps:**

1. Log in
2. Verify that dashboard is displayed
3. Reload the page (F5 or browser refresh)

**Expected Result:**

- User stays logged in
- Dashboard is displayed again (no redirect to `/login`)

**Status:** ✅ Implemented

---

## Navigation

### US-NAV-001: Display home dashboard

| Field            | Value                 |
| ---------------- | --------------------- |
| **Route**        | `/`                   |
| **Permission**   | `user`                |
| **Precondition** | Logged in as testuser |
| **Test Data**    | -                     |

**As an** authenticated user
**I want to** see an overview page
**so that** I can quickly grasp the most important information

**Steps:**

1. Log in
2. Navigate to `/`

**Expected Result:**

- Dashboard page is displayed
- Cards for "Auto Processing", "Document Queue", "Configuration" are visible
- Navigation links to Dashboard, Documents, Settings are present

**Status:** ✅ Implemented

---

### US-NAV-002: Protected route without login - Home

| Field            | Value         |
| ---------------- | ------------- |
| **Route**        | `/`           |
| **Permission**   | `anonymous`   |
| **Precondition** | Not logged in |
| **Test Data**    | -             |

**As an** unauthenticated user
**I want to** be redirected to login
**so that** unauthorized access is prevented

**Steps:**

1. Make sure you are not logged in (e.g., in incognito mode)
2. Navigate directly to `/`

**Expected Result:**

- Redirect to `/login?redirect=%2F`
- Login form is displayed

**Status:** ✅ Implemented

---

### US-NAV-003: Protected route without login - Settings

| Field            | Value         |
| ---------------- | ------------- |
| **Route**        | `/settings`   |
| **Permission**   | `anonymous`   |
| **Precondition** | Not logged in |
| **Test Data**    | -             |

**As an** unauthenticated user
**I want to** be redirected to login when accessing /settings
**so that** settings are protected

**Steps:**

1. Make sure you are not logged in
2. Navigate directly to `/settings`

**Expected Result:**

- Redirect to `/login?redirect=%2Fsettings`

**Status:** ✅ Implemented

---

## User Management (Admin)

### US-ADMIN-001: View user list

| Field            | Value                            |
| ---------------- | -------------------------------- |
| **Route**        | `/admin/users`                   |
| **Permission**   | `admin`                          |
| **Precondition** | Logged in as admin               |
| **Test Data**    | Multiple users exist in database |

**As an** admin
**I want to** see a list of all users
**so that** I can manage user accounts

**Steps:**

1. Log in as admin
2. Navigate to `/admin/users`

**Expected Result:**

- Table with columns: Username, Role, Status, Created, Actions
- All users are listed
- Current user's status badge shows "Active" or "Suspended"

**Status:** ✅ Implemented

---

### US-ADMIN-002: Create new user

| Field            | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Route**        | `/admin/users`                                               |
| **Permission**   | `admin`                                                      |
| **Precondition** | Logged in as admin                                           |
| **Test Data**    | `username: "newuser"`, `password: "password123"`, role: User |

**As an** admin
**I want to** create a new user account
**so that** new users can access the application

**Steps:**

1. Navigate to `/admin/users`
2. Click "Create User" button
3. Fill in username, password, and select role
4. Click "Create User" in dialog

**Expected Result:**

- Dialog closes
- New user appears in the list
- DB: User has `mustChangePassword: true`
- New user can log in with the provided credentials

**Status:** ✅ Implemented

---

### US-ADMIN-003: Edit user

| Field            | Value                                     |
| ---------------- | ----------------------------------------- |
| **Route**        | `/admin/users`                            |
| **Permission**   | `admin`                                   |
| **Precondition** | Logged in as admin, test user exists      |
| **Test Data**    | `newUsername: "renameduser"`, role: Admin |

**As an** admin
**I want to** edit a user's details
**so that** I can update their information

**Steps:**

1. Navigate to `/admin/users`
2. Click edit icon next to user
3. Change username and/or role
4. Click "Save"

**Expected Result:**

- Dialog closes
- User list shows updated username/role
- DB: User record is updated

**Status:** ✅ Implemented

---

### US-ADMIN-004: Reset user password

| Field            | Value                                |
| ---------------- | ------------------------------------ |
| **Route**        | `/admin/users`                       |
| **Permission**   | `admin`                              |
| **Precondition** | Logged in as admin, test user exists |
| **Test Data**    | `resetPassword: "newInitialPass123"` |

**As an** admin
**I want to** reset a user's password
**so that** they can regain access if they forgot their password

**Steps:**

1. Navigate to `/admin/users`
2. Click edit icon next to user
3. Enter new password in "Reset Password" field
4. Click "Save"

**Expected Result:**

- Dialog closes
- User's badge shows "Must Change Password"
- User can log in with new password
- User is redirected to `/change-password` after login

**Status:** ✅ Implemented

---

### US-ADMIN-005: Suspend user

| Field            | Value                                  |
| ---------------- | -------------------------------------- |
| **Route**        | `/admin/users`                         |
| **Permission**   | `admin`                                |
| **Precondition** | Logged in as admin, active user exists |
| **Test Data**    | -                                      |

**As an** admin
**I want to** suspend a user account
**so that** they can no longer access the application

**Steps:**

1. Navigate to `/admin/users`
2. Click suspend icon (ban) next to an active user

**Expected Result:**

- User's status badge changes to "Suspended"
- User can no longer log in
- Login attempt shows "account suspended" error

**Status:** ✅ Implemented

---

### US-ADMIN-006: Activate suspended user

| Field            | Value                                     |
| ---------------- | ----------------------------------------- |
| **Route**        | `/admin/users`                            |
| **Permission**   | `admin`                                   |
| **Precondition** | Logged in as admin, suspended user exists |
| **Test Data**    | -                                         |

**As an** admin
**I want to** reactivate a suspended user
**so that** they can access the application again

**Steps:**

1. Navigate to `/admin/users`
2. Click activate icon (checkmark) next to a suspended user

**Expected Result:**

- User's status badge changes to "Active"
- User can log in again

**Status:** ✅ Implemented

---

### US-ADMIN-007: Delete user

| Field            | Value                                     |
| ---------------- | ----------------------------------------- |
| **Route**        | `/admin/users`                            |
| **Permission**   | `admin`                                   |
| **Precondition** | Logged in as admin, deletable user exists |
| **Test Data**    | -                                         |

**As an** admin
**I want to** delete a user account
**so that** unused accounts are removed

**Steps:**

1. Navigate to `/admin/users`
2. Click delete icon next to user
3. Confirm deletion in dialog

**Expected Result:**

- Dialog closes
- User is removed from the list
- User can no longer log in

**Status:** ✅ Implemented

---

### US-ADMIN-008: Cannot delete self

| Field            | Value              |
| ---------------- | ------------------ |
| **Route**        | `/admin/users`     |
| **Permission**   | `admin`            |
| **Precondition** | Logged in as admin |
| **Test Data**    | -                  |

**As an** admin
**I want to** be prevented from deleting my own account
**so that** I don't accidentally lock myself out

**Steps:**

1. Navigate to `/admin/users`
2. Try to click delete icon next to own user

**Expected Result:**

- Delete button is disabled for own user
- Cannot delete self

**Status:** ✅ Implemented

---

### US-ADMIN-009: Cannot demote last admin

| Field            | Value                            |
| ---------------- | -------------------------------- |
| **Route**        | `/admin/users`                   |
| **Permission**   | `admin`                          |
| **Precondition** | Logged in as the only admin user |
| **Test Data**    | -                                |

**As an** admin (last admin)
**I want to** be prevented from demoting or deactivating myself
**so that** the system always has at least one admin

**Steps:**

1. Navigate to `/admin/users`
2. Try to change own role to "User" or suspend self

**Expected Result:**

- Error message "Cannot modify the last admin user"
- Action is rejected

**Status:** ✅ Implemented

---

### US-ADMIN-010: Non-admin cannot access user management

| Field            | Value                       |
| ---------------- | --------------------------- |
| **Route**        | `/admin/users`              |
| **Permission**   | `user`                      |
| **Precondition** | Logged in as non-admin user |
| **Test Data**    | -                           |

**As a** regular user
**I want to** be prevented from accessing admin pages
**so that** only admins can manage users

**Steps:**

1. Log in as a non-admin user
2. Navigate directly to `/admin/users`

**Expected Result:**

- Redirect to `/` (home)
- No access to user management

**Status:** ✅ Implemented

---

## Internationalization

### US-I18N-001: Display German language

| Field            | Value                                     |
| ---------------- | ----------------------------------------- |
| **Route**        | `/login`                                  |
| **Permission**   | `anonymous`                               |
| **Precondition** | Not logged in, browser language is German |
| **Test Data**    | Browser with `Accept-Language: de-DE`     |

**As a** German-speaking user
**I want to** see the app in German
**so that** I understand all texts

**Steps:**

1. Set browser language to German
2. Navigate to `/login`

**Expected Result:**

- Login button shows "Anmelden"
- Form labels are in German

**Status:** ✅ Implemented

---

### US-I18N-002: Display English language

| Field            | Value                                      |
| ---------------- | ------------------------------------------ |
| **Route**        | `/login`                                   |
| **Permission**   | `anonymous`                                |
| **Precondition** | Not logged in, browser language is English |
| **Test Data**    | Browser with `Accept-Language: en-US`      |

**As an** English-speaking user
**I want to** see the app in English
**so that** I understand all texts

**Steps:**

1. Set browser language to English
2. Navigate to `/login`

**Expected Result:**

- Login button shows "Login" or "Sign in"
- Form labels are in English

**Status:** ✅ Implemented

---

## Legend

| Status         | Meaning                                   |
| -------------- | ----------------------------------------- |
| ✅ Implemented | Feature is fully implemented and testable |
| 🚧 In Progress | Feature is currently being implemented    |
| ⏳ Planned     | Feature is planned but not yet started    |
