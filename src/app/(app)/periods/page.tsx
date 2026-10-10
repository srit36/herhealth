'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { useNavigate } from '@/lib/useNavigate';
import {
  type FlowLevel,
  type DayLog,
  emptyLog,
  initialPeriodLogs,
  symptomOptions,
  moodOptions,
} from '@/mock/periods';

export default function PeriodsPage() {
  return <Periods />;
}

function Periods() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [logs, setLogs] = useState<Record<number, DayLog>>(initialPeriodLogs);
  const [draft, setDraft] = useState<DayLog>(emptyLog());
  const [savedDay, setSavedDay] = useState<number | null>(null);

  const openDay = (day: number) => {
    setSelectedDay(day);
    setDraft(
      logs[day]
        ? { ...logs[day], symptoms: [...logs[day].symptoms] }
        : emptyLog(),
    );
    setSavedDay(null);
  };

  const toggleSymptom = (symptom: string) => {
    setDraft((current) => ({
      ...current,
      symptoms: current.symptoms.includes(symptom)
        ? current.symptoms.filter((item) => item !== symptom)
        : [...current.symptoms, symptom],
    }));
  };

  const saveLog = () => {
    if (selectedDay === null) return;
    setLogs((current) => ({ ...current, [selectedDay]: draft }));
    setSavedDay(selectedDay);
    setSelectedDay(null);
  };

  const calendarCells: Array<{ day: number; current: boolean; label: string }> =
    [
      { day: 28, current: false, label: 'September 28' },
      { day: 29, current: false, label: 'September 29' },
      { day: 30, current: false, label: 'September 30' },
      ...Array.from({ length: 31 }, (_, index) => ({
        day: index + 1,
        current: true,
        label: `October ${index + 1}`,
      })),
      { day: 1, current: false, label: 'November 1' },
    ];

  return (
    <>
      <section className="periods-header">
        <div>
          <div className="eyebrow">CYCLE TRACKING</div>
          <h1>Periods</h1>
          <p>
            Track your cycle, symptoms, and how you feel throughout each cycle.
          </p>
        </div>
        <div
          className="month-navigation"
          aria-label="Calendar month navigation"
        >
          <button type="button" aria-label="Previous month">
            <Icon name="chevronLeft" size={17} />
            <span>September</span>
          </button>
          <strong>October 2026</strong>
          <button type="button" aria-label="Next month">
            <span>November</span>
            <Icon name="chevronRight" size={17} />
          </button>
        </div>
      </section>

      {savedDay && (
        <div className="saved-message" role="status">
          <Icon name="check" size={17} />
          October {savedDay} was saved to your cycle.
        </div>
      )}

      <section className="periods-layout">
        <div className="calendar-card">
          <div className="calendar-title-row">
            <div>
              <h2>October 2026</h2>
              <p>Select any date to add or edit your health details.</p>
            </div>
            <div className="calendar-legend" aria-label="Calendar legend">
              <span>
                <i className="legend-flow" /> Period
              </span>
              <span>
                <i className="legend-symptom" /> Symptoms
              </span>
              <span>
                <i className="legend-note" /> Note
              </span>
            </div>
          </div>
          <div className="calendar-weekdays" aria-hidden="true">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {calendarCells.map((cell, index) => {
              const log = cell.current ? logs[cell.day] : undefined;
              const isPeriod = log && log.flow !== 'None';
              const isToday = cell.current && cell.day === 12;
              return (
                <button
                  type="button"
                  className={`calendar-day ${!cell.current ? 'outside' : ''} ${
                    isPeriod ? 'period-day' : ''
                  } ${isToday ? 'today' : ''}`}
                  key={`${cell.label}-${index}`}
                  onClick={() => cell.current && openDay(cell.day)}
                  disabled={!cell.current}
                  aria-label={`${cell.label}${log ? ', health details logged' : ''}`}
                >
                  <span className="day-number">{cell.day}</span>
                  {isToday && <span className="today-label">Today</span>}
                  {cell.current && (
                    <span className="day-indicators">
                      {isPeriod && (
                        <i
                          className={`flow-indicator flow-${log.flow.toLowerCase()}`}
                          title={`${log.flow} flow`}
                        />
                      )}
                      {log && log.symptoms.length > 0 && (
                        <i
                          className="symptom-indicator"
                          title="Symptoms logged"
                        />
                      )}
                      {log && log.note && (
                        <i className="note-indicator" title="Note added">
                          <Icon name="note" size={11} />
                        </i>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="cycle-summary">
          <div className="summary-heading">
            <div className="card-icon">
              <Icon name="period" />
            </div>
            <div>
              <div className="section-kicker">CURRENT CYCLE</div>
              <span>October 2026</span>
            </div>
          </div>
          <div className="cycle-day-display">
            <strong>12</strong>
            <span>Cycle day</span>
          </div>
          <div className="summary-facts">
            <div>
              <span>Cycle length</span>
              <strong>28 days</strong>
            </div>
            <div>
              <span>Period</span>
              <strong>Oct 1 – Oct 5</strong>
            </div>
          </div>
          <div className="estimate-box">
            <span>ESTIMATED NEXT PERIOD</span>
            <strong>Around Oct 29</strong>
            <p>
              Estimated from your recent cycles. Your actual dates may vary.
            </p>
          </div>
          <button
            type="button"
            className="secondary-button summary-log-button"
            onClick={() => openDay(12)}
          >
            Log today <Icon name="arrow" size={17} />
          </button>
        </aside>
      </section>

      <section className="cycle-history">
        <div className="section-heading">
          <div>
            <h2>Cycle history</h2>
            <p>Your three most recent cycles</p>
          </div>
          <button type="button" className="quiet-button">
            View all cycles
          </button>
        </div>
        <div className="history-list">
          {[
            ['October 2026', 'Oct 1 – Oct 5', '28-day cycle'],
            ['September 2026', 'Sep 3 – Sep 7', '29-day cycle'],
            ['August 2026', 'Aug 5 – Aug 9', '29-day cycle'],
          ].map(([month, period, length], index) => (
            <div className="history-item" key={month}>
              <div className={`history-flow ${index > 0 ? 'past' : ''}`}>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <strong>{month}</strong>
                <span>{period}</span>
              </div>
              <span className="history-length">{length}</span>
              <Icon name="chevronRight" size={16} />
            </div>
          ))}
        </div>
      </section>

      {selectedDay !== null && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setSelectedDay(null)}
            aria-label="Close date panel"
          />
          <aside
            className="date-panel"
            aria-label={`Log details for October ${selectedDay}`}
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">OCTOBER 2026</div>
                <h2>October {selectedDay}</h2>
                <p>Cycle Day {selectedDay}</p>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={() => setSelectedDay(null)}
                aria-label="Close"
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            <div className="panel-body">
              <fieldset className="log-fieldset">
                <legend>Flow</legend>
                <div className="flow-options">
                  {(
                    [
                      'None',
                      'Spotting',
                      'Light',
                      'Medium',
                      'Heavy',
                    ] as FlowLevel[]
                  ).map((flow) => (
                    <button
                      type="button"
                      className={draft.flow === flow ? 'selected' : ''}
                      onClick={() =>
                        setDraft((current) => ({ ...current, flow }))
                      }
                      key={flow}
                    >
                      <i className={`flow-choice flow-${flow.toLowerCase()}`} />
                      <span>{flow}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="log-fieldset">
                <legend>
                  Symptoms <span>Select all that apply</span>
                </legend>
                <div className="symptom-options">
                  {symptomOptions.map((symptom) => (
                    <button
                      type="button"
                      className={
                        draft.symptoms.includes(symptom) ? 'selected' : ''
                      }
                      onClick={() => toggleSymptom(symptom)}
                      key={symptom}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="log-fieldset">
                <legend>Mood</legend>
                <div className="mood-options">
                  {moodOptions.map((mood, index) => (
                    <button
                      type="button"
                      className={draft.mood === index + 1 ? 'selected' : ''}
                      onClick={() =>
                        setDraft((current) => ({ ...current, mood: index + 1 }))
                      }
                      key={mood}
                      aria-label={mood}
                    >
                      <span className={`mood-mark mood-${index + 1}`} />
                      <small>{mood}</small>
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="notes-field">
                <span>
                  Notes <small>Optional</small>
                </span>
                <textarea
                  value={draft.note}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      note: event.target.value,
                    }))
                  }
                  placeholder="Anything you want to remember..."
                  rows={3}
                />
              </label>
            </div>

            <div className="panel-footer">
              <span>Your entries are private to you.</span>
              <button
                type="button"
                className="primary-button"
                onClick={saveLog}
              >
                Save
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
