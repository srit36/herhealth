import 'server-only';
import { z } from 'zod';
import { ApiError, type ApiErrorBody } from '@/lib/api/errors';
import { fieldErrors } from '@/lib/validation/auth';
import { logError } from '@/lib/log';

/**
 * Responses for route handlers. Health data must never be cached by the browser,
 * a CDN or a shared proxy, so every response is `no-store`.
 */
const baseHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export function json<T>(
  data: T,
  init: { status?: number; headers?: HeadersInit } = {},
) {
  return Response.json(data, {
    status: init.status ?? 200,
    headers: {
      ...baseHeaders,
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

export function errorResponse(error: unknown, routeName: string): Response {
  if (error instanceof ApiError) {
    const body: ApiErrorBody = {
      error: { code: error.code, message: error.message, fields: error.fields },
    };
    const headers: Record<string, string> = {};
    if (error.retryAfterSeconds)
      headers['Retry-After'] = String(error.retryAfterSeconds);
    return json(body, { status: error.status, headers });
  }

  if (error instanceof z.ZodError) {
    const fields = fieldErrors(error);
    const body: ApiErrorBody = {
      error: {
        code: 'validation',
        message: 'Some of the information is not valid.',
        fields,
      },
    };
    return json(body, { status: 400 });
  }

  // Unknown failure: log the error NAME only and answer with a generic message.
  logError('api.unhandled', error, { route: routeName });
  const body: ApiErrorBody = {
    error: {
      code: 'server_error',
      message: 'Something went wrong. Please try again.',
    },
  };
  return json(body, { status: 500 });
}

/** Read and parse a JSON body, with a clear 400 for malformed input. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw ApiError.badRequest('The request body must be valid JSON.');
  }
}

/**
 * Wrap a handler so thrown ApiErrors, validation errors and surprises all become
 * well-formed JSON responses.
 */
export function route<Args extends unknown[]>(
  routeName: string,
  handler: (...args: Args) => Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return errorResponse(error, routeName);
    }
  };
}
