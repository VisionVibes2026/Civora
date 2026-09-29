import React, { useState } from 'react';
import type { Language, ViewMode } from '../types';
import { LANGUAGES } from '../constants/languages';
import { 
  Globe, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  User, 
  Check, 
  ChevronDown,
  Menu
} from 'lucide-react';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isKioskMode: boolean;
  onToggleKioskMode: () => void;
  activeView: ViewMode;
  currentTitle: string;
  onTitleChange: (newTitle: string) => void;
  onToggleSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isKioskMode,
  onToggleKioskMode,
  currentTitle,
  onTitleChange,
  onToggleSidebar,
  onOpenNotifications,
  onOpenSettings,
  unreadNotificationsCount,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(currentTitle);

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="civora-header">
      {/* Left side: Hamburger menu for sidebar toggle + Subtle Logo + Title */}
      <div className="header-left">
        <button 
          onClick={onToggleSidebar} 
          className="icon-btn sidebar-toggle-btn"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="header-brand" onClick={() => window.location.reload()} title="Civora - Ask. Verify. Act.">
          <img src="/logo.png" alt="Civora Logo" className="brand-logo" />
          <span className="brand-name">Civora</span>
        </div>
      </div>

      {/* Center: Conversation Title */}
      <div className="header-center">
        {!isKioskMode && (
          <div className="title-container">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="header-title-input"
              />
            ) : (
              <h1 
                className="header-title-text"
                onClick={() => setIsEditingTitle(true)}
                title="Click to rename conversation"
              >
                {currentTitle}
              </h1>
            )}
          </div>
        )}
      </div>

      {/* Right side: Trust Status, Kiosk Toggle, Language Selector, Notifications, Profile */}
      <div className="header-right">
        {/* Verified & PII Protected Status Badge */}
        <div className="trust-status-chip" title="Government-verified RAG engine with PII redaction">
          <ShieldCheck size={14} className="trust-icon" />
          <span className="trust-text">Verified & PII Protected</span>
        </div>

        {/* Kiosk Mode Toggle */}
        <button
          onClick={onToggleKioskMode}
          className={`kiosk-toggle-btn ${isKioskMode ? 'active' : ''}`}
          title="Toggle rural touch-friendly Kiosk Mode"
        >
          <Smartphone size={15} />
          <span>{isKioskMode ? 'Exit Kiosk' : 'Kiosk'}</span>
        </button>

        {/* Language Selector Dropdown */}
        <div className="lang-selector-wrapper">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="lang-selector-btn"
            aria-haspopup="true"
            aria-expanded={isLangMenuOpen}
          >
            <Globe size={15} />
            <span className="lang-code">{LANGUAGES[currentLanguage].nativeName}</span>
            <ChevronDown size={13} />
          </button>

          {isLangMenuOpen && (
            <div className="lang-dropdown-menu">
              {(Object.keys(LANGUAGES) as Language[]).map((langKey) => (
                <button
                  key={langKey}
                  onClick={() => {
                    onLanguageChange(langKey);
                    setIsLangMenuOpen(false);
                  }}
                  className={`lang-option-btn ${currentLanguage === langKey ? 'selected' : ''}`}
                >
                  <span className="lang-name-native">{LANGUAGES[langKey].nativeName}</span>
                  <span className="lang-name-en">({LANGUAGES[langKey].languageName})</span>
                  {currentLanguage === langKey && <Check size={14} className="check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="icon-btn notification-btn"
          title="Notifications & Policy Updates"
          aria-label="Notifications"
        >
          <Bell size={17} />
          {unreadNotificationsCount > 0 && (
            <span className="notification-badge">{unreadNotificationsCount}</span>
          )}
        </button>

        {/* User Profile Avatar */}
        <button 
          onClick={onOpenSettings}
          className="user-profile-btn" 
          title="User Profile & Settings"
        >
          <div className="avatar-circle">
            <User size={15} />
          </div>
        </button>
      </div>

      <style>{`
        .civora-header {
          height: 56px;
          background-color: #171717;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-toggle-btn {
          color: var(--secondary-text);
          padding: 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .sidebar-toggle-btn:hover {
          background-color: var(--surface-hover);
          color: var(--text);
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .brand-logo {
          height: 34px;
          width: auto;
          max-width: 120px;
          object-fit: contain;
          border-radius: 4px;
        }

        .brand-name {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text);
          letter-spacing: -0.01em;
        }

        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 450px;
          margin: 0 16px;
        }

        .title-container {
          width: 100%;
          text-align: center;
        }

        .header-title-text {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--secondary-text);
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .header-title-text:hover {
          background-color: var(--surface);
          color: var(--text);
        }

        .header-title-input {
          width: 100%;
          padding: 4px 8px;
          background-color: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          color: var(--text);
          outline: none;
          text-align: center;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trust-status-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #22C55E;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .trust-icon {
          color: #22C55E;
        }

        .kiosk-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--surface);
          border: 1px solid var(--border);
          color: var(--secondary-text);
          padding: 5px 10px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .kiosk-toggle-btn:hover {
          border-color: var(--primary);
          color: var(--text);
          background-color: var(--surface-hover);
        }

        .kiosk-toggle-btn.active {
          background-color: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }

        .lang-selector-wrapper {
          position: relative;
        }

        .lang-selector-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--surface);
          border: 1px solid var(--border);
          padding: 5px 10px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--secondary-text);
          transition: all var(--transition-fast);
        }

        .lang-selector-btn:hover {
          border-color: #555555;
          color: var(--text);
          background-color: var(--surface-hover);
        }

        .lang-dropdown-menu {
          position: absolute;
          right: 0;
          top: 115%;
          background-color: #212121;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 6px;
          min-width: 170px;
          z-index: 100;
        }

        .lang-option-btn {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--secondary-text);
          gap: 6px;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .lang-option-btn:hover {
          background-color: var(--surface-hover);
          color: var(--text);
        }

        .lang-option-btn.selected {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }

        .lang-name-native {
          font-weight: 600;
        }

        .lang-name-en {
          color: var(--muted);
          font-size: 0.78rem;
        }

        .check-icon {
          margin-left: auto;
          color: var(--primary);
        }

        .icon-btn {
          position: relative;
          padding: 6px;
          border-radius: var(--radius-md);
          color: var(--secondary-text);
          transition: all var(--transition-fast);
        }

        .icon-btn:hover {
          background-color: var(--surface-hover);
          color: var(--text);
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: var(--accent);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          height: 15px;
          width: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile-btn {
          padding: 2px;
        }

        .avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #2F2F2F;
          border: 1px solid var(--border);
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .avatar-circle:hover {
          transform: scale(1.05);
          border-color: var(--secondary-text);
        }

        @media (max-width: 900px) {
          .trust-status-chip {
            display: none;
          }
          .header-center {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
