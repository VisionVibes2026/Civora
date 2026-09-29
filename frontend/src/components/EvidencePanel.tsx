import React from 'react';
import type { SourceCitation, Jurisdiction, Language } from '../types';
import { LANGUAGES } from '../constants/languages';
import { 
  ShieldCheck, 
  MapPin, 
  Building2, 
  FileText, 
  Tag, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  FileSearch,
  UserCheck,
  X
} from 'lucide-react';

interface EvidencePanelProps {
  jurisdiction?: Jurisdiction;
  source?: SourceCitation;
  isLowConfidence?: boolean;
  currentLanguage: Language;
  onClose?: () => void;
  onReviewSource?: () => void;
  onRequestHumanReview?: () => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  jurisdiction,
  source,
  isLowConfidence,
  currentLanguage,
  onClose,
  onReviewSource,
  onRequestHumanReview,
}) => {
  const t = LANGUAGES[currentLanguage].evidencePanel;
  const ts = LANGUAGES[currentLanguage].trustSafety;

  if (isLowConfidence) {
    return (
      <aside className="civora-evidence-panel low-confidence-mode">
        <div className="panel-header">
          <div className="panel-title-group">
            <AlertTriangle size={18} className="warning-icon" />
            <h3 className="panel-title">Verification Warning</h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="panel-close-btn" aria-label="Close panel">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="panel-body">
          <div className="low-confidence-box">
            <p className="low-confidence-text">{ts.lowConfidenceWarning}</p>
          </div>

          <div className="evidence-actions">
            <button 
              onClick={onReviewSource} 
              className="evidence-btn secondary-btn"
            >
              <FileSearch size={15} />
              <span>{ts.reviewSource}</span>
            </button>

            <button 
              onClick={onRequestHumanReview} 
              className="evidence-btn primary-btn"
            >
              <UserCheck size={15} />
              <span>{ts.requestHumanReview}</span>
            </button>
          </div>
        </div>

        <style>{`
          .civora-evidence-panel.low-confidence-mode {
            background-color: var(--surface);
            border-left: 1px solid var(--border);
            width: 320px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .warning-icon { color: var(--warning); }
          .low-confidence-box {
            background-color: var(--warning-bg);
            border: 1px solid #FDE68A;
            border-radius: var(--radius-md);
            padding: 14px;
            color: #92400E;
            font-size: 0.88rem;
            line-height: 1.5;
          }
          .evidence-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 12px;
          }
          .evidence-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px;
            border-radius: var(--radius-md);
            font-size: 0.85rem;
            font-weight: 600;
            transition: all var(--transition-fast);
          }
          .secondary-btn {
            border: 1px solid var(--border);
            color: var(--text);
            background: var(--bg);
          }
          .secondary-btn:hover { background: #E2E8F0; }
          .primary-btn {
            background-color: var(--primary);
            color: #ffffff;
          }
          .primary-btn:hover { background-color: var(--primary-hover); }
        `}</style>
      </aside>
    );
  }

  return (
    <aside className="civora-evidence-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <ShieldCheck size={18} className="shield-icon" />
          <h3 className="panel-title">{t.title}</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="panel-close-btn" aria-label="Close panel">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="panel-body">
        {/* Verification Status Badge */}
        <div className="verified-badge-card">
          <CheckCircle2 size={16} className="badge-icon" />
          <span className="badge-text">{source?.trustBadge || t.verifiedBadge}</span>
          {source?.confidence && (
            <span className="confidence-pill">
              {Math.round(source.confidence * 100)}% Match
            </span>
          )}
        </div>

        {/* Verification Attributes */}
        <div className="evidence-section">
          <div className="evidence-row">
            <MapPin size={15} className="row-icon" />
            <div className="row-content">
              <span className="row-label">{t.jurisdiction}</span>
              <span className="row-value">{jurisdiction?.state || 'Tamil Nadu / India'}</span>
            </div>
          </div>

          <div className="evidence-row">
            <Building2 size={15} className="row-icon" />
            <div className="row-content">
              <span className="row-label">{t.cooperativeType}</span>
              <span className="row-value">{jurisdiction?.cooperativeType || 'PACS / Credit Society'}</span>
            </div>
          </div>

          <div className="evidence-row">
            <ShieldCheck size={15} className="row-icon" />
            <div className="row-content">
              <span className="row-label">{t.authority}</span>
              <span className="row-value">{jurisdiction?.authority || 'Registrar of Cooperative Societies'}</span>
            </div>
          </div>

          <div className="evidence-row">
            <FileText size={15} className="row-icon" />
            <div className="row-content">
              <span className="row-label">{t.source}</span>
              <span className="row-value highlight-value">{source?.actOrScheme || 'Cooperative Societies Act'}</span>
            </div>
          </div>

          <div className="evidence-row">
            <Tag size={15} className="row-icon" />
            <div className="row-content">
              <span className="row-label">{t.section}</span>
              <span className="row-value">{source?.section || 'Section 21'}</span>
            </div>
          </div>

          <div className="evidence-row">
            <Tag size={15} className="row-icon" />
            <div className="row-content">
              <span className="row-label">{t.version}</span>
              <span className="row-value">{source?.version || 'v2025.1'}</span>
            </div>
          </div>

          <div className="evidence-row">
            <Calendar size={15} className="row-icon" />
            <div className="row-content">
              <span className="row-label">{t.effectiveDate}</span>
              <span className="row-value">{source?.effectiveDate || '01-Apr-2024'}</span>
            </div>
          </div>
        </div>

        {/* Verification Footer Note */}
        <div className="panel-footer-note">
          <span>Grounded Legal Knowledge Base • Advisory AI Reference</span>
        </div>
      </div>

      <style>{`
        .civora-evidence-panel {
          width: 310px;
          background-color: var(--surface);
          border-left: 1px solid var(--border);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          user-select: none;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .panel-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .shield-icon {
          color: var(--secondary);
        }

        .panel-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary);
        }

        .panel-close-btn {
          color: var(--muted);
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .panel-close-btn:hover {
          background-color: var(--bg);
          color: var(--text);
        }

        .verified-badge-card {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--success-bg);
          border: 1px solid #BBF7D0;
          padding: 10px 12px;
          border-radius: var(--radius-md);
        }

        .badge-icon {
          color: var(--success);
          flex-shrink: 0;
        }

        .badge-text {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--success);
          flex: 1;
        }

        .confidence-pill {
          background-color: #DCFCE7;
          color: var(--success);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-full);
        }

        .evidence-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .evidence-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .row-icon {
          color: var(--muted);
          margin-top: 3px;
          flex-shrink: 0;
        }

        .row-content {
          display: flex;
          flex-direction: column;
        }

        .row-label {
          font-size: 0.72rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          font-weight: 600;
        }

        .row-value {
          font-size: 0.85rem;
          color: var(--text);
          font-weight: 500;
        }

        .highlight-value {
          color: var(--primary);
          font-weight: 600;
        }

        .panel-footer-note {
          font-size: 0.72rem;
          color: var(--muted);
          text-align: center;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
          font-style: italic;
        }

        @media (max-width: 900px) {
          .civora-evidence-panel {
            width: 100%;
            border-left: none;
            border-top: 1px solid var(--border);
          }
        }
      `}</style>
    </aside>
  );
};
