import React, { useState } from 'react';
import type { ViewMode, Language, ChatSession, ChatMessage } from './types';
import { DEMO_STEPS } from './constants/demoSequence';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeScreen } from './components/HomeScreen';
import { ChatWorkspace } from './components/ChatWorkspace';
import { SchemesDirectory } from './components/SchemesDirectory';
import { LawsLibrary } from './components/LawsLibrary';
import { GrievanceWizard } from './components/GrievanceWizard';
import { DocumentAnalyzer } from './components/DocumentAnalyzer';
import { KioskUI } from './components/KioskUI';
import { VoiceModal } from './components/VoiceModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';

export const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [activeView, setActiveView] = useState<ViewMode>('home');
  const [isKioskMode, setIsKioskMode] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isLowConfidenceDemo, setIsLowConfidenceDemo] = useState<boolean>(false);

  // Modals state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Single Continuous Demo Session state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Audio sequence counter tracked independently from manual text messages
  const [audioCount, setAudioCount] = useState<number>(0);

  const activeSession = chatSessions.find(s => s.id === activeSessionId) || null;

  // New Chat Action - Navigates to HomeScreen ("How can I help you today?")
  const handleNewChat = () => {
    setActiveSessionId(null);
    setActiveView('home');
    setAudioCount(0);
  };

  const [pendingInputText, setPendingInputText] = useState<string>('');

  // Helper to determine the matching DemoStep for a user message
  const getDemoStepForUserMessage = (text: string, assistantCount: number) => {
    const lower = text.toLowerCase().trim();

    // 1. Audio #1 / Step 1: Paddy farmer query
    if (
      lower.includes('paddy farmer') ||
      lower.includes('nagapattinam') ||
      lower.includes('heavy rain') ||
      lower.includes('agricultural loan from pacs') ||
      lower.includes('நெல் விவசாயி') ||
      lower.includes('சேதமடைந்துள்ளது')
    ) {
      return DEMO_STEPS[1];
    }

    // 2. Audio #2 / Step 2: Loan document check
    if (
      lower.includes('loan document') ||
      lower.includes('check whether insurance') ||
      lower.includes('கடன் ஆவணம்')
    ) {
      return DEMO_STEPS[2];
    }

    // 3. Audio #3 / Step 3: Applicable query
    if (
      lower.includes('applicable') ||
      lower.includes('பொருந்துமா')
    ) {
      return DEMO_STEPS[3];
    }

    // 4. Audio #4 / Step 4: What should I do now
    if (
      lower.includes('what should i do') ||
      lower.includes('என்ன செய்ய வேண்டும்')
    ) {
      return DEMO_STEPS[4];
    }

    // 5. Audio #5 / Step 5: What information keep ready
    if (
      lower.includes('keep ready') ||
      lower.includes('விவரங்களை ஆயத்தமாக')
    ) {
      return DEMO_STEPS[5];
    }

    // 6. Audio #6 / Step 6: Yes prepare it
    if (
      lower.includes('prepare') ||
      lower.includes('தயார் செய்யவும்')
    ) {
      return DEMO_STEPS[6];
    }

    // 7. Greeting / "hi" / "hello"
    if (
      lower === 'hi' ||
      lower === 'hello' ||
      lower === 'வணக்கம்' ||
      lower.startsWith('hi ') ||
      lower.startsWith('hello ')
    ) {
      return DEMO_STEPS[0];
    }

    // Fallback based on assistant message count
    const stepIdx = Math.min(assistantCount, DEMO_STEPS.length - 1);
    return DEMO_STEPS[stepIdx];
  };

  // Send Message Logic - Supports continuous multi-turn demo
  const handleSendMessage = (text: string, attachedFile?: File) => {
    setPendingInputText('');
    let currentSessionId = activeSessionId;
    let updatedSessions = [...chatSessions];

    // User message
    const userMsgText = text.trim() || (attachedFile ? `Uploaded document: ${attachedFile.name}` : 'Document upload');
    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: 'Just now',
      attachedDocName: attachedFile ? attachedFile.name : undefined
    };

    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: userMsgText.length > 30 ? userMsgText.substring(0, 30) + '...' : userMsgText,
        language: currentLanguage,
        createdAt: 'Just now',
        messages: [userMsg]
      };
      updatedSessions.unshift(newSession);
      currentSessionId = newSession.id;
    } else {
      updatedSessions = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, userMsg]
          };
        }
        return s;
      });
    }

    setChatSessions(updatedSessions);
    setActiveSessionId(currentSessionId);
    setActiveView('chat');
    setIsGenerating(true);

    // Count how many assistant messages exist in this session
    const currentSess = updatedSessions.find(s => s.id === currentSessionId);
    const assistantCount = currentSess ? currentSess.messages.filter(m => m.sender === 'assistant').length : 0;
    
    // Pick next step by content matching or assistant count fallback
    const matchedStep = getDemoStepForUserMessage(text, assistantCount);

    // Simulate realistic AI processing state (3.3s for document upload OCR & verification workflow, 2.5s for text)
    const processingDelay = attachedFile ? 3300 : 2500;

    setTimeout(() => {
      const docEn = `I've analyzed your uploaded document and matched the relevant details from your conversation.

Extracted details
Crop: Paddy
Location: Nagapattinam, Tamil Nadu
Cause reported: Heavy rain
Loan: Agricultural loan through PACS
Insurance: Identified from uploaded document
Incident: Crop damage reported

Verification
Insurance context: PMFBY provides crop-insurance coverage for eligible crop losses caused by specified natural calamities and other covered risks. The official PMFBY portal provides policy/application-status and crop-insurance information. [Official PMFBY Portal](https://pmfby.gov.in/?utm_source=chatgpt.com)

Sources
• PMFBY — Ministry of Agriculture & Farmers Welfare, Government of India
• PMFBY Operational Guidelines
• National Crop Insurance Portal`;

      const docTa = `உங்கள் பதிவேற்றப்பட்ட ஆவணத்தைப் பகுப்பாய்வு செய்து, உங்கள் உரையாடலிலிருந்து பொருத்தமான விவரங்களைப் பொருத்தியுள்ளேன்.

பிரித்தெடுக்கப்பட்ட விவரங்கள்
பயிர்: நெல்
இடம்: நாகப்பட்டினம், தமிழ்நாடு
அறிவிக்கப்பட்ட காரணம்: கனமழை
கடன்: PACS மூலம் விவசாயக் கடன்
காப்பீடு: பதிவேற்றப்பட்ட ஆவணத்திலிருந்து கண்டறியப்பட்டது
சம்பவம்: பயிர் சேதம் அறிக்கையிடப்பட்டது

சரிபார்ப்பு
காப்பீட்டுச் சூழல்: தகுதியுள்ள பயிர் இழப்புகளுக்கு PMFBY பயிர் காப்பீட்டு பாதுகாப்பை வழங்குகிறது. அதிகாரப்பூர்வ PMFBY தளம் கொள்கை/விண்ணப்ப நிலை மற்றும் பயிர் காப்பீட்டுத் தகவலை வழங்குகிறது. [அதிகாரப்பூர்வ PMFBY தளம்](https://pmfby.gov.in/?utm_source=chatgpt.com)

ஆதாரங்கள்
• PMFBY — வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம், இந்திய அரசு
• PMFBY செயல்பாட்டு வழிகாட்டுதல்கள்
• தேசிய பயிர் காப்பீட்டு தளம்`;

      const originalEnglishText = attachedFile ? docEn : matchedStep.civoraResponseEn;
      const tamilText = attachedFile ? docTa : matchedStep.civoraResponseTa;

      const isTamil = currentLanguage === 'ta';
      const responseText = isTamil ? tamilText : originalEnglishText;

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        originalEnglishText,
        tamilText,
        timestamp: 'Just now',
        isLowConfidence: isLowConfidenceDemo,
        demoStepIndex: matchedStep.stepIndex,
        attachedDocState: matchedStep.attachedDocState,
        verificationState: matchedStep.verificationState,
        verifiedAnswer: matchedStep.verifiedAnswer,
        officialSupportCard: matchedStep.officialSupportCard,
        summaryReportCard: matchedStep.summaryReportCard,
        jurisdiction: {
          state: 'Tamil Nadu',
          cooperativeType: 'PACS',
          authority: 'Registrar of Cooperative Societies',
          policy: 'PMFBY & TNPACS Crop Insurance Policy 2024-25'
        },
        source: {
          label: 'PMFBY Official Source',
          actOrScheme: 'Pradhan Mantri Fasal Bima Yojana',
          section: 'Clause 6.3 - Localized Calamity Coverage',
          version: 'Notification 2024-25',
          effectiveDate: '01-Aug-2024',
          trustBadge: '✓ Verified source',
          confidence: 0.99
        }
      };

      setChatSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, aiMsg]
          };
        }
        return s;
      }));
      setIsGenerating(false);
    }, processingDelay);
  };

  const handleQuickAction = (actionType: 'scheme' | 'laws' | 'docs' | 'grievance') => {
    if (actionType === 'scheme') {
      setActiveView('schemes');
    } else if (actionType === 'laws') {
      setActiveView('laws');
    } else if (actionType === 'docs') {
      setActiveView('documents');
    } else if (actionType === 'grievance') {
      setActiveView('grievance');
    }
  };

  const handleSelectNextAction = (actionType: string, payload?: string) => {
    if (actionType === 'grievance') {
      setActiveView('grievance');
    } else if (actionType === 'documents') {
      setActiveView('documents');
    } else if (actionType === 'schemes') {
      setActiveView('schemes');
    } else if (actionType === 'laws') {
      setActiveView('laws');
    } else if (actionType === 'query' && payload) {
      handleSendMessage(payload);
    }
  };

  const handleDeleteSession = (id: string) => {
    const updated = chatSessions.filter(s => s.id !== id);
    setChatSessions(updated);
    if (activeSessionId === id) {
      setActiveSessionId(updated[0]?.id || null);
      if (updated.length === 0) {
        setActiveView('home');
        setAudioCount(0);
      }
    }
  };

  const currentTitle = activeSession ? activeSession.title : 'New Civora Conversation';

  // Compute next demo user query for sequential audio transcription queue using independent audioCount
  const audioStepIndex = Math.min(1 + audioCount, DEMO_STEPS.length - 1);
  const nextDemoStepObj = DEMO_STEPS[audioStepIndex] || DEMO_STEPS[1];
  const nextDemoUserQuery = currentLanguage === 'ta' ? nextDemoStepObj.userQueryTa : nextDemoStepObj.userQueryEn;

  return (
    <div className={`civora-app-root ${isKioskMode ? 'kiosk-mode-active' : ''}`}>
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        isKioskMode={isKioskMode}
        onToggleKioskMode={() => setIsKioskMode(!isKioskMode)}
        activeView={activeView}
        currentTitle={currentTitle}
        onTitleChange={(newTitle) => {
          if (activeSessionId) {
            setChatSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, title: newTitle } : s));
          }
        }}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        unreadNotificationsCount={2}
      />

      {/* Main Layout Area */}
      <div className="civora-layout-body">
        {/* Sidebar */}
        {!isKioskMode && (
          <Sidebar
            activeView={activeView}
            onSelectView={setActiveView}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            chatSessions={chatSessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            currentLanguage={currentLanguage}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isKioskMode={isKioskMode}
            onToggleKioskMode={() => setIsKioskMode(!isKioskMode)}
          />
        )}

        {/* View Switcher Container */}
        <main className="civora-view-container">
          {activeView === 'home' && (
            <HomeScreen
              currentLanguage={currentLanguage}
              onSendMessage={handleSendMessage}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onQuickAction={handleQuickAction}
              onLanguageChange={setCurrentLanguage}
              externalInputText={pendingInputText}
            />
          )}

          {activeView === 'chat' && (
            <ChatWorkspace
              messages={activeSession ? activeSession.messages : []}
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              onSendMessage={handleSendMessage}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              isGenerating={isGenerating}
              onSelectNextAction={handleSelectNextAction}
              isLowConfidenceDemo={isLowConfidenceDemo}
              onToggleLowConfidenceDemo={() => setIsLowConfidenceDemo(!isLowConfidenceDemo)}
              externalInputText={pendingInputText}
            />
          )}

          {activeView === 'schemes' && (
            <SchemesDirectory
              currentLanguage={currentLanguage}
              onAskAboutScheme={(schemeTitle) => handleSendMessage(`Explain the benefits and required documents for ${schemeTitle}`)}
            />
          )}

          {activeView === 'laws' && (
            <LawsLibrary
              currentLanguage={currentLanguage}
              onAskAboutLaw={(lawTitle, section) => handleSendMessage(`Explain ${section ? section + ' of ' : ''}${lawTitle} in simple terms`)}
            />
          )}

          {activeView === 'grievance' && (
            <GrievanceWizard
              currentLanguage={currentLanguage}
              onFinishGrievance={() => handleSendMessage(`I have generated a grievance draft. How do I proceed?`)}
              onAskCivoraAboutGrievance={(text) => handleSendMessage(text)}
            />
          )}

          {activeView === 'documents' && (
            <DocumentAnalyzer
              currentLanguage={currentLanguage}
              onAskCivoraAboutDoc={(text) => handleSendMessage(text)}
            />
          )}
        </main>
      </div>

      {/* Kiosk Mode Overlay */}
      {isKioskMode && (
        <KioskUI
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          onSelectAction={(act) => {
            if (act === 'voice') setIsVoiceModalOpen(true);
            else if (act === 'schemes') { setActiveView('schemes'); setIsKioskMode(false); }
            else if (act === 'laws') { setActiveView('laws'); setIsKioskMode(false); }
            else if (act === 'grievance') { setActiveView('grievance'); setIsKioskMode(false); }
            else if (act === 'documents') { setActiveView('documents'); setIsKioskMode(false); }
            else if (act === 'pacs') { handleSendMessage('What credit services are offered by PACS?'); setIsKioskMode(false); }
          }}
          onExitKiosk={() => setIsKioskMode(false)}
        />
      )}

      {/* Modals */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLanguage={currentLanguage}
        nextDemoUserQuery={nextDemoUserQuery}
        onVoiceInputCaptured={(transcript) => {
          setPendingInputText(transcript);
          setAudioCount(prev => prev + 1);
          setIsVoiceModalOpen(false);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isLowConfidenceDemo={isLowConfidenceDemo}
        onToggleLowConfidenceDemo={() => setIsLowConfidenceDemo(!isLowConfidenceDemo)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <style>{`
        .civora-app-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: var(--bg);
        }

        .civora-layout-body {
          flex: 1;
          display: flex;
          height: calc(100vh - 60px);
          overflow: hidden;
        }

        .civora-view-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default App;
