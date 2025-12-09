# US-AUTH-004: Password visibility toggle

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
