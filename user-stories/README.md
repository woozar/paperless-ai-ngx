# User Stories - Paperless AI NGX

This folder documents all implemented user stories of the application.
Each user story is structured so that an E2E test can be created from it.

> **Note:** This folder must be updated with every UI change.
> **Important:** Only include stories for features that are fully operable via the UI.

## Structure

- `auth/` - Authentication stories (US-AUTH-\*)
- `nav/` - Navigation stories (US-NAV-\*)
- `admin/` - Admin/User Management stories (US-ADMIN-\*)
- `i18n/` - Internationalization stories (US-I18N-\*)
- `sharing/` - Resource Sharing stories (US-SHARING-\*)
- `settings/` - Settings stories (US-SETTINGS-\*)
- `doc/` - Document Analysis stories (US-DOC-\*)

## Test Setup Prerequisites

For E2E tests, the following conditions must be met:

1. **Salt Setting in DB:** The setting `security.password.salt` must exist in the `Setting` table
2. **Password Hashing:** All test user passwords must be hashed with SHA-256 + Salt

## Permissions

| Permission  | Description             |
| ----------- | ----------------------- |
| `anonymous` | Not logged in           |
| `user`      | Any registered user     |
| `admin`     | User with `role: ADMIN` |

## Legend

| Status         | Meaning                                   |
| -------------- | ----------------------------------------- |
| ✅ Implemented | Feature is fully implemented and testable |
| 🚧 In Progress | Feature is currently being implemented    |
| ⏳ Planned     | Feature is planned but not yet started    |
