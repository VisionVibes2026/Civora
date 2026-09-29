import React, { useState } from 'react';
import type { GrievanceDraft, Language } from '../types';
import { 
  FileText, 
  Check, 
  Copy, 
  Download, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert
} from 'lucide-react';

interface GrievanceWizardProps {
  currentLanguage: Language;
  onFinishGrievance: (draft: GrievanceDraft) => void;
  onAskCivoraAboutGrievance: (text: string) => void;
}

export const GrievanceWizard: React.FC<GrievanceWizardProps> = ({
  onAskCivoraAboutGrievance,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [issueType, setIssueType] = useState('Delayed Crop Loan Interest Subvention Disbursement');
  const [description, setDescription] = useState(
    'My 2024-25 crop loan interest subvention claim of ₹14,500 has been delayed for over 6 months despite full repayment on 10-Jan-2025.'
  );
  const [state, setState] = useState('Tamil Nadu');
  const [societyType, setSocietyType] = useState('Primary Agricultural Credit Society (PACS)');
  const [societyName, setSocietyName] = useState('Kanchipuram Primary Agricultural Credit Society (PACS No. K-142)');
  const [memberId, setMemberId] = useState('MEM-TN-88421');
  const [copied, setCopied] = useState(false);

  const generatedRefNo = `CIV-GRV-${Math.floor(100000 + Math.random() * 900000)}`;
  const todayDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const generatedDraftText = `BEFORE THE DEPUTY REGISTRAR OF COOPERATIVE SOCIETIES
JURISDICTION: ${state.toUpperCase()}
REFERENCE NO: ${generatedRefNo}
DATE: ${todayDate}

SUBJECT: Formal Representation regarding ${issueType} - Reg.

APPLICANT DETAILS:
Member Name: [REDACTED - MEMBER NAME]
Member ID / Account No: ${memberId}
Cooperative Society: ${societyName}
Society Type: ${societyType}
State / District: ${state}

FACTS OF THE GRIEVANCE:
1. The applicant is a duly registered member of ${societyName} holding active share capital.
2. ${description}
3. Under Section 90 of the ${state === 'Tamil Nadu' ? 'Tamil Nadu Cooperative Societies Act, 1983' : 'Applicable State Cooperative Societies Act'}, members are entitled to timely disbursement of approved subventions and resolution of disputes touching society business.
4. Oral representations made to the PACS secretary have not yielded resolution within the statutory 30-day timeframe.

REQUESTED RELIEF:
1. Direct the Secretary / Board of ${societyName} to verify and release the delayed interest subvention amount without further administrative delay.
2. Conduct an official inquiry under statutory rules if administrative lapse is identified.

PRAYER:
It is respectfully prayed that the competent authority issue necessary instructions to resolve this matter in the interest of member justice.

Yours faithfully,
(Member Signature / Verification)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedDraftText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${generatedRefNo}_Grievance_Draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grievance-container">
      <div className="grievance-header-banner">
        <div className="banner-title-group">
          <FileText size={24} className="banner-icon" />
          <div>
            <h1 className="banner-title">Prepare an Official Grievance Draft</h1>
            <p className="banner-sub">Guided 3-step assistant to generate formal representations for Cooperative Registrars</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-node ${step >= 1 ? 'active' : ''}`}>1. Describe Issue</div>
          <div className="step-line"></div>
          <div className={`step-node ${step >= 2 ? 'active' : ''}`}>2. Identify Context</div>
          <div className="step-line"></div>
          <div className={`step-node ${step === 3 ? 'active' : ''}`}>3. Review & Export</div>
        </div>
      </div>

      <div className="grievance-content-card">
        {step === 1 && (
          <div className="wizard-step-body">
            <h2 className="step-title">Step 1: Describe Your Issue</h2>
            <p className="step-desc">Select the category of grievance and describe the facts in your own words.</p>

            <div className="form-group">
              <label className="form-label">Grievance Category</label>
              <select 
                value={issueType} 
                onChange={(e) => setIssueType(e.target.value)}
                className="form-select"
              >
                <option value="Delayed Crop Loan Interest Subvention Disbursement">Delayed Crop Loan Interest Subvention</option>
                <option value="PACS Share Certificate Non-Issuance">PACS Share Certificate Non-Issuance</option>
                <option value="Fertilizer / Agricultural Input Supply Shortage">Fertilizer / Agricultural Input Supply Shortage</option>
                <option value="Non-Crediting of Fixed Deposit Payout on Maturity">Non-Crediting of Fixed Deposit Payout on Maturity</option>
                <option value="Irregularity in Board Election / Voter List">Irregularity in Board Election / Voter List</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description of Facts</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="form-textarea"
                placeholder="Explain what happened, dates, loan amounts, and responses received..."
              />
            </div>

            <div className="step-actions">
              <button onClick={() => setStep(2)} className="wizard-btn primary">
                <span>Continue to Context</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step-body">
            <h2 className="step-title">Step 2: Identify Society Context</h2>
            <p className="step-desc">Provide jurisdiction details so Civora can cite applicable laws and authorities.</p>

            <div className="form-row">
              <div className="form-group half">
                <label className="form-label">State Jurisdiction</label>
                <select value={state} onChange={(e) => setState(e.target.value)} className="form-select">
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Multi-State">Multi-State Society</option>
                </select>
              </div>

              <div className="form-group half">
                <label className="form-label">Cooperative Society Type</label>
                <select value={societyType} onChange={(e) => setSocietyType(e.target.value)} className="form-select">
                  <option value="Primary Agricultural Credit Society (PACS)">PACS</option>
                  <option value="Urban Cooperative Credit Society">Urban Cooperative Credit Society</option>
                  <option value="District Central Cooperative Bank (DCCB)">DCCB Bank</option>
                  <option value="Cooperative Housing Society">Housing Society</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Exact Name of Cooperative Society</label>
              <input
                type="text"
                value={societyName}
                onChange={(e) => setSocietyName(e.target.value)}
                className="form-input"
                placeholder="e.g. Kanchipuram PACS No. K-142"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Member ID / Passbook No. (Optional)</label>
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="form-input"
                placeholder="e.g. MEM-TN-88421"
              />
            </div>

            <div className="step-actions">
              <button onClick={() => setStep(1)} className="wizard-btn secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button onClick={() => setStep(3)} className="wizard-btn primary">
                <span>Generate Official Draft</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step-body">
            <h2 className="step-title">Step 3: Review Generated Grievance Draft</h2>
            <p className="step-desc">Your formal representation has been generated with statutory citations.</p>

            <div className="draft-preview-box">
              <pre className="draft-text">{generatedDraftText}</pre>
            </div>

            {/* Disclaimer card */}
            <div className="disclaimer-alert">
              <ShieldAlert size={18} className="alert-icon" />
              <span>
                <strong>Notice:</strong> Civora is an advisory assistance tool. Present this printed/signed representation to your local Deputy Registrar of Cooperative Societies (DRCS) or designated grievance portal.
              </span>
            </div>

            <div className="step-actions split">
              <div className="action-buttons-group">
                <button onClick={handleCopy} className="wizard-btn secondary">
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                  <span>{copied ? 'Copied' : 'Copy Draft'}</span>
                </button>

                <button onClick={handleDownload} className="wizard-btn secondary">
                  <Download size={16} />
                  <span>Download Text</span>
                </button>
              </div>

              <button 
                onClick={() => onAskCivoraAboutGrievance(`I have generated a grievance draft regarding ${issueType}. What are the next administrative steps?`)} 
                className="wizard-btn primary"
              >
                <span>Ask Civora About Next Steps</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .grievance-container {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          background-color: #171717;
        }

        .grievance-header-banner {
          width: 100%;
          max-width: 850px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .banner-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .banner-icon {
          color: #F97316;
        }

        .banner-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #F5F5F5;
        }

        .banner-sub {
          font-size: 0.88rem;
          color: #A7A7A7;
          margin-top: 2px;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid #2F2F2F;
        }

        .step-node {
          font-size: 0.8rem;
          font-weight: 500;
          color: #737373;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          background-color: #2F2F2F;
        }

        .step-node.active {
          background-color: rgba(15, 118, 110, 0.2);
          color: #0F766E;
          border: 1px solid rgba(15, 118, 110, 0.4);
          font-weight: 600;
        }

        .step-line {
          flex: 1;
          height: 1px;
          background-color: #3A3A3A;
        }

        .grievance-content-card {
          width: 100%;
          max-width: 850px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 16px;
          padding: 24px;
        }

        .wizard-step-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #F5F5F5;
        }

        .step-desc {
          font-size: 0.88rem;
          color: #A7A7A7;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-row {
          display: flex;
          gap: 16px;
        }

        .form-group.half { flex: 1; }

        .form-label {
          font-size: 0.82rem;
          font-weight: 500;
          color: #F5F5F5;
        }

        .form-select, .form-input, .form-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #3A3A3A;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #F5F5F5;
          background-color: #2F2F2F;
          outline: none;
          transition: border-color 150ms ease;
        }

        .form-select:focus, .form-input:focus, .form-textarea:focus {
          border-color: #0F766E;
        }

        .step-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #2F2F2F;
        }

        .step-actions.split {
          justify-content: space-between;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wizard-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 150ms ease;
        }

        .wizard-btn.primary {
          background-color: #F5F5F5;
          color: #171717;
          font-weight: 600;
        }

        .wizard-btn.primary:hover {
          transform: scale(1.02);
        }

        .wizard-btn.secondary {
          background-color: #2F2F2F;
          border: 1px solid #3A3A3A;
          color: #F5F5F5;
        }

        .wizard-btn.secondary:hover {
          background-color: #3A3A3A;
        }

        .draft-preview-box {
          background-color: #171717;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          padding: 18px;
          max-height: 340px;
          overflow-y: auto;
        }

        .draft-text {
          font-family: monospace;
          font-size: 0.86rem;
          color: #E5E5E5;
          white-space: pre-wrap;
          line-height: 1.55;
        }

        .disclaimer-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background-color: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.83rem;
          color: #F59E0B;
        }

        .alert-icon {
          color: #F59E0B;
          flex-shrink: 0;
          margin-top: 2px;
        }

        @media (max-width: 640px) {
          .form-row { flex-direction: column; }
          .step-actions.split { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </div>
  );
};
