import React from 'react';
import { X, Settings } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLowConfidenceDemo: boolean;
  onToggleLowConfidenceDemo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isLowConfidenceDemo,
  onToggleLowConfidenceDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-row">
            <Settings size={18} className="header-icon" />
            <h2 className="modal-title">Civora Platform Settings</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="setting-group">
            <h3 className="setting-group-title">Trust & Safety Architecture</h3>

            <div className="setting-row">
              <div>
                <span className="setting-name">PII Protection & Redaction</span>
                <p className="setting-desc">Automatically redacts Aadhaar, Phone Numbers, and Land Patta details from output logs.</p>
              </div>
              <input type="checkbox" checked readOnly className="toggle-checkbox" />
            </div>

            <div className="setting-row">
              <div>
                <span className="setting-name">Simulate Low-Confidence AI Fallback</span>
                <p className="setting-desc">Toggle low-confidence state to test human review and document verification prompts.</p>
              </div>
              <button 
                onClick={onToggleLowConfidenceDemo}
                className={`switch-btn ${isLowConfidenceDemo ? 'active' : ''}`}
              >
                {isLowConfidenceDemo ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          <div className="setting-group">
            <h3 className="setting-group-title">Voice & Language Settings</h3>

            <div className="setting-row">
              <div>
                <span className="setting-name">Speech Synthesis Speed</span>
                <p className="setting-desc">Adjust speech pace for rural public announcements.</p>
              </div>
              <select defaultValue="1.0" className="setting-select">
                <option value="0.8">0.8x (Slower)</option>
                <option value="1.0">1.0x (Standard)</option>
                <option value="1.2">1.2x (Faster)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 200; padding: 16px;
        }
        .modal-card {
          width: 100%; max-width: 520px; background-color: #212121; border: 1px solid #3A3A3A; border-radius: 16px;
          padding: 24px; display: flex; flex-direction: column; gap: 20px; box-shadow: 0 16px 32px rgba(0, 0, 0, 0.6);
        }
        .modal-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #2F2F2F; padding-bottom: 12px; }
        .title-row { display: flex; align-items: center; gap: 8px; }
        .header-icon { color: #0F766E; }
        .modal-title { font-size: 1.1rem; font-weight: 600; color: #F5F5F5; }
        .modal-close-btn { color: #737373; padding: 4px; }
        .modal-body { display: flex; flex-direction: column; gap: 20px; }
        .setting-group { display: flex; flex-direction: column; gap: 12px; }
        .setting-group-title { font-size: 0.8rem; font-weight: 600; color: #0F766E; text-transform: uppercase; letter-spacing: 0.03em; }
        .setting-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px; background-color: #2F2F2F; border-radius: 10px; border: 1px solid #3A3A3A; }
        .setting-name { font-size: 0.88rem; font-weight: 500; color: #F5F5F5; }
        .setting-desc { font-size: 0.78rem; color: #737373; margin-top: 2px; }
        .toggle-checkbox { width: 18px; height: 18px; accent-color: #22C55E; }
        .switch-btn { padding: 6px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; border: 1px solid #3A3A3A; background-color: #212121; color: #F5F5F5; }
        .switch-btn.active { background-color: rgba(245, 158, 11, 0.2); color: #F59E0B; border-color: rgba(245, 158, 11, 0.4); }
        .setting-select { padding: 6px 10px; border-radius: 8px; border: 1px solid #3A3A3A; background-color: #212121; color: #F5F5F5; font-size: 0.85rem; }
      `}</style>
    </div>
  );
};
