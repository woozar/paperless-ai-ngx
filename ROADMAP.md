# Paperless AI NGX - Roadmap

## Phase 1: Core Infrastructure (Current)

- [x] Turborepo + pnpm Monorepo Setup
- [x] Next.js 16 App with App Router, Turbopack, React Compiler
- [x] shadcn/ui + Tailwind CSS Theming
- [x] next-intl i18n (DE/EN)
- [x] Prisma Schema for PostgreSQL
- [x] Paperless-ngx API Client Package
- [ ] MCP Server (HTTP Transport)

## Phase 2: Docker & Testing Setup

- [ ] Docker Compose for Production (app + postgres + mcp-server)
- [ ] Dockerfile for Web App
- [ ] Dockerfile for MCP Server
- [x] Configure Vitest Unit/Integration Tests
- [ ] Playwright E2E Tests Setup
  - [ ] Implement E2E tests based on USER-STORIES.md
  - [ ] Test fixtures for user data (testuser, blockeduser, admin)
  - [ ] Each User Story = 1 E2E Test
- [ ] docker-compose.test.yml for E2E Tests
- [ ] GitHub Actions CI/CD Pipeline
- [x] SonarQube Integration for static code analysis
  - [x] Shell script for analysis (`scripts/sonar-analysis.sh`)
  - [x] Uses ENV: `SONAR_SERVER`, `SONAR_KEY`, `SONAR_TOKEN`

## Phase 3: Authentication & User Management

### Backend Infrastructure

- [x] Prisma Schema with User, Settings, Sharing Models
- [x] Bootstrap logic for initial admin user
- [x] Password Hashing Utilities (SHA-256 + Salt)
- [x] JWT Authentication (Jose)
- [x] Auth API Endpoints (login, logout, change-password, me)
- [x] OpenAPI Spec Generation (zod-to-openapi)
- [x] API Client Package Generation (@hey-api/openapi-ts)

### App-wide Authentication

- [x] Login Page UI (`/login`)
- [x] Next.js Proxy for Auth Protection (all routes except `/login`)
- [x] Automatic redirect to `/login` when not logged in
- [x] Auth Context for Client-Side State
- [x] Automatic redirect to `/change-password` when `mustChangePassword=true`

### User Roles

- [x] Two roles: `DEFAULT` and `ADMIN` (Prisma Schema)
- [x] Initial Admin created on first start (via ADMIN_INITIAL_PASSWORD)
- [x] UI: Only admins can create new users
- [ ] UI: Admins can edit app settings
- [x] Schema: Admins do NOT have automatic access to other users' objects (Owner + Sharing Model)

### User Creation & Password

- [x] `mustChangePassword` flag in User Model
- [x] API: Change password endpoint with validation
- [x] UI: Admin creates user with initial password
- [x] UI: Modal blocks UI when password must be changed
- [x] UI: Password change form

### User Suspension (Soft-Delete)

- [x] `isActive` flag in User Model for Soft-Delete
- [x] Login check for isActive in Auth Endpoint
- [x] UI: Admins can suspend/unsuspend users
- [x] API: Last admin cannot be suspended (Validation)

### i18n Error Messages

- [x] Centralize API error responses in `ApiResponses` with translation keys
- [x] Update `ErrorResponseSchema` to use `params` for translation parameters
- [x] Migrate all API routes to use centralized error responses
- [ ] Define translation keys in i18n files (de/en):
  - [ ] `error.unauthorized`
  - [ ] `error.invalidCredentials`
  - [ ] `error.accountSuspended`
  - [ ] `error.forbidden`
  - [ ] `error.userNotFound`
  - [ ] `error.invalidPasswordFormat`
  - [ ] `error.invalidUsernameOrPassword`
  - [ ] `error.currentPasswordIncorrect`
  - [ ] `error.usernameExists` (with `{username}` parameter support)
  - [ ] `error.serverError`
  - [ ] `error.applicationNotConfigured`
  - [ ] `error.lastAdmin`
  - [ ] `error.cannotDeleteSelf`
  - [ ] `error.invalidRequest`

### Toast Notification System

- [x] Implement unified toast notification system (e.g., sonner, react-hot-toast)
- [x] Replace inline error messages in dialogs with toasts
- [x] Replace page-level error states with toasts
- [x] Toast types: Success (auto-dismiss), Error (longer duration), Info, Warning
- [x] Integration with all CRUD operations (Create, Update, Delete users)
- [x] Proper positioning and stacking of multiple toasts

### Setup Wizard Page (`/setup`)

- [ ] Enter Paperless-ngx URL + Token
- [ ] Connection test
- [ ] Select AI Provider (OpenAI, Google, Anthropic)
- [ ] Enter API Key
- [ ] Select model

### Settings System

- [x] Key-Value Settings Table (settingKey/settingValue)
- [x] Bootstrap creates Salt setting automatically
- [ ] `useSettings` Hook in frontend with typed object
  ```typescript
  {
    security: {
      sharing: {
        mode: 'basic' | 'advanced';
      }
    }
  }
  ```
- [ ] Advanced permissions setting (`security.sharing.mode`)
  - `basic`: No Sharing UI visible
  - `advanced`: Users can share objects with other users

### Sharing & Permissions

- [x] Owner + Sharing Model in Prisma Schema for: PaperlessInstance, AiAccess, AiBot
- [x] Permission Levels Enum: READ, WRITE, ADMIN
  - READ: Read only
  - WRITE: Read and edit
  - ADMIN: Read, edit, and reshare
- [x] Join Tables: UserPaperlessInstanceAccess, UserAiAccessAccess, UserAiBotAccess
- [ ] UI: Sharing UI only visible when `security.sharing.mode = advanced`
- [ ] UI: Explanation of permission levels in Share Modal (especially ADMIN/Resharing)

## Phase 4: Dashboard & Document Processing

- [ ] Dashboard Page (`/dashboard`)
  - [ ] Processing statistics
  - [ ] Recently processed documents
  - [ ] Queue status
  - [ ] Charts & Visualizations
    - [ ] Pie Charts (overall distribution)
      - [ ] Documents per instance
      - [ ] Token usage per model
      - [ ] Token usage per instance
      - [ ] Token usage per bot
    - [ ] Line Charts (distribution over time)
      - [ ] Documents over time
      - [ ] Token usage over time
- [ ] Document List (`/documents`)
  - [ ] Show unprocessed documents
  - [ ] Filter by status
  - [ ] Trigger manual processing
- [ ] Document Detail Page (`/documents/[id]`)
  - [ ] Preview
  - [ ] AI analysis result
  - [ ] Confirm/reject changes

## Phase 5: AI Document Analysis

- [ ] AI Service Integration (Vercel AI SDK)
  - [ ] OpenAI Provider
  - [ ] Google Gemini Provider
  - [ ] Anthropic Claude Provider
- [ ] Document Analysis Prompt
  - [ ] Extract title
  - [ ] Suggest tags (from existing ones)
  - [ ] Recognize correspondent
  - [ ] Classify document type
  - [ ] Extract date
- [ ] Paperless-ngx Update API
- [ ] Token Usage Tracking

## Phase 6: Scheduled Processing

- [ ] node-cron Integration
- [ ] Configurable scan intervals
- [ ] Auto-Processing Toggle
- [ ] Processing Queue Management
- [ ] Retry logic on errors

## Phase 7: RAG / Chat Feature

- [ ] Document Indexing Service
- [ ] Vector Store Integration (optional)
- [ ] Chat Interface (`/chat`)
- [ ] Semantic Document Search
- [ ] Context-aware Q&A

## Phase 8: Advanced Features

- [ ] Configure custom prompts
- [ ] Rules Engine (which documents to process)
- [ ] Batch Processing
- [ ] Export/Import Settings
- [ ] Multi-User Support
- [ ] API for external integrations

## Phase 9: Polish & Release

- [ ] Error Handling & Logging
- [ ] Performance Optimization
- [ ] Accessibility (a11y)
- [ ] Mobile Responsive
- [ ] Documentation
- [ ] Release v1.0.0

---

## Possible Future Features

- [ ] **Keycloak Integration** (Optional)
  - SSO Login via Keycloak as alternative to local authentication
  - Configuration via Environment Variables:
    - `KEYCLOAK_ENABLED` (true/false)
    - `KEYCLOAK_URL`
    - `KEYCLOAK_REALM`
    - `KEYCLOAK_CLIENT_ID`
    - `KEYCLOAK_CLIENT_SECRET`
  - User mapping: Keycloak roles to app roles (admin/default)
  - Automatic user creation on first login

---

## Next Steps (Priority)

1. **Docker Compose Setup** - So the app is production-ready deployable
2. **Setup Wizard** - So users can configure Paperless + AI
3. **Dashboard with real functionality** - Display documents
4. **AI Analysis** - Implement core feature
