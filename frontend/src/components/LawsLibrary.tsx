import React, { useState } from 'react';
import { LAWS_DATABASE } from '../constants/knowledgeData';
import type { Language, CooperativeLaw } from '../types';
import { Scale, Search, BookOpen, ArrowRight } from 'lucide-react';

interface LawsLibraryProps {
  currentLanguage: Language;
  onAskAboutLaw: (lawTitle: string, section?: string) => void;
}

export const LawsLibrary: React.FC<LawsLibraryProps> = ({
  onAskAboutLaw,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLaw, setSelectedLaw] = useState<CooperativeLaw>(LAWS_DATABASE[0]);

  const filteredLaws = LAWS_DATABASE.filter(law =>
    law.actTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    law.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    law.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="laws-container">
      <div className="laws-header">
        <div className="title-group">
          <Scale size={24} className="header-icon" />
          <div>
            <h1 className="header-title">Cooperative Laws, Acts & By-Laws</h1>
            <p className="header-sub">Search statutory provisions, voting rights, member qualifications and audit rules</p>
          </div>
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TN Cooperative Societies Act 1983, Multi-State Act, Section 21..."
            className="search-input"
          />
        </div>
      </div>

      <div className="laws-body-grid">
        {/* Left list */}
        <div className="laws-list-col">
          {filteredLaws.map(law => (
            <div
              key={law.id}
              onClick={() => setSelectedLaw(law)}
              className={`law-card ${selectedLaw.id === law.id ? 'active' : ''}`}
            >
              <div className="card-top">
                <span className="jurisdiction-chip">{law.jurisdiction}</span>
                <span className="date-chip">{law.effectiveDate}</span>
              </div>

              <h3 className="law-card-title">{law.actTitle}</h3>
              <p className="law-card-summary">{law.summary}</p>

              <div className="card-footer">
                <span className="section-count">{law.keySections.length} Key Sections Indexed</span>
                <ArrowRight size={14} className="card-arrow" />
              </div>
            </div>
          ))}
        </div>

        {/* Right detail view */}
        {selectedLaw && (
          <div className="law-detail-col">
            <div className="detail-card">
              <div className="detail-header">
                <span className="jurisdiction-chip large">{selectedLaw.jurisdiction}</span>
                <h2 className="detail-title">{selectedLaw.actTitle}</h2>
                <p className="detail-summary">{selectedLaw.summary}</p>
                <span className="effective-date">Enactment / Amendment Date: {selectedLaw.effectiveDate}</span>
              </div>

              <div className="sections-list-container">
                <h3 className="sections-header-title">Statutory Sections & Regulations:</h3>

                <div className="sections-grid">
                  {selectedLaw.keySections.map((sec, idx) => (
                    <div key={idx} className="section-card">
                      <div className="section-card-top">
                        <span className="section-num-badge">{sec.sectionNumber}</span>
                        <h4 className="section-title-text">{sec.title}</h4>
                      </div>

                      <p className="section-desc-text">{sec.description}</p>

                      <button
                        onClick={() => onAskAboutLaw(selectedLaw.actTitle, sec.sectionNumber)}
                        className="ask-section-btn"
                      >
                        <BookOpen size={13} />
                        <span>Explain {sec.sectionNumber}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-card-footer">
                <button
                  onClick={() => onAskAboutLaw(selectedLaw.actTitle)}
                  className="ask-law-btn"
                >
                  <span>Ask Civora Anything About This Act</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .laws-container {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background-color: #171717;
          align-items: center;
        }

        .laws-header {
          width: 100%;
          max-width: 1100px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .title-group { display: flex; align-items: center; gap: 16px; }
        .header-icon { color: #0F766E; }
        .header-title { font-size: 1.25rem; font-weight: 600; color: #F5F5F5; }
        .header-sub { font-size: 0.88rem; color: #A7A7A7; margin-top: 2px; }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon { position: absolute; left: 12px; color: #737373; }
        .search-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1px solid #3A3A3A;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #F5F5F5;
          background-color: #2F2F2F;
          outline: none;
        }

        .search-input:focus { border-color: #0F766E; }

        .laws-body-grid {
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 20px;
          align-items: start;
        }

        .laws-list-col { display: flex; flex-direction: column; gap: 12px; }

        .law-card {
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .law-card:hover { border-color: #555555; background-color: #2A2A2A; }
        .law-card.active { border-color: #0F766E; background-color: #262626; }

        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .jurisdiction-chip { background-color: rgba(15, 118, 110, 0.2); color: #0F766E; font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-full); }
        .jurisdiction-chip.large { font-size: 0.78rem; padding: 4px 10px; width: fit-content; }
        .date-chip { font-size: 0.72rem; color: #737373; }

        .law-card-title { font-size: 0.95rem; font-weight: 600; color: #F5F5F5; }
        .law-card-summary { font-size: 0.82rem; color: #737373; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 4px; }
        .section-count { font-size: 0.75rem; color: #737373; font-weight: 500; }
        .card-arrow { color: #737373; }

        .law-detail-col { position: sticky; top: 76px; }
        .detail-card {
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-header { display: flex; flex-direction: column; gap: 8px; }
        .detail-title { font-size: 1.2rem; font-weight: 600; color: #F5F5F5; }
        .detail-summary { font-size: 0.9rem; color: #A7A7A7; line-height: 1.5; }
        .effective-date { font-size: 0.78rem; color: #737373; font-style: italic; }

        .sections-list-container { display: flex; flex-direction: column; gap: 12px; }
        .sections-header-title { font-size: 0.88rem; font-weight: 600; color: #F5F5F5; }

        .sections-grid { display: flex; flex-direction: column; gap: 10px; }

        .section-card {
          background-color: #2F2F2F;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .section-card-top { display: flex; align-items: center; gap: 8px; }
        .section-num-badge { background-color: #0F766E; color: #ffffff; font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-sm); }
        .section-title-text { font-size: 0.88rem; font-weight: 600; color: #F5F5F5; }
        .section-desc-text { font-size: 0.84rem; color: #A7A7A7; line-height: 1.45; }

        .ask-section-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          align-self: flex-start;
          color: #0F766E;
          font-size: 0.78rem;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          transition: background-color 150ms ease;
        }

        .ask-section-btn:hover { background-color: rgba(15, 118, 110, 0.15); }

        .detail-card-footer { padding-top: 12px; border-top: 1px solid #2F2F2F; display: flex; justify-content: flex-end; }
        .ask-law-btn { display: flex; align-items: center; gap: 8px; background-color: #F5F5F5; color: #171717; padding: 9px 18px; border-radius: var(--radius-full); font-weight: 600; font-size: 0.88rem; transition: transform 150ms ease; }
        .ask-law-btn:hover { transform: scale(1.02); }

        @media (max-width: 900px) {
          .laws-body-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
