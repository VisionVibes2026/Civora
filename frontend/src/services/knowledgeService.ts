/**
 * Civora Knowledge & Grievance Services.
 */

import { apiClient } from './apiClient';
import type { CooperativeScheme, CooperativeLaw, GrievanceDraft } from '../types';
import { SCHEMES_DATABASE, LAWS_DATABASE } from '../constants/knowledgeData';

export class KnowledgeService {
  public async getSchemes(state?: string): Promise<{ data: CooperativeScheme[]; isMock: boolean }> {
    const mockFallback = () => SCHEMES_DATABASE;
    const res = await apiClient.get<CooperativeScheme[]>(`/knowledge/schemes?state=${state || ''}`, mockFallback);
    return { data: res.data || SCHEMES_DATABASE, isMock: res.isMock };
  }

  public async getLaws(jurisdiction?: string): Promise<{ data: CooperativeLaw[]; isMock: boolean }> {
    const mockFallback = () => LAWS_DATABASE;
    const res = await apiClient.get<CooperativeLaw[]>(`/knowledge/laws?jurisdiction=${jurisdiction || ''}`, mockFallback);
    return { data: res.data || LAWS_DATABASE, isMock: res.isMock };
  }
}

export class GrievanceService {
  public async draftGrievance(data: {
    applicantName: string;
    societyName: string;
    category: string;
    issueDescription: string;
    state?: string;
  }): Promise<{ draft: GrievanceDraft; isMock: boolean }> {
    const mockFallback = (): GrievanceDraft => ({
      issueType: data.category || 'Loan Waiver Exclusion',
      description: data.issueDescription,
      state: data.state || 'Tamil Nadu',
      societyName: data.societyName || 'Thiruvarur PACCS No. 402',
      societyType: 'Primary Agricultural Cooperative Credit Society (PACCS)',
      memberId: 'PACCS-TR-402-8812',
      generatedText: (
        `TO:\nTHE DEPUTY REGISTRAR OF COOPERATIVE SOCIETIES\n${data.state || 'Tamil Nadu'} Circle\n\n` +
        `SUBJECT: Formal Representation regarding ${data.category || 'Waiver Exclusion'} under Section 90 of TNCSA 1983.\n\n` +
        `RESPECTED SIR/MADAM,\n\n` +
        `I, ${data.applicantName || 'Member Farmer'}, am an active member of ${data.societyName || 'the Society'}. ` +
        `I respectfully submit this representation regarding: ${data.issueDescription}.\n\n` +
        `STATUTORY PROVISIONS CITED:\n` +
        `1. Tamil Nadu Co-operative Societies Act 1983, Section 90 (Dispute Resolution)\n` +
        `2. Cooperative Audit & Surcharge Guidelines, Section 81\n\n` +
        `PRAYER:\n` +
        `It is humbly prayed that the Competent Authority may kindly cause an immediate verification ` +
        `of my records and grant appropriate relief in accordance with cooperative statutory rules.\n\n` +
        `Yours faithfully,\n${data.applicantName || 'Applicant'}`
      ),
      referenceNo: `GRIEV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    });

    const res = await apiClient.post<any>('/grievances/draft', data, mockFallback);
    return { draft: res.data || mockFallback(), isMock: res.isMock };
  }
}

export const knowledgeService = new KnowledgeService();
export const grievanceService = new GrievanceService();
