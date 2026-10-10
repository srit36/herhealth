'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: call the sign-up API, then continue to consent.
    router.push('/consent');
  };

  return (
    <section className="auth-card">
      <div className="auth-brand">HERHEALTH</div>
      <h1>Create your account</h1>
      <p className="auth-lede">
        Start building a clearer picture of your health, in your own time.
      </p>
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-field">
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>
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
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <button type="submit" className="primary-button">
          Continue
        </button>
      </form>
      <p className="auth-alt">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </section>
  );
}
