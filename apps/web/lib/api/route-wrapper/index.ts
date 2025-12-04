import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiRoute } from './create-api-route';
import {
  AdminHandler,
  AuthenticatedHandler,
  PublicHandler,
  RouteOptions,
  RouteParams,
} from './types';

/**
 * Creates an admin-only API route handler.
 * Automatically handles authentication and admin role verification.
 *
 * @example
 * ```ts
 * export const GET = adminRoute(
 *   async ({ user }) => {
 *     const items = await prisma.item.findMany();
 *     return NextResponse.json({ items });
 *   },
 *   { errorLogPrefix: 'List items' }
 * );
 *
 * export const POST = adminRoute(
 *   async ({ body }) => {
 *     const item = await prisma.item.create({ data: body });
 *     return NextResponse.json(item, { status: 201 });
 *   },
 *   { bodySchema: CreateItemSchema, errorLogPrefix: 'Create item' }
 * );
 * ```
 */
export function adminRoute<
  TBodySchema extends z.ZodTypeAny = z.ZodUnknown,
  TParams extends Record<string, string> = Record<string, string>,
>(
  handler: AdminHandler<z.infer<TBodySchema>, TParams>,
  options?: RouteOptions<TBodySchema>
): (request: NextRequest, context?: RouteParams<TParams>) => Promise<NextResponse> {
  return createApiRoute(handler as Parameters<typeof createApiRoute>[0], {
    auth: 'admin',
    ...options,
  });
}

/**
 * Creates an authenticated API route handler.
 * Requires any logged-in user (not admin-specific).
 *
 * @example
 * ```ts
 * export const GET = authRoute(
 *   async ({ user }) => {
 *     return NextResponse.json({ userId: user.userId });
 *   },
 *   { errorLogPrefix: 'Get current user' }
 * );
 * ```
 */
export function authRoute<
  TBodySchema extends z.ZodTypeAny = z.ZodUnknown,
  TParams extends Record<string, string> = Record<string, string>,
>(
  handler: AuthenticatedHandler<z.infer<TBodySchema>, TParams>,
  options?: RouteOptions<TBodySchema>
): (request: NextRequest, context?: RouteParams<TParams>) => Promise<NextResponse> {
  return createApiRoute(handler as Parameters<typeof createApiRoute>[0], {
    auth: 'authenticated',
    ...options,
  });
}

/**
 * Creates a public API route handler.
 * No authentication required.
 *
 * @example
 * ```ts
 * export const POST = publicRoute(
 *   async ({ body }) => {
 *     const user = await authenticate(body);
 *     return NextResponse.json({ token: user.token });
 *   },
 *   { bodySchema: LoginSchema, errorLogPrefix: 'Login' }
 * );
 * ```
 */
export function publicRoute<
  TBodySchema extends z.ZodTypeAny = z.ZodUnknown,
  TParams extends Record<string, string> = Record<string, string>,
>(
  handler: PublicHandler<z.infer<TBodySchema>, TParams>,
  options?: RouteOptions<TBodySchema>
): (request: NextRequest, context?: RouteParams<TParams>) => Promise<NextResponse> {
  return createApiRoute(handler as Parameters<typeof createApiRoute>[0], {
    auth: 'none',
    ...options,
  });
}

export * from './types';
export { createApiRoute } from './create-api-route';
