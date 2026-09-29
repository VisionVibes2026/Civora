import React from 'react';
import { X, Bell } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'NABARD PACS Interest Subvention Circular Updated',
      desc: 'Prompt Repayment Incentive (PRI) guidelines for FY 2025-26 published for Primary Agricultural Credit Societies.',
      date: 'Today, 09:30 AM',
      type: 'policy',
      unread: true
    },
    {
      id: '2',
      title: 'Tamil Nadu Cooperative Societies Rules Amendment',
      desc: 'Updated bye-law model for PACS digital loan disbursement under Section 21.',
      date: 'Yesterday',
      type: 'law',
      unread: true
    },
    {
      id: '3',
      title: 'Grievance Tracking Reference CIV-GRV-481920',
      desc: 'Representation submitted to DRCS Office status updated to "Under Administrative Review".',
      date: '2 days ago',
      type: 'grievance',
      unread: false
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="title-row">
            <Bell size={18} className="header-icon" />
            <h2 className="modal-title">Notifications & Policy Alerts</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn"><X size={18} /></button>
        </div>

        <div className="modal-body">
          {notifications.map(item => (
            <div key={item.id} className={`notification-item ${item.unread ? 'unread' : ''}`}>
              <div className="item-top">
                <span className="item-title">{item.title}</span>
                <span className="item-date">{item.date}</span>
              </div>
              <p className="item-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 200; padding: 16px;
        }
        .modal-card {
          width: 100%; max-width: 480px; background-color: #212121; border: 1px solid #3A3A3A; border-radius: 16px;
          padding: 20px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 16px 32px rgba(0, 0, 0, 0.6);
        }
        .modal-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #2F2F2F; padding-bottom: 12px; }
        .title-row { display: flex; align-items: center; gap: 8px; }
        .header-icon { color: #0F766E; }
        .modal-title { font-size: 1.05rem; font-weight: 600; color: #F5F5F5; }
        .modal-close-btn { color: #737373; padding: 4px; }
        .modal-body { display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto; }
        .notification-item { background-color: #2F2F2F; border: 1px solid #3A3A3A; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
        .notification-item.unread { border-left: 3px solid #0F766E; background-color: rgba(15, 118, 110, 0.15); }
        .item-top { display: flex; justify-content: space-between; align-items: center; }
        .item-title { font-size: 0.88rem; font-weight: 600; color: #F5F5F5; }
        .item-date { font-size: 0.72rem; color: #737373; }
        .item-desc { font-size: 0.82rem; color: #A7A7A7; line-height: 1.45; }
      `}</style>
    </div>
  );
};
