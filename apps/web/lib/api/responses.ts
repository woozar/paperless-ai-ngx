import { NextResponse } from 'next/server';

/**
 * Standard API error responses with translation keys and typed parameters
 */
export const ApiResponses = {
  // 401 Unauthorized
  unauthorized: () =>
    NextResponse.json({ error: 'Unauthorized', message: 'unauthorized' }, { status: 401 }),

  invalidCredentials: () =>
    NextResponse.json(
      { error: 'Authentication failed', message: 'invalidCredentials' },
      { status: 401 }
    ),

  accountSuspended: () =>
    NextResponse.json(
      { error: 'Authentication failed', message: 'accountSuspended' },
      { status: 401 }
    ),

  // 403 Forbidden
  forbidden: () => NextResponse.json({ error: 'Forbidden', message: 'forbidden' }, { status: 403 }),

  // 404 Not Found
  notFound: (message: string = 'notFound') =>
    NextResponse.json({ error: 'Not found', message }, { status: 404 }),

  userNotFound: () =>
    NextResponse.json({ error: 'Not found', message: 'userNotFound' }, { status: 404 }),

  // 400 Bad Request
  badRequest: (message: string = 'invalidRequest') =>
    NextResponse.json({ error: 'Bad request', message }, { status: 400 }),

  validationError: () =>
    NextResponse.json({ error: 'Validation error', message: 'invalidRequest' }, { status: 400 }),

  invalidPasswordFormat: () =>
    NextResponse.json(
      { error: 'Validation error', message: 'invalidPasswordFormat' },
      { status: 400 }
    ),

  invalidUsernameOrPassword: () =>
    NextResponse.json(
      { error: 'Validation error', message: 'invalidUsernameOrPassword' },
      { status: 400 }
    ),

  currentPasswordIncorrect: () =>
    NextResponse.json(
      { error: 'Authentication failed', message: 'currentPasswordIncorrect' },
      { status: 400 }
    ),

  lastAdmin: () =>
    NextResponse.json({ error: 'Bad request', message: 'lastAdmin' }, { status: 400 }),

  cannotDeleteSelf: () =>
    NextResponse.json({ error: 'Bad request', message: 'cannotDeleteSelf' }, { status: 400 }),

  // 409 Conflict
  conflict: (message: string = 'conflict') =>
    NextResponse.json({ error: 'Conflict', message }, { status: 409 }),

  usernameExists: (params?: { username: string }) =>
    NextResponse.json({ error: 'Conflict', message: 'usernameExists', params }, { status: 409 }),

  // 500 Server Error
  serverError: (message: string = 'serverError') =>
    NextResponse.json({ error: 'Server error', message }, { status: 500 }),

  applicationNotConfigured: () =>
    NextResponse.json(
      { error: 'Server error', message: 'applicationNotConfigured' },
      { status: 500 }
    ),

  settingsParseError: (params: { key: string; value: string; errors: string }) =>
    NextResponse.json(
      { error: 'Settings parse error', message: 'settingsParseError', params },
      { status: 500 }
    ),

  settingsValidationError: (params: { key: string; value: string; expectedType: string }) =>
    NextResponse.json(
      { error: 'Settings validation error', message: 'settingsValidationError', params },
      { status: 400 }
    ),
} as const;
