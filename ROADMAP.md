# Paperless AI NGX - Roadmap

## Phase 1: Core Infrastructure (Current)

- [x] Turborepo + pnpm Monorepo Setup
- [x] Next.js 16 App with App Router, Turbopack, React Compiler
- [x] shadcn/ui + Tailwind CSS Theming
- [x] next-intl i18n (DE/EN)
- [x] Prisma Schema for PostgreSQL
- [x] Paperless-ngx API Client Package
- [x] MCP Server (HTTP Transport)

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
- [x] UI: Admins can edit app settings
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
- [x] Define all error translation keys in i18n files (de/en)
- [x] Implement `useErrorDisplay` hook for consistent toast notifications

### Toast Notification System

- [x] Implement unified toast notification system (e.g., sonner, react-hot-toast)
- [x] Replace inline error messages in dialogs with toasts
- [x] Replace page-level error states with toasts
- [x] Toast types: Success (auto-dismiss), Error (longer duration), Info, Warning
- [x] Integration with all CRUD operations (Create, Update, Delete users)
- [x] Proper positioning and stacking of multiple toasts

### Settings System

- [x] Key-Value Settings Table (settingKey/settingValue)
- [x] Bootstrap creates Salt setting automatically
- [x] `useSettings` Hook in frontend with typed object
- [x] Advanced permissions setting (`security.sharing.mode`)
  - `basic`: No Sharing UI visible
  - `advanced`: Users can share objects with other users

### Sharing & Permissions

- [x] Owner + Sharing Model in Prisma Schema for: PaperlessInstance, AiProvider, AiBot
- [x] Permission Levels Enum: READ, WRITE, ADMIN
  - READ: Read only
  - WRITE: Read and edit
  - ADMIN: Read, edit, and reshare
- [x] Join Tables: UserPaperlessInstanceAccess, UserAiProviderAccess, UserAiBotAccess
- [ ] UI: Sharing UI only visible when `security.sharing.mode = advanced`
- [ ] UI: Explanation of permission levels in Share Modal (especially ADMIN/Resharing)

## Phase 3a: Object Management UI

### Infrastructure

- [x] Encryption utilities for API tokens/keys (AES-256-GCM)
- [x] Rename AiAccess to AiProvider in Prisma schema
- [x] Database migration
- [x] ENV variable documentation (ENCRYPTION_KEY)

### PaperlessInstance Management

- [x] API Routes with encryption (GET, POST, PATCH, DELETE)
- [x] Admin page `/admin/paperless-instances`
- [x] Create/Edit/Delete Dialogs
- [x] Warning on Delete with document count
- [x] 100% Test Coverage
- [x] i18n (de/en)

### AiProvider Management (renamed from AiAccess)

- [x] API Routes with encryption
- [x] Admin page `/admin/ai-providers`
- [x] Provider dropdown (openai, anthropic, ollama, google, custom)
- [x] Conditional baseUrl field
- [x] Prevent delete when referenced by AiBots
- [x] 100% Test Coverage
- [x] i18n (de/en)

### AiBot Management

- [x] API Routes
- [x] Admin page `/admin/ai-bots`
- [x] AiProvider dropdown (only user's own providers)
- [x] "No providers available" handling
- [x] 100% Test Coverage
- [x] i18n (de/en)

## Phase 3b: Setup Wizard

- [ ] Setup page (`/setup`)
- [ ] Paperless-ngx URL + Token entry
- [ ] Connection test
- [ ] AI Provider selection (OpenAI, Google, Anthropic)
- [ ] API Key entry
- [ ] Model selection
- [ ] Step-by-step creation of PaperlessInstance, AiProvider, AiBot

## Phase 4: Docker & Testing Setup

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

## Phase 5: Customizable Dashboard System

### Database Schema

- [ ] `Dashboard` Model
  - [ ] `id`, `name`, `description`, `ownerId`
  - [ ] `isDefault` flag (system-wide default dashboard)
  - [ ] `gridCols` (number of columns, default: 12)
  - [ ] `createdAt`, `updatedAt`
- [ ] `DashboardTile` Model
  - [ ] `id`, `dashboardId`, `tileType` (enum)
  - [ ] `gridX`, `gridY`, `gridWidth`, `gridHeight`
  - [ ] `config` (JSON - tile-specific settings)
  - [ ] `order` (z-index for overlapping edge cases)
- [ ] `UserDashboardAccess` Join Table
  - [ ] `userId`, `dashboardId`, `permission` (READ, WRITE, ADMIN)
- [ ] Migration: Create default "Overview" dashboard on bootstrap

### Dashboard API

- [ ] CRUD endpoints for Dashboards (`/api/dashboards`)
- [ ] CRUD endpoints for Tiles (`/api/dashboards/[id]/tiles`)
- [ ] Permission checks (Owner + Sharing Model)
- [ ] Bulk update endpoint for tile positions (drag & drop saves)
- [ ] Clone dashboard endpoint

### Tile Types (React Components)

- [ ] `STATISTICS` - Processing statistics (documents processed, pending, failed)
- [ ] `RECENT_DOCUMENTS` - Recently processed documents list
- [ ] `QUEUE_STATUS` - Current queue status
- [ ] `PIE_CHART` - Configurable pie chart
  - [ ] Config: `metric` (documents_per_instance, token_per_model, token_per_instance, token_per_bot)
- [ ] `LINE_CHART` - Configurable line chart over time
  - [ ] Config: `metric` (documents_over_time, tokens_over_time), `timeRange`
- [ ] `QUICK_ACTIONS` - Buttons for common actions
- [ ] `MARKDOWN` - Custom markdown content (for notes)

### Tile Size Constraints

- [ ] Define `minWidth`, `minHeight` per tile type:
  - [ ] `STATISTICS`: min 3x2
  - [ ] `RECENT_DOCUMENTS`: min 4x3
  - [ ] `QUEUE_STATUS`: min 2x2
  - [ ] `PIE_CHART`: min 3x3
  - [ ] `LINE_CHART`: min 4x2
  - [ ] `QUICK_ACTIONS`: min 2x1
  - [ ] `MARKDOWN`: min 2x2
- [ ] Validate constraints on API level

### Grid System & Layout Engine

- [ ] 12-column responsive grid (CSS Grid or react-grid-layout)
- [ ] Responsive breakpoints:
  - [ ] Desktop (≥1200px): 12 columns
  - [ ] Tablet (≥768px): 8 columns
  - [ ] Mobile (<768px): 4 columns (stacked layout)
- [ ] Collision detection algorithm
- [ ] Auto-compact: Tiles float up to fill gaps

### Drag & Drop Editor

- [ ] Edit mode toggle (only for WRITE/ADMIN permission)
- [ ] Drag tiles to reposition
- [ ] Resize handles (corner + edges)
- [ ] Visual grid overlay in edit mode
- [ ] Collision handling strategy: **Block resize/move** if collision would occur
  - [ ] Visual feedback: Red outline when move/resize is blocked
  - [ ] Tooltip explaining why action is blocked
- [ ] Tile toolbar in edit mode:
  - [ ] Configure tile (opens config modal)
  - [ ] Delete tile
  - [ ] Duplicate tile
- [ ] Add tile button → opens tile type picker
- [ ] Undo/Redo for layout changes (in-memory, not persisted until save)
- [ ] Save/Cancel buttons (batch save all changes)

### Edge Case Handling

- [ ] **Resize blocked by neighbor**: Show ghost outline at max possible size, display tooltip
- [ ] **Drag to occupied space**: Preview shows where tile would push others (but we block, not push)
- [ ] **Tile exceeds grid bounds**: Clamp to grid boundary
- [ ] **Responsive shrink**: If tile min-width > available columns, tile spans full width
- [ ] **Empty dashboard**: Show "Add your first tile" placeholder
- [ ] **Last tile delete**: Prevent deleting last tile (dashboard must have ≥1 tile)
- [ ] **Concurrent edit**: Optimistic UI + conflict toast if save fails (reload to see changes)

### Default Dashboard

- [ ] System creates "Overview" dashboard on first boot
- [ ] Owned by system (no owner, or special system user)
- [ ] All users have implicit READ access
- [ ] Only ADMINs can edit the default dashboard
- [ ] Users can clone default dashboard to customize

### Dashboard UI Pages

- [ ] Dashboard view page (`/dashboard/[id]`)
- [ ] Dashboard list page (`/dashboards`) - shows user's dashboards + shared
- [ ] Dashboard settings modal (name, description, sharing)
- [ ] Redirect `/dashboard` to user's primary dashboard or default

### Responsive Strategy

- [ ] **Layout Persistence per Breakpoint**
  - [ ] Store separate tile positions for desktop/tablet/mobile in `DashboardTile.config`
  - [ ] Or: Auto-calculate positions based on column reduction algorithm
- [ ] **Column Collapse Algorithm**
  - [ ] When columns reduce (12→8→4), tiles maintain relative order
  - [ ] Tiles that no longer fit side-by-side stack vertically
  - [ ] Preserve user's manual arrangements where possible
- [ ] **Touch Support**
  - [ ] Long-press to enter edit mode on mobile
  - [ ] Larger touch targets for resize handles
  - [ ] Swipe gestures for tile actions (optional)
- [ ] **Performance on Mobile**
  - [ ] Lazy-load tile content below fold
  - [ ] Reduce chart complexity on mobile (fewer data points)
  - [ ] Skeleton loading for each tile independently

## Phase 5a: Document Processing

- [ ] Document List (`/documents`)
  - [ ] Show unprocessed documents
  - [ ] Filter by status
  - [ ] Trigger manual processing
- [ ] Document Detail Page (`/documents/[id]`)
  - [ ] Preview
  - [ ] AI analysis result
  - [ ] Confirm/reject changes

## Phase 6: AI Document Analysis

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

## Phase 7: Scheduled Processing

- [ ] node-cron Integration
- [ ] Configurable scan intervals
- [ ] Auto-Processing Toggle
- [ ] Processing Queue Management
- [ ] Retry logic on errors

## Phase 8: RAG / Chat Feature

- [ ] Document Indexing Service
- [ ] Vector Store Integration (optional)
- [ ] Chat Interface (`/chat`)
- [ ] Semantic Document Search
- [ ] Context-aware Q&A

## Phase 9: Advanced Features

- [ ] Configure custom prompts
- [ ] Rules Engine (which documents to process)
- [ ] Batch Processing
- [ ] Export/Import Settings
- [ ] Multi-User Support
- [ ] API for external integrations

## Phase 10: Polish & Release

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

1. **Setup Wizard** (Phase 3b) - Step-by-step wizard to create instances, providers, and bots
2. **Docker Compose Setup** (Phase 4) - Make the app production-ready deployable
3. **Customizable Dashboard System** (Phase 5) - Grid-based dashboard with drag & drop tiles
4. **Document Processing** (Phase 5a) - Document list and detail views
5. **AI Analysis** (Phase 6) - Implement core document analysis feature
