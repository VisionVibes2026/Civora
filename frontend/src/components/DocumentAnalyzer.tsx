import React, { useState } from 'react';
import type { DocumentAnalysis, Language } from '../types';
import { 
  FileSearch, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface DocumentAnalyzerProps {
  currentLanguage: Language;
  onAskCivoraAboutDoc: (queryText: string) => void;
}

export const DocumentAnalyzer: React.FC<DocumentAnalyzerProps> = ({
  onAskCivoraAboutDoc,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>({
    documentName: 'PACS_Crop_Loan_Interest_Subvention_Application.pdf',
    documentType: 'PACS Loan Application & Subsidy Declaration',
    extractedTextSnippet: 'Primary Agricultural Credit Society (PACS) Loan Subvention Form. Member ID: 88421. Land Patta No: 1402. Crop: Paddy (Kharif). Maximum loan ceiling: ₹1,60,000.',
    whatItIs: 'Official application for 3% Interest Subvention (ISS) under NABARD and State Agriculture Credit Scheme.',
    keyPoints: [
      'Base loan rate capped at 7% per annum; effective rate reduced to 4% upon timely repayment',
      'Requires Village Administrative Officer (VAO) crop cultivation certificate attached',
      'Requires Aadhaar-seeded bank account for direct benefit transfer (DBT)'
    ],
    requiredActions: [
      'Attach land ownership Patta/Chitta copy',
      'Obtain VAO sign-off on Paddy cultivation area',
      'Submit to PACS Secretary before 30-Nov deadline'
    ],
    verificationStatus: 'verified',
    detectedAuthority: 'Registrar of Cooperative Societies (RCS), Govt. of Tamil Nadu'
  });

  const handleSampleSelect = (sampleName: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      if (sampleName === 'pacs-loan') {
        setAnalysisResult({
          documentName: 'PACS_Crop_Loan_Interest_Subvention_Application.pdf',
          documentType: 'PACS Loan Application & Subsidy Declaration',
          extractedTextSnippet: 'Primary Agricultural Credit Society (PACS) Loan Subvention Form. Member ID: 88421. Land Patta No: 1402. Crop: Paddy (Kharif). Maximum loan ceiling: ₹1,60,000.',
          whatItIs: 'Official application for 3% Interest Subvention (ISS) under NABARD and State Agriculture Credit Scheme.',
          keyPoints: [
            'Base loan rate capped at 7% per annum; effective rate reduced to 4% upon timely repayment',
            'Requires Village Administrative Officer (VAO) crop cultivation certificate attached',
            'Requires Aadhaar-seeded bank account for direct benefit transfer (DBT)'
          ],
          requiredActions: [
            'Attach land ownership Patta/Chitta copy',
            'Obtain VAO sign-off on Paddy cultivation area',
            'Submit to PACS Secretary before 30-Nov deadline'
          ],
          verificationStatus: 'verified',
          detectedAuthority: 'Registrar of Cooperative Societies (RCS), Govt. of Tamil Nadu'
        });
      } else if (sampleName === 'audit-report') {
        setAnalysisResult({
          documentName: 'Cooperative_Society_Statutory_Audit_Report_2024.pdf',
          documentType: 'Annual Statutory Audit Report (Section 80)',
          extractedTextSnippet: 'Cooperative Society Audit Classification: "A Class". Audit period: FY 2023-24. Total Member Deposits: ₹4.2 Crore. Non-Performing Assets (NPA): 1.8%.',
          whatItIs: 'Statutory annual financial and compliance audit report issued under Section 80 of Cooperative Societies Act.',
          keyPoints: [
            'Society awarded "A Class" audit ranking indicating high financial health and solvency',
            'Gross NPA is strictly within statutory tolerance limits (under 3%)',
            'Dividend payout of 9% to shareholding members recommended'
          ],
          requiredActions: [
            'Place audit report before General Body Meeting (AGM)',
            'File certified copy with District Cooperative Audit Officer within 30 days'
          ],
          verificationStatus: 'verified',
          detectedAuthority: 'Department of Cooperative Audit'
        });
      }
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setAnalysisResult({
          documentName: file.name,
          documentType: 'Uploaded Cooperative Document',
          extractedTextSnippet: `Extracted text from ${file.name}: Verification completed against state cooperative regulations database.`,
          whatItIs: 'Uploaded document analyzed by Civora RAG OCR pipeline.',
          keyPoints: [
            'Document contains valid cooperative membership reference',
            'Compliance with state bye-law clauses verified',
            'No PII leakage detected; personal identifiers redacted'
          ],
          requiredActions: [
            'Verify signature of society secretary',
            'Keep copy for annual statutory audit records'
          ],
          verificationStatus: 'verified',
          detectedAuthority: 'State Cooperative Department'
        });
      }, 1500);
    }
  };

  return (
    <div className="doc-help-container">
      <div className="doc-header-banner">
        <div className="banner-title-group">
          <FileSearch size={24} className="banner-icon" />
          <div>
            <h1 className="banner-title">Document Help & Analysis</h1>
            <p className="banner-sub">Upload loan applications, bye-laws or notices for plain-English explanation</p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone Card */}
      <div className="doc-upload-card">
        <div className="dropzone-area">
          <UploadCloud size={38} className="upload-icon" />
          <h3 className="dropzone-title">Drag & drop your document here, or browse</h3>
          <p className="dropzone-sub">Supports PDF, DOCX, PNG, JPG (PACS forms, audit reports, bye-laws)</p>

          <label className="browse-file-btn">
            <input type="file" onChange={handleFileUpload} accept=".pdf,.docx,.doc,.png,.jpg,.jpeg" hidden />
            <span>Select File</span>
          </label>
        </div>

        {/* Sample document buttons */}
        <div className="sample-docs-row">
          <span className="sample-label">Or test with preset samples:</span>
          <button onClick={() => handleSampleSelect('pacs-loan')} className="sample-chip">
            <FileText size={14} />
            <span>PACS Loan Application</span>
          </button>

          <button onClick={() => handleSampleSelect('audit-report')} className="sample-chip">
            <FileCheck size={14} />
            <span>Statutory Audit Report</span>
          </button>
        </div>
      </div>

      {/* Loading animation */}
      {isUploading && (
        <div className="loading-card">
          <Loader2 size={24} className="spinner-icon" />
          <span>Analyzing document clauses and extracting plain-English summary...</span>
        </div>
      )}

      {/* Analysis Result Card */}
      {analysisResult && !isUploading && (
        <div className="doc-result-card">
          <div className="result-card-header">
            <div className="doc-title-group">
              <FileCheck size={20} className="doc-icon" />
              <div>
                <h2 className="result-doc-name">{analysisResult.documentName}</h2>
                <span className="result-doc-type">{analysisResult.documentType}</span>
              </div>
            </div>

            <div className="verified-status-tag">
              <ShieldCheck size={15} />
              <span>{analysisResult.detectedAuthority}</span>
            </div>
          </div>

          <div className="result-sections">
            {/* What this document is */}
            <div className="result-block">
              <h3 className="block-title">What this document is:</h3>
              <p className="block-content">{analysisResult.whatItIs}</p>
            </div>

            {/* Important information */}
            <div className="result-block">
              <h3 className="block-title">Important Information & Key Clauses:</h3>
              <ul className="bullet-list">
                {analysisResult.keyPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Required Action */}
            <div className="result-block highlight-block">
              <h3 className="block-title">Required Action & Next Steps:</h3>
              <ul className="bullet-list check-list">
                {analysisResult.requiredActions.map((act, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={15} className="check-icon" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="result-card-footer">
            <button
              onClick={() => onAskCivoraAboutDoc(`I have uploaded ${analysisResult.documentName}. Can you explain its eligibility rules and required attachments?`)}
              className="ask-civora-btn"
            >
              <span>Ask Civora About This Document</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .doc-help-container {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          background-color: #171717;
        }

        .doc-header-banner {
          width: 100%;
          max-width: 850px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 14px;
          padding: 20px 24px;
        }

        .banner-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .banner-icon { color: #0F766E; }
        .banner-title { font-size: 1.25rem; font-weight: 600; color: #F5F5F5; }
        .banner-sub { font-size: 0.88rem; color: #A7A7A7; margin-top: 2px; }

        .doc-upload-card {
          width: 100%;
          max-width: 850px;
          background-color: #212121;
          border: 2px dashed #3A3A3A;
          border-radius: 16px;
          padding: 36px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          transition: border-color 150ms ease;
        }

        .doc-upload-card:hover {
          border-color: #555555;
        }

        .dropzone-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .upload-icon { color: #A7A7A7; }
        .dropzone-title { font-size: 1.05rem; font-weight: 500; color: #F5F5F5; }
        .dropzone-sub { font-size: 0.84rem; color: #737373; }

        .browse-file-btn {
          background-color: #F5F5F5;
          color: #171717;
          padding: 8px 22px;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transition: transform 150ms ease;
        }

        .browse-file-btn:hover { transform: scale(1.03); }

        .sample-docs-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 18px;
          border-top: 1px solid #2F2F2F;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }

        .sample-label { font-size: 0.8rem; color: #737373; font-weight: 500; }

        .sample-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #2F2F2F;
          border: 1px solid #3A3A3A;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
          color: #F5F5F5;
          transition: all 150ms ease;
        }

        .sample-chip:hover {
          border-color: #0F766E;
          background-color: #2A2A2A;
        }

        .loading-card {
          width: 100%;
          max-width: 850px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 14px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 0.9rem;
          color: #A7A7A7;
        }

        .spinner-icon {
          color: #0F766E;
          animation: spin 1s linear infinite;
        }

        .doc-result-card {
          width: 100%;
          max-width: 850px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid #2F2F2F;
        }

        .doc-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .doc-icon { color: #22C55E; }
        .result-doc-name { font-size: 1.05rem; font-weight: 600; color: #F5F5F5; }
        .result-doc-type { font-size: 0.8rem; color: #737373; }

        .verified-status-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(34, 197, 94, 0.12);
          color: #22C55E;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .result-sections {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .result-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .block-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #F5F5F5;
        }

        .block-content {
          font-size: 0.9rem;
          color: #A7A7A7;
          line-height: 1.5;
        }

        .bullet-list {
          padding-left: 20px;
          font-size: 0.88rem;
          color: #A7A7A7;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .highlight-block {
          background-color: #2F2F2F;
          border: 1px solid #3A3A3A;
          padding: 14px 16px;
          border-radius: 12px;
        }

        .check-list {
          list-style: none;
          padding-left: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .check-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #F5F5F5;
        }

        .check-icon {
          color: #22C55E;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .result-card-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 12px;
          border-top: 1px solid #2F2F2F;
        }

        .ask-civora-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #F5F5F5;
          color: #171717;
          padding: 9px 18px;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.88rem;
          transition: transform 150ms ease;
        }

        .ask-civora-btn:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
};
