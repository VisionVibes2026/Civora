import React from 'react';
import type { Language } from '../types';
import { LANGUAGES } from '../constants/languages';
import { 
  Mic, 
  Leaf, 
  Scale, 
  CreditCard, 
  FileText, 
  FileSearch, 
  X
} from 'lucide-react';

interface KioskUIProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onSelectAction: (action: 'voice' | 'schemes' | 'laws' | 'pacs' | 'grievance' | 'documents') => void;
  onExitKiosk: () => void;
}

export const KioskUI: React.FC<KioskUIProps> = ({
  currentLanguage,
  onLanguageChange,
  onSelectAction,
  onExitKiosk,
}) => {
  const t = LANGUAGES[currentLanguage].kiosk;

  return (
    <div className="kiosk-fullscreen-overlay">
      {/* Top Banner with Exit and Language Pills */}
      <div className="kiosk-top-bar">
        <div className="kiosk-brand">
          <img src="/logo.png" alt="Civora Logo" className="kiosk-logo" />
          <div>
            <h1 className="kiosk-brand-title">Civora Kiosk</h1>
            <span className="kiosk-brand-sub">Cooperative Assistance Service</span>
          </div>
        </div>

        {/* Language selector buttons */}
        <div className="kiosk-lang-row">
          {(Object.keys(LANGUAGES) as Language[]).map(langKey => (
            <button
              key={langKey}
              onClick={() => onLanguageChange(langKey)}
              className={`kiosk-lang-btn ${currentLanguage === langKey ? 'active' : ''}`}
            >
              {LANGUAGES[langKey].nativeName}
            </button>
          ))}
        </div>

        <button onClick={onExitKiosk} className="kiosk-exit-btn" title="Exit Kiosk Mode">
          <X size={24} />
          <span>Exit Kiosk</span>
        </button>
      </div>

      {/* Main Touch Content Area */}
      <div className="kiosk-main-content">
        <div className="kiosk-hero">
          <h2 className="kiosk-welcome-text">{t.welcome}</h2>
          <p className="kiosk-subwelcome-text">{t.subWelcome}</p>
        </div>

        {/* Large Prominent Voice Touch Target */}
        <div className="kiosk-voice-hero-card" onClick={() => onSelectAction('voice')}>
          <div className="kiosk-mic-bubble">
            <Mic size={54} className="kiosk-mic-icon" />
          </div>
          <div className="kiosk-voice-text-group">
            <h3 className="kiosk-voice-title">{t.talkToCivora}</h3>
            <p className="kiosk-voice-desc">{t.micPrompt}</p>
          </div>
        </div>

        {/* 5 Grid Large Action Buttons */}
        <div className="kiosk-grid">
          <button onClick={() => onSelectAction('schemes')} className="kiosk-tile scheme-tile">
            <Leaf size={42} className="tile-icon" />
            <span className="tile-label">{t.schemesButton}</span>
          </button>

          <button onClick={() => onSelectAction('laws')} className="kiosk-tile laws-tile">
            <Scale size={42} className="tile-icon" />
            <span className="tile-label">{t.lawsButton}</span>
          </button>

          <button onClick={() => onSelectAction('pacs')} className="kiosk-tile pacs-tile">
            <CreditCard size={42} className="tile-icon" />
            <span className="tile-label">{t.pacsServicesButton}</span>
          </button>

          <button onClick={() => onSelectAction('grievance')} className="kiosk-tile grievance-tile">
            <FileText size={42} className="tile-icon" />
            <span className="tile-label">{t.grievanceButton}</span>
          </button>

          <button onClick={() => onSelectAction('documents')} className="kiosk-tile doc-tile">
            <FileSearch size={42} className="tile-icon" />
            <span className="tile-label">{t.docHelpButton}</span>
          </button>
        </div>
      </div>

      <style>{`
        .kiosk-fullscreen-overlay {
          position: fixed;
          inset: 0;
          background-color: #0F172A;
          color: #ffffff;
          z-index: 500;
          display: flex;
          flex-direction: column;
          padding: 24px;
          overflow-y: auto;
          user-select: none;
        }

        .kiosk-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #1E293B;
          border-radius: 20px;
          padding: 16px 24px;
          margin-bottom: 24px;
        }

        .kiosk-brand { display: flex; align-items: center; gap: 16px; }
        .kiosk-logo { height: 64px; width: auto; max-width: 220px; object-fit: contain; }
        .kiosk-brand-title { font-size: 1.5rem; font-weight: 800; color: #ffffff; }
        .kiosk-brand-sub { font-size: 0.88rem; color: #94A3B8; }

        .kiosk-lang-row { display: flex; gap: 8px; }
        .kiosk-lang-btn {
          background-color: #334155;
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 12px;
          transition: all var(--transition-fast);
        }

        .kiosk-lang-btn.active {
          background-color: var(--accent);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(249, 115, 22, 0.5);
        }

        .kiosk-exit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #DC2626;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 12px;
        }

        .kiosk-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }

        .kiosk-hero { text-align: center; }
        .kiosk-welcome-text { font-size: 2.2rem; font-weight: 800; color: #ffffff; }
        .kiosk-subwelcome-text { font-size: 1.15rem; color: #94A3B8; margin-top: 4px; }

        .kiosk-voice-hero-card {
          width: 100%;
          background: linear-gradient(135deg, #123B63 0%, #0F766E 100%);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          transition: transform var(--transition-fast);
        }

        .kiosk-voice-hero-card:hover { transform: scale(1.02); }

        .kiosk-mic-bubble {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background-color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 24px rgba(249, 115, 22, 0.6);
        }

        .kiosk-mic-icon { color: #ffffff; }

        .kiosk-voice-title { font-size: 1.8rem; font-weight: 800; color: #ffffff; }
        .kiosk-voice-desc { font-size: 1.1rem; color: #E2E8F0; margin-top: 4px; }

        .kiosk-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
        }

        .kiosk-tile {
          background-color: #1E293B;
          border: 2px solid #334155;
          border-radius: 20px;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 160px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .kiosk-tile:hover {
          border-color: var(--secondary);
          transform: translateY(-3px);
          background-color: #334155;
        }

        .scheme-tile .tile-icon { color: #2DD4BF; }
        .laws-tile .tile-icon { color: #60A5FA; }
        .pacs-tile .tile-icon { color: #FBBF24; }
        .grievance-tile .tile-icon { color: #FB923C; }
        .doc-tile .tile-icon { color: #4ADE80; }

        .tile-label {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
        }

        @media (max-width: 800px) {
          .kiosk-grid { grid-template-columns: repeat(2, 1fr); }
          .kiosk-top-bar { flex-direction: column; gap: 12px; }
        }
      `}</style>
    </div>
  );
};
