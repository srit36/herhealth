'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: call the login API.
    router.push('/');
  };

  return (
    <section className="auth-card">
      <div className="auth-brand">HERHEALTH</div>
      <h1>Welcome back</h1>
      <p className="auth-lede">
        Log in to see your check-ins, timeline and insights.
      </p>
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-field">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="auth-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" className="primary-button">
          Log in
        </button>
      </form>
      <p className="auth-alt">
        New here? <Link href="/sign-up">Create an account</Link>
      </p>
    </section>
  );
}
