'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const consents = [
  {
    id: 'terms',
    required: true,
    text: 'I agree to the Terms of Use and Privacy Policy.',
  },
  {
    id: 'health-data',
    required: true,
    text: 'I consent to HerHealth storing and processing the health information I enter.',
  },
  {
    id: 'ai',
    required: false,
    text: 'I would like AI-generated summaries and insights based on my data (optional).',
  },
  {
    id: 'research',
    required: false,
    text: "Share de-identified data to help improve women's health research (optional).",
  },
];

export default function ConsentPage() {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const ready = consents.filter((c) => c.required).every((c) => checked[c.id]);

  return (
    <section className="auth-card">
      <div className="auth-brand">HERHEALTH</div>
      <h1>Your data, your choice</h1>
      <p className="auth-lede">
        Review what you are comfortable sharing. You can change optional choices
        later in Settings.
      </p>
      <ul className="consent-list">
        {consents.map((c) => (
          <li key={c.id}>
            <label>
              <input
                type="checkbox"
                checked={Boolean(checked[c.id])}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [c.id]: e.target.checked }))
                }
              />
              <span>{c.text}</span>
            </label>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="primary-button"
        disabled={!ready}
        onClick={() => {
          // TODO: persist consent choices via the API.
          router.push('/');
        }}
      >
        Continue to HerHealth
      </button>
    </section>
  );
}
