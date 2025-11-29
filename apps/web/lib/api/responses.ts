import { NextResponse } from 'next/server';

/**
 * Standard API error responses with translation keys and typed parameters
 */
export const ApiResponses = {
  // 401 Unauthorized
  unauthorized: () =>
    NextResponse.json({ error: 'Unauthorized', message: 'error.unauthorized' }, { status: 401 }),

  invalidCredentials: () =>
    NextResponse.json(
      { error: 'Authentication failed', message: 'error.invalidCredentials' },
      { status: 401 }
    ),

  accountSuspended: () =>
    NextResponse.json(
      { error: 'Authentication failed', message: 'error.accountSuspended' },
      { status: 401 }
    ),

  // 403 Forbidden
  forbidden: () =>
    NextResponse.json({ error: 'Forbidden', message: 'error.forbidden' }, { status: 403 }),

  // 404 Not Found
  notFound: (message: string = 'error.notFound') =>
    NextResponse.json({ error: 'Not found', message }, { status: 404 }),

  userNotFound: () =>
    NextResponse.json({ error: 'Not found', message: 'error.userNotFound' }, { status: 404 }),

  // 400 Bad Request
  badRequest: (message: string = 'error.invalidRequest') =>
    NextResponse.json({ error: 'Bad request', message }, { status: 400 }),

  validationError: () =>
    NextResponse.json(
      { error: 'Validation error', message: 'error.invalidRequest' },
      { status: 400 }
    ),

  invalidPasswordFormat: () =>
    NextResponse.json(
      { error: 'Validation error', message: 'error.invalidPasswordFormat' },
      { status: 400 }
    ),

  invalidUsernameOrPassword: () =>
    NextResponse.json(
      { error: 'Validation error', message: 'error.invalidUsernameOrPassword' },
      { status: 400 }
    ),

  currentPasswordIncorrect: () =>
    NextResponse.json(
      { error: 'Authentication failed', message: 'error.currentPasswordIncorrect' },
      { status: 400 }
    ),

  lastAdmin: () =>
    NextResponse.json({ error: 'Bad request', message: 'error.lastAdmin' }, { status: 400 }),

  cannotDeleteSelf: () =>
    NextResponse.json({ error: 'Bad request', message: 'error.cannotDeleteSelf' }, { status: 400 }),

  // 409 Conflict
  conflict: (message: string = 'error.conflict') =>
    NextResponse.json({ error: 'Conflict', message }, { status: 409 }),

  usernameExists: (params?: { username: string }) =>
    NextResponse.json(
      { error: 'Conflict', message: 'error.usernameExists', params },
      { status: 409 }
    ),

  // 500 Server Error
  serverError: (message: string = 'error.serverError') =>
    NextResponse.json({ error: 'Server error', message }, { status: 500 }),

  applicationNotConfigured: () =>
    NextResponse.json(
      { error: 'Server error', message: 'error.applicationNotConfigured' },
      { status: 500 }
    ),
} as const;
