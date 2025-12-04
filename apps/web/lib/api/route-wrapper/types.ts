import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { JwtPayload } from '@/lib/auth/jwt';

/**
 * Auth requirement levels for API routes
 */
export type AuthRequirement = 'none' | 'authenticated' | 'admin';

/**
 * Route context type for Next.js App Router dynamic routes
 */
export type RouteParams<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>;
};

/**
 * Base context passed to route handlers
 */
export type RouteContext<
  TBody = unknown,
  TParams extends Record<string, string> = Record<string, string>,
> = {
  request: NextRequest;
  user: JwtPayload | null;
  body: TBody;
  params: TParams;
};

/**
 * Context for authenticated routes (user is guaranteed to exist)
 */
export type AuthenticatedRouteContext<
  TBody = unknown,
  TParams extends Record<string, string> = Record<string, string>,
> = Omit<RouteContext<TBody, TParams>, 'user'> & {
  user: JwtPayload;
};

/**
 * Context for admin routes (user is guaranteed to be admin)
 */
export type AdminRouteContext<
  TBody = unknown,
  TParams extends Record<string, string> = Record<string, string>,
> = Omit<RouteContext<TBody, TParams>, 'user'> & {
  user: JwtPayload & { role: 'ADMIN' };
};

/**
 * Handler function for public routes (no auth required)
 */
export type PublicHandler<
  TBody = unknown,
  TParams extends Record<string, string> = Record<string, string>,
> = (ctx: RouteContext<TBody, TParams>) => Promise<NextResponse>;

/**
 * Handler function for authenticated routes (any logged-in user)
 */
export type AuthenticatedHandler<
  TBody = unknown,
  TParams extends Record<string, string> = Record<string, string>,
> = (ctx: AuthenticatedRouteContext<TBody, TParams>) => Promise<NextResponse>;

/**
 * Handler function for admin-only routes
 */
export type AdminHandler<
  TBody = unknown,
  TParams extends Record<string, string> = Record<string, string>,
> = (ctx: AdminRouteContext<TBody, TParams>) => Promise<NextResponse>;

/**
 * Configuration options for route wrapper
 */
export type RouteOptions<TBodySchema extends z.ZodTypeAny = z.ZodUnknown> = {
  /** Zod schema for request body validation */
  bodySchema?: TBodySchema;
  /** Prefix for error logging (e.g., "Create user") */
  errorLogPrefix?: string;
};
