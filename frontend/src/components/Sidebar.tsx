import React from 'react';
import type { ViewMode, Language, ChatSession } from '../types';
import { LANGUAGES } from '../constants/languages';
import { 
  Plus, 
  MessageSquare, 
  Leaf, 
  Scale, 
  FileText, 
  File, 
  HelpCircle, 
  Settings, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Smartphone
} from 'lucide-react';

interface SidebarProps {
  activeView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  chatSessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  currentLanguage: Language;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  isKioskMode: boolean;
  onToggleKioskMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  chatSessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  currentLanguage,
  onOpenHelp,
  onOpenSettings,
  isKioskMode,
  onToggleKioskMode
}) => {
  const t = LANGUAGES[currentLanguage].nav;

  const navItems = [
    { id: 'chat' as ViewMode, label: t.chat, icon: MessageSquare },
    { id: 'schemes' as ViewMode, label: t.schemes, icon: Leaf },
    { id: 'laws' as ViewMode, label: t.laws, icon: Scale },
    { id: 'grievance' as ViewMode, label: t.grievance, icon: FileText },
    { id: 'documents' as ViewMode, label: t.documents, icon: File },
  ];

  return (
    <aside className={`civora-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Top Section: Civora Brand Header + New Chat Button */}
      <div className="sidebar-top-section">
        {!isCollapsed ? (
          <div className="sidebar-brand-header">
            <div className="brand-title-group">
              <img src="/logo.png" alt="Civora" className="sidebar-logo" />
              <div className="brand-text-col">
                <span className="brand-title">Civora</span>
                <span className="brand-tagline">Ask. Verify. Act.</span>
              </div>
            </div>

            <button
              onClick={onToggleCollapse}
              className="collapse-toggle-btn"
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        ) : (
          <div className="collapsed-top-row">
            <button
              onClick={onToggleCollapse}
              className="collapse-toggle-btn"
              title="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <button
          onClick={onNewChat}
          className="new-chat-btn"
          title="Start a new Civora conversation"
        >
          <Plus size={16} />
          {!isCollapsed && <span>{t.newChat}</span>}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={17} className="nav-icon" />
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Recent Chat History */}
      {!isCollapsed && (
        <div className="sidebar-history-section">
          <div className="history-header">
            <span>Recent Conversations</span>
          </div>
          <div className="history-list">
            {chatSessions.length === 0 ? (
              <div className="empty-history">No recent chats</div>
            ) : (
              chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onSelectView('chat');
                  }}
                  className={`history-item ${activeSessionId === session.id && activeView === 'chat' ? 'active' : ''}`}
                >
                  <MessageSquare size={14} className="history-icon" />
                  <span className="history-title">{session.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="delete-history-btn"
                    title="Delete conversation"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Bottom Actions: Help & FAQ, Settings, Kiosk */}
      <div className="sidebar-bottom-section">
        <button
          onClick={onOpenHelp}
          className="nav-item-btn bottom-btn"
          title={isCollapsed ? t.help : undefined}
        >
          <HelpCircle size={17} />
          {!isCollapsed && <span>Help & FAQ</span>}
        </button>

        <button
          onClick={onOpenSettings}
          className="nav-item-btn bottom-btn"
          title={isCollapsed ? t.settings : undefined}
        >
          <Settings size={17} />
          {!isCollapsed && <span>Settings</span>}
        </button>

        {!isCollapsed && (
          <div className="kiosk-mode-banner" onClick={onToggleKioskMode}>
            <Smartphone size={14} />
            <span>{isKioskMode ? 'Exit Touch Kiosk' : 'Touch Kiosk Mode'}</span>
          </div>
        )}
      </div>

      <style>{`
        .civora-sidebar {
          width: 260px;
          height: calc(100vh - 56px);
          background-color: #202123;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-normal);
          position: relative;
          z-index: 40;
          user-select: none;
        }

        .civora-sidebar.collapsed {
          width: 64px;
        }

        .sidebar-top-section {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-brand-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px 4px 4px 4px;
        }

        .brand-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sidebar-logo {
          height: 32px;
          width: auto;
          max-width: 110px;
          object-fit: contain;
          border-radius: 4px;
        }

        .brand-text-col {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: #F5F5F5;
          line-height: 1.2;
        }

        .brand-tagline {
          font-size: 0.7rem;
          color: #737373;
          font-weight: 500;
        }

        .collapsed-top-row {
          display: flex;
          justify-content: center;
        }

        .new-chat-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: transparent;
          color: #F5F5F5;
          border: 1px solid #3A3A3A;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          font-size: 0.88rem;
          transition: all var(--transition-fast);
          width: 100%;
        }

        .new-chat-btn:hover {
          background-color: var(--surface-hover);
          border-color: #555555;
        }

        .civora-sidebar.collapsed .new-chat-btn {
          justify-content: center;
          padding: 9px 0;
        }

        .collapse-toggle-btn {
          padding: 4px;
          color: var(--muted);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .collapse-toggle-btn:hover {
          background-color: var(--surface-hover);
          color: var(--text);
        }

        .sidebar-nav {
          padding: 4px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-item-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          color: var(--secondary-text);
          font-size: 0.88rem;
          font-weight: 400;
          transition: all var(--transition-fast);
        }

        .nav-item-btn:hover {
          background-color: var(--surface-hover);
          color: #F5F5F5;
        }

        .nav-item-btn.active {
          background-color: #2F2F2F;
          color: #F5F5F5;
          font-weight: 500;
        }

        .nav-icon {
          color: var(--secondary-text);
          flex-shrink: 0;
        }

        .nav-item-btn.active .nav-icon {
          color: #F5F5F5;
        }

        .civora-sidebar.collapsed .nav-item-btn {
          justify-content: center;
          padding: 9px 0;
        }

        .sidebar-history-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 12px;
          overflow: hidden;
          margin-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .history-header {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--muted);
          margin-bottom: 8px;
          padding: 0 4px;
        }

        .history-list {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .empty-history {
          font-size: 0.8rem;
          color: var(--muted);
          padding: 8px 4px;
          font-style: italic;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          color: var(--secondary-text);
          cursor: pointer;
          transition: background-color var(--transition-fast), color var(--transition-fast);
          position: relative;
        }

        .history-item:hover {
          background-color: var(--surface-hover);
          color: #F5F5F5;
        }

        .history-item.active {
          background-color: #2F2F2F;
          color: #F5F5F5;
          font-weight: 500;
        }

        .history-icon {
          color: var(--muted);
          flex-shrink: 0;
        }

        .history-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .delete-history-btn {
          opacity: 0;
          color: var(--muted);
          padding: 3px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .history-item:hover .delete-history-btn {
          opacity: 1;
        }

        .delete-history-btn:hover {
          color: var(--error);
          background-color: var(--error-bg);
        }

        .sidebar-bottom-section {
          padding: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .bottom-btn {
          color: var(--secondary-text);
        }

        .kiosk-mode-banner {
          margin-top: 6px;
          padding: 8px 10px;
          background-color: rgba(15, 118, 110, 0.2);
          border: 1px solid rgba(15, 118, 110, 0.35);
          color: #0F766E;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .kiosk-mode-banner:hover {
          background-color: rgba(15, 118, 110, 0.3);
          color: #22C55E;
        }

        @media (max-width: 768px) {
          .civora-sidebar {
            position: absolute;
            left: 0;
            top: 56px;
            z-index: 90;
            box-shadow: var(--shadow-lg);
          }
          .civora-sidebar.collapsed {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};
