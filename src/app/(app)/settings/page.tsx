'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { Toggle } from '@/components/Toggle';
import { useNavigate } from '@/lib/useNavigate';
import { type SettingsSection, settingsNavigation } from '@/mock/settings';

export default function SettingsPage() {
  const onNavigate = useNavigate();
  return <Settings onNavigate={onNavigate} />;
}

function Settings({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [section, setSection] = useState<SettingsSection>('Privacy & Data');
  const [aiInsights, setAiInsights] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [exported, setExported] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ananya',
    email: 'ananya@example.com',
    birthDate: '',
    preferredName: 'Ananya',
  });
  const [notifications, setNotifications] = useState({
    checkIn: true,
    period: true,
    consultation: true,
    insights: false,
  });
  const [reminderTime, setReminderTime] = useState('21:00');
  const [theme, setTheme] = useState('System');
  const [units, setUnits] = useState('Metric');
  const [twoFactor, setTwoFactor] = useState(false);
  const [signedOutOthers, setSignedOutOthers] = useState(false);

  return (
    <div className="settings-page">
      <section className="settings-header">
        <div className="eyebrow">YOUR HERHEALTH</div>
        <h1>Settings</h1>
        <p>Manage your account, privacy, and preferences.</p>
      </section>

      <div className="settings-layout">
        <aside className="settings-navigation" aria-label="Settings sections">
          <div>
            <span>SETTINGS</span>
            <strong>Manage your account</strong>
          </div>
          <nav>
            {settingsNavigation.map((item) => (
              <button
                type="button"
                className={section === item.label ? 'active' : ''}
                onClick={() => setSection(item.label)}
                key={item.label}
              >
                <Icon name={item.icon} size={17} />
                <span>{item.label}</span>
                <Icon name="chevronRight" size={14} />
              </button>
            ))}
          </nav>
          <div className="settings-nav-private">
            <Icon name="lock" size={15} />
            <p>Your settings and health information are private to you.</p>
          </div>
        </aside>

        <main className="settings-content">
          {section === 'Privacy & Data' && (
            <SettingsPanel
              title="Privacy & Data"
              description="You control what happens to your health information."
              eyebrow="YOUR INFORMATION"
            >
              <SettingsRow
                icon="vault"
                title="Your health information"
                description="HerHealth stores the information you choose to add, including check-ins, symptoms, periods, health records, consultations, and insights."
              >
                <button
                  type="button"
                  className="settings-secondary-action"
                  onClick={() => onNavigate('Health Timeline')}
                >
                  Manage health data
                </button>
              </SettingsRow>
              <SettingsRow
                icon="spark"
                title="AI-assisted insights"
                description="HerHealth may use information you’ve provided to generate personalized observations and help organize your health information."
              >
                <div className="toggle-with-label">
                  <Toggle
                    checked={aiInsights}
                    onChange={setAiInsights}
                    label="AI-assisted insights"
                  />
                  <span>{aiInsights ? 'On' : 'Off'}</span>
                </div>
                <small className="settings-help">
                  Turn this off if you don’t want HerHealth to generate
                  personalized insights. Your underlying health data will remain
                  in HerHealth.
                </small>
              </SettingsRow>
              <SettingsRow
                icon="download"
                title="Export your data"
                description="Download a copy of the health information you’ve stored in HerHealth."
              >
                <button
                  type="button"
                  className="settings-secondary-action"
                  onClick={() => setExported(true)}
                >
                  <Icon name="download" size={14} />{' '}
                  {exported ? 'Export prepared' : 'Export my data'}
                </button>
              </SettingsRow>
              <SettingsRow
                icon="trash"
                title="Delete your health data"
                description="Permanently remove your health information from HerHealth."
                danger
              >
                <button
                  type="button"
                  className="settings-danger-action"
                  onClick={() => setShowDelete(true)}
                >
                  Delete health data
                </button>
              </SettingsRow>
            </SettingsPanel>
          )}

          {section === 'Account' && (
            <SettingsPanel
              title="Account"
              description="Manage your profile and account details."
              eyebrow="YOUR ACCOUNT"
            >
              <section className="settings-subsection">
                <div className="subsection-heading">
                  <div>
                    <h2>Your profile</h2>
                    <p>The basic details associated with your account.</p>
                  </div>
                  <div className="settings-avatar">AS</div>
                </div>
                <div className="profile-fields">
                  <label>
                    <span>Name</span>
                    <input
                      value={profile.name}
                      disabled={!profileEditing}
                      onChange={(event) =>
                        setProfile((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      value={profile.email}
                      disabled={!profileEditing}
                      onChange={(event) =>
                        setProfile((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className="settings-secondary-action"
                  onClick={() => setProfileEditing((value) => !value)}
                >
                  {profileEditing ? 'Save profile' : 'Edit profile'}
                </button>
              </section>
              <section className="settings-subsection">
                <div className="subsection-heading">
                  <div>
                    <h2>Personalization</h2>
                    <p>
                      Optional details that help HerHealth address you
                      naturally.
                    </p>
                  </div>
                </div>
                <div className="profile-fields">
                  <label>
                    <span>
                      Date of birth <small>Optional</small>
                    </span>
                    <input
                      type="date"
                      value={profile.birthDate}
                      onChange={(event) =>
                        setProfile((current) => ({
                          ...current,
                          birthDate: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>
                      Preferred name <small>Optional</small>
                    </span>
                    <input
                      value={profile.preferredName}
                      onChange={(event) =>
                        setProfile((current) => ({
                          ...current,
                          preferredName: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
              </section>
              <section className="settings-subsection account-actions">
                <div>
                  <h2>Account actions</h2>
                  <p>Sign out of HerHealth on this device.</p>
                </div>
                <button type="button" className="settings-secondary-action">
                  Sign out
                </button>
              </section>
            </SettingsPanel>
          )}

          {section === 'Notifications' && (
            <SettingsPanel
              title="Notifications"
              description="Choose when HerHealth reminds you about things that matter."
              eyebrow="REMINDERS"
            >
              <ToggleRow
                title="Daily check-in reminder"
                description="Get reminded to complete your daily check-in."
                checked={notifications.checkIn}
                onChange={(value) =>
                  setNotifications((current) => ({
                    ...current,
                    checkIn: value,
                  }))
                }
              />
              <ToggleRow
                title="Period reminder"
                description="Get reminders related to your cycle tracking."
                checked={notifications.period}
                onChange={(value) =>
                  setNotifications((current) => ({ ...current, period: value }))
                }
              />
              <ToggleRow
                title="Consultation reminders"
                description="Get reminded about upcoming consultations you’ve added."
                checked={notifications.consultation}
                onChange={(value) =>
                  setNotifications((current) => ({
                    ...current,
                    consultation: value,
                  }))
                }
              />
              <ToggleRow
                title="Insight notifications"
                description="Get notified when HerHealth has a new pattern to show you."
                checked={notifications.insights}
                onChange={(value) =>
                  setNotifications((current) => ({
                    ...current,
                    insights: value,
                  }))
                }
              />
              <section className="reminder-time-row">
                <div>
                  <span>
                    <Icon name="calendar" size={17} />
                  </span>
                  <div>
                    <h2>Reminder time</h2>
                    <p>
                      Your daily check-in reminder will arrive at this time.
                    </p>
                  </div>
                </div>
                <label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(event) => setReminderTime(event.target.value)}
                  />
                  <span>{formatReminderTime(reminderTime)}</span>
                </label>
              </section>
            </SettingsPanel>
          )}

          {section === 'Preferences' && (
            <SettingsPanel
              title="Preferences"
              description="Choose how HerHealth looks and feels for you."
              eyebrow="APP PREFERENCES"
            >
              <PreferenceRow
                title="Theme"
                description="Choose an appearance for HerHealth."
              >
                <SegmentedSetting
                  options={['System', 'Light', 'Dark']}
                  value={theme}
                  onChange={setTheme}
                />
              </PreferenceRow>
              <PreferenceRow
                title="Measurement units"
                description="Choose the units used for health information."
              >
                <SegmentedSetting
                  options={['Metric', 'Imperial']}
                  value={units}
                  onChange={setUnits}
                />
              </PreferenceRow>
              <PreferenceRow
                title="Language"
                description="The language used throughout HerHealth."
              >
                <label className="settings-select">
                  <select defaultValue="English">
                    <option>English</option>
                  </select>
                  <Icon name="chevronRight" size={13} />
                </label>
              </PreferenceRow>
            </SettingsPanel>
          )}

          {section === 'Security' && (
            <SettingsPanel
              title="Security"
              description="Keep your HerHealth account protected."
              eyebrow="ACCOUNT SECURITY"
            >
              <SettingsRow
                icon="lock"
                title="Password"
                description="Last changed 3 months ago."
              >
                <button type="button" className="settings-secondary-action">
                  Change password
                </button>
              </SettingsRow>
              <section className="settings-subsection devices-section">
                <div className="subsection-heading">
                  <div>
                    <h2>Active devices</h2>
                    <p>Devices currently signed in to your account.</p>
                  </div>
                </div>
                <div className="device-row">
                  <span>
                    <Icon name="timeline" size={18} />
                  </span>
                  <div>
                    <strong>Windows · Chrome</strong>
                    <small>Current session · Bengaluru, India</small>
                  </div>
                  <b>CURRENT</b>
                </div>
                {!signedOutOthers && (
                  <div className="device-row">
                    <span>
                      <Icon name="mood" size={18} />
                    </span>
                    <div>
                      <strong>Android · Chrome</strong>
                      <small>Last active 2 days ago</small>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className="settings-secondary-action"
                  disabled={signedOutOthers}
                  onClick={() => setSignedOutOthers(true)}
                >
                  {signedOutOthers
                    ? 'Other devices signed out'
                    : 'Sign out of other devices'}
                </button>
              </section>
              <SettingsRow
                icon="vault"
                title="Two-factor authentication"
                description="Add an extra layer of security to your account."
              >
                <button
                  type="button"
                  className="settings-secondary-action"
                  onClick={() => setTwoFactor(true)}
                >
                  {twoFactor ? 'Set up started' : 'Set up'}
                </button>
              </SettingsRow>
            </SettingsPanel>
          )}

          <footer className="settings-privacy-footer">
            <span>
              <Icon name="lock" size={16} />
            </span>
            <div>
              <strong>Your health information belongs to you.</strong>
              <p>
                HerHealth is designed to help you organize and understand the
                information you choose to store.
              </p>
            </div>
            <button type="button" onClick={() => setSection('Privacy & Data')}>
              Learn about privacy <Icon name="arrow" size={14} />
            </button>
          </footer>
        </main>
      </div>

      {showDelete && (
        <>
          <button
            type="button"
            className="modal-scrim delete-scrim"
            onClick={() => setShowDelete(false)}
            aria-label="Cancel deletion"
          />
          <section
            className="delete-modal settings-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-health-title"
          >
            <span>
              <Icon name="trash" size={21} />
            </span>
            <h2 id="delete-health-title">Delete your health data?</h2>
            <p>
              This will permanently remove your health records, check-ins,
              periods, consultations, and other stored health information. This
              action cannot be undone.
            </p>
            <div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button type="button" className="delete-confirm">
                Delete permanently
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SettingsPanel({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="settings-panel">
      <header>
        <div className="section-kicker">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <div className="settings-panel-body">{children}</div>
    </section>
  );
}

function SettingsRow({
  icon,
  title,
  description,
  children,
  danger = false,
}: {
  icon: IconName;
  title: string;
  description: string;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <section className={`settings-row ${danger ? 'danger' : ''}`}>
      <span className="settings-row-icon">
        <Icon name={icon} size={18} />
      </span>
      <div className="settings-row-copy">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="settings-row-control">{children}</div>
    </section>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <section className="toggle-setting-row">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div>
        <span>{checked ? 'On' : 'Off'}</span>
        <Toggle checked={checked} onChange={onChange} label={title} />
      </div>
    </section>
  );
}

function PreferenceRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="preference-row">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function SegmentedSetting({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="settings-segmented">
      {options.map((option) => (
        <button
          type="button"
          className={value === option ? 'active' : ''}
          onClick={() => onChange(option)}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function formatReminderTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${period}`;
}
