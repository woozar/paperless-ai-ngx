# Project Conventions

## API Architecture

- We use API Routes instead of Server Actions to allow additional UIs
- We generate an OpenAPI file and create a client under `packages/` that we use from the frontend, additional apps, and E2E tests

## Component Design

When creating a new component, always decide:

1. **Smart vs Dumb Component**

   - **Smart (Container)**: Has business logic, fetches data, manages complex state
   - **Dumb (Presentational)**: Receives data via props, minimal internal state

2. **Internal vs External State**

   - **Internal state**: Form inputs in dialogs, UI toggles, loading states
   - **External state**: Data that affects multiple components, needs to persist

3. **Dialog Components**
   - Manage their own form state internally
   - Expose a simple callback (e.g., `onCreate`, `onSubmit`) that returns the form data
   - Handle loading/error states internally
   - Reset state when closing via `useEffect`

```tsx
// ✅ Good - Dialog manages its own state
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: FormData) => Promise<{ error?: string }>;
};

// ❌ Bad - Parent manages dialog's form state
type Props = {
  open: boolean;
  username: string;
  onUsernameChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  // ... many more callbacks
};
```

## Protected Routes & Authorization

**AppShell handles the Auth Loading State centrally.**

Pages that use AppShell don't need to worry about `isLoading` - AppShell automatically shows a loading skeleton while auth is initializing.

For pages with specific role requirements (e.g., Admin-only):

```tsx
const { user } = useAuth();

useEffect(() => {
  // No isLoading check needed - AppShell handles that
  if (user?.role !== 'ADMIN') {
    router.push('/');
  }
}, [user, router]);
```

**Note:** AppShell is used by all authenticated pages, but NOT by `/login` or `/change-password`.

## UI/Testing Conventions

- All input controls and buttons must have a `data-testid` attribute for reliable test selection
- Format: `data-testid="action-context"` (e.g., `data-testid="edit-user-user-1"`, `data-testid="submit-login"`)
- Never rely on element position for test selection

## User Feedback & Notifications

The application uses a unified toast notification system (sonner) for user feedback:

- **Success notifications**: Brief, auto-dismissing toasts (e.g., "User created successfully")
- **Error notifications**: Toasts with error messages from API responses
- **Info notifications**: For non-critical information
- **Warning notifications**: For warnings that require attention

**Implementation Guidelines:**

- Use `toast.error(t(response.error.message, response.error.params))` for API errors
- Use `toast.success(t('translationKey'))` for successful operations
- Never use inline error states in dialogs or forms
- Toast notifications appear at `top-right` position
- All error messages use translation keys from the API response

## Documentation

- **USER-STORIES.md** must be updated with every UI change
  - Add new features as user stories
  - Check off acceptance criteria when implemented
  - Format: `US-[CATEGORY]-[NR]` (e.g., `US-AUTH-001`)
- **ROADMAP.md** contains planned features and current progress
