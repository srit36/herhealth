'use client';

import { useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { useNavigate } from '@/lib/useNavigate';
import {
  type VaultRecordType,
  type VaultRecord,
  startingVaultRecords,
  vaultTypes,
} from '@/mock/vault';

export default function VaultPage() {
  const onNavigate = useNavigate();
  return <HealthVault onNavigate={onNavigate} />;
}

function HealthVault({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [records, setRecords] = useState<VaultRecord[]>(startingVaultRecords);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Any date');
  const [sort, setSort] = useState('Newest first');
  const [selectedRecord, setSelectedRecord] = useState<VaultRecord | null>(
    null,
  );
  const [showAdd, setShowAdd] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<VaultRecord | null>(null);
  const [timelineMessage, setTimelineMessage] = useState('');

  const [newType, setNewType] = useState<VaultRecordType>('Lab report');
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('2026-10-05');
  const [newConsultation, setNewConsultation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [fileName, setFileName] = useState('');

  const visibleRecords = records
    .filter((record) => {
      const matchesQuery = [
        record.name,
        record.type,
        record.date,
        record.related,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesType = typeFilter === 'All' || record.type === typeFilter;
      const recordTime = new Date(record.isoDate).getTime();
      const cutoff =
        dateFilter === 'Past month'
          ? new Date('2026-09-05').getTime()
          : dateFilter === 'Past 3 months'
            ? new Date('2026-07-05').getTime()
            : dateFilter === 'Past year'
              ? new Date('2025-10-05').getTime()
              : 0;
      return matchesQuery && matchesType && recordTime >= cutoff;
    })
    .sort((a, b) =>
      sort === 'Oldest first'
        ? a.isoDate.localeCompare(b.isoDate)
        : sort === 'Name A–Z'
          ? a.name.localeCompare(b.name)
          : b.isoDate.localeCompare(a.isoDate),
    );

  const saveRecord = () => {
    const fallbackName = fileName
      ? fileName.replace(/\.[^/.]+$/, '')
      : `New ${newType}`;
    const date = new Date(`${newDate}T12:00:00`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const record: VaultRecord = {
      id: Date.now(),
      name: newName.trim() || fallbackName,
      type: newType,
      date,
      isoDate: newDate,
      added: 'October 5, 2026',
      related: newConsultation || undefined,
      notes: newNotes || undefined,
      format: fileName.toLowerCase().endsWith('.png')
        ? 'PNG'
        : fileName.toLowerCase().match(/\.jpe?g$/)
          ? 'JPG'
          : 'PDF',
    };
    setRecords((current) => [record, ...current]);
    setShowAdd(false);
    setSelectedRecord(record);
    setNewName('');
    setNewConsultation('');
    setNewNotes('');
    setFileName('');
  };

  const addRecordToTimeline = (record: VaultRecord) => {
    setTimelineMessage(`${record.name} was added to your Health Timeline.`);
    setOpenMenu(null);
  };

  const categoryCounts = [
    [
      'Lab reports',
      records.filter((record) => record.type === 'Lab report').length,
    ],
    [
      'Prescriptions',
      records.filter((record) => record.type === 'Prescription').length,
    ],
    [
      'Doctor notes',
      records.filter((record) => record.type === 'Doctor note').length,
    ],
    [
      'Other',
      records.filter(
        (record) =>
          !['Lab report', 'Prescription', 'Doctor note'].includes(record.type),
      ).length,
    ],
  ] as const;

  if (records.length === 0) {
    return (
      <VaultEmptyState onAdd={() => setShowAdd(true)} onNavigate={onNavigate} />
    );
  }

  return (
    <div className="vault-page">
      <section className="vault-header">
        <div>
          <div className="eyebrow">PRIVATE HEALTH ARCHIVE</div>
          <h1>Health Vault</h1>
          <p>
            Keep your important health records organized in one private place.
          </p>
        </div>
        <button
          type="button"
          className="primary-button add-record-button"
          onClick={() => setShowAdd(true)}
        >
          <Icon name="plus" size={17} /> Add health record
        </button>
      </section>

      <div className="vault-privacy">
        <span>
          <Icon name="lock" size={16} />
        </span>
        <div>
          <strong>Private to you</strong>
          <p>
            Your health records are stored securely and are only available to
            you.
          </p>
        </div>
      </div>

      {timelineMessage && (
        <div className="vault-message" role="status">
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

      <section className="vault-toolbar" aria-label="Search and filter records">
        <label className="vault-search">
          <Icon name="search" size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your health records..."
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
        <label className="vault-select">
          <span>Type</span>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option>All</option>
            {vaultTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <Icon name="chevronRight" size={13} />
        </label>
        <label className="vault-select">
          <span>Date</span>
          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          >
            <option>Any date</option>
            <option>Past month</option>
            <option>Past 3 months</option>
            <option>Past year</option>
          </select>
          <Icon name="chevronRight" size={13} />
        </label>
        <label className="vault-select">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option>Newest first</option>
            <option>Oldest first</option>
            <option>Name A–Z</option>
          </select>
          <Icon name="chevronRight" size={13} />
        </label>
      </section>

      <section className="vault-overview">
        <div className="record-total">
          <strong>{records.length + 6} records</strong>
          <span>in your vault</span>
        </div>
        {categoryCounts.map(([label, count]) => (
          <button
            type="button"
            key={label}
            onClick={() =>
              setTypeFilter(
                label === 'Lab reports'
                  ? 'Lab report'
                  : label === 'Prescriptions'
                    ? 'Prescription'
                    : label === 'Doctor notes'
                      ? 'Doctor note'
                      : 'All',
              )
            }
          >
            <span>{label}</span>
            <strong>
              {label === 'Other'
                ? count + 1
                : count +
                  (label === 'Lab reports'
                    ? 3
                    : label === 'Prescriptions'
                      ? 2
                      : 1)}
            </strong>
          </button>
        ))}
      </section>

      <section className="vault-list-section">
        <div className="vault-list-heading">
          <div>
            <h2>Your records</h2>
            <p>{visibleRecords.length} shown · Updated today</p>
          </div>
          <span>
            <Icon name="lock" size={13} /> Only visible to you
          </span>
        </div>
        <div className="vault-table">
          <div className="vault-table-header">
            <span>Document</span>
            <span>Type</span>
            <span>Record date</span>
            <span>Added</span>
            <span />
          </div>
          {visibleRecords.length === 0 ? (
            <div className="vault-no-results">
              <Icon name="search" size={20} />
              <strong>No records found</strong>
              <span>Try changing your search or filters.</span>
              <button
                type="button"
                className="quiet-button"
                onClick={() => {
                  setQuery('');
                  setTypeFilter('All');
                  setDateFilter('Any date');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            visibleRecords.map((record) => (
              <div className="vault-row" key={record.id}>
                <div className="document-cell">
                  <span
                    className={`document-icon type-${record.type.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon name="note" size={18} />
                    <small>{record.format}</small>
                  </span>
                  <div>
                    <strong>{record.name}</strong>
                    {record.related && <span>{record.related}</span>}
                  </div>
                </div>
                <span className="record-type">{record.type}</span>
                <time>{record.date}</time>
                <time>{record.added}</time>
                <div className="record-actions">
                  <button
                    type="button"
                    className="view-record-button"
                    onClick={() => setSelectedRecord(record)}
                  >
                    View record
                  </button>
                  <button
                    type="button"
                    className="more-button"
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === record.id ? null : record.id,
                      )
                    }
                    aria-label={`More actions for ${record.name}`}
                  >
                    <Icon name="dots" size={18} />
                  </button>
                  {openMenu === record.id && (
                    <div className="record-menu">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(record);
                          setOpenMenu(null);
                        }}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(record);
                          setOpenMenu(null);
                        }}
                      >
                        Edit details
                      </button>
                      <button
                        type="button"
                        onClick={() => addRecordToTimeline(record)}
                      >
                        Add to timeline
                      </button>
                      <button type="button">
                        <Icon name="download" size={14} /> Download
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => {
                          setDeleteRecord(record);
                          setOpenMenu(null);
                        }}
                      >
                        <Icon name="trash" size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="vault-timeline-callout">
        <span>
          <Icon name="timeline" size={20} />
        </span>
        <div>
          <h2>Your records can become part of your health story.</h2>
          <p>
            Add important records to your Health Timeline so you can see them
            alongside check-ins, periods, symptoms, and consultations.
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onNavigate('Health Timeline')}
        >
          View Health Timeline <Icon name="arrow" size={15} />
        </button>
      </section>

      {showAdd && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setShowAdd(false)}
            aria-label="Close add record panel"
          />
          <aside
            className="date-panel add-record-panel"
            aria-label="Add health record"
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">HEALTH VAULT</div>
                <h2>Add health record</h2>
                <p>Save a document to your private archive.</p>
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
            <div className="add-record-body">
              <fieldset className="record-type-options">
                <legend>What are you adding?</legend>
                <div>
                  {vaultTypes.map((type) => (
                    <button
                      type="button"
                      className={newType === type ? 'selected' : ''}
                      onClick={() => setNewType(type)}
                      key={type}
                    >
                      <Icon
                        name={
                          type === 'Imaging'
                            ? 'insights'
                            : type === 'Prescription'
                              ? 'check'
                              : type === 'Vaccination'
                                ? 'vault'
                                : 'note'
                        }
                        size={16}
                      />
                      {type === 'Imaging'
                        ? 'Imaging / scan'
                        : type === 'Vaccination'
                          ? 'Vaccination record'
                          : type}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="upload-section">
                <span className="record-field-label">Upload document</span>
                <label
                  className={`upload-dropzone ${fileName ? 'has-file' : ''}`}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(event) =>
                      setFileName(event.target.files?.[0]?.name ?? '')
                    }
                  />
                  <span>
                    <Icon name={fileName ? 'check' : 'upload'} size={22} />
                  </span>
                  <strong>{fileName || 'Drop your file here'}</strong>
                  <p>
                    {fileName
                      ? 'Ready to add'
                      : 'or choose a file from your computer'}
                  </p>
                  {!fileName && <b>Choose file</b>}
                  <small>PDF, JPG, or PNG</small>
                </label>
              </div>
              <div className="record-metadata">
                <label>
                  <span>Document name</span>
                  <input
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    placeholder="e.g. Complete Blood Count"
                  />
                </label>
                <div>
                  <label>
                    <span>Date</span>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(event) => setNewDate(event.target.value)}
                    />
                  </label>
                  <label>
                    <span>Category</span>
                    <select
                      value={newType}
                      onChange={(event) =>
                        setNewType(event.target.value as VaultRecordType)
                      }
                    >
                      {vaultTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  <span>
                    Related consultation <small>Optional</small>
                  </span>
                  <select
                    value={newConsultation}
                    onChange={(event) => setNewConsultation(event.target.value)}
                  >
                    <option value="">None</option>
                    <option>General consultation · Oct 1, 2026</option>
                    <option>Women’s wellness visit · Aug 26, 2026</option>
                  </select>
                </label>
                <label>
                  <span>
                    Notes <small>Optional</small>
                  </span>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(event) => setNewNotes(event.target.value)}
                    placeholder="Anything useful to remember..."
                  />
                </label>
              </div>
            </div>
            <div className="panel-footer add-record-footer">
              <span>
                <Icon name="lock" size={13} /> Private to you
              </span>
              <button
                type="button"
                className="primary-button"
                onClick={saveRecord}
              >
                Save record
              </button>
            </div>
          </aside>
        </>
      )}

      {selectedRecord && (
        <>
          <button
            type="button"
            className="panel-scrim"
            onClick={() => setSelectedRecord(null)}
            aria-label="Close record details"
          />
          <aside
            className="date-panel record-detail-panel"
            aria-label={`${selectedRecord.name} details`}
          >
            <div className="panel-header">
              <div>
                <div className="section-kicker">
                  {selectedRecord.type.toUpperCase()}
                </div>
                <h2>{selectedRecord.name}</h2>
                <p>{selectedRecord.date}</p>
              </div>
              <button
                type="button"
                className="panel-close"
                onClick={() => setSelectedRecord(null)}
                aria-label="Close"
              >
                <Icon name="close" size={19} />
              </button>
            </div>
            <div className="record-detail-body">
              <div className="document-preview">
                <div className="preview-page">
                  <div className="preview-brand">
                    <span />
                    <span />
                  </div>
                  <i className="preview-title" />
                  <i />
                  <i />
                  <i />
                  <i className="short" />
                  <div className="preview-box">
                    <i />
                    <i />
                    <i />
                  </div>
                  <small>{selectedRecord.format} document preview</small>
                </div>
                <span>{selectedRecord.format} · Document preview</span>
              </div>
              <dl className="record-details-list">
                <div>
                  <dt>Document name</dt>
                  <dd>{selectedRecord.name}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{selectedRecord.type}</dd>
                </div>
                <div>
                  <dt>Record date</dt>
                  <dd>{selectedRecord.date}</dd>
                </div>
                <div>
                  <dt>Added</dt>
                  <dd>{selectedRecord.added}</dd>
                </div>
                <div>
                  <dt>Related consultation</dt>
                  <dd>{selectedRecord.related || 'None'}</dd>
                </div>
              </dl>
              {selectedRecord.notes && (
                <div className="record-notes">
                  <span>NOTES</span>
                  <p>{selectedRecord.notes}</p>
                </div>
              )}
              <button type="button" className="open-document-button">
                <Icon name="note" size={16} /> Open document{' '}
                <Icon name="arrow" size={15} />
              </button>
              <div className="record-secondary-actions">
                <button type="button">Edit details</button>
                <button
                  type="button"
                  onClick={() => addRecordToTimeline(selectedRecord)}
                >
                  Add to timeline
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => setDeleteRecord(selectedRecord)}
                >
                  Delete
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {deleteRecord && (
        <>
          <button
            type="button"
            className="modal-scrim delete-scrim"
            onClick={() => setDeleteRecord(null)}
            aria-label="Cancel delete"
          />
          <section
            className="delete-modal"
            role="alertdialog"
            aria-modal="true"
          >
            <span>
              <Icon name="trash" size={21} />
            </span>
            <h2>Delete this record?</h2>
            <p>
              <strong>{deleteRecord.name}</strong> will be permanently removed
              from your Health Vault. This can’t be undone.
            </p>
            <div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDeleteRecord(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm"
                onClick={() => {
                  setRecords((current) =>
                    current.filter((record) => record.id !== deleteRecord.id),
                  );
                  if (selectedRecord?.id === deleteRecord.id)
                    setSelectedRecord(null);
                  setDeleteRecord(null);
                }}
              >
                Delete record
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function VaultEmptyState({
  onAdd,
  onNavigate,
}: {
  onAdd: () => void;
  onNavigate: (page: string) => void;
}) {
  return (
    <section className="vault-empty">
      <div className="vault-empty-art">
        <div>
          <Icon name="lock" size={21} />
        </div>
        <span />
        <span />
      </div>
      <div className="eyebrow">YOUR PRIVATE HEALTH ARCHIVE</div>
      <h1>Your health records, all in one place</h1>
      <p>
        Upload reports, prescriptions, doctor notes, and other important health
        documents so you can easily find them when you need them.
      </p>
      <div>
        <button type="button" className="primary-button" onClick={onAdd}>
          <Icon name="plus" size={16} /> Add your first record
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
