# US-ADMIN-025: Configure automatic document processing

| Field            | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| **Route**        | `/admin/paperless-instances` → Edit Instance Dialog         |
| **Permission**   | `admin` or instance owner                                   |
| **Precondition** | Logged in, Paperless instance exists, default AI bot exists |
| **Test Data**    | Valid Paperless instance with API connection                |

**As an** admin or instance owner
**I want to** configure automatic document processing for my Paperless instance
**so that** new documents are automatically analyzed without manual intervention

**Steps:**

1. Navigate to `/admin/paperless-instances`
2. Click "Edit" button on an instance row
3. Scroll to "Auto-Processing" section
4. Toggle "Enable auto-processing" to on
5. Select scan interval (e.g., "Every 30 minutes")
6. Select default AI bot from dropdown
7. Optionally configure import filter tags
8. Click "Save"

**Expected Result:**

- Auto-processing settings are saved
- Success toast "Instance updated" is shown
- Scheduler starts scanning the instance at configured interval
- New documents matching filter tags are automatically added to queue
- Documents are processed using the selected default AI bot
- Next scan time is calculated and stored

**Status:** ✅ Implemented
