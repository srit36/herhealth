/**
 * Hardened cookie options for Supabase's session cookies.
 *
 * By default @supabase/ssr leaves cookies readable by JavaScript, because its
 * BROWSER client needs to read them. HerHealth has no browser-side Supabase
 * client: every auth call happens on the server (server actions, route handlers,
 * proxy.ts). So the cookies can be HttpOnly, which means a script injected into a
 * page cannot read or steal the session.
 *
 * If you ever add a browser-side Supabase client, this must be revisited.
 */
export type CookieOptionsLike = {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
};

export function hardenCookieOptions(
  options: CookieOptionsLike | undefined,
  isProduction: boolean = process.env.NODE_ENV === 'production',
): CookieOptionsLike {
  return {
    ...options,
    path: options?.path ?? '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
  };
}
