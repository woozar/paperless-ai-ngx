import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser, JwtPayload } from '@/lib/auth/jwt';
import { ApiResponses } from '../responses';
import { AuthRequirement, RouteParams, RouteContext, RouteOptions } from './types';

type InternalRouteOptions<TBodySchema extends z.ZodTypeAny = z.ZodUnknown> =
  RouteOptions<TBodySchema> & {
    auth: AuthRequirement;
  };

/**
 * Creates a wrapped API route handler with automatic auth, validation, and error handling.
 *
 * @param handler - The business logic handler function
 * @param options - Configuration options (auth level, body schema, error prefix)
 * @returns A Next.js API route handler function
 */
export function createApiRoute<
  TBodySchema extends z.ZodTypeAny = z.ZodUnknown,
  TParams extends Record<string, string> = Record<string, string>,
>(
  handler: (ctx: RouteContext<z.infer<TBodySchema>, TParams>) => Promise<NextResponse>,
  options: InternalRouteOptions<TBodySchema>
): (request: NextRequest, context?: RouteParams<TParams>) => Promise<NextResponse> {
  const { auth, bodySchema, errorLogPrefix = 'API' } = options;

  return async (
    request: NextRequest,
    routeContext?: RouteParams<TParams>
  ): Promise<NextResponse> => {
    try {
      // 1. Extract route params if present
      const params = routeContext ? await routeContext.params : ({} as TParams);

      // 2. Handle authentication
      let user: JwtPayload | null = null;

      if (auth !== 'none') {
        user = await getAuthUser(request);

        if (!user) {
          console.error(`[${errorLogPrefix}] Auth failed: no user`);
          return ApiResponses.unauthorized();
        }

        if (auth === 'admin' && user.role !== 'ADMIN') {
          console.error(`[${errorLogPrefix}] Auth failed: not admin`);
          return ApiResponses.forbidden();
        }
      }

      // 3. Handle body validation
      let body: z.infer<TBodySchema> = undefined as z.infer<TBodySchema>;

      if (bodySchema) {
        try {
          const rawBody = await request.json();
          const parsed = bodySchema.safeParse(rawBody);

          if (!parsed.success) {
            console.error(`[${errorLogPrefix}] Validation error:`, parsed.error.issues);
            return ApiResponses.validationError();
          }

          body = parsed.data;
        } catch (parseError) {
          // JSON parse error
          console.error(`[${errorLogPrefix}] JSON parse error:`, parseError);
          return ApiResponses.validationError();
        }
      }

      // 4. Call the handler with typed context
      const ctx: RouteContext<z.infer<TBodySchema>, TParams> = {
        request,
        user,
        body,
        params,
      };

      return await handler(ctx);
    } catch (error) {
      console.error(`[${errorLogPrefix}] error:`, error);
      return ApiResponses.serverError();
    }
  };
}
