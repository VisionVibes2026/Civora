import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-row">
            <HelpCircle size={18} className="header-icon" />
            <h2 className="modal-title">Help & Frequently Asked Questions</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="faq-item">
            <h3 className="faq-q">What is Civora?</h3>
            <p className="faq-a">Civora is a multilingual AI-powered cooperative assistance platform providing simple, verified, and actionable guidance on cooperative laws, schemes, services, and formal grievance drafting.</p>
          </div>

          <div className="faq-item">
            <h3 className="faq-q">How does Civora verify legal information?</h3>
            <p className="faq-a">Every answer contains a "Why this answer?" Evidence Panel showing the exact State Act, Section Number, Policy Version, and Effective Date retrieved from government gazettes.</p>
          </div>

          <div className="faq-item">
            <h3 className="faq-q">Can Civora submit my grievance directly to the government?</h3>
            <p className="faq-a">Civora assists in drafting formal representations formatted for statutory compliance under Section 90. Submit your generated draft to your designated Registrar of Cooperative Societies (RCS) or state grievance portal.</p>
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
        .modal-body { display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; }
        .faq-item { background-color: #2F2F2F; border: 1px solid #3A3A3A; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 6px; }
        .faq-q { font-size: 0.9rem; font-weight: 600; color: #F5F5F5; }
        .faq-a { font-size: 0.85rem; color: #A7A7A7; line-height: 1.5; }
      `}</style>
    </div>
  );
};
