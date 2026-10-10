'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { moodOptions } from '@/mock/periods';
import { useNavigate } from '@/lib/useNavigate';
import { type CheckInSeverity, checkInSymptoms } from '@/mock/check-in';

export default function CheckInPage() {
  const onNavigate = useNavigate();
  return <DailyCheckIn onNavigate={onNavigate} />;
}

function DailyCheckIn({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [mood, setMood] = useState(4);
  const [energy, setEnergy] = useState(6);
  const [sleepHours, setSleepHours] = useState('7');
  const [sleepMinutes, setSleepMinutes] = useState('30');
  const [sleepQuality, setSleepQuality] = useState('Good');
  const [stress, setStress] = useState('Low');
  const [symptoms, setSymptoms] = useState<Record<string, CheckInSeverity>>({
    Fatigue: 'Moderate',
    Bloating: 'Mild',
  });
  const [note, setNote] = useState(
    'Felt a little tired after lunch, but an evening walk helped.',
  );
  const [complete, setComplete] = useState(false);

  const toggleCheckInSymptom = (symptom: string) => {
    setSymptoms((current) => {
      const next = { ...current };
      if (next[symptom]) {
        delete next[symptom];
      } else {
        next[symptom] = 'Mild';
      }
      return next;
    });
  };

  if (complete) {
    return (
      <section className="checkin-success">
        <div className="success-mark">
          <Icon name="check" size={29} />
        </div>
        <div className="eyebrow">MONDAY, OCTOBER 5</div>
        <h1>Check-in complete</h1>
        <p>Your check-in has been added to your health timeline.</p>
        <div className="success-summary">
          <div>
            <span>Mood</span>
            <strong>Good</strong>
          </div>
          <div>
            <span>Energy</span>
            <strong>{energy} / 10</strong>
          </div>
          <div>
            <span>Sleep</span>
            <strong>
              {sleepHours}h {sleepMinutes}m
            </strong>
          </div>
        </div>
        <div className="success-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setComplete(false)}
          >
            View today’s entry
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate('Home')}
          >
            Back to Home <Icon name="arrow" size={17} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="daily-checkin-page">
      <section className="daily-header">
        <div>
          <div className="eyebrow">2 MINUTE CHECK-IN</div>
          <h1>Daily Check-in</h1>
          <p>Take a moment to check in with yourself.</p>
        </div>
        <div className="checkin-date">
          <div className="card-icon">
            <Icon name="calendar" size={19} />
          </div>
          <div>
            <span>MONDAY</span>
            <strong>October 5, 2026</strong>
          </div>
        </div>
      </section>

      <div className="checkin-form">
        <CheckInSection
          number="01"
          label="Mood"
          question="How are you feeling today?"
        >
          <div className="large-mood-options">
            {moodOptions.map((label, index) => (
              <button
                type="button"
                className={mood === index + 1 ? 'selected' : ''}
                onClick={() => setMood(index + 1)}
                key={label}
              >
                <span className={`mood-mark mood-${index + 1}`} />
                <strong>{label}</strong>
              </button>
            ))}
          </div>
        </CheckInSection>

        <CheckInSection
          number="02"
          label="Energy"
          question="How is your energy today?"
        >
          <div className="energy-scale">
            <div className="energy-numbers">
              {Array.from({ length: 10 }, (_, index) => (
                <button
                  type="button"
                  className={energy === index + 1 ? 'selected' : ''}
                  onClick={() => setEnergy(index + 1)}
                  key={index + 1}
                  aria-label={`Energy ${index + 1} out of 10`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="scale-labels">
              <span>1 — Low</span>
              <span>10 — High</span>
            </div>
          </div>
        </CheckInSection>

        <CheckInSection
          number="03"
          label="Sleep"
          question="How did you sleep last night?"
        >
          <div className="sleep-layout">
            <div className="sleep-duration">
              <span className="input-label">Sleep duration</span>
              <div className="duration-inputs">
                <label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={sleepHours}
                    onChange={(event) => setSleepHours(event.target.value)}
                    aria-label="Hours slept"
                  />
                  <span>Hours</span>
                </label>
                <i>:</i>
                <label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={sleepMinutes}
                    onChange={(event) => setSleepMinutes(event.target.value)}
                    aria-label="Additional minutes slept"
                  />
                  <span>Minutes</span>
                </label>
              </div>
            </div>
            <div className="sleep-quality">
              <span className="input-label">How was your sleep?</span>
              <div className="segmented-options four">
                {['Poor', 'Fair', 'Good', 'Great'].map((quality) => (
                  <button
                    type="button"
                    className={sleepQuality === quality ? 'selected' : ''}
                    onClick={() => setSleepQuality(quality)}
                    key={quality}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CheckInSection>

        <CheckInSection
          number="04"
          label="Stress"
          question="How would you describe your stress today?"
        >
          <div className="segmented-options five">
            {['Very low', 'Low', 'Moderate', 'High', 'Very high'].map(
              (level) => (
                <button
                  type="button"
                  className={stress === level ? 'selected' : ''}
                  onClick={() => setStress(level)}
                  key={level}
                >
                  <i
                    className={`stress-level stress-${level.replace(' ', '-').toLowerCase()}`}
                  />
                  {level}
                </button>
              ),
            )}
          </div>
        </CheckInSection>

        <CheckInSection
          number="05"
          label="Symptoms"
          question="Are you experiencing anything you’d like to track today?"
          detail="Select only what feels relevant."
        >
          <div className="checkin-symptoms">
            {checkInSymptoms.map((symptom) => (
              <button
                type="button"
                className={symptoms[symptom] ? 'selected' : ''}
                onClick={() => toggleCheckInSymptom(symptom)}
                key={symptom}
              >
                <span className="chip-check">
                  {symptoms[symptom] && <Icon name="check" size={12} />}
                </span>
                {symptom}
              </button>
            ))}
          </div>
          {Object.keys(symptoms).length > 0 && (
            <div className="severity-list">
              <div className="severity-heading">
                <span>Selected symptoms</span>
                <span>Severity</span>
              </div>
              {Object.entries(symptoms).map(([symptom, severity]) => (
                <div className="severity-row" key={symptom}>
                  <strong>{symptom}</strong>
                  <div>
                    {(['Mild', 'Moderate', 'Severe'] as CheckInSeverity[]).map(
                      (level) => (
                        <button
                          type="button"
                          className={severity === level ? 'selected' : ''}
                          onClick={() =>
                            setSymptoms((current) => ({
                              ...current,
                              [symptom]: level,
                            }))
                          }
                          key={level}
                        >
                          {level}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CheckInSection>

        <CheckInSection
          number="06"
          label="Note"
          question="Anything else?"
          detail="Optional"
        >
          <label className="daily-note">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a note about today..."
              rows={4}
            />
            <span>{note.length} / 500</span>
          </label>
        </CheckInSection>

        <div className="checkin-save">
          <div>
            <Icon name="check" size={16} />
            <span>You can edit today’s check-in anytime.</span>
          </div>
          <button
            type="button"
            className="primary-button checkin-save-button"
            onClick={() => setComplete(true)}
          >
            Save check-in <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckInSection({
  number,
  label,
  question,
  detail,
  children,
}: {
  number: string;
  label: string;
  question: string;
  detail?: string;
  children: ReactNode;
}) {
  return (
    <section className="checkin-section">
      <div className="checkin-section-label">
        <span>{number}</span>
        <strong>{label}</strong>
      </div>
      <div className="checkin-section-content">
        <div className="checkin-question">
          <h2>{question}</h2>
          {detail && <span>{detail}</span>}
        </div>
        {children}
      </div>
    </section>
  );
}
