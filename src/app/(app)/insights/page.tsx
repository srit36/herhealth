'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { useNavigate } from '@/lib/useNavigate';
import {
  type InsightDetail,
  insightDetails,
  insightTrendData,
} from '@/mock/insights';

export default function InsightsPage() {
  const onNavigate = useNavigate();
  return <Insights onNavigate={onNavigate} />;
}

function Insights({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [range, setRange] = useState('Last 30 days');
  const [trend, setTrend] = useState<keyof typeof insightTrendData>('Sleep');
  const [selectedInsight, setSelectedInsight] = useState<InsightDetail | null>(
    null,
  );
  const hasEnoughData = true;

  const patternCards = [
    {
      key: 'sleep-energy',
      icon: 'moon' as IconName,
      title: 'Sleep & Energy',
      text: 'Your energy tends to be higher on days when you sleep 7+ hours.',
      meta: 'Seen across 10 logged days',
    },
    {
      key: 'stress-mood',
      icon: 'stress' as IconName,
      title: 'Stress & Mood',
      text: 'Higher-stress days have appeared alongside lower mood ratings several times this month.',
      meta: 'Appeared 5 times this month',
    },
    {
      key: 'cycle-symptoms',
      icon: 'period' as IconName,
      title: 'Cycle & Symptoms',
      text: 'You’ve logged more fatigue and cramps around the beginning of your last two periods.',
      meta: 'Observation from 2 cycles',
    },
    {
      key: 'consistency',
      icon: 'check' as IconName,
      title: 'Your consistency',
      text: 'You’ve completed 18 of 24 possible daily check-ins this month.',
      meta: '75% check-in completion',
    },
  ];

  if (!hasEnoughData) {
    return <InsightsEmptyState onNavigate={onNavigate} />;
  }

  return (
    <div className="insights-page">
      <section className="insights-header">
        <div>
          <div className="eyebrow">PERSONAL OBSERVATIONS</div>
          <h1>Insights</h1>
          <p>Understand patterns in your health over time.</p>
        </div>
        <div className="insights-header-actions">
          <button
            type="button"
            className="insights-how-button"
            onClick={() =>
              setSelectedInsight({
                title: 'How insights work',
                label: 'ABOUT YOUR INSIGHTS',
                noticed:
                  'HerHealth looks for recurring patterns across the information you choose to log. Insights are personal observations, not medical conclusions.',
                tracking:
                  'The more consistently you log, the more context HerHealth can use when showing possible patterns.',
                values: [45, 58, 52, 68, 64, 77, 73],
              })
            }
          >
            <Icon name="spark" size={15} /> How insights work
          </button>
          <label className="range-select">
            <Icon name="calendar" size={16} />
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              aria-label="Insight date range"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
            </select>
            <Icon name="chevronRight" size={14} />
          </label>
        </div>
      </section>

      <section className="featured-insight">
        <div className="featured-copy">
          <div className="featured-label">
            <span>
              <Icon name="spark" size={16} />
            </span>
            <div>
              <strong>Something we noticed</strong>
              <small>Based on your recent check-ins</small>
            </div>
          </div>
          <h2>Your sleep has been lower than usual this week.</h2>
          <p>
            Over the last 7 days, your average sleep was about 6h 35m, compared
            with your usual 7h 20m.
          </p>
          <div className="might-mean">
            <strong>What this might mean</strong>
            <p>
              Lower sleep can sometimes coincide with changes in energy, mood,
              or stress. Keep tracking these factors to see whether the pattern
              continues.
            </p>
          </div>
          <div className="featured-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setSelectedInsight(insightDetails.sleep)}
            >
              View sleep trend
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
        <div className="sleep-feature-chart">
          <div className="chart-summary">
            <div>
              <span>7-day average</span>
              <strong>6h 35m</strong>
            </div>
            <span className="trend-change down">↓ 45m</span>
          </div>
          <div className="sleep-bars">
            {[72, 58, 64, 49, 54, 67, 57].map((height, index) => (
              <div key={index}>
                <i
                  style={{ height: `${height}%` }}
                  className={height < 60 ? 'lower' : ''}
                />
                <span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
              </div>
            ))}
            <b className="usual-line">
              <span>usual 7h 20m</span>
            </b>
          </div>
          <p>Sleep duration from your daily check-ins</p>
        </div>
      </section>

      <section className="patterns-section">
        <div className="insight-section-heading">
          <div>
            <h2>Patterns in your health</h2>
            <p>Observations from the information you’ve logged</p>
          </div>
          <span>Updated today</span>
        </div>
        <div className="pattern-grid">
          {patternCards.map((card) => (
            <article className="pattern-card" key={card.key}>
              <div className="pattern-top">
                <span>
                  <Icon name={card.icon} size={18} />
                </span>
                <small>{card.meta}</small>
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              {card.key === 'consistency' ? (
                <div className="consistency-progress">
                  <span style={{ width: '75%' }} />
                </div>
              ) : (
                <MiniPatternVisual kind={card.key} />
              )}
              <button
                type="button"
                className="quiet-button"
                onClick={() =>
                  card.key === 'consistency'
                    ? onNavigate('Health Timeline')
                    : setSelectedInsight(insightDetails[card.key])
                }
              >
                {card.key === 'consistency'
                  ? 'View timeline'
                  : 'Explore pattern'}
                <Icon name="arrow" size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="health-trends-section">
        <div className="insight-section-heading">
          <div>
            <h2>Your health at a glance</h2>
            <p>Compared with the previous {range.toLowerCase()}</p>
          </div>
        </div>
        <div className="trend-metrics">
          {(
            Object.keys(insightTrendData) as Array<
              keyof typeof insightTrendData
            >
          ).map((metric) => {
            const data = insightTrendData[metric];
            return (
              <button
                type="button"
                className={trend === metric ? 'active' : ''}
                onClick={() => setTrend(metric)}
                key={metric}
              >
                <span>{metric}</span>
                <strong>{data.value}</strong>
                <small className={data.direction}>
                  {data.direction === 'up'
                    ? '↑ '
                    : data.direction === 'down'
                      ? '↓ '
                      : ''}
                  {data.change}
                </small>
              </button>
            );
          })}
        </div>
        <div className="large-trend-chart">
          <div className="chart-topline">
            <div>
              <span>{trend.toUpperCase()} TREND</span>
              <strong>{insightTrendData[trend].value}</strong>
            </div>
            <div className="chart-key">
              <i /> Daily value <span /> 7-day average
            </div>
          </div>
          <TrendLineChart points={insightTrendData[trend].points} />
          <div className="chart-dates">
            <span>Sep 6</span>
            <span>Sep 13</span>
            <span>Sep 20</span>
            <span>Sep 27</span>
            <span>Oct 5</span>
          </div>
        </div>
      </section>

      <section className="insights-lower-grid">
        <div className="observations-section">
          <div className="insight-section-heading">
            <div>
              <h2>Recent observations</h2>
              <p>Small changes and moments from your data</p>
            </div>
          </div>
          <div className="observations-list">
            {[
              [
                'Oct 4',
                'Your energy was higher than your weekly average.',
                'Daily check-in · Energy',
              ],
              [
                'Oct 2',
                'You logged a headache after two days of shorter-than-usual sleep.',
                'Symptoms + Sleep',
              ],
              [
                'Sep 29',
                'Your stress rating was lower than your previous week.',
                'Daily check-ins · Stress',
              ],
            ].map(([date, text, source], index) => (
              <article key={date}>
                <time>{date}</time>
                <span className="observation-dot" />
                <div>
                  <p>{text}</p>
                  <small>{source}</small>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedInsight(
                      index === 1
                        ? insightDetails.headaches
                        : insightDetails['sleep-energy'],
                    )
                  }
                >
                  View details <Icon name="arrow" size={14} />
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="watch-insight">
          <div className="watch-heading">
            <span>
              <Icon name="timeline" size={18} />
            </span>
            <div>
              <strong>Worth keeping an eye on</strong>
              <small>Based on the last 30 days</small>
            </div>
          </div>
          <h3>Headaches have appeared 4 times in the last 30 days.</h3>
          <p>
            You’ve logged headaches on four days this month. If this continues,
            consider discussing the pattern with a healthcare professional.
          </p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setSelectedInsight(insightDetails.headaches)}
          >
            View related entries <Icon name="arrow" size={15} />
          </button>
        </aside>
      </section>

      <footer className="insights-disclaimer">
        <Icon name="spark" size={14} />
        Insights are observations from the information you log. They do not
        provide a diagnosis or establish cause and effect.
      </footer>

      {selectedInsight && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setSelectedInsight(null)}
            aria-label="Close insight details"
          />
          <aside
            className="date-panel insight-detail-panel"
            aria-label={`${selectedInsight.title} details`}
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">
                  {selectedInsight.label.toUpperCase()}
                </div>
                <h2>{selectedInsight.title}</h2>
                <p>Personal observation</p>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={() => setSelectedInsight(null)}
                aria-label="Close"
              >
                <Icon name="close" size={19} />
              </button>
            </div>
            <div className="insight-detail-body">
              <div className="detail-copy-block">
                <span>WHAT WE NOTICED</span>
                <p>{selectedInsight.noticed}</p>
              </div>
              <div className="detail-data-block">
                <div>
                  <span>YOUR DATA</span>
                  <small>From your logged information</small>
                </div>
                <DualBarChart
                  values={selectedInsight.values}
                  secondValues={selectedInsight.secondValues}
                />
              </div>
              <div className="not-mean-block">
                <span>WHAT THIS DOES NOT MEAN</span>
                <p>
                  This pattern does not establish a cause-and-effect
                  relationship. It is simply an observation based on the
                  information you’ve logged.
                </p>
              </div>
              <div className="detail-copy-block keep-tracking">
                <span>KEEP TRACKING</span>
                <p>{selectedInsight.tracking}</p>
              </div>
            </div>
            <div className="panel-footer insight-panel-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSelectedInsight(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => onNavigate('Health Timeline')}
              >
                View related timeline entries
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function MiniPatternVisual({ kind }: { kind: string }) {
  if (kind === 'cycle-symptoms') {
    return (
      <div className="mini-cycle-visual">
        {[70, 85, 62, 37, 24, 18, 14].map((value, index) => (
          <i key={index} style={{ height: `${value}%` }} />
        ))}
        <span>Cycle days 1–7</span>
      </div>
    );
  }
  return (
    <div className="mini-correlation">
      {[32, 48, 41, 62, 55, 73, 66].map((value, index) => (
        <span
          key={index}
          style={{ left: `${index * 14 + 4}%`, bottom: `${value}%` }}
        />
      ))}
      <i />
    </div>
  );
}

function TrendLineChart({ points }: { points: number[] }) {
  const coordinates = points
    .map(
      (point, index) => `${(index / (points.length - 1)) * 100},${100 - point}`,
    )
    .join(' ');
  const area = `0,100 ${coordinates} 100,100`;
  return (
    <svg
      className="trend-line-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-label="Selected health trend"
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4d9385" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4d9385" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="25" x2="100" y2="25" className="chart-gridline" />
      <line x1="0" y1="50" x2="100" y2="50" className="chart-gridline" />
      <line x1="0" y1="75" x2="100" y2="75" className="chart-gridline" />
      <polygon points={area} fill="url(#trendFill)" />
      <polyline points={coordinates} className="trend-polyline" />
      {points.map((point, index) => (
        <circle
          key={index}
          cx={(index / (points.length - 1)) * 100}
          cy={100 - point}
          r="1.2"
        />
      ))}
    </svg>
  );
}

function DualBarChart({
  values,
  secondValues,
}: {
  values: number[];
  secondValues?: number[];
}) {
  return (
    <div className="dual-bar-chart">
      {values.map((value, index) => (
        <div key={index}>
          <i style={{ height: `${value}%` }} />
          {secondValues && (
            <b style={{ height: `${secondValues[index] ?? 0}%` }} />
          )}
        </div>
      ))}
    </div>
  );
}

function InsightsEmptyState({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <section className="insights-empty">
      <div className="insights-empty-visual">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="eyebrow">YOUR PERSONAL INSIGHTS</div>
      <h1>Your insights will appear here</h1>
      <p>
        As you check in and record health information, HerHealth will look for
        meaningful patterns across your data.
      </p>
      <div>
        <button
          type="button"
          className="primary-button"
          onClick={() => onNavigate('Daily Check-in')}
        >
          Start today’s check-in <Icon name="arrow" size={17} />
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onNavigate('Health Timeline')}
        >
          Add health information
        </button>
      </div>
    </section>
  );
}
