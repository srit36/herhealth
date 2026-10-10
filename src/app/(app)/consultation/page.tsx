'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { useNavigate } from '@/lib/useNavigate';
import {
  type ConsultationRecord,
  initialConsultations,
} from '@/mock/consultation';

export default function ConsultationPage() {
  const onNavigate = useNavigate();
  return <Consultation onNavigate={onNavigate} />;
}

function Consultation({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [consultations, setConsultations] = useState(initialConsultations);
  const [questions, setQuestions] = useState([
    'Could my recent fatigue be worth discussing?',
    'Should I continue tracking my headaches?',
  ]);
  const [showSummary, setShowSummary] = useState(false);
  const [pdfStage, setPdfStage] = useState<
    'summary' | 'loading' | 'ready' | 'preview'
  >('summary');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationRecord | null>(null);
  const [savedPrompt, setSavedPrompt] = useState(false);
  const [timelineMessage, setTimelineMessage] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    type: 'General',
    date: '2026-10-10',
    doctor: '',
    reason: '',
    notes: '',
    followUp: '',
  });

  const openSummary = () => {
    setPdfStage('summary');
    setShowSummary(true);
  };

  const generatePdf = () => {
    setPdfStage('loading');
    window.setTimeout(() => setPdfStage('ready'), 900);
  };

  const saveConsultation = () => {
    const formattedDate = new Date(
      `${newConsultation.date}T12:00:00`,
    ).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    setConsultations((current) => [
      {
        id: Date.now(),
        date: formattedDate,
        type: `${newConsultation.type} consultation`,
        doctor: newConsultation.doctor || undefined,
        reason: newConsultation.reason || undefined,
        notes: newConsultation.notes || undefined,
        followUp: newConsultation.followUp || undefined,
        summary: false,
      },
      ...current,
    ]);
    setSavedPrompt(true);
  };

  if (consultations.length === 0) {
    return (
      <ConsultationEmptyState
        onAdd={() => setShowAdd(true)}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="consultation-page">
      <section className="consultation-page-header">
        <div>
          <div className="eyebrow">CARE, ORGANIZED</div>
          <h1>Consultation</h1>
          <p>Prepare for appointments and keep track of what was discussed.</p>
        </div>
        <button
          type="button"
          className="primary-button consultation-add-button"
          onClick={() => {
            setShowAdd(true);
            setSavedPrompt(false);
          }}
        >
          <Icon name="plus" size={17} /> Add consultation
        </button>
      </section>

      {timelineMessage && (
        <div className="vault-message consultation-message" role="status">
          <Icon name="check" size={16} /> {timelineMessage}
          <button
            type="button"
            onClick={() => setTimelineMessage('')}
            aria-label="Dismiss"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <section className="next-consultation">
        <div className="next-label">
          <span>
            <Icon name="calendar" size={18} />
          </span>
          <div>
            <strong>NEXT CONSULTATION</strong>
            <small>Personal reminder</small>
          </div>
        </div>
        <div className="next-main">
          <div>
            <h2>General consultation</h2>
            <p>Dr. Meera Sharma · Apollo Clinic</p>
          </div>
          <div className="appointment-when">
            <span>OCT</span>
            <strong>10</strong>
            <div>
              <b>Saturday</b>
              <small>10:30 AM</small>
            </div>
          </div>
        </div>
        <div className="next-actions">
          <button
            type="button"
            className="primary-button"
            onClick={openSummary}
          >
            Prepare for visit
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setSelectedConsultation({
                id: 0,
                date: 'October 10, 2026',
                type: 'General consultation',
                doctor: 'Dr. Meera Sharma',
                reason:
                  'Discuss recent headaches, fatigue, and sleep patterns.',
                notes: 'Preparation in progress.',
                summary: false,
              })
            }
          >
            View details
          </button>
        </div>
      </section>

      <section className="prepare-section">
        <div className="prepare-heading">
          <div>
            <div className="section-kicker">PREPARE FOR YOUR VISIT</div>
            <h2>Bring the important details together</h2>
            <p>
              Review the information you’ve tracked recently and create a
              concise summary to take to your healthcare professional.
            </p>
          </div>
          <div className="prepare-progress">
            <strong>4</strong>
            <span>sources reviewed</span>
          </div>
        </div>

        <div className="prepare-grid">
          <PreparationBlock
            icon="insights"
            title="Recent patterns"
            items={[
              'Sleep has averaged 6h 35m over the last 7 days',
              'Headache logged 4 times in the last 30 days',
              'Stress was higher on 5 days this month',
            ]}
          />
          <PreparationBlock
            icon="mood"
            title="Recent symptoms"
            items={[
              'Headache · 4 entries',
              'Fatigue · 3 entries',
              'Cramps · 2 entries',
            ]}
          />
          <PreparationBlock
            icon="vault"
            title="Relevant health records"
            items={['Complete Blood Count · Sep 18', 'Prescription · Sep 12']}
          />
          <div className="preparation-block questions-block">
            <div className="prep-block-title">
              <span>
                <Icon name="consultation" size={17} />
              </span>
              <div>
                <strong>Questions for your doctor</strong>
                <small>Editable · user-entered</small>
              </div>
            </div>
            <div className="question-list">
              {questions.map((question, index) => (
                <label key={index}>
                  <span>{index + 1}</span>
                  <input
                    value={question}
                    onChange={(event) =>
                      setQuestions((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      )
                    }
                    aria-label={`Question ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuestions((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    aria-label="Remove question"
                  >
                    <Icon name="close" size={13} />
                  </button>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="add-question-button"
              onClick={() => setQuestions((current) => [...current, ''])}
            >
              <Icon name="plus" size={13} /> Add a question
            </button>
          </div>
        </div>

        <div className="prepare-footer">
          <div>
            <Icon name="spark" size={15} />
            <span>
              Your summary will only use information you’ve recorded in
              HerHealth.
            </span>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={openSummary}
          >
            Create consultation summary <Icon name="arrow" size={17} />
          </button>
        </div>
      </section>

      <section className="consultation-bottom-grid">
        <div className="past-consultations">
          <div className="insight-section-heading">
            <div>
              <h2>Past consultations</h2>
              <p>Your saved consultation history</p>
            </div>
          </div>
          <div className="past-list">
            {consultations.map((consultation) => (
              <article key={consultation.id}>
                <time>
                  {consultation.date.replace(', 2026', '')}
                  <small>2026</small>
                </time>
                <span className="past-marker">
                  <Icon name="consultation" size={16} />
                </span>
                <div>
                  <strong>{consultation.type}</strong>
                  <small>
                    {consultation.doctor || 'Healthcare professional not added'}
                  </small>
                </div>
                <span
                  className={`summary-status ${consultation.summary ? 'available' : ''}`}
                >
                  {consultation.summary ? 'Summary available' : 'No summary'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    consultation.summary
                      ? openSummary()
                      : setSelectedConsultation(consultation)
                  }
                >
                  {consultation.summary ? 'View summary' : 'View details'}{' '}
                  <Icon name="arrow" size={14} />
                </button>
              </article>
            ))}
          </div>
        </div>

        <aside className="care-history-callout">
          <span>
            <Icon name="timeline" size={20} />
          </span>
          <h2>Keep your care history connected</h2>
          <p>
            Your consultations can appear alongside your check-ins, symptoms,
            periods, and health records in your Health Timeline.
          </p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => onNavigate('Health Timeline')}
          >
            View Health Timeline <Icon name="arrow" size={15} />
          </button>
        </aside>
      </section>

      {showSummary && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setShowSummary(false)}
            aria-label="Close consultation summary"
          />
          <aside
            className={`date-panel consultation-summary-panel stage-${pdfStage}`}
            aria-label="Consultation summary"
          >
            {pdfStage === 'summary' && (
              <>
                <div className="panel-header">
                  <div>
                    <div className="section-kicker">GENERAL CONSULTATION</div>
                    <h2>Your consultation summary</h2>
                    <p>Last 30 days · Prepared from your records</p>
                  </div>
                  <button
                    type="button"
                    className="panel-close"
                    onClick={() => setShowSummary(false)}
                    aria-label="Close"
                  >
                    <Icon name="close" size={19} />
                  </button>
                </div>
                <div className="consultation-summary-body">
                  <div className="summary-date-range">
                    <span>DATE RANGE</span>
                    <strong>September 10 – October 10, 2026</strong>
                  </div>
                  <SummaryOverview />
                  <SummarySymptoms />
                  <div className="summary-records">
                    <div>
                      <span>RELEVANT HEALTH RECORDS</span>
                      <strong>2 health records</strong>
                    </div>
                    <p>
                      <Icon name="note" size={14} /> Complete Blood Count{' '}
                      <small>Sep 18</small>
                    </p>
                    <p>
                      <Icon name="note" size={14} /> Prescription{' '}
                      <small>Sep 12</small>
                    </p>
                  </div>
                  <div className="summary-observation">
                    <span>OBSERVATION FROM YOUR RECORDS</span>
                    <p>
                      “Headaches appeared more often during weeks when sleep was
                      below your usual average.”
                    </p>
                    <small>
                      This is a pattern in your logged data and is not a medical
                      conclusion.
                    </small>
                  </div>
                  <div className="summary-questions">
                    <span>QUESTIONS</span>
                    {questions.filter(Boolean).map((question, index) => (
                      <p key={index}>
                        <b>{index + 1}</b>
                        {question}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="panel-footer summary-panel-footer">
                  <div>
                    <button type="button">Edit summary</button>
                    <button type="button">Save summary</button>
                  </div>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={generatePdf}
                  >
                    <Icon name="note" size={15} /> Generate PDF
                  </button>
                </div>
              </>
            )}
            {pdfStage === 'loading' && (
              <div className="pdf-status">
                <div className="pdf-loader">
                  <Icon name="note" size={25} />
                  <span />
                </div>
                <h2>Preparing your consultation summary...</h2>
                <p>Bringing together your selected health information.</p>
              </div>
            )}
            {pdfStage === 'ready' && (
              <div className="pdf-status ready">
                <div className="pdf-ready-mark">
                  <Icon name="check" size={26} />
                </div>
                <div className="eyebrow">CONSULTATION SUMMARY</div>
                <h2>Your PDF is ready</h2>
                <p>
                  You can save this summary or share it with your healthcare
                  professional.
                </p>
                <div className="ready-file">
                  <span>
                    <Icon name="note" size={20} />
                  </span>
                  <div>
                    <strong>HerHealth_Consultation_Summary.pdf</strong>
                    <small>October 10, 2026 · PDF</small>
                  </div>
                </div>
                <div className="pdf-ready-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setDownloaded(true)}
                  >
                    <Icon name="download" size={16} />{' '}
                    {downloaded ? 'Downloaded' : 'Download PDF'}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setPdfStage('preview')}
                  >
                    View PDF
                  </button>
                  <button
                    type="button"
                    className="text-button teal"
                    onClick={() => setShowSummary(false)}
                  >
                    Back to consultation
                  </button>
                </div>
              </div>
            )}
            {pdfStage === 'preview' && (
              <PdfPreview
                onBack={() => setPdfStage('ready')}
                onDownload={() => setDownloaded(true)}
                downloaded={downloaded}
              />
            )}
          </aside>
        </>
      )}

      {showAdd && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setShowAdd(false)}
            aria-label="Close add consultation"
          />
          <aside
            className="date-panel add-consultation-panel"
            aria-label="Add consultation"
          >
            {!savedPrompt ? (
              <>
                <div className="panel-header">
                  <div>
                    <div className="section-kicker">CARE HISTORY</div>
                    <h2>Add consultation</h2>
                    <p>Save the details you want to remember.</p>
                  </div>
                  <button
                    type="button"
                    className="panel-close"
                    onClick={() => setShowAdd(false)}
                    aria-label="Close"
                  >
                    <Icon name="close" size={19} />
                  </button>
                </div>
                <div className="add-consultation-body">
                  <fieldset>
                    <legend>Consultation type</legend>
                    <div className="consultation-type-options">
                      {[
                        'General',
                        'Gynecology',
                        'Dermatology',
                        'Nutrition',
                        'Other',
                      ].map((type) => (
                        <button
                          type="button"
                          className={
                            newConsultation.type === type ? 'selected' : ''
                          }
                          onClick={() =>
                            setNewConsultation((current) => ({
                              ...current,
                              type,
                            }))
                          }
                          key={type}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label>
                    <span>Date</span>
                    <input
                      type="date"
                      value={newConsultation.date}
                      onChange={(event) =>
                        setNewConsultation((current) => ({
                          ...current,
                          date: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>
                      Doctor / healthcare professional <small>Optional</small>
                    </span>
                    <input
                      value={newConsultation.doctor}
                      onChange={(event) =>
                        setNewConsultation((current) => ({
                          ...current,
                          doctor: event.target.value,
                        }))
                      }
                      placeholder="e.g. Dr. Meera Sharma"
                    />
                  </label>
                  <label>
                    <span>
                      Reason for visit <small>Optional</small>
                    </span>
                    <input
                      value={newConsultation.reason}
                      onChange={(event) =>
                        setNewConsultation((current) => ({
                          ...current,
                          reason: event.target.value,
                        }))
                      }
                      placeholder="What did you want to discuss?"
                    />
                  </label>
                  <label>
                    <span>Notes</span>
                    <textarea
                      rows={4}
                      value={newConsultation.notes}
                      onChange={(event) =>
                        setNewConsultation((current) => ({
                          ...current,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="Add anything you want to remember about this consultation..."
                    />
                  </label>
                  <label>
                    <span>
                      Follow-up date <small>Optional</small>
                    </span>
                    <input
                      type="date"
                      value={newConsultation.followUp}
                      onChange={(event) =>
                        setNewConsultation((current) => ({
                          ...current,
                          followUp: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                <div className="panel-footer add-consultation-footer">
                  <span>
                    <Icon name="lock" size={13} /> Private to you
                  </span>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={saveConsultation}
                  >
                    Save consultation
                  </button>
                </div>
              </>
            ) : (
              <div className="saved-consultation-prompt">
                <div className="success-mark">
                  <Icon name="check" size={25} />
                </div>
                <h2>Consultation saved</h2>
                <p>Prepare a summary from your recent health data?</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    setShowAdd(false);
                    openSummary();
                  }}
                >
                  Prepare summary
                </button>
                <button
                  type="button"
                  className="text-button teal"
                  onClick={() => setShowAdd(false)}
                >
                  Not now
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {selectedConsultation && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setSelectedConsultation(null)}
            aria-label="Close consultation details"
          />
          <aside
            className="date-panel consultation-detail-panel"
            aria-label="Consultation details"
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">CONSULTATION</div>
                <h2>{selectedConsultation.type}</h2>
                <p>{selectedConsultation.date}</p>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={() => setSelectedConsultation(null)}
                aria-label="Close"
              >
                <Icon name="close" size={19} />
              </button>
            </div>
            <div className="consultation-detail-body">
              <dl>
                <div>
                  <dt>Doctor</dt>
                  <dd>{selectedConsultation.doctor || 'Not added'}</dd>
                </div>
                <div>
                  <dt>Reason for visit</dt>
                  <dd>{selectedConsultation.reason || 'Not added'}</dd>
                </div>
              </dl>
              <div className="consult-detail-section">
                <span>USER-ENTERED NOTES</span>
                <p>{selectedConsultation.notes || 'No notes were added.'}</p>
              </div>
              <div className="discussed-info">
                <span>HEALTH INFORMATION DISCUSSED</span>
                {[
                  'Symptoms · Headache and fatigue',
                  'Check-ins · Last 30 days',
                  'Health records · 2 records',
                  'Insights · Sleep & Energy',
                ].map((item) => (
                  <button type="button" key={item}>
                    {item}
                    <Icon name="chevronRight" size={14} />
                  </button>
                ))}
              </div>
              {selectedConsultation.followUp && (
                <div className="follow-up-box">
                  <Icon name="calendar" size={17} />
                  <div>
                    <span>FOLLOW-UP</span>
                    <strong>{selectedConsultation.followUp}</strong>
                  </div>
                </div>
              )}
            </div>
            <div className="consultation-detail-actions">
              <button type="button">Edit</button>
              <button
                type="button"
                onClick={() => {
                  setSelectedConsultation(null);
                  openSummary();
                }}
              >
                View summary
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedConsultation(null);
                  openSummary();
                }}
              >
                Generate PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimelineMessage(
                    `${selectedConsultation.type} was added to your Health Timeline.`,
                  );
                  setSelectedConsultation(null);
                }}
              >
                Add to timeline
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function PreparationBlock({
  icon,
  title,
  items,
}: {
  icon: IconName;
  title: string;
  items: string[];
}) {
  return (
    <div className="preparation-block">
      <div className="prep-block-title">
        <span>
          <Icon name={icon} size={17} />
        </span>
        <strong>{title}</strong>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SummaryOverview() {
  return (
    <section className="summary-overview">
      <span>WHAT I’VE BEEN TRACKING</span>
      <div>
        {[
          ['Sleep', '7h 05m', 'average'],
          ['Mood', 'Mostly good', ''],
          ['Energy', '6.8 / 10', 'average'],
          ['Stress', 'Moderate', ''],
        ].map(([label, value, note]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function SummarySymptoms() {
  return (
    <section className="summary-symptoms">
      <span>SYMPTOMS I’VE NOTICED</span>
      <div>
        {[
          ['Headache', '4 entries'],
          ['Fatigue', '3 entries'],
          ['Cramps', '2 entries'],
        ].map(([symptom, count]) => (
          <p key={symptom}>
            <strong>{symptom}</strong>
            <span>{count}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

function PdfPreview({
  onBack,
  onDownload,
  downloaded,
}: {
  onBack: () => void;
  onDownload: () => void;
  downloaded: boolean;
}) {
  return (
    <div className="pdf-preview-screen">
      <div className="pdf-preview-toolbar">
        <button type="button" onClick={onBack}>
          <Icon name="chevronLeft" size={16} /> Back
        </button>
        <span>HerHealth_Consultation_Summary.pdf</span>
        <button type="button" className="download-preview" onClick={onDownload}>
          <Icon name="download" size={15} />{' '}
          {downloaded ? 'Downloaded' : 'Download PDF'}
        </button>
      </div>
      <div className="a4-preview-wrap">
        <article className="a4-document">
          <header>
            <div className="pdf-brand">
              <span className="brand-mark">
                <i />
                <i />
              </span>
              <strong>HERHEALTH</strong>
            </div>
            <div>
              <span>CONSULTATION DATE</span>
              <strong>October 10, 2026</strong>
            </div>
          </header>
          <h1>Consultation Summary</h1>
          <div className="pdf-meta">
            <p>
              <span>Patient</span>
              <strong>Ananya</strong>
            </p>
            <p>
              <span>Consultation</span>
              <strong>General consultation</strong>
            </p>
            <p>
              <span>Summary period</span>
              <strong>Sep 10 – Oct 10, 2026</strong>
            </p>
          </div>
          <PdfSection title="Health overview">
            <div className="pdf-overview">
              {[
                ['Sleep', '7h 05m average'],
                ['Mood', 'Mostly good'],
                ['Energy', '6.8 / 10 average'],
                ['Stress', 'Moderate'],
              ].map(([label, value]) => (
                <p key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </p>
              ))}
            </div>
          </PdfSection>
          <PdfSection title="Symptoms tracked">
            <div className="pdf-simple-list">
              {[
                ['Headache', '4 entries'],
                ['Fatigue', '3 entries'],
                ['Cramps', '2 entries'],
              ].map(([label, value]) => (
                <p key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </p>
              ))}
            </div>
          </PdfSection>
          <PdfSection title="Patterns observed">
            <blockquote>
              “Headaches appeared more often during weeks when sleep was below
              your usual average.”
            </blockquote>
            <small className="pdf-caution">
              Observation from logged data — not a medical conclusion.
            </small>
          </PdfSection>
          <PdfSection title="Relevant health records">
            <div className="pdf-records">
              <p>
                Complete Blood Count <span>September 18, 2026</span>
              </p>
              <p>
                Prescription <span>September 12, 2026</span>
              </p>
            </div>
          </PdfSection>
          <PdfSection title="Questions for my healthcare professional">
            <ol>
              <li>Could my recent fatigue be worth discussing?</li>
              <li>Should I continue tracking my headaches?</li>
            </ol>
          </PdfSection>
          <PdfSection title="Consultation notes">
            <div className="pdf-note-lines">
              <i />
              <i />
              <i />
            </div>
          </PdfSection>
          <footer>
            Generated by HerHealth · October 10, 2026{' '}
            <span>Personal health summary · Page 1 of 1</span>
          </footer>
        </article>
      </div>
    </div>
  );
}

function PdfSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="pdf-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ConsultationEmptyState({
  onAdd,
  onNavigate,
}: {
  onAdd: () => void;
  onNavigate: (page: string) => void;
}) {
  return (
    <section className="consultation-empty">
      <div className="consult-empty-art">
        <Icon name="consultation" size={25} />
        <span />
        <span />
      </div>
      <div className="eyebrow">PERSONAL CARE ORGANIZER</div>
      <h1>Prepare for your next visit</h1>
      <p>
        Save consultation notes and bring together the health information you’ve
        tracked so it’s easier to discuss what matters with your healthcare
        professional.
      </p>
      <div>
        <button type="button" className="primary-button" onClick={onAdd}>
          <Icon name="plus" size={16} /> Add consultation
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onNavigate('Daily Check-in')}
        >
          Start today’s check-in
        </button>
      </div>
    </section>
  );
}
