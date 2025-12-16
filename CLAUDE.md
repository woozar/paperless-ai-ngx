# Project Conventions

## API Architecture

- We use API Routes instead of Server Actions to allow additional UIs
- We generate an OpenAPI file and create a client under `packages/` that we use from the frontend, additional apps, and E2E tests

### API Client Usage

**ALWAYS use the generated API client from `@repo/api-client` for all API calls.**

```tsx
// ✅ Good - Use generated client
import { client } from '@repo/api-client';

const { data, error } = await client.GET('/api/users');
const { data, error } = await client.POST('/api/users', { body: { username, password } });

// ❌ Bad - Never use raw fetch
const response = await fetch('/api/users');
const response = await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify({ username, password }),
});
```

**Regenerate the client after API changes:**

```bash
pnpm generate
```

This ensures:

- Type safety for request/response payloads
- Consistent error handling
- OpenAPI spec stays in sync with implementation

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

## Performance Optimization

**Core principle:** Only memoize when it actually prevents re-renders.

### When to use `memo()`

- List items rendered in a `.map()` (e.g., TableRow components)
- Components that receive stable props from parent

```tsx
// ✅ Good - prevents re-render when other list items change
export const BotTableRow = memo(function BotTableRow({ bot, onEdit, onDelete, formatDate }) {
  return <TableRow>...</TableRow>;
});
```

### When to use `useMemo`/`useCallback`

- Props passed to `memo()` components that would otherwise be new references
- Values used in dependency arrays of other hooks
- Repeated patterns → extract into a custom hook (e.g., `useFormatDate`)

```tsx
// ✅ Good - stabilizes prop for memo() child
const formatDate = useFormatDate(); // hook encapsulates useMemo

// ❌ Bad - useMemo inside memo() component is usually pointless
const showShareButton = useMemo(() => mode === 'ADVANCED', [mode]); // just use: mode === 'ADVANCED'
```

### When NOT to memoize

- Simple operations (string comparisons, boolean logic)
- Callbacks inside `memo()` components (if memo blocks render, callback isn't called anyway)
- Props for components without `memo()`
- State setters from `useState` (already stable)

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

- **`user-stories/`** folder must be updated with every UI change
  - One file per user story (e.g., `user-stories/auth/US-AUTH-001.md`)
  - Add new features as user stories in the appropriate category folder
  - Format: `US-[CATEGORY]-[NR]` (e.g., `US-AUTH-001`)
  - Categories: `auth/`, `nav/`, `admin/`, `i18n/`, `sharing/`, `settings/`, `doc/`
- **ROADMAP.md** contains planned features and current progress
- **README.md Release Notes** must be kept up-to-date
  - Write user-focused entries describing the value for the user
  - Avoid technical implementation details
  - Focus on what users can now do, not how it was built

```markdown
// ✅ Good - User-focused

- Share AI bots with other users
- Deploy with a single command

// ❌ Bad - Technical details

- Added UserAiBotAccess join table
- Docker Compose with turbo prune optimization
```

## Code Coverage

To exclude a line from code coverage, use the v8 ignore directive:

```ts
// v8 ignore next -- @preserve
```

## Test Execution

When analyzing test output (e.g., checking coverage, finding failures), always write the output to a temp file first if you need to grep multiple times:

```bash
# ✅ Good - Run once, grep multiple times
pnpm --filter web test:coverage > /tmp/coverage-output.txt 2>&1
grep "All files" /tmp/coverage-output.txt
grep "FAIL" /tmp/coverage-output.txt

# ❌ Bad - Running tests multiple times
pnpm --filter web test:coverage 2>&1 | grep "All files"
pnpm --filter web test:coverage 2>&1 | grep "FAIL"
```

This saves time and avoids unnecessary test re-runs.
