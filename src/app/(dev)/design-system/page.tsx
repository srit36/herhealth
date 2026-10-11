import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import {
  Badge,
  Button,
  buttonClasses,
  Card,
  CheckboxField,
  SelectField,
  StatTile,
  TextareaField,
  TextField,
} from '@/components/ui';

export const metadata: Metadata = {
  title: 'Design system · HerHealth',
  robots: { index: false, follow: false },
};

const swatches = [
  { name: 'ink', className: 'bg-ink' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'faint', className: 'bg-faint' },
  { name: 'line', className: 'bg-line' },
  { name: 'surface', className: 'bg-surface border border-line' },
  { name: 'canvas', className: 'bg-canvas border border-line' },
  { name: 'teal', className: 'bg-teal' },
  { name: 'teal-dark', className: 'bg-teal-dark' },
  { name: 'teal-soft', className: 'bg-teal-soft' },
  { name: 'teal-line', className: 'bg-teal-line' },
  { name: 'sage', className: 'bg-sage' },
  { name: 'sand', className: 'bg-sand' },
  { name: 'sidebar', className: 'bg-sidebar' },
  { name: 'danger', className: 'bg-danger' },
  { name: 'danger-soft', className: 'bg-danger-soft' },
  { name: 'warn', className: 'bg-warn' },
  { name: 'warn-strong', className: 'bg-warn-strong' },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

/** Developer-only page for checking components by eye. Hidden in production. */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs font-bold tracking-[0.13em] text-teal">
        DEVELOPMENT ONLY
      </p>
      <h1 className="mt-2 mb-10 font-display text-3xl font-bold text-ink">
        Design system
      </h1>

      <Section title="Colour tokens">
        <ul className="grid grid-cols-6 gap-3">
          {swatches.map((s) => (
            <li key={s.name} className="text-xs text-muted">
              <div className={`mb-1.5 h-12 rounded-field ${s.className}`} />
              {s.name}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Buttons">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="quiet">Quiet</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Saving</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <a
              href="#links"
              id="links"
              className={buttonClasses({ variant: 'secondary' })}
            >
              Link styled as button
            </a>
          </div>
          <div className="max-w-xs">
            <Button size="lg" fullWidth>
              Full width
            </Button>
          </div>
          <div>
            <p className="mb-2 text-xs text-muted">
              Current design, for comparison (legacy classes):
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="primary-button">
                Legacy primary
              </button>
              <button type="button" className="secondary-button">
                Legacy secondary
              </button>
              <button type="button" className="quiet-button">
                Legacy quiet
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge>Neutral</Badge>
          <Badge tone="teal">Teal</Badge>
          <Badge tone="warn">Warn</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="Cards and stat tiles">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-muted">Default card</p>
          </Card>
          <Card tone="soft" padding="sm">
            <p className="text-sm text-teal-dark">Soft card, small padding</p>
          </Card>
        </div>
        <Card className="mt-4">
          <div className="grid grid-cols-4 gap-6">
            <StatTile
              label="Sleep"
              value="7h 20m"
              note="Last night"
              level={72}
              icon={<Icon name="moon" />}
            />
            <StatTile
              label="Mood"
              value="Good"
              note="Today"
              level={80}
              icon={<Icon name="mood" />}
            />
            <StatTile label="Energy" value="Moderate" level={60} />
            <StatTile label="Stress" value="—" note="No data yet" />
          </div>
        </Card>
      </Section>

      <Section title="Form fields">
        <Card>
          <div className="grid max-w-md gap-4">
            <TextField
              label="Email"
              type="email"
              placeholder="you@example.com"
              hint="We never share your email."
            />
            <TextField
              label="Password"
              type="password"
              required
              error="Use at least 12 characters."
            />
            <SelectField label="Flow level">
              <option>Light</option>
              <option>Medium</option>
              <option>Heavy</option>
            </SelectField>
            <TextareaField
              label="Notes"
              placeholder="Anything else to remember?"
            />
            <CheckboxField label="I am 18 years or older" boxed />
            <CheckboxField
              label="I agree to the terms"
              boxed
              error="You must agree to continue."
            />
          </div>
        </Card>
      </Section>
    </main>
  );
}
