'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { useNavigate } from '@/lib/useNavigate';
import {
  type WellnessPanelMode,
  type WellnessRecommendation,
  type WellnessGoal,
} from '@/mock/nutrition';

export default function NutritionPage() {
  const onNavigate = useNavigate();
  return <NutritionLifestyle onNavigate={onNavigate} />;
}

function NutritionLifestyle({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [water, setWater] = useState(5);
  const [panel, setPanel] = useState<WellnessPanelMode>(null);
  const [message, setMessage] = useState('');
  const [recommendations, setRecommendations] = useState<
    WellnessRecommendation[]
  >([
    {
      title: 'Prioritize regular sleep',
      description: 'Aim to maintain a consistent sleep schedule.',
      category: 'Sleep',
      status: 'In progress',
    },
    {
      title: 'Include more iron-rich foods',
      description: 'Add more iron-rich foods to your meals.',
      category: 'Nutrition',
      status: 'In progress',
    },
    {
      title: 'Stay hydrated',
      description: 'Keep track of your daily water intake.',
      category: 'Nutrition',
      status: 'Active',
    },
  ]);
  const [goals, setGoals] = useState<WellnessGoal[]>([
    {
      title: 'Drink 2L of water',
      progress: 5,
      total: 7,
      unit: 'days',
      category: 'Nutrition',
    },
    {
      title: 'Walk regularly',
      progress: 4,
      total: 5,
      unit: 'days',
      category: 'Movement',
    },
    {
      title: 'Sleep before 11:30 PM',
      progress: 3,
      total: 7,
      unit: 'days',
      category: 'Sleep',
    },
  ]);
  const [draftCategory, setDraftCategory] = useState('Nutrition');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftNote, setDraftNote] = useState('');
  const [draftTarget, setDraftTarget] = useState('');
  const [draftFrequency, setDraftFrequency] = useState('Daily');
  const hasLifestyleData = true;

  const closePanel = () => {
    setPanel(null);
    setDraftTitle('');
    setDraftNote('');
    setDraftTarget('');
  };

  const savePanel = () => {
    if (panel === 'recommendation') {
      setRecommendations((current) => [
        ...current,
        {
          title: draftTitle || 'New wellness recommendation',
          description:
            draftNote || 'A personal recommendation to keep in mind.',
          category: draftCategory,
          status: 'In progress',
        },
      ]);
      setMessage('Your recommendation was added.');
    } else if (panel === 'goal') {
      setGoals((current) => [
        ...current,
        {
          title: draftTitle || 'New wellness goal',
          progress: 0,
          total: Number(draftTarget) || (draftFrequency === 'Daily' ? 7 : 4),
          unit: draftFrequency === 'Daily' ? 'days' : 'weeks',
          category: draftCategory,
        },
      ]);
      setMessage('Your wellness goal was created.');
    } else if (panel === 'food') {
      setMessage('Your food note was added.');
    } else if (panel === 'activity') {
      setMessage('Today’s activity was logged.');
    }
    closePanel();
  };

  if (!hasLifestyleData) {
    return <WellnessEmptyState onNavigate={onNavigate} onOpen={setPanel} />;
  }

  return (
    <div className="wellness-page">
      <section className="wellness-header">
        <div className="eyebrow">EVERYDAY WELLBEING</div>
        <h1>Nutrition &amp; Lifestyle</h1>
        <p>
          Support your everyday health with habits and recommendations that fit
          your life.
        </p>
      </section>

      {message && (
        <div className="vault-message wellness-message" role="status">
          <Icon name="check" size={16} /> {message}
          <button
            type="button"
            onClick={() => setMessage('')}
            aria-label="Dismiss"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <section className="today-focus">
        <div className="focus-copy">
          <div className="focus-label">
            <span>
              <Icon name="spark" size={17} />
            </span>
            <div>
              <strong>TODAY’S FOCUS</strong>
              <small>Based on your recent check-ins</small>
            </div>
          </div>
          <h2>Your sleep has been a little lower than usual this week.</h2>
          <p>
            You’ve averaged about 6h 35m of sleep over the last 7 days, compared
            with your usual 7h 20m.
          </p>
          <div className="focus-action-copy">
            <Icon name="moon" size={17} />
            <p>
              Consider keeping your bedtime consistent tonight and continue
              tracking your sleep.
            </p>
          </div>
          <div className="focus-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate('Insights')}
            >
              View sleep pattern
            </button>
            <button
              type="button"
              className="text-button teal"
              onClick={() => onNavigate('Daily Check-in')}
            >
              Track today <Icon name="arrow" size={15} />
            </button>
          </div>
        </div>
        <div className="focus-week">
          <div>
            <span>7-DAY SLEEP</span>
            <strong>
              6h 35m <small>average</small>
            </strong>
          </div>
          <div className="focus-week-bars">
            {[72, 58, 64, 49, 54, 67, 57].map((value, index) => (
              <span key={index}>
                <i style={{ height: `${value}%` }} />
                <small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small>
              </span>
            ))}
          </div>
          <p>
            <i /> Your usual sleep · 7h 20m
          </p>
        </div>
      </section>

      <section className="wellness-section">
        <WellnessSectionHeading
          title="Nutrition"
          subtitle="Keep track of everyday nutrition habits and recommendations that matter to you."
        />
        <div className="nutrition-grid">
          <article className="nutrition-focus-card">
            <div className="wellness-card-label">
              <span>
                <Icon name="nutrition" size={18} />
              </span>
              <div>
                <strong>Your nutrition focus</strong>
                <small>From your health information</small>
              </div>
            </div>
            <h3>Increase your intake of iron-rich foods.</h3>
            <p>
              This is a personal focus saved from information you added to
              HerHealth, not medical advice.
            </p>
            <div className="food-examples">
              {['Spinach', 'Lentils', 'Eggs', 'Beans'].map((food) => (
                <span key={food}>{food}</span>
              ))}
            </div>
            <button
              type="button"
              className="quiet-button"
              onClick={() => setPanel('recommendation')}
            >
              View details <Icon name="arrow" size={15} />
            </button>
          </article>
          <article className="hydration-card">
            <div className="wellness-card-label">
              <span>
                <Icon name="period" size={18} />
              </span>
              <strong>Hydration</strong>
            </div>
            <div className="hydration-value">
              <strong>{water} / 8</strong>
              <span>glasses today</span>
            </div>
            <div className="hydration-glasses">
              {Array.from({ length: 8 }, (_, index) => (
                <i className={index < water ? 'filled' : ''} key={index} />
              ))}
            </div>
            <p>Keep your water intake consistent throughout the day.</p>
            <button
              type="button"
              className="secondary-button"
              disabled={water >= 8}
              onClick={() => {
                setWater((value) => Math.min(8, value + 1));
                setMessage('One glass of water was logged.');
              }}
            >
              <Icon name="plus" size={14} />{' '}
              {water >= 8 ? 'Daily goal reached' : 'Log water'}
            </button>
          </article>
          <article className="food-note-card">
            <div className="wellness-card-label">
              <span>
                <Icon name="note" size={18} />
              </span>
              <strong>Food notes</strong>
            </div>
            <p>
              Record meals, food-related observations, or anything you’d like to
              remember.
            </p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setPanel('food')}
            >
              <Icon name="plus" size={14} /> Add food note
            </button>
          </article>
        </div>
      </section>

      <section className="wellness-section">
        <WellnessSectionHeading
          title="Lifestyle"
          subtitle="Small everyday habits can help you understand what works well for you."
        />
        <div className="lifestyle-grid">
          {[
            {
              icon: 'moon' as IconName,
              title: 'Sleep',
              value: '6h 35m',
              detail: 'Average this week',
              change: '↓ 45 min from usual',
              action: 'View pattern',
              destination: 'Insights',
            },
            {
              icon: 'energy' as IconName,
              title: 'Movement',
              value: '4 days',
              detail: 'Active this week',
              change: 'A steady week',
              action: 'Log activity',
              destination: '',
            },
            {
              icon: 'stress' as IconName,
              title: 'Stress',
              value: 'Moderate',
              detail: 'Average this week',
              change: 'Stable this week',
              action: 'View pattern',
              destination: 'Insights',
            },
          ].map((item) => (
            <article className="lifestyle-metric" key={item.title}>
              <div>
                <span>
                  <Icon name={item.icon} size={17} />
                </span>
                <strong>{item.title}</strong>
              </div>
              <h3>{item.value}</h3>
              <p>{item.detail}</p>
              <small>{item.change}</small>
              <button
                type="button"
                className="quiet-button"
                onClick={() =>
                  item.destination
                    ? onNavigate(item.destination)
                    : setPanel('activity')
                }
              >
                {item.action} <Icon name="arrow" size={14} />
              </button>
            </article>
          ))}
          <article className="recovery-card">
            <div className="wellness-card-label">
              <span>
                <Icon name="spark" size={18} />
              </span>
              <div>
                <strong>Rest &amp; Recovery</strong>
                <small>From recent check-ins</small>
              </div>
            </div>
            <h3>Doing okay</h3>
            <p>
              Your recent stress and energy levels suggest you may benefit from
              making time for rest.
            </p>
            <button
              type="button"
              className="quiet-button"
              onClick={() => onNavigate('Insights')}
            >
              View insights <Icon name="arrow" size={14} />
            </button>
          </article>
        </div>
      </section>

      <section className="wellness-section">
        <WellnessSectionHeading
          title="My recommendations"
          subtitle="Keep track of lifestyle and nutrition recommendations that are relevant to you."
        >
          <button
            type="button"
            className="secondary-button"
            onClick={() => setPanel('recommendation')}
          >
            <Icon name="plus" size={14} /> Add recommendation
          </button>
        </WellnessSectionHeading>
        <div className="recommendation-list">
          {recommendations.map((recommendation, index) => (
            <article key={`${recommendation.title}-${index}`}>
              <span className="recommendation-icon">
                <Icon
                  name={
                    recommendation.category === 'Sleep'
                      ? 'moon'
                      : recommendation.category === 'Movement'
                        ? 'energy'
                        : 'nutrition'
                  }
                  size={17}
                />
              </span>
              <div>
                <strong>{recommendation.title}</strong>
                <p>{recommendation.description}</p>
              </div>
              <small>{recommendation.category}</small>
              <button
                type="button"
                className={recommendation.status === 'Active' ? 'active' : ''}
              >
                {recommendation.status}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="wellness-section">
        <WellnessSectionHeading
          title="My goals"
          subtitle="Set a few simple goals that support your everyday wellbeing."
        >
          <button
            type="button"
            className="secondary-button"
            onClick={() => setPanel('goal')}
          >
            <Icon name="plus" size={14} /> Add goal
          </button>
        </WellnessSectionHeading>
        <div className="goal-grid">
          {goals.map((goal, index) => (
            <article key={`${goal.title}-${index}`}>
              <div>
                <span>{goal.category}</span>
                <Icon
                  name={
                    goal.category === 'Sleep'
                      ? 'moon'
                      : goal.category === 'Movement'
                        ? 'energy'
                        : 'period'
                  }
                  size={17}
                />
              </div>
              <h3>{goal.title}</h3>
              <p>
                <strong>{goal.progress}</strong> / {goal.total} {goal.unit}
              </p>
              <div className="goal-progress">
                <span
                  style={{
                    width: `${Math.min(100, (goal.progress / goal.total) * 100)}%`,
                  }}
                />
              </div>
              <small>Supportive goal · Update anytime</small>
            </article>
          ))}
        </div>
      </section>

      <section className="wellness-section for-you-section">
        <WellnessSectionHeading
          title="For you"
          subtitle="Suggestions based on the information you’ve been tracking."
        />
        <div className="for-you-list">
          {[
            [
              'Your energy tends to be higher after nights when you sleep 7+ hours.',
              'You may want to keep tracking sleep and energy to see whether this pattern continues.',
              'View pattern',
              'Insights',
            ],
            [
              'You’ve been more consistent with your daily check-ins this month.',
              'Keep tracking regularly to help HerHealth understand your patterns over time.',
              'View Insights',
              'Insights',
            ],
            [
              'You’ve logged lower energy several times this week.',
              'Consider paying attention to sleep, stress, and activity alongside your energy.',
              'View related entries',
              'Health Timeline',
            ],
          ].map(([title, text, action, destination], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <button
                type="button"
                className="quiet-button"
                onClick={() => onNavigate(destination)}
              >
                {action} <Icon name="arrow" size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <footer className="insights-disclaimer wellness-disclaimer">
        <Icon name="spark" size={14} /> Suggestions are based on information
        you’ve logged and are not medical advice.
      </footer>

      {panel && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={closePanel}
            aria-label="Close panel"
          />
          <aside
            className="date-panel wellness-action-panel"
            aria-label={wellnessPanelTitle(panel)}
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">NUTRITION &amp; LIFESTYLE</div>
                <h2>{wellnessPanelTitle(panel)}</h2>
                <p>{wellnessPanelSubtitle(panel)}</p>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={closePanel}
                aria-label="Close"
              >
                <Icon name="close" size={19} />
              </button>
            </div>
            <div className="wellness-panel-body">
              {(panel === 'recommendation' || panel === 'goal') && (
                <fieldset className="wellness-category-options">
                  <legend>Category</legend>
                  <div>
                    {['Nutrition', 'Sleep', 'Movement', 'Stress', 'Other'].map(
                      (category) => (
                        <button
                          type="button"
                          className={
                            draftCategory === category ? 'selected' : ''
                          }
                          onClick={() => setDraftCategory(category)}
                          key={category}
                        >
                          {category}
                        </button>
                      ),
                    )}
                  </div>
                </fieldset>
              )}
              {panel === 'recommendation' && (
                <>
                  <WellnessField label="Recommendation">
                    <input
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      placeholder="Add a recommendation..."
                    />
                  </WellnessField>
                  <WellnessField label="Optional note" optional>
                    <textarea
                      rows={4}
                      value={draftNote}
                      onChange={(event) => setDraftNote(event.target.value)}
                      placeholder="Add more context..."
                    />
                  </WellnessField>
                </>
              )}
              {panel === 'goal' && (
                <>
                  <WellnessField label="Goal">
                    <input
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      placeholder="What would you like to work toward?"
                    />
                  </WellnessField>
                  <WellnessField label="Target">
                    <input
                      type="number"
                      min="1"
                      value={draftTarget}
                      onChange={(event) => setDraftTarget(event.target.value)}
                      placeholder="Set your target..."
                    />
                  </WellnessField>
                  <div className="frequency-field">
                    <span>Frequency</span>
                    <div>
                      {['Daily', 'Weekly'].map((frequency) => (
                        <button
                          type="button"
                          className={
                            draftFrequency === frequency ? 'selected' : ''
                          }
                          onClick={() => setDraftFrequency(frequency)}
                          key={frequency}
                        >
                          {frequency}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {panel === 'food' && (
                <>
                  <WellnessField label="What would you like to remember?">
                    <textarea
                      rows={5}
                      value={draftNote}
                      onChange={(event) => setDraftNote(event.target.value)}
                      placeholder="Record a meal or how you felt..."
                    />
                  </WellnessField>
                  <WellnessField label="When">
                    <select defaultValue="Today · Lunch">
                      <option>Today · Breakfast</option>
                      <option>Today · Lunch</option>
                      <option>Today · Dinner</option>
                      <option>Today · Snack</option>
                    </select>
                  </WellnessField>
                </>
              )}
              {panel === 'activity' && (
                <>
                  <div className="activity-quick-options">
                    <span>Activity</span>
                    <div>
                      {['Walk', 'Yoga', 'Strength', 'Cycling', 'Other'].map(
                        (activity) => (
                          <button
                            type="button"
                            className={
                              draftTitle === activity ? 'selected' : ''
                            }
                            onClick={() => setDraftTitle(activity)}
                            key={activity}
                          >
                            {activity}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                  <WellnessField label="Duration">
                    <select defaultValue="30 minutes">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                    </select>
                  </WellnessField>
                  <WellnessField label="Note" optional>
                    <textarea
                      rows={3}
                      value={draftNote}
                      onChange={(event) => setDraftNote(event.target.value)}
                      placeholder="How did it feel?"
                    />
                  </WellnessField>
                </>
              )}
            </div>
            <div className="panel-footer wellness-panel-footer">
              <span>
                <Icon name="lock" size={13} /> Private to you
              </span>
              <button
                type="button"
                className="primary-button"
                onClick={savePanel}
              >
                {panel === 'goal'
                  ? 'Create goal'
                  : panel === 'recommendation'
                    ? 'Save recommendation'
                    : panel === 'food'
                      ? 'Save food note'
                      : 'Log activity'}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function WellnessSectionHeading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="wellness-section-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function WellnessField({
  label,
  optional = false,
  children,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="wellness-field">
      <span>
        {label}
        {optional && <small>Optional</small>}
      </span>
      {children}
    </label>
  );
}

function wellnessPanelTitle(panel: Exclude<WellnessPanelMode, null>) {
  return panel === 'food'
    ? 'Add food note'
    : panel === 'activity'
      ? 'Log activity'
      : panel === 'goal'
        ? 'Add wellness goal'
        : 'Add recommendation';
}

function wellnessPanelSubtitle(panel: Exclude<WellnessPanelMode, null>) {
  return panel === 'food'
    ? 'Save a simple food-related observation.'
    : panel === 'activity'
      ? 'Add movement to today’s health picture.'
      : panel === 'goal'
        ? 'Choose one supportive thing to work toward.'
        : 'Save guidance that feels relevant to you.';
}

function WellnessEmptyState({
  onNavigate,
  onOpen,
}: {
  onNavigate: (page: string) => void;
  onOpen: (panel: WellnessPanelMode) => void;
}) {
  return (
    <section className="wellness-empty">
      <div className="wellness-empty-art">
        <Icon name="nutrition" size={25} />
        <span />
        <span />
        <span />
      </div>
      <div className="eyebrow">EVERYDAY WELLBEING</div>
      <h1>Build your everyday health picture</h1>
      <p>
        Track simple habits like sleep, hydration, movement, stress, and
        nutrition to help HerHealth understand what works for you.
      </p>
      <div>
        <button
          type="button"
          className="primary-button"
          onClick={() => onNavigate('Daily Check-in')}
        >
          Start today’s check-in <Icon name="arrow" size={16} />
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onOpen('goal')}
        >
          Set a wellness goal
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onOpen('recommendation')}
        >
          Add a recommendation
        </button>
      </div>
    </section>
  );
}
