'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { useNavigate } from '@/lib/useNavigate';
import {
  type TimelineEventType,
  type TimelineEvent,
  timelineEvents,
  timelineFilters,
} from '@/mock/timeline';

export default function TimelinePage() {
  const onNavigate = useNavigate();
  return <HealthTimeline onNavigate={onNavigate} />;
}

function HealthTimeline({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<'All' | TimelineEventType>(
    'All',
  );
  const [query, setQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null,
  );
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilters, setTypeFilters] = useState<TimelineEventType[]>([]);
  const [dateFilter, setDateFilter] = useState('All time');

  const visibleEvents = timelineEvents.filter((event) => {
    const matchesTab = activeFilter === 'All' || event.type === activeFilter;
    const matchesTypes =
      typeFilters.length === 0 || typeFilters.includes(event.type);
    const searchable = [
      event.date,
      event.type,
      event.title,
      event.subtitle,
      event.note,
      ...event.details.flat(),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = searchable.includes(query.trim().toLowerCase());
    const dateLimit =
      dateFilter === 'Last 7 days'
        ? 7
        : dateFilter === 'Last 30 days'
          ? 30
          : dateFilter === 'Last 3 months'
            ? 90
            : Number.POSITIVE_INFINITY;
    return (
      matchesTab &&
      matchesTypes &&
      matchesSearch &&
      event.dayOffset <= dateLimit
    );
  });

  const toggleTimelineType = (type: TimelineEventType) => {
    setTypeFilters((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  };

  const addOptions: Array<{
    title: string;
    description: string;
    icon: IconName;
    destination: string;
  }> = [
    {
      title: 'Health note',
      description: 'Record something important.',
      icon: 'note',
      destination: 'Health Timeline',
    },
    {
      title: 'Consultation',
      description: 'Add a doctor visit.',
      icon: 'consultation',
      destination: 'Consultation',
    },
    {
      title: 'Health record',
      description: 'Add a report or document.',
      icon: 'vault',
      destination: 'Health Vault',
    },
    {
      title: 'Period',
      description: 'Add or edit period information.',
      icon: 'period',
      destination: 'Periods',
    },
  ];

  return (
    <div className="timeline-page">
      <section className="timeline-header">
        <div>
          <div className="eyebrow">YOUR HEALTH HISTORY</div>
          <h1>Health Timeline</h1>
          <p>Your health history, all in one place.</p>
        </div>
        <div className="timeline-header-actions">
          <label className="timeline-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your timeline"
              aria-label="Search your timeline"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </label>
          <div className="filter-control-wrap">
            <button
              type="button"
              className={`timeline-filter-button ${
                showFilters ||
                typeFilters.length > 0 ||
                dateFilter !== 'All time'
                  ? 'active'
                  : ''
              }`}
              onClick={() => {
                setShowFilters((value) => !value);
                setShowAdd(false);
              }}
            >
              <Icon name="filter" size={16} />
              Filter
              {typeFilters.length > 0 && <span>{typeFilters.length}</span>}
            </button>
            {showFilters && (
              <div className="filter-popover">
                <div className="popover-title">
                  <strong>Filter timeline</strong>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilters([]);
                      setDateFilter('All time');
                    }}
                  >
                    Clear all
                  </button>
                </div>
                <fieldset>
                  <legend>Type</legend>
                  {(
                    [
                      'Check-ins',
                      'Symptoms',
                      'Periods',
                      'Consultations',
                      'Health Records',
                      'Notes',
                    ] as TimelineEventType[]
                  ).map((type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        checked={typeFilters.includes(type)}
                        onChange={() => toggleTimelineType(type)}
                      />
                      <span>
                        {type === 'Check-ins' ? 'Daily check-ins' : type}
                      </span>
                    </label>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Date</legend>
                  {[
                    'All time',
                    'Last 7 days',
                    'Last 30 days',
                    'Last 3 months',
                    'Custom range',
                  ].map((range) => (
                    <label key={range}>
                      <input
                        type="radio"
                        name="timeline-date"
                        checked={dateFilter === range}
                        onChange={() => setDateFilter(range)}
                      />
                      <span>{range}</span>
                    </label>
                  ))}
                </fieldset>
                {dateFilter === 'Custom range' && (
                  <div className="custom-range">
                    <label>
                      From
                      <input type="date" defaultValue="2026-09-01" />
                    </label>
                    <label>
                      To
                      <input type="date" defaultValue="2026-10-05" />
                    </label>
                  </div>
                )}
                <button
                  type="button"
                  className="primary-button apply-filter"
                  onClick={() => setShowFilters(false)}
                >
                  Apply filters
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="primary-button add-health-button"
            onClick={() => {
              setShowAdd(true);
              setShowFilters(false);
            }}
          >
            <Icon name="plus" size={17} /> Add health information
          </button>
        </div>
      </section>

      <div
        className="timeline-tabs"
        role="tablist"
        aria-label="Timeline categories"
      >
        {timelineFilters.map((filter) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === filter}
            className={activeFilter === filter ? 'active' : ''}
            onClick={() => setActiveFilter(filter)}
            key={filter}
          >
            {filter}
          </button>
        ))}
      </div>

      {timelineEvents.length === 0 ? (
        <TimelineEmptyState
          onNavigate={onNavigate}
          onAdd={() => setShowAdd(true)}
        />
      ) : visibleEvents.length === 0 ? (
        <section className="timeline-no-results">
          <div className="card-icon">
            <Icon name="search" />
          </div>
          <h2>No matching health events</h2>
          <p>Try changing your search or clearing a filter.</p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setQuery('');
              setActiveFilter('All');
              setTypeFilters([]);
              setDateFilter('All time');
            }}
          >
            Clear search and filters
          </button>
        </section>
      ) : (
        <section className="health-events" aria-label="Health history">
          {visibleEvents.map((event, index) => (
            <article className="timeline-event" key={event.id}>
              <time>{event.shortDate}</time>
              <div className="timeline-rail">
                <div
                  className={`event-marker event-${event.type.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon name={event.icon} size={17} />
                </div>
                {index < visibleEvents.length - 1 && <span />}
              </div>
              <div className="event-content">
                <div className="event-main">
                  <div>
                    <span className="event-type">{event.type}</span>
                    <h2>{event.title}</h2>
                    {event.subtitle && <p>{event.subtitle}</p>}
                  </div>
                  <button
                    type="button"
                    className="quiet-button"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {event.action} <Icon name="arrow" size={15} />
                  </button>
                </div>
                {event.type === 'Check-ins' && (
                  <div className="event-data-row">
                    {event.details
                      .filter(([label]) =>
                        [
                          'Mood',
                          'Energy',
                          'Sleep',
                          'Stress',
                          'Symptoms',
                        ].includes(label),
                      )
                      .map(([label, value]) => (
                        <div key={label}>
                          <span>{label}</span>
                          <strong>{value}</strong>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {showAdd && (
        <>
          <button
            type="button"
            className="modal-scrim"
            onClick={() => setShowAdd(false)}
            aria-label="Close"
          />
          <section
            className="add-health-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Add health information"
          >
            <div className="add-modal-header">
              <div>
                <div className="section-kicker">ADD TO YOUR TIMELINE</div>
                <h2>What would you like to add?</h2>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={() => setShowAdd(false)}
                aria-label="Close"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="add-option-list">
              {addOptions.map((option) => (
                <button
                  type="button"
                  key={option.title}
                  onClick={() => {
                    setShowAdd(false);
                    if (option.destination !== 'Health Timeline')
                      onNavigate(option.destination);
                  }}
                >
                  <span>
                    <Icon name={option.icon} size={19} />
                  </span>
                  <div>
                    <strong>{option.title}</strong>
                    <p>{option.description}</p>
                  </div>
                  <Icon name="chevronRight" size={16} />
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {selectedEvent && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setSelectedEvent(null)}
            aria-label="Close event details"
          />
          <aside
            className="date-panel timeline-detail-panel"
            aria-label={`${selectedEvent.title} details`}
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">
                  {selectedEvent.type.toUpperCase()}
                </div>
                <h2>{selectedEvent.date}</h2>
                <p>{selectedEvent.title}</p>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close"
              >
                <Icon name="close" size={19} />
              </button>
            </div>
            <div className="timeline-detail-body">
              <div className="detail-event-heading">
                <div className="card-icon">
                  <Icon name={selectedEvent.icon} />
                </div>
                <div>
                  <span>HEALTH EVENT</span>
                  <strong>{selectedEvent.title}</strong>
                </div>
              </div>
              <dl>
                {selectedEvent.details.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              {selectedEvent.note && (
                <div className="event-note">
                  <span>NOTES</span>
                  <p>{selectedEvent.note}</p>
                </div>
              )}
            </div>
            <div className="panel-footer timeline-panel-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <button type="button" className="primary-button">
                Edit entry
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function TimelineEmptyState({
  onNavigate,
  onAdd,
}: {
  onNavigate: (page: string) => void;
  onAdd: () => void;
}) {
  return (
    <section className="timeline-empty">
      <div className="empty-timeline-art" aria-hidden="true">
        <span />
        <i />
        <span />
        <i />
        <span />
      </div>
      <h2>Your health story starts here.</h2>
      <p>
        As you check in, add health information, and record important moments,
        they’ll appear here in chronological order.
      </p>
      <div>
        <button
          type="button"
          className="primary-button"
          onClick={() => onNavigate('Daily Check-in')}
        >
          Start today’s check-in <Icon name="arrow" size={17} />
        </button>
        <button type="button" className="secondary-button" onClick={onAdd}>
          Add past health information
        </button>
      </div>
    </section>
  );
}
