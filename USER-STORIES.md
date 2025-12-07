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

### US-ADMIN-024: View and restore deleted users

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

## AI Provider Management (Admin)

### US-ADMIN-011: View AI provider list

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

---

### US-ADMIN-012: Create AI provider

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| **Route**        | `/admin/ai-providers`                                            |
| **Permission**   | `admin`                                                          |
| **Precondition** | Logged in as admin                                               |
| **Test Data**    | `name: "OpenAI GPT-4"`, `provider: "openai"`, `apiKey: "sk-..."` |

**As an** admin
**I want to** create a new AI provider
**so that** I can configure AI services

**Steps:**

1. Navigate to `/admin/ai-providers`
2. Click "Create Provider" button
3. Fill in name, provider type, model, and API key
4. Click "Create" in dialog

**Expected Result:**

- Dialog closes
- New provider appears in the list
- DB: Provider is created with encrypted API key

**Status:** ✅ Implemented

---

### US-ADMIN-013: Edit AI provider

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| **Route**        | `/admin/ai-providers`               |
| **Permission**   | `admin`                             |
| **Precondition** | Logged in as admin, provider exists |
| **Test Data**    | `newName: "Updated Provider"`       |

**As an** admin
**I want to** edit an AI provider's details
**so that** I can update configuration

**Steps:**

1. Navigate to `/admin/ai-providers`
2. Click edit icon next to provider
3. Modify name, model, or API key
4. Click "Save"

**Expected Result:**

- Dialog closes
- Provider list shows updated details
- DB: Provider record is updated

**Status:** ✅ Implemented

---

### US-ADMIN-014: Delete AI provider

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| **Route**        | `/admin/ai-providers`               |
| **Permission**   | `admin`                             |
| **Precondition** | Logged in as admin, provider exists |
| **Test Data**    | -                                   |

**As an** admin
**I want to** delete an AI provider
**so that** I can remove unused configurations

**Steps:**

1. Navigate to `/admin/ai-providers`
2. Click delete icon next to provider
3. Confirm deletion in dialog

**Expected Result:**

- Dialog closes
- Provider is removed from the list
- DB: Provider record is deleted

**Status:** ✅ Implemented

---

## AI Bot Management (Admin)

### US-ADMIN-015: View AI bot list

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

---

### US-ADMIN-016: Create AI bot

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Route**        | `/admin/ai-bots`                                   |
| **Permission**   | `admin`                                            |
| **Precondition** | Logged in as admin, AI provider exists             |
| **Test Data**    | `name: "Document Classifier"`, `providerId: "..."` |

**As an** admin
**I want to** create a new AI bot
**so that** I can configure document processing bots

**Steps:**

1. Navigate to `/admin/ai-bots`
2. Click "Create Bot" button
3. Fill in name and select AI provider
4. Click "Create" in dialog

**Expected Result:**

- Dialog closes
- New bot appears in the list
- DB: Bot is created with provider reference

**Status:** ✅ Implemented

---

### US-ADMIN-017: Edit AI bot

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Route**        | `/admin/ai-bots`               |
| **Permission**   | `admin`                        |
| **Precondition** | Logged in as admin, bot exists |
| **Test Data**    | `newName: "Updated Bot"`       |

**As an** admin
**I want to** edit an AI bot's details
**so that** I can update configuration

**Steps:**

1. Navigate to `/admin/ai-bots`
2. Click edit icon next to bot
3. Modify name or AI provider
4. Click "Save"

**Expected Result:**

- Dialog closes
- Bot list shows updated details
- DB: Bot record is updated

**Status:** ✅ Implemented

---

### US-ADMIN-018: Delete AI bot

| Field            | Value                          |
| ---------------- | ------------------------------ |
| **Route**        | `/admin/ai-bots`               |
| **Permission**   | `admin`                        |
| **Precondition** | Logged in as admin, bot exists |
| **Test Data**    | -                              |

**As an** admin
**I want to** delete an AI bot
**so that** I can remove unused bots

**Steps:**

1. Navigate to `/admin/ai-bots`
2. Click delete icon next to bot
3. Confirm deletion in dialog

**Expected Result:**

- Dialog closes
- Bot is removed from the list
- DB: Bot record is deleted

**Status:** ✅ Implemented

---

## Paperless Instance Management (Admin)

### US-ADMIN-019: View Paperless instance list

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

---

### US-ADMIN-020: Create Paperless instance

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

---

### US-ADMIN-021: Edit Paperless instance

| Field            | Value                               |
| ---------------- | ----------------------------------- |
| **Route**        | `/admin/paperless-instances`        |
| **Permission**   | `admin`                             |
| **Precondition** | Logged in as admin, instance exists |
| **Test Data**    | `newName: "Updated Instance"`       |

**As an** admin
**I want to** edit a Paperless instance's details
**so that** I can update connection settings

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click edit icon next to instance
3. Modify name, API URL, or API token
4. Click "Save"

**Expected Result:**

- Dialog closes
- Instance list shows updated details
- DB: Instance record is updated

**Status:** ✅ Implemented

---

### US-ADMIN-022: Delete Paperless instance with document count warning

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Route**        | `/admin/paperless-instances`                       |
| **Permission**   | `admin`                                            |
| **Precondition** | Logged in as admin, instance with documents exists |
| **Test Data**    | Instance with imported documents                   |

**As an** admin
**I want to** see a warning with document count before deleting an instance
**so that** I understand the impact of deletion

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click delete icon next to instance with documents
3. Observe warning message with document count
4. Confirm deletion

**Expected Result:**

- Delete dialog shows document count warning
- After confirmation: Instance and associated documents are removed
- DB: Instance and documents are deleted

**Status:** ✅ Implemented

---

### US-ADMIN-023: Import documents from Paperless instance

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Route**        | `/admin/paperless-instances`            |
| **Permission**   | `admin`                                 |
| **Precondition** | Logged in as admin, instance configured |
| **Test Data**    | Instance with accessible documents      |

**As an** admin
**I want to** import documents from a Paperless instance
**so that** I can process them with AI

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click import icon next to instance
3. Wait for import to complete

**Expected Result:**

- Loading indicator shows during import
- Success toast shows number of imported documents
- DB: Documents are imported from Paperless

**Status:** ✅ Implemented

---

## Resource Sharing

### US-SHARING-001: Share resource with specific user

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

---

### US-SHARING-002: Share resource with all users

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

---

### US-SHARING-003: Change share permission

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

---

### US-SHARING-004: Remove share

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

---

## Settings (Admin)

### US-SETTINGS-001: View settings page

| Field            | Value              |
| ---------------- | ------------------ |
| **Route**        | `/admin/settings`  |
| **Permission**   | `admin`            |
| **Precondition** | Logged in as admin |
| **Test Data**    | -                  |

**As an** admin
**I want to** view all application settings
**so that** I can configure the application

**Steps:**

1. Log in as admin
2. Navigate to `/admin/settings`

**Expected Result:**

- Settings page is displayed
- All configurable settings are shown with current values
- Settings are grouped by category

**Status:** ✅ Implemented

---

### US-SETTINGS-002: Edit settings

| Field            | Value                |
| ---------------- | -------------------- |
| **Route**        | `/admin/settings`    |
| **Permission**   | `admin`              |
| **Precondition** | Logged in as admin   |
| **Test Data**    | Setting value change |

**As an** admin
**I want to** edit application settings
**so that** I can customize the application behavior

**Steps:**

1. Navigate to `/admin/settings`
2. Modify a setting value
3. Save changes

**Expected Result:**

- Success notification is shown
- Setting is updated
- DB: Setting value is persisted

**Status:** ✅ Implemented

---

### US-SETTINGS-003: Change theme (Light/Dark/System)

| Field            | Value             |
| ---------------- | ----------------- |
| **Route**        | `/admin/settings` |
| **Permission**   | `user`            |
| **Precondition** | Logged in         |
| **Test Data**    | -                 |

**As a** user
**I want to** switch between light, dark, and system theme
**so that** I can use the app in my preferred visual mode

**Steps:**

1. Navigate to `/admin/settings`
2. Find the "Appearance" section with "Theme" setting
3. Click the theme dropdown
4. Select "Light", "Dark", or "System"

**Expected Result:**

- Theme changes immediately upon selection
- "Light": App uses light color scheme
- "Dark": App uses dark color scheme
- "System": App follows OS/browser preference
- Setting persists across page reloads
- Setting is stored locally (no server sync)

**Status:** ✅ Implemented

---

## Header and Navigation

### US-NAV-004: Header shows user info and navigation

| Field            | Value     |
| ---------------- | --------- |
| **Route**        | `/`       |
| **Permission**   | `user`    |
| **Precondition** | Logged in |
| **Test Data**    | -         |

**As a** logged-in user
**I want to** see my user info and navigation in the header
**so that** I can navigate the app and know who I'm logged in as

**Steps:**

1. Log in
2. Observe the header bar

**Expected Result:**

- App logo and name are displayed on the left
- Navigation links are shown (Dashboard, Paperless Instances, AI Providers, AI Bots)
- Admin-only links (Users, Settings) are visible only for admins
- User avatar with initials is displayed on the right
- Username is shown
- Logout button is visible
- GitHub link with version tooltip is present
- On mobile: Navigation collapses into a hamburger menu

**Status:** ✅ Implemented

---

## Legend

| Status         | Meaning                                   |
| -------------- | ----------------------------------------- |
| ✅ Implemented | Feature is fully implemented and testable |
| 🚧 In Progress | Feature is currently being implemented    |
| ⏳ Planned     | Feature is planned but not yet started    |
