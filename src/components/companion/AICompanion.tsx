'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { Toggle } from '@/components/Toggle';
import { checkRedFlags } from '@/lib/redFlags';
import {
  type AIMode,
  type AIViewState,
  aiCapabilities,
  aiSuggestedQuestions,
} from '@/mock/companion';

export function AICompanion({
  initialMode,
  onNavigate,
}: {
  initialMode: string;
  onNavigate: (page: string) => void;
}) {
  const validMode =
    aiCapabilities.find((capability) => capability.mode === initialMode)
      ?.mode ?? 'Ask HerHealth';
  const [mode, setMode] = useState<AIMode>(validMode);
  const [view, setView] = useState<AIViewState>(
    initialMode === 'Ask HerHealth' ? 'home' : 'conversation',
  );
  const [question, setQuestion] = useState('');
  const [activeQuestion, setActiveQuestion] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [consentEnabled, setConsentEnabled] = useState(true);
  const [attachedContext, setAttachedContext] = useState('');

  const openMode = (nextMode: AIMode) => {
    setMode(nextMode);
    setAttachedContext('');
    setActiveQuestion('');
    setView(nextMode === 'Ask HerHealth' ? 'conversation' : 'conversation');
  };

  const askQuestion = async (nextQuestion?: string) => {
    const text = (nextQuestion ?? question).trim();
    if (!text) return;
    setActiveQuestion(text);
    setQuestion('');
    const { isEmergency } = await checkRedFlags(text);
    if (isEmergency) {
      setView('emergency');
      return;
    }
    setView('loading');
    window.setTimeout(() => {
      if (/error|went wrong/i.test(text)) setView('error');
      else if (/not enough|new user/i.test(text)) setView('insufficient');
      else setView('conversation');
    }, 750);
  };

  const chooseQuestion = (text: string) => {
    setMode('Ask HerHealth');
    setQuestion(text);
    setView('conversation');
  };

  const openContextualAsk = (context: string, suggestedQuestion = '') => {
    setMode('Ask HerHealth');
    setAttachedContext(context);
    setQuestion(suggestedQuestion);
    setActiveQuestion('');
    setView('conversation');
  };

  if (!aiEnabled) {
    return (
      <section className="ai-disabled-state">
        <div className="ai-state-mark">
          <Icon name="lock" size={25} />
        </div>
        <div className="eyebrow">AI-ASSISTED FEATURES</div>
        <h1>AI Companion is turned off</h1>
        <p>
          AI-assisted features are currently disabled. Your HerHealth
          information remains available to you, but personalized explanations,
          health analysis, and AI-generated plans are unavailable.
        </p>
        <div>
          <button
            type="button"
            className="primary-button"
            onClick={() => setAiEnabled(true)}
          >
            Turn on AI-assisted features
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => onNavigate('Settings')}
          >
            Privacy settings
          </button>
        </div>
      </section>
    );
  }

  if (view === 'emergency') {
    return (
      <AIEmergencyState
        onBack={() => {
          setView('home');
          setActiveQuestion('');
        }}
      />
    );
  }

  return (
    <div className="ai-page">
      <section className="ai-header">
        <div>
          <div className="eyebrow">PERSONAL HEALTH SUPPORT</div>
          <h1>AI Companion</h1>
          <p>
            A calm place to ask questions, understand your health information,
            and turn insights into practical next steps.
          </p>
        </div>
        <button
          type="button"
          className="ai-privacy-button"
          onClick={() => setShowPrivacy(true)}
        >
          <Icon name="lock" size={14} /> AI privacy
        </button>
      </section>

      {view === 'home' ? (
        <>
          <section className="ai-ask-hero">
            <div className="ai-ask-heading">
              <span>
                <Icon name="spark" size={19} />
              </span>
              <div>
                <h2>How can I help?</h2>
                <p>
                  Ask about the health information you’ve chosen to keep in
                  HerHealth.
                </p>
              </div>
            </div>
            <div className="ai-main-input">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    askQuestion();
                  }
                }}
                placeholder="Ask anything about your health..."
                rows={2}
              />
              <button
                type="button"
                onClick={() => askQuestion()}
                aria-label="Send question"
              >
                <Icon name="arrow" size={19} />
              </button>
            </div>
            <div className="ai-example-prompts">
              {aiSuggestedQuestions.slice(0, 4).map((example) => (
                <button
                  type="button"
                  onClick={() => chooseQuestion(example)}
                  key={example}
                >
                  “{example}”
                </button>
              ))}
            </div>
            <span className="ai-source-note">
              <Icon name="lock" size={12} /> Uses only the HerHealth information
              you choose to share
            </span>
          </section>

          <section className="ai-quick-section">
            <AISectionHeading
              title="Ways I can help"
              subtitle="Ask, understand, and act with one HerHealth companion."
            />
            <div className="ai-capability-grid">
              {aiCapabilities.map((capability) => (
                <article key={capability.mode}>
                  <span>
                    <Icon name={capability.icon} size={20} />
                  </span>
                  <h3>{capability.mode}</h3>
                  <p>{capability.description}</p>
                  <button
                    type="button"
                    className="quiet-button"
                    onClick={() => openMode(capability.mode)}
                  >
                    {capability.action} <Icon name="arrow" size={15} />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="ai-suggested-section">
            <AISectionHeading
              title="Suggested questions"
              subtitle="Start with something you’re already tracking."
            />
            <div className="ai-question-grid">
              {aiSuggestedQuestions.map((item) => (
                <button
                  type="button"
                  onClick={() => chooseQuestion(item)}
                  key={item}
                >
                  <Icon name="consultation" size={15} />
                  <span>{item}</span>
                  <Icon name="arrow" size={14} />
                </button>
              ))}
            </div>
          </section>

          <section className="ai-recent-section">
            <AISectionHeading
              title="Recent activity"
              subtitle="Continue where you left off."
            />
            <div className="ai-recent-list">
              {[
                [
                  'Understanding my sleep trend',
                  'Today',
                  'Ask HerHealth',
                  'consultation',
                  'Ask HerHealth',
                ],
                [
                  'Complete Blood Count — explained',
                  'Yesterday',
                  'Health Record Analysis',
                  'vault',
                  'Analyze My Health',
                ],
                [
                  'My recent health patterns',
                  'Sep 30',
                  'Health Analysis',
                  'insights',
                  'Analyze My Health',
                ],
                [
                  '30-day wellbeing plan',
                  'Sep 28',
                  'Nutrition & Lifestyle',
                  'nutrition',
                  'Create Nutrition & Lifestyle Plan',
                ],
              ].map(([title, date, type, icon, nextMode]) => (
                <button
                  type="button"
                  key={title}
                  onClick={() => openMode(nextMode as AIMode)}
                >
                  <span>
                    <Icon name={icon as IconName} size={17} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <small>
                      {date} · {type}
                    </small>
                  </div>
                  <Icon name="chevronRight" size={15} />
                </button>
              ))}
            </div>
          </section>
        </>
      ) : mode === 'Analyze My Health' ? (
        <AIHealthAnalysis
          onBack={() => setView('home')}
          onAsk={openContextualAsk}
          onNavigate={onNavigate}
        />
      ) : (
        <AIConversation
          mode={mode}
          view={view}
          activeQuestion={activeQuestion}
          question={question}
          setQuestion={setQuestion}
          askQuestion={askQuestion}
          attachedContext={attachedContext}
          onBack={() => {
            setView('home');
            setActiveQuestion('');
          }}
          onNavigate={onNavigate}
        />
      )}

      <footer className="ai-footer-note">
        HerHealth provides informational support based on the information you
        choose to share. It does not replace medical advice.
      </footer>

      {showPrivacy && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setShowPrivacy(false)}
            aria-label="Close AI privacy settings"
          />
          <aside
            className="date-panel ai-consent-panel"
            aria-label="AI Companion privacy"
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">AI COMPANION</div>
                <h2>Before you start</h2>
                <p>You choose what HerHealth may use.</p>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={() => setShowPrivacy(false)}
                aria-label="Close"
              >
                <Icon name="close" size={19} />
              </button>
            </div>
            <div className="ai-consent-body">
              <p>
                HerHealth can use the health information you choose to share to
                provide more relevant answers and insights.
              </p>
              <div className="consent-list">
                <span>WHAT MAY BE USED</span>
                {[
                  'Check-ins',
                  'Symptoms',
                  'Period information',
                  'Health Timeline entries',
                  'Health records you choose to analyze',
                  'Consultation information',
                ].map((item) => (
                  <p key={item}>
                    <Icon name="check" size={13} /> {item}
                  </p>
                ))}
              </div>
              <div className="consent-toggle-row">
                <div>
                  <strong>
                    Use my HerHealth information for AI-assisted features
                  </strong>
                  <p>
                    Turning this off does not delete or change your underlying
                    health information.
                  </p>
                </div>
                <Toggle
                  checked={consentEnabled}
                  onChange={setConsentEnabled}
                  label="Use my HerHealth information for AI-assisted features"
                />
              </div>
            </div>
            <div className="panel-footer ai-consent-footer">
              <button type="button" onClick={() => onNavigate('Settings')}>
                Manage AI privacy settings
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setAiEnabled(consentEnabled);
                  setShowPrivacy(false);
                }}
              >
                Continue
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function AIConversation({
  mode,
  view,
  activeQuestion,
  question,
  setQuestion,
  askQuestion,
  attachedContext,
  onBack,
  onNavigate,
}: {
  mode: AIMode;
  view: AIViewState;
  activeQuestion: string;
  question: string;
  setQuestion: (value: string) => void;
  askQuestion: (question?: string) => void;
  attachedContext: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}) {
  const modeCopy = {
    'Ask HerHealth': [
      'Ask HerHealth',
      'Questions about your health information and everyday wellbeing.',
    ],
    'Analyze My Health': [
      'Analyze My Health',
      'Explore your recent health information in one place.',
    ],
    'Create Nutrition & Lifestyle Plan': [
      'Create Nutrition & Lifestyle Plan',
      'Turn your goals and recent information into practical actions.',
    ],
  }[mode];
  const suggestions = attachedContext
    ? [
        'What does this report contain?',
        'Can you explain these terms?',
        'What should I ask my doctor about it?',
      ]
    : mode === 'Create Nutrition & Lifestyle Plan'
      ? [
          'Create a gentle 7-day wellbeing plan',
          'Help me focus on sleep this week',
          'Add hydration to my daily plan',
        ]
      : aiSuggestedQuestions.slice(0, 3);

  if (view === 'loading') {
    return (
      <section className="ai-working-state">
        <div className="ai-calm-loader">
          <Icon name={attachedContext ? 'vault' : 'spark'} size={23} />
          <span />
        </div>
        <h2>
          {attachedContext
            ? 'Reading your health record...'
            : 'Thinking about that...'}
        </h2>
        <p>
          {attachedContext
            ? 'This may take a moment.'
            : 'Reviewing only the information you’ve chosen to share.'}
        </p>
      </section>
    );
  }

  if (view === 'error') {
    return (
      <section className="ai-inline-state">
        <div className="ai-state-mark">
          <Icon name="close" size={22} />
        </div>
        <h2>We couldn’t complete that</h2>
        <p>
          Something went wrong while processing your request. Your saved health
          information has not been changed.
        </p>
        <div>
          <button
            type="button"
            className="primary-button"
            onClick={() => askQuestion(activeQuestion)}
          >
            Try again
          </button>
          <button type="button" className="secondary-button" onClick={onBack}>
            Go back
          </button>
        </div>
      </section>
    );
  }

  if (view === 'insufficient') {
    return (
      <section className="ai-inline-state">
        <div className="ai-state-mark">
          <Icon name="timeline" size={22} />
        </div>
        <h2>Your health picture is still taking shape</h2>
        <p>
          Keep checking in and adding health information. Once there’s enough
          information, HerHealth can help you identify meaningful patterns.
        </p>
        <div>
          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate('Daily Check-in')}
          >
            Start today’s check-in
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

  return (
    <section className="ai-conversation-view">
      <header>
        <button type="button" onClick={onBack}>
          <Icon name="chevronLeft" size={16} /> AI Companion
        </button>
        <div>
          <span>
            <Icon
              name={
                attachedContext
                  ? 'vault'
                  : mode === 'Create Nutrition & Lifestyle Plan'
                    ? 'nutrition'
                    : 'consultation'
              }
              size={19}
            />
          </span>
          <div>
            <h2>{modeCopy[0]}</h2>
            <p>{modeCopy[1]}</p>
          </div>
        </div>
      </header>
      {attachedContext && (
        <div className="ai-attached">
          <Icon name="note" size={16} />
          <div>
            <span>ATTACHED</span>
            <strong>{attachedContext}</strong>
          </div>
          <Icon name="lock" size={13} />
        </div>
      )}
      <div className="ai-conversation-body">
        {!activeQuestion ? (
          <div className="ai-conversation-start">
            <div>
              <Icon name="spark" size={19} />
            </div>
            <h3>
              {attachedContext
                ? 'What would you like to know about this report?'
                : mode === 'Create Nutrition & Lifestyle Plan'
                  ? 'What would you like your plan to support?'
                  : 'What would you like to ask?'}
            </h3>
            <p>
              {attachedContext
                ? 'I can help explain its structure and terms without replacing professional interpretation.'
                : 'I’ll use only the HerHealth information you choose to share.'}
            </p>
            <div>
              {suggestions.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => askQuestion(item)}
                >
                  {item}
                  <Icon name="arrow" size={14} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="ai-messages">
            <div className="user-message">
              <span>YOU</span>
              <p>{activeQuestion}</p>
            </div>
            <div className="ai-response">
              <div className="ai-response-label">
                <span>
                  <Icon name="spark" size={14} />
                </span>
                <div>
                  <strong>HERHEALTH</strong>
                  <small>
                    {attachedContext
                      ? `Based on ${attachedContext}`
                      : 'Based on your recent health information'}
                  </small>
                </div>
              </div>
              <AIResponseContent mode={mode} question={activeQuestion} />
              <div className="response-sources">
                <span>SOURCES USED</span>
                <p>
                  {attachedContext
                    ? 'Complete Blood Count · Sep 18, 2026'
                    : 'Daily check-ins · Health Timeline · Last 14 days'}
                </p>
              </div>
              <button
                type="button"
                className="ai-supporting-entries"
                onClick={() =>
                  onNavigate(
                    attachedContext ? 'Health Vault' : 'Health Timeline',
                  )
                }
              >
                {attachedContext
                  ? 'View attached record'
                  : 'View supporting entries'}{' '}
                <Icon name="arrow" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="ai-followup">
        <div>
          <textarea
            rows={2}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a follow-up..."
          />
          <button
            type="button"
            onClick={() => askQuestion()}
            aria-label="Send follow-up"
          >
            <Icon name="arrow" size={18} />
          </button>
        </div>
        <p>
          HerHealth provides informational support and does not replace medical
          advice.
        </p>
      </div>
    </section>
  );
}

function AIHealthAnalysis({
  onBack,
  onAsk,
  onNavigate,
}: {
  onBack: () => void;
  onAsk: (context: string, question?: string) => void;
  onNavigate: (page: string) => void;
}) {
  const [stage, setStage] = useState<'setup' | 'loading' | 'results'>('setup');
  const [range, setRange] = useState('Last 30 days');
  const [sources, setSources] = useState([
    'Recent check-ins',
    'Symptoms',
    'Period history',
    'Health records',
    'Recent insights',
  ]);
  const [evidence, setEvidence] = useState<string | null>(null);

  const sourceOptions = [
    'Recent check-ins',
    'Symptoms',
    'Period history',
    'Health records',
    'Recent insights',
    'Consultation information',
  ];

  const toggleSource = (source: string) =>
    setSources((current) =>
      current.includes(source)
        ? current.filter((item) => item !== source)
        : [...current, source],
    );

  const analyze = () => {
    if (sources.length === 0) return;
    setStage('loading');
    window.setTimeout(() => setStage('results'), 900);
  };

  if (stage === 'loading') {
    return (
      <section className="ai-working-state ai-analysis-loading">
        <div className="ai-calm-loader">
          <Icon name="insights" size={23} />
          <span />
        </div>
        <h2>Analyzing your recent health information...</h2>
        <p>
          HerHealth is looking across the information you’ve chosen to include.
        </p>
      </section>
    );
  }

  if (stage === 'setup') {
    return (
      <section className="ai-analysis-setup">
        <header>
          <button type="button" onClick={onBack}>
            <Icon name="chevronLeft" size={16} /> AI Companion
          </button>
          <div>
            <span>
              <Icon name="insights" size={20} />
            </span>
            <div>
              <h2>Analyze My Health</h2>
              <p>
                Look across your recent information to understand what stands
                out.
              </p>
            </div>
          </div>
        </header>
        <div className="analysis-setup-body">
          <div className="analysis-intro">
            <div className="section-kicker">UNDERSTAND YOUR HEALTH PICTURE</div>
            <h3>Choose what you’d like HerHealth to analyze</h3>
            <p>
              You’re in control. Select the information and date range you want
              to include.
            </p>
          </div>
          <fieldset className="analysis-source-options">
            <legend>Analyze</legend>
            {sourceOptions.map((source) => (
              <label key={source}>
                <input
                  type="checkbox"
                  checked={sources.includes(source)}
                  onChange={() => toggleSource(source)}
                />
                <span>
                  <Icon
                    name={
                      source === 'Health records'
                        ? 'vault'
                        : source === 'Period history'
                          ? 'period'
                          : source === 'Recent insights'
                            ? 'insights'
                            : source === 'Consultation information'
                              ? 'consultation'
                              : 'check'
                    }
                    size={17}
                  />
                </span>
                <div>
                  <strong>{source}</strong>
                  <small>{analysisSourceDescription(source)}</small>
                </div>
              </label>
            ))}
          </fieldset>
          <label className="analysis-range">
            <span>Date range</span>
            <div>
              <Icon name="calendar" size={16} />
              <select
                value={range}
                onChange={(event) => setRange(event.target.value)}
              >
                <option>Last 14 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
              </select>
              <Icon name="chevronRight" size={13} />
            </div>
          </label>
          <div className="analysis-setup-note">
            <Icon name="lock" size={14} />
            <p>
              Only the selected information will be included. Analysis does not
              change your saved health data.
            </p>
          </div>
          <button
            type="button"
            className="primary-button analysis-start-button"
            disabled={sources.length === 0}
            onClick={analyze}
          >
            <Icon name="insights" size={16} /> Analyze my health
          </button>
        </div>
      </section>
    );
  }

  const patterns = [
    [
      'Sleep & Energy',
      'Your energy ratings have been lower on several days when you slept less than 7 hours.',
    ],
    [
      'Cycle & Symptoms',
      'Fatigue and cramps appeared more often around the beginning of your last two recorded periods.',
    ],
    [
      'Stress & Mood',
      'Higher-stress days have appeared alongside lower mood ratings several times this month.',
    ],
  ];

  return (
    <section className="ai-analysis-results">
      <header>
        <button type="button" onClick={onBack}>
          <Icon name="chevronLeft" size={16} /> AI Companion
        </button>
        <div>
          <span>
            <Icon name="insights" size={20} />
          </span>
          <div>
            <h2>Your health overview</h2>
            <p>
              {range} · {sources.length} information sources
            </p>
          </div>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setStage('setup')}
        >
          Change analysis
        </button>
      </header>
      <div className="analysis-results-body">
        <div className="analysis-results-intro">
          <div className="section-kicker">ANALYZE MY HEALTH</div>
          <h3>Here’s what stands out from your recent health information.</h3>
          <p>
            These are observations from the information you’ve logged, not
            medical conclusions.
          </p>
        </div>

        <section className="analysis-changes">
          <div className="analysis-section-title">
            <h3>Recent changes</h3>
            <span>Compared with your usual patterns</span>
          </div>
          <div>
            {[
              ['Sleep', '6h 35m', 'average', '↓ 45 min from usual', 'moon'],
              [
                'Energy',
                '6.8 / 10',
                'average',
                '↓ from previous period',
                'energy',
              ],
              [
                'Stress',
                'Moderate',
                'average',
                'Higher on 5 days this month',
                'stress',
              ],
            ].map(([title, value, note, change, icon]) => (
              <article key={title}>
                <span>
                  <Icon name={icon as IconName} size={18} />
                </span>
                <div>
                  <small>{title}</small>
                  <strong>{value}</strong>
                  <p>{note}</p>
                </div>
                <b>{change}</b>
              </article>
            ))}
          </div>
        </section>

        <section className="analysis-patterns">
          <div className="analysis-section-title">
            <h3>Patterns we noticed</h3>
            <span>Based on selected information</span>
          </div>
          <div>
            {patterns.map(([title, text], index) => (
              <article key={title}>
                <div className="pattern-index">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                  <small>Observation from your logged data</small>
                </div>
                <div>
                  <button type="button" onClick={() => setEvidence(title)}>
                    View evidence
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onAsk(
                        `${title} pattern · ${range}`,
                        `Can you help me understand my ${title.toLowerCase()} pattern?`,
                      )
                    }
                  >
                    Ask about this
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="analysis-lower-grid">
          <section className="analysis-records">
            <div className="analysis-section-title">
              <h3>Recent health records</h3>
              <span>3 records included</span>
            </div>
            {[
              ['Complete Blood Count', 'Sep 18, 2026'],
              ['Vitamin & Iron Panel', 'Sep 14, 2026'],
              ['Ultrasound Report', 'Aug 26, 2026'],
            ].map(([record, date]) => (
              <article key={record}>
                <span>
                  <Icon name="note" size={16} />
                </span>
                <div>
                  <strong>{record}</strong>
                  <small>{date}</small>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onAsk(
                      `${record} · ${date}`,
                      'What does this report contain?',
                    )
                  }
                >
                  Understand this record
                </button>
              </article>
            ))}
          </section>
          <aside className="analysis-discuss">
            <span>
              <Icon name="consultation" size={18} />
            </span>
            <div className="section-kicker">WORTH DISCUSSING</div>
            <h3>Recurring headaches appeared several times this month.</h3>
            <p>
              You may want to mention this pattern during your next consultation
              if it continues.
            </p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate('Health Timeline')}
            >
              View related entries <Icon name="arrow" size={14} />
            </button>
          </aside>
        </div>
      </div>

      {evidence && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setEvidence(null)}
            aria-label="Close evidence"
          />
          <aside
            className="date-panel evidence-panel"
            aria-label={`${evidence} evidence`}
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">PATTERN EVIDENCE</div>
                <h2>{evidence}</h2>
                <p>Supporting information from your history</p>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={() => setEvidence(null)}
                aria-label="Close"
              >
                <Icon name="close" size={19} />
              </button>
            </div>
            <div className="evidence-body">
              <section>
                <span>OBSERVATION</span>
                <p>
                  {evidence === 'Sleep & Energy'
                    ? 'Your energy ratings were lower on several days when your recorded sleep was below 7 hours.'
                    : evidence === 'Cycle & Symptoms'
                      ? 'Fatigue and cramps appeared more often near the beginning of your last two recorded periods.'
                      : 'Higher-stress days appeared alongside lower mood ratings several times this month.'}
                </p>
              </section>
              <section className="evidence-based-on">
                <span>BASED ON</span>
                <div>
                  <p>
                    <strong>14</strong> daily check-ins
                  </p>
                  <p>
                    <strong>11</strong> sleep entries
                  </p>
                  <p>
                    <strong>9</strong> energy entries
                  </p>
                </div>
              </section>
              <section className="evidence-dates">
                <span>SUPPORTING DATES</span>
                {[
                  ['Oct 3', 'Sleep 6h 10m · Energy 5/10'],
                  ['Oct 2', 'Sleep 6h 30m · Energy 6/10'],
                  ['Sep 30', 'Sleep 7h 40m · Energy 8/10'],
                ].map(([date, detail]) => (
                  <article key={date}>
                    <time>{date}</time>
                    <i />
                    <p>{detail}</p>
                  </article>
                ))}
              </section>
              <div className="evidence-caution">
                <Icon name="spark" size={15} />
                <p>
                  This is a pattern in your logged data and is not a medical
                  conclusion.
                </p>
              </div>
            </div>
            <div className="panel-footer evidence-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setEvidence(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  onAsk(
                    `${evidence} pattern · ${range}`,
                    `Can you help me understand this ${evidence.toLowerCase()} pattern?`,
                  )
                }
              >
                Ask HerHealth about this
              </button>
            </div>
          </aside>
        </>
      )}
    </section>
  );
}

function analysisSourceDescription(source: string) {
  return {
    'Recent check-ins': 'Mood, energy, sleep, and stress',
    Symptoms: 'Symptoms and severity you recorded',
    'Period history': 'Cycle dates and related symptoms',
    'Health records': 'Documents you choose to include',
    'Recent insights': 'Patterns HerHealth previously observed',
    'Consultation information': 'Saved visits, questions, and notes',
  }[source];
}

function AIResponseContent({
  mode,
  question,
}: {
  mode: AIMode;
  question: string;
}) {
  if (/report|record|blood count|terms/i.test(question)) {
    return (
      <div className="ai-response-copy">
        <p>
          This document is a <strong>Complete Blood Count report</strong> from
          September 18. It contains measurements related to different types of
          blood cells.
        </p>
        <h4>What I can help with</h4>
        <ul>
          <li>Explain the headings and common terms in simpler language</li>
          <li>Help you prepare questions for your healthcare professional</li>
          <li>Connect this record to your Health Timeline</li>
        </ul>
        <div className="ai-caution">
          I can organize and explain what the document contains, but I can’t
          interpret results as a diagnosis.
        </div>
      </div>
    );
  }
  if (mode === 'Create Nutrition & Lifestyle Plan') {
    return (
      <div className="ai-response-copy">
        <p>
          Here is a gentle starting plan based on your recent sleep, hydration,
          and energy entries.
        </p>
        <h4>This week’s practical focus</h4>
        <ul>
          <li>Keep your bedtime within a consistent 30-minute window</li>
          <li>Log one glass of water with each main meal</li>
          <li>Take a short walk on 4 days, if it feels comfortable</li>
        </ul>
        <div className="ai-caution">
          You can adjust or remove any action. This plan is for everyday
          wellbeing and is not medical treatment.
        </div>
      </div>
    );
  }
  return (
    <div className="ai-response-copy">
      <p>
        From your recent check-ins, your energy has been{' '}
        <strong>lower than your usual average on 4 days this week</strong>.
      </p>
      <h4>What appeared alongside it</h4>
      <ul>
        <li>Average sleep was about 45 minutes shorter than usual</li>
        <li>Stress was moderate on 3 of those days</li>
        <li>Fatigue was logged twice</li>
      </ul>
      <p>
        It may be useful to keep tracking sleep, stress, and energy together to
        see whether the pattern continues.
      </p>
      <div className="ai-caution">
        This is based on information you logged. It is not a medical conclusion.
      </div>
    </div>
  );
}

function AIEmergencyState({ onBack }: { onBack: () => void }) {
  return (
    <section className="ai-emergency-state">
      <div className="emergency-mark">
        <Icon name="consultation" size={24} />
      </div>
      <div className="eyebrow">URGENT SUPPORT</div>
      <h1>You may need urgent help</h1>
      <p>What you’ve described could require immediate medical attention.</p>
      <a href="tel:112" className="emergency-primary">
        Call 112 — Emergency
      </a>
      <div className="emergency-contacts">
        <div>
          <strong>Ambulance: 108</strong>
          <span>For emergency medical assistance.</span>
        </div>
        <div>
          <strong>Tele-MANAS: 14416</strong>
          <span>24×7 Government of India mental-health support.</span>
        </div>
      </div>
      <button type="button" className="secondary-button" onClick={onBack}>
        Return to HerHealth
      </button>
      <footer>
        HerHealth is not an emergency service. If you are in immediate danger,
        contact emergency services or seek urgent medical care.
      </footer>
    </section>
  );
}

function AISectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="ai-section-heading">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}
