# US-ADMIN-030: Configure AI Bot document mode (Text vs PDF)

| Field            | Value                                            |
| ---------------- | ------------------------------------------------ |
| **Route**        | `/admin/ai-bots` (Create/Edit Bot Dialog)        |
| **Permission**   | `admin` or bot owner                             |
| **Precondition** | Logged in, AI Model with PDF-supporting provider |
| **Test Data**    | AI Account with OpenAI, Anthropic, or Google     |

**As an** admin or bot owner
**I want to** configure whether an AI bot receives the full PDF or extracted text
**so that** I can balance analysis quality vs. cost for document processing

**Steps:**

1. Navigate to `/admin/ai-bots`
2. Click "Create Bot" or "Edit" on existing bot
3. Select an AI Model using a PDF-supporting provider (OpenAI, Anthropic, Google)
4. Locate "Document Mode" dropdown
5. Select either "Text only (extracted)" or "Full PDF"
6. Optionally set "Max PDF Size (MB)" when PDF mode is selected
7. Click "Save"

**Expected Result:**

- Document Mode dropdown is visible with options:
  - "Text only (extracted)" - sends OCR text to AI (default, cheaper)
  - "Full PDF" - sends complete PDF document (better for complex layouts)
- When "Full PDF" is selected:
  - Warning message displayed: "PDF mode uses more tokens and costs more than text mode"
  - Optional "Max PDF Size (MB)" field appears (1-100 MB)
  - Empty = use global setting (default 20 MB)
- When using a provider that doesn't support PDF (Ollama, Custom):
  - Document Mode is disabled and locked to "Text only"
  - Tooltip: "PDF mode not available for this provider"
- Bot saves with selected document mode
- During analysis, documents are sent according to configured mode
- If PDF exceeds size limit, falls back to text mode automatically

**Provider Support:**

| Provider  | PDF Support |
| --------- | ----------- |
| OpenAI    | Yes         |
| Anthropic | Yes         |
| Google    | Yes         |
| Ollama    | No          |
| Custom    | No          |

**Status:** ✅ Implemented
