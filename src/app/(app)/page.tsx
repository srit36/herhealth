'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { UPCOMING_APPOINTMENT } from '@/mock/today';
import { useNavigate } from '@/lib/useNavigate';
import { metrics } from '@/mock/home';

export default function HomePage() {
  const onNavigate = useNavigate();
  return (
    <Home
      checkInStarted={false}
      onStartCheckIn={() => onNavigate('Daily Check-in')}
      onNavigate={onNavigate}
    />
  );
}

function Home({
  checkInStarted,
  onStartCheckIn,
  onNavigate,
}: {
  checkInStarted: boolean;
  onStartCheckIn: () => void;
  onNavigate: (page: string) => void;
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">YOUR HEALTH, TODAY</div>
          <h1>Good afternoon, Ananya</h1>
          <p>Here’s your health at a glance.</p>
        </div>
        <div className="cycle-status">
          <span className="status-dot" />
          <div>
            <span>Cycle day 18</span>
            <small>Next period in ~10 days</small>
          </div>
        </div>
      </section>

      <section className="hero-grid" aria-label="Today’s overview">
        <div className="checkin-card">
          <div className="checkin-topline">
            <div className="card-icon">
              <Icon name="check" />
            </div>
            <div className="time-badge">2–3 min</div>
          </div>
          <div className="checkin-copy">
            <div className="section-kicker">TODAY’S CHECK-IN</div>
            <h2>
              {checkInStarted ? 'Check-in ready' : 'How are you feeling today?'}
            </h2>
            <p>
              {checkInStarted
                ? 'Your daily check-in has been opened. You can continue whenever you’re ready.'
                : 'A few quick questions help you notice patterns in your mood, symptoms, and energy.'}
            </p>
          </div>
          <div className="checkin-footer">
            <button
              type="button"
              className="primary-button"
              onClick={onStartCheckIn}
            >
              <span>
                {checkInStarted
                  ? 'Continue check-in'
                  : 'Start today’s check-in'}
              </span>
              <Icon name="arrow" size={18} />
            </button>
            <div className="streak">
              <span className="streak-number">5</span>
              <span>day streak</span>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-heading">
            <div className="spark-icon">
              <Icon name="spark" size={21} />
            </div>
            <div>
              <div className="section-kicker">SOMETHING WE NOTICED</div>
              <div className="insight-date">Based on your last 14 days</div>
            </div>
          </div>
          <blockquote>
            Your energy tends to feel steadier on days after you get more than 7
            hours of sleep.
          </blockquote>
          <div
            className="insight-chart"
            aria-label="Energy trend rising over five days"
          >
            {[36, 44, 39, 62, 78, 72, 88].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => onNavigate('Insights')}
          >
            View your insights <Icon name="arrow" size={16} />
          </button>
        </div>
      </section>

      <section className="glance-section">
        <div className="section-heading">
          <div>
            <h2>Health at a glance</h2>
            <p>From your most recent check-in and connected data</p>
          </div>
          <button
            type="button"
            className="quiet-button"
            onClick={() => onNavigate('Health Timeline')}
          >
            View timeline <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="metric-row">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <div className="metric-icon">
                <Icon name={metric.icon} size={19} />
              </div>
              <div className="metric-content">
                <div className="metric-label">{metric.label}</div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-note">{metric.note}</div>
              </div>
              <div className="metric-track">
                <span style={{ width: `${metric.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lower-grid">
        <div className="activity-panel">
          <div className="section-heading compact">
            <div>
              <h2>Recent activity</h2>
              <p>Your latest health updates</p>
            </div>
            <button
              type="button"
              className="quiet-button"
              onClick={() => onNavigate('Health Timeline')}
            >
              See all
            </button>
          </div>
          <div className="activity-list">
            <ActivityItem
              icon="check"
              title="Daily check-in completed"
              detail="Mood good · Energy 6/10 · No new symptoms"
              time="Yesterday, 8:42 PM"
            />
            <ActivityItem
              icon="vault"
              title="Blood test report added"
              detail="Complete Blood Count · Apollo Diagnostics"
              time="21 Jun"
            />
            <ActivityItem
              icon="period"
              title="Period ended"
              detail="5 day duration · Flow lighter than usual"
              time="16 Jun"
              last
            />
          </div>
        </div>

        <aside className="consult-card">
          <div className="consult-top">
            <div className="consult-icon">
              <Icon name="consultation" size={22} />
            </div>
            <div className="appointment-label">UPCOMING APPOINTMENT</div>
          </div>
          <h2>{UPCOMING_APPOINTMENT.doctor}</h2>
          <p>
            {UPCOMING_APPOINTMENT.specialty} · {UPCOMING_APPOINTMENT.when}
          </p>
          <div className="prep-status">
            <div className="prep-ring">2/4</div>
            <div>
              <strong>Your consultation brief is in progress</strong>
              <span>Add recent questions and symptoms before your visit.</span>
            </div>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => onNavigate('Consultation')}
          >
            Continue preparing <Icon name="arrow" size={17} />
          </button>
        </aside>
      </section>

      <footer className="disclaimer">
        HerHealth helps you organize and understand your personal health
        information. It does not provide medical advice or diagnoses.
      </footer>
    </>
  );
}

function ActivityItem({
  icon,
  title,
  detail,
  time,
  last = false,
}: {
  icon: IconName;
  title: string;
  detail: string;
  time: string;
  last?: boolean;
}) {
  return (
    <div className={`activity-item ${last ? 'last' : ''}`}>
      <div className="activity-marker">
        <div>
          <Icon name={icon} size={17} />
        </div>
      </div>
      <div className="activity-copy">
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <time>{time}</time>
    </div>
  );
}
