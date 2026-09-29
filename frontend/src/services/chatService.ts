/**
 * Civora Frontend Chat Service.
 *
 * Provides typed interface to backend /api/v1/chat endpoint with local fallback
 * to demo sequence data when in offline / standalone mode.
 */

import { apiClient } from './apiClient';
import type { ChatMessage, Language } from '../types';
import { DEMO_STEPS } from '../constants/demoSequence';

export interface SendMessageRequest {
  message: string;
  conversationId?: string;
  language: Language;
}

export class ChatService {
  public async sendMessage(request: SendMessageRequest): Promise<{
    message: ChatMessage;
    isMock: boolean;
  }> {
    // Local fallback logic using DEMO_STEPS
    const mockFallback = (): ChatMessage => {
      const q = request.message.toLowerCase();
      const isTamil = request.language === 'ta';

      let step = DEMO_STEPS[1];
      if (q.includes('passbook') || q.includes('doc') || q.includes('ஆவணம்') || q.includes('check')) {
        step = DEMO_STEPS[2];
      } else if (q.includes('applicable') || q.includes('damage') || q.includes('பொருந்துமா')) {
        step = DEMO_STEPS[3];
      } else if (q.includes('what should') || q.includes('do now') || q.includes('செய்ய வேண்டும்')) {
        step = DEMO_STEPS[4];
      } else if (q.includes('ready') || q.includes('keep') || q.includes('தயார்')) {
        step = DEMO_STEPS[5];
      } else if (q.includes('yes') || q.includes('prepare') || q.includes('ஆம்')) {
        step = DEMO_STEPS[6];
      }

      return {
        id: `msg_${Date.now()}`,
        sender: 'assistant',
        text: isTamil ? step.civoraResponseTa : step.civoraResponseEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachedDocState: step.attachedDocState,
        verificationState: step.verificationState,
        verifiedAnswer: step.verifiedAnswer,
        officialSupportCard: step.officialSupportCard,
        summaryReportCard: step.summaryReportCard,
        demoStepIndex: step.stepIndex,
      };
    };

    const res = await apiClient.post<any>(
      '/chat/messages',
      {
        message: request.message,
        conversation_id: request.conversationId,
        language: request.language,
      },
      mockFallback
    );

    if (res.data && !res.isMock) {
      const backendMsg: ChatMessage = {
        id: res.data.message_id || `msg_${Date.now()}`,
        sender: 'assistant',
        text: res.data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jurisdiction: res.data.jurisdiction
          ? {
              state: res.data.jurisdiction.state || 'Tamil Nadu',
              cooperativeType: res.data.jurisdiction.applicable_act_name || 'PACS / Credit Society',
              authority: res.data.jurisdiction.competent_authority || 'Registrar of Cooperative Societies',
              policy: res.data.jurisdiction.dispute_resolution_section || 'Section 90',
            }
          : undefined,
        source: res.data.citations && res.data.citations.length > 0
          ? {
              label: res.data.citations[0].source_name,
              actOrScheme: res.data.citations[0].source_name,
              section: res.data.citations[0].section || 'General',
              version: 'v2025.1',
              effectiveDate: '01-Apr-2024',
              trustBadge: 'Grounded Statutory Source',
              confidence: res.data.confidence_score || 0.95,
            }
          : undefined,
      };
      return { message: backendMsg, isMock: false };
    }

    return { message: res.data || mockFallback(), isMock: true };
  }
}

export const chatService = new ChatService();
