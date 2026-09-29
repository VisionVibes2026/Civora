import React, { useState } from 'react';
import { SCHEMES_DATABASE } from '../constants/knowledgeData';
import type { Language, CooperativeScheme } from '../types';
import { Leaf, Search, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface SchemesDirectoryProps {
  currentLanguage: Language;
  onAskAboutScheme: (schemeTitle: string) => void;
}

export const SchemesDirectory: React.FC<SchemesDirectoryProps> = ({
  onAskAboutScheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedScheme, setSelectedScheme] = useState<CooperativeScheme | null>(SCHEMES_DATABASE[0]);

  const sectors = ['All', 'Credit', 'Agriculture', 'Dairy', 'Multi-purpose'];

  const filteredSchemes = SCHEMES_DATABASE.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'All' || scheme.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="schemes-container">
      <div className="schemes-header">
        <div className="title-group">
          <Leaf size={24} className="header-icon" />
          <div>
            <h1 className="header-title">Cooperative Schemes & Subsidy Programs</h1>
            <p className="header-sub">Verified directory of centrally sponsored and state cooperative schemes</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="search-filter-row">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PACS computerization, crop loan subvention, AIF..."
              className="search-input"
            />
          </div>

          <div className="sector-pills">
            {sectors.map(sector => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`sector-chip ${selectedSector === sector ? 'active' : ''}`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Directory & Detail View */}
      <div className="schemes-body-grid">
        {/* Left List Column */}
        <div className="schemes-list-col">
          {filteredSchemes.map(scheme => (
            <div
              key={scheme.id}
              onClick={() => setSelectedScheme(scheme)}
              className={`scheme-card ${selectedScheme?.id === scheme.id ? 'active' : ''}`}
            >
              <div className="card-top">
                <span className="sector-badge">{scheme.sector}</span>
                <span className="state-badge">{scheme.state}</span>
              </div>

              <h3 className="scheme-card-title">{scheme.title}</h3>
              <p className="scheme-card-desc">{scheme.shortDescription}</p>

              <div className="card-footer">
                <span className="source-tag">{scheme.officialSource}</span>
                <ArrowRight size={14} className="card-arrow" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail Column */}
        {selectedScheme && (
          <div className="scheme-detail-col">
            <div className="detail-card">
              <div className="detail-header">
                <div>
                  <div className="badges-row">
                    <span className="sector-badge large">{selectedScheme.sector}</span>
                    <span className="state-badge large">{selectedScheme.state}</span>
                  </div>
                  <h2 className="detail-title">{selectedScheme.title}</h2>
                  <span className="detail-version">Official Source: {selectedScheme.officialSource} ({selectedScheme.version})</span>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Key Scheme Benefits:</h3>
                <ul className="detail-bullet-list">
                  {selectedScheme.benefits.map((benefit, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={15} className="check-icon" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Eligible Entities & Beneficiaries:</h3>
                <div className="tags-flex">
                  {selectedScheme.eligibleEntities.map((entity, idx) => (
                    <span key={idx} className="entity-chip">{entity}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Mandatory Required Documents:</h3>
                <ul className="doc-checklist">
                  {selectedScheme.requiredDocuments.map((doc, idx) => (
                    <li key={idx}>
                      <FileText size={15} className="doc-icon" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-footer-action">
                <button
                  onClick={() => onAskAboutScheme(`Tell me about eligibility criteria and application process for ${selectedScheme.title}`)}
                  className="ask-scheme-btn"
                >
                  <span>Ask Civora About This Scheme</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .schemes-container {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background-color: #171717;
          align-items: center;
        }

        .schemes-header {
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
        .header-icon { color: #22C55E; }
        .header-title { font-size: 1.25rem; font-weight: 600; color: #F5F5F5; }
        .header-sub { font-size: 0.88rem; color: #A7A7A7; margin-top: 2px; }

        .search-filter-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          flex: 1;
          min-width: 280px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #737373;
        }

        .search-input {
          width: 100%;
          padding: 9px 12px 9px 36px;
          border: 1px solid #3A3A3A;
          border-radius: 10px;
          font-size: 0.88rem;
          color: #F5F5F5;
          background-color: #2F2F2F;
          outline: none;
        }

        .search-input:focus { border-color: #0F766E; }

        .sector-pills { display: flex; gap: 6px; }
        .sector-chip {
          padding: 5px 14px;
          border-radius: var(--radius-full);
          border: 1px solid #3A3A3A;
          background-color: #2F2F2F;
          font-size: 0.8rem;
          font-weight: 500;
          color: #A7A7A7;
          transition: all 150ms ease;
        }

        .sector-chip.active {
          background-color: #0F766E;
          color: #ffffff;
          border-color: #0F766E;
        }

        .schemes-body-grid {
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 20px;
          align-items: start;
        }

        .schemes-list-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .scheme-card {
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

        .scheme-card:hover { border-color: #555555; background-color: #2A2A2A; }
        .scheme-card.active { border-color: #0F766E; background-color: #262626; }

        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .sector-badge {
          background-color: rgba(34, 197, 94, 0.15);
          color: #22C55E;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .state-badge {
          background-color: #2F2F2F;
          color: #A7A7A7;
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .scheme-card-title { font-size: 0.95rem; font-weight: 600; color: #F5F5F5; line-height: 1.4; }
        .scheme-card-desc { font-size: 0.82rem; color: #737373; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 6px; }
        .source-tag { font-size: 0.75rem; color: #737373; font-style: italic; }
        .card-arrow { color: #737373; }

        .scheme-detail-col { position: sticky; top: 76px; }

        .detail-card {
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-title { font-size: 1.2rem; font-weight: 600; color: #F5F5F5; line-height: 1.35; margin-top: 6px; }
        .detail-version { font-size: 0.78rem; color: #737373; }

        .detail-section { display: flex; flex-direction: column; gap: 8px; }
        .section-title { font-size: 0.88rem; font-weight: 600; color: #F5F5F5; }

        .detail-bullet-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .detail-bullet-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.88rem; color: #A7A7A7; }
        .check-icon { color: #22C55E; flex-shrink: 0; margin-top: 2px; }

        .tags-flex { display: flex; flex-wrap: wrap; gap: 6px; }
        .entity-chip { background-color: #2F2F2F; border: 1px solid #3A3A3A; padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 500; color: #F5F5F5; }

        .doc-checklist { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .doc-checklist li { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #A7A7A7; }
        .doc-icon { color: #0F766E; flex-shrink: 0; }

        .detail-footer-action { padding-top: 12px; border-top: 1px solid #2F2F2F; display: flex; justify-content: flex-end; }
        .ask-scheme-btn { display: flex; align-items: center; gap: 8px; background-color: #F5F5F5; color: #171717; padding: 9px 18px; border-radius: var(--radius-full); font-weight: 600; font-size: 0.88rem; transition: transform 150ms ease; }
        .ask-scheme-btn:hover { transform: scale(1.02); }

        @media (max-width: 900px) {
          .schemes-body-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
