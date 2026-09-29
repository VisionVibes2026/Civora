import React, { useState, useRef } from 'react';
import type { Language } from '../types';
import { LANGUAGES } from '../constants/languages';
import { 
  Plus,
  Paperclip, 
  Mic, 
  ArrowUp,
  Leaf, 
  Scale, 
  FileText, 
  Edit3,
  ShieldCheck
} from 'lucide-react';

interface HomeScreenProps {
  currentLanguage: Language;
  onSendMessage: (query: string, attachedFile?: File) => void;
  onOpenVoiceModal: () => void;
  onQuickAction: (actionType: 'scheme' | 'laws' | 'docs' | 'grievance') => void;
  onLanguageChange: (lang: Language) => void;
  externalInputText?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLanguage,
  onSendMessage,
  onOpenVoiceModal,
  onQuickAction,
  onLanguageChange,
  externalInputText,
}) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (externalInputText) {
      setInputText(externalInputText);
    }
  }, [externalInputText]);

  // Dynamically expand textarea height based on content
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(28, scrollH), 200)}px`;
    }
  }, [inputText]);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputText.trim() || attachedFile) {
      onSendMessage(inputText.trim(), attachedFile || undefined);
      setInputText('');
      setAttachedFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onSendMessage(inputText.trim(), file);
      setInputText('');
      setAttachedFile(null);
    }
  };

  const suggestions = [
    {
      title: 'Explain a scheme',
      description: 'Eligibility, benefits and process',
      icon: Leaf,
      action: () => onQuickAction('scheme')
    },
    {
      title: 'Ask about cooperative laws',
      description: 'Simple explanations with sources',
      icon: Scale,
      action: () => onQuickAction('laws')
    },
    {
      title: 'Check required documents',
      description: 'Find documents for services',
      icon: FileText,
      action: () => onQuickAction('docs')
    },
    {
      title: 'Prepare a grievance',
      description: 'Create a clear grievance draft',
      icon: Edit3,
      action: () => onQuickAction('grievance')
    }
  ];

  return (
    <div className="civora-home-container">
      <div className="home-center-wrapper">
        {/* Centered Hero Section */}
        <div className="home-hero">
          <img src="/logo.png" alt="Civora Logo" className="hero-logo" />
          <h1 className="hero-headline">How can I help you today?</h1>
          <p className="hero-subheadline">Ask about cooperative laws, schemes, services or grievances.</p>
        </div>

        {/* 4 Suggestion Cards in 2x2 Grid */}
        <div className="suggestions-grid">
          {suggestions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="suggestion-card"
              >
                <div className="card-text-col">
                  <span className="card-title">{item.title}</span>
                  <span className="card-desc">{item.description}</span>
                </div>
                <div className="card-icon-wrapper">
                  <Icon size={18} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Language selector chips bar */}
        <div className="language-pills-row">
          <span className="lang-row-label">Language:</span>
          {(Object.keys(LANGUAGES) as Language[]).map((langKey) => (
            <button
              key={langKey}
              onClick={() => onLanguageChange(langKey)}
              className={`lang-pill ${currentLanguage === langKey ? 'active' : ''}`}
            >
              {LANGUAGES[langKey].nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed/Centered Bottom Chat Input Bar */}
      <div className="bottom-input-container">
        <div className="chat-input-box">
          {attachedFile && (
            <div className="attached-file-chip">
              <Paperclip size={13} />
              <span className="file-name">{attachedFile.name}</span>
              <button 
                onClick={() => setAttachedFile(null)} 
                className="remove-file-btn"
                title="Remove attachment"
              >
                ×
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Civora anything about cooperatives..."
            className="chat-textarea"
            rows={1}
          />

          <div className="input-controls">
            <div className="controls-left">
              <button
                type="button"
                onClick={() => onQuickAction('scheme')}
                className="control-icon-btn"
                title="More options"
              >
                <Plus size={18} />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="control-icon-btn"
                title="Upload document"
              >
                <Paperclip size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />

              <button
                type="button"
                onClick={() => {
                  setAttachedFile(null);
                  onOpenVoiceModal();
                }}
                className="control-icon-btn mic-btn"
                title="Voice input"
              >
                <Mic size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() && !attachedFile}
              className="send-circle-btn"
              title="Send message"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        <div className="input-disclaimer">
          <ShieldCheck size={13} className="shield-icon" />
          <span>Verified & PII Protected • Official Cooperative Knowledge Index</span>
        </div>
      </div>

      <style>{`
        .civora-home-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 24px 16px 16px 16px;
          height: calc(100vh - 56px);
          overflow-y: auto;
          background-color: #171717;
          position: relative;
        }

        .home-center-wrapper {
          width: 100%;
          max-width: 850px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: auto 0;
          gap: 28px;
        }

        .home-hero {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .hero-logo {
          height: 84px;
          width: auto;
          max-width: 260px;
          object-fit: contain;
          border-radius: 8px;
          margin-bottom: 12px;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }

        .hero-headline {
          font-size: 36px;
          font-weight: 600;
          color: #F5F5F5;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }

        .hero-subheadline {
          font-size: 1rem;
          color: #A7A7A7;
          max-width: 540px;
          line-height: 1.5;
        }

        .suggestions-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .suggestion-card {
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          box-shadow: none;
          transition: background-color 150ms ease, border-color 150ms ease;
        }

        .suggestion-card:hover {
          background-color: #2A2A2A;
          border-color: #4A4A4A;
        }

        .card-text-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: #F5F5F5;
        }

        .card-desc {
          font-size: 0.82rem;
          color: #737373;
        }

        .card-icon-wrapper {
          color: #A7A7A7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .language-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .lang-row-label {
          font-size: 0.78rem;
          color: #737373;
          font-weight: 500;
        }

        .lang-pill {
          font-size: 0.78rem;
          font-weight: 500;
          color: #A7A7A7;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          border: 1px solid #2F2F2F;
          background-color: #212121;
          transition: all 150ms ease;
        }

        .lang-pill:hover {
          color: #F5F5F5;
          border-color: #3A3A3A;
        }

        .lang-pill.active {
          background-color: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }

        .bottom-input-container {
          width: 100%;
          max-width: 850px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
        }

        .chat-input-box {
          width: 100%;
          background-color: #2F2F2F;
          border: 1px solid #444444;
          border-radius: 18px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 150ms ease;
        }

        .chat-input-box:focus-within {
          border-color: #666666;
        }

        .attached-file-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(255, 255, 255, 0.1);
          color: #F5F5F5;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          align-self: flex-start;
        }

        .remove-file-btn {
          color: #A7A7A7;
          font-weight: bold;
          padding: 0 2px;
        }

        .remove-file-btn:hover {
          color: #EF4444;
        }

        .chat-textarea {
          width: 100%;
          border: none;
          outline: none;
          resize: none;
          font-size: 0.96rem;
          color: #F5F5F5;
          background: transparent;
          line-height: 1.5;
          min-height: 28px;
          max-height: 200px;
          overflow-y: auto;
          transition: height 120ms ease;
        }

        .chat-textarea::placeholder {
          color: #8E8E93;
        }

        .input-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 4px;
          margin-top: auto;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .control-icon-btn {
          color: #A7A7A7;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 150ms ease, background-color 150ms ease;
        }

        .control-icon-btn:hover {
          color: #F5F5F5;
          background-color: rgba(255, 255, 255, 0.08);
        }

        .send-circle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #F5F5F5;
          color: #171717;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 150ms ease, transform 150ms ease;
        }

        .send-circle-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .send-circle-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .input-disclaimer {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.74rem;
          color: #737373;
          text-align: center;
        }

        .shield-icon {
          color: #22C55E;
        }

        @media (max-width: 640px) {
          .suggestions-grid {
            grid-template-columns: 1fr;
          }
          .hero-headline {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};
