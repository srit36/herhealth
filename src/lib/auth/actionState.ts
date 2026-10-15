/** What an auth server action returns to its form (via useActionState). */
export type ActionState = {
  status: 'idle' | 'error' | 'success';
  /** A message for the whole form. */
  message?: string;
  /** Messages for single fields, keyed by field name. */
  fieldErrors?: Record<string, string>;
  /** Set when a login failed only because the email is not verified yet. */
  needsVerification?: boolean;
  /** The email the action was about, so a follow-up form can reuse it. */
  email?: string;
};

export const initialActionState: ActionState = { status: 'idle' };
