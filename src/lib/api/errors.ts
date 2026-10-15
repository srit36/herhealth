/**
 * An error that is safe to show to the caller: a stable `code` the UI can switch
 * on, and a plain-language message. Never put database, auth-library or user
 * content in `message`.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string>;

  constructor(
    status: number,
    code: string,
    message: string,
    fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }

  static badRequest(message: string, fields?: Record<string, string>) {
    return new ApiError(400, 'validation', message, fields);
  }
  static unauthorized() {
    return new ApiError(401, 'unauthorized', 'Please sign in to continue.');
  }
  static consentRequired() {
    return new ApiError(
      403,
      'consent_required',
      'Please complete the consent step to continue.',
    );
  }
  static forbidden(message = 'This request was blocked.') {
    return new ApiError(403, 'forbidden', message);
  }
  static notFound(message = 'Not found.') {
    return new ApiError(404, 'not_found', message);
  }
  static tooManyRequests(retryAfterSeconds: number) {
    const error = new ApiError(
      429,
      'rate_limited',
      'Too many requests. Please wait a moment and try again.',
    );
    error.retryAfterSeconds = retryAfterSeconds;
    return error;
  }

  retryAfterSeconds?: number;
}

/** The JSON body of every error response. */
export type ApiErrorBody = {
  error: { code: string; message: string; fields?: Record<string, string> };
};
