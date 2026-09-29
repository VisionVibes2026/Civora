import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Language } from '../types';
import { DEMO_STEPS } from '../constants/demoSequence';
import { 
  Plus,
  Paperclip, 
  Mic, 
  ArrowUp, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  ShieldAlert
} from 'lucide-react';

interface ChatWorkspaceProps {
  messages: ChatMessage[];
  currentLanguage: Language;
  onLanguageChange?: (lang: Language) => void;
  onSendMessage: (text: string, attachedFile?: File) => void;
  onOpenVoiceModal: () => void;
  isGenerating: boolean;
  onSelectNextAction: (actionType: string, payload?: string) => void;
  isLowConfidenceDemo: boolean;
  onToggleLowConfidenceDemo: () => void;
  externalInputText?: string;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  currentLanguage,
  onLanguageChange,
  onSendMessage,
  onOpenVoiceModal,
  isGenerating,
  onSelectNextAction,
  isLowConfidenceDemo,
  onToggleLowConfidenceDemo,
  externalInputText,
}) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Global Chat Language State
  const [globalChatLang, setGlobalChatLang] = useState<Language>(currentLanguage);

  useEffect(() => {
    setGlobalChatLang(currentLanguage);
  }, [currentLanguage]);

  const handleSwitchGlobalLang = (targetLang: Language) => {
    setGlobalChatLang(targetLang);
    if (onLanguageChange) {
      onLanguageChange(targetLang);
    }
  };

  useEffect(() => {
    if (externalInputText) {
      setInputText(externalInputText);
    }
  }, [externalInputText]);

  // Dynamically expand textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(28, scrollH), 200)}px`;
    }
  }, [inputText]);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [expandedEvidenceIds, setExpandedEvidenceIds] = useState<Record<string, boolean>>({});
  const [audioMenuOpenId, setAudioMenuOpenId] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<string>("Understanding...");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Animate progressive document processing or query verification sequence
  useEffect(() => {
    if (isGenerating) {
      const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
      const isDocUpload = lastUserMsg && (lastUserMsg.attachedDocName || lastUserMsg.text.toLowerCase().includes('document') || lastUserMsg.text.toLowerCase().includes('uploaded'));

      if (isDocUpload) {
        setProcessingStage("Analyzing document…");
        const t1 = setTimeout(() => setProcessingStage("✓ Document received"), 500);
        const t2 = setTimeout(() => setProcessingStage("✓ OCR extracting text"), 1000);
        const t3 = setTimeout(() => setProcessingStage("✓ Identifying crop and location"), 1500);
        const t4 = setTimeout(() => setProcessingStage("✓ Detecting loan and insurance details"), 2000);
        const t5 = setTimeout(() => setProcessingStage("✓ Cross-checking relevant crop-insurance information"), 2500);
        const t6 = setTimeout(() => setProcessingStage("✓ Evidence matched"), 3000);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
          clearTimeout(t4);
          clearTimeout(t5);
          clearTimeout(t6);
        };
      } else {
        setProcessingStage("Understanding...");
        const timer1 = setTimeout(() => setProcessingStage("Checking official sources..."), 650);
        const timer2 = setTimeout(() => setProcessingStage("Verifying information..."), 1300);
        const timer3 = setTimeout(() => setProcessingStage("Preparing response..."), 1900);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }
    }
  }, [isGenerating, messages]);

  // Helper to render inline markdown links [text](url) cleanly
  const renderFormattedText = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="civora-inline-link"
        >
          {label}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

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

  const toggleEvidenceExpand = (msgId: string) => {
    setExpandedEvidenceIds(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Helper to translate response text for audio playback without altering visible UI text
  const translateTextForAudio = (text: string, targetLang: 'en' | 'ta'): string => {
    const isTamilSource = /[\u0B80-\u0BFF]/.test(text);

    // If source script matches target language, return text as is
    if ((targetLang === 'ta' && isTamilSource) || (targetLang === 'en' && !isTamilSource)) {
      return text;
    }

    // 1. Check exact step match from DEMO_STEPS
    for (const step of DEMO_STEPS) {
      if (
        text.trim() === step.civoraResponseEn.trim() ||
        (text.length > 20 && step.civoraResponseEn.includes(text.substring(0, 25)))
      ) {
        return targetLang === 'ta' ? step.civoraResponseTa : step.civoraResponseEn;
      }
      if (
        text.trim() === step.civoraResponseTa.trim() ||
        (text.length > 20 && step.civoraResponseTa.includes(text.substring(0, 25)))
      ) {
        return targetLang === 'ta' ? step.civoraResponseTa : step.civoraResponseEn;
      }
    }

    // 2. Check full Document Analysis response match
    if (text.includes("Extracted details") || text.includes("I've analyzed your uploaded document")) {
      if (targetLang === 'ta') {
        return `உங்கள் பதிவேற்றப்பட்ட ஆவணத்தைப் பகுப்பாய்வு செய்து, உங்கள் உரையாடலிலிருந்து பொருத்தமான விவரங்களைப் பொருத்தியுள்ளேன்.

பிரித்தெடுக்கப்பட்ட விவரங்கள்
பயிர்: நெல்
இடம்: நாகப்பட்டினம், தமிழ்நாடு
அறிவிக்கப்பட்ட காரணம்: கனமழை
கடன்: PACS மூலம் விவசாயக் கடன்
காப்பீடு: பதிவேற்றப்பட்ட ஆவணத்திலிருந்து கண்டறியப்பட்டது
சம்பவம்: பயிர் சேதம் அறிக்கையிடப்பட்டது

சரிபார்ப்பு
காப்பீட்டுச் சூழல்: தகுதியுள்ள பயிர் இழப்புகளுக்கு PMFBY பயிர் காப்பீட்டு பாதுகாப்பை வழங்குகிறது. அதிகாரப்பூர்வ PMFBY தளம் கொள்கை/விண்ணப்ப நிலை மற்றும் பயிர் காப்பீட்டுத் தகவலை வழங்குகிறது. அதிகாரப்பூர்வ PMFBY தளம்

ஆதாரங்கள்
• PMFBY — வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம், இந்திய அரசு
• PMFBY செயல்பாட்டு வழிகாட்டுதல்கள்
• தேசிய பயிர் காப்பீட்டு தளம்`;
      }
    }

    if (text.includes("பிரித்தெடுக்கப்பட்ட விவரங்கள்") || text.includes("உங்கள் பதிவேற்றப்பட்ட ஆவணத்தைப்")) {
      if (targetLang === 'en') {
        return `I've analyzed your uploaded document and matched the relevant details from your conversation.

Extracted details
Crop: Paddy
Location: Nagapattinam, Tamil Nadu
Cause reported: Heavy rain
Loan: Agricultural loan through PACS
Insurance: Identified from uploaded document
Incident: Crop damage reported

Verification
Insurance context: PMFBY provides crop-insurance coverage for eligible crop losses caused by specified natural calamities and other covered risks. The official PMFBY portal provides policy/application-status and crop-insurance information. Official PMFBY Portal

Sources
• PMFBY — Ministry of Agriculture & Farmers Welfare, Government of India
• PMFBY Operational Guidelines
• National Crop Insurance Portal`;
      }
    }

    // 3. Fallback phrase replacements for custom or dynamic text
    let translated = text;
    if (targetLang === 'ta') {
      const EN_TO_TA: [RegExp, string][] = [
        [/Crop:\s*Paddy/gi, "பயிர்: நெல்"],
        [/Location:\s*Nagapattinam,\s*Tamil Nadu/gi, "இடம்: நாகப்பட்டினம், தமிழ்நாடு"],
        [/Cause reported:\s*Heavy rain/gi, "அறிவிக்கப்பட்ட காரணம்: கனமழை"],
        [/Loan:\s*Agricultural loan through PACS/gi, "கடன்: PACS மூலம் விவசாயக் கடன்"],
        [/Insurance:\s*Identified from uploaded document/gi, "காப்பீடு: பதிவேற்றப்பட்ட ஆவணத்திலிருந்து கண்டறியப்பட்டது"],
        [/Incident:\s*Crop damage reported/gi, "சம்பவம்: பயிர் சேதம் அறிக்கையிடப்பட்டது"],
        [/Extracted details/gi, "பிரித்தெடுக்கப்பட்ட விவரங்கள்"],
        [/Verification/gi, "சரிபார்ப்பு"],
        [/Sources/gi, "ஆதாரங்கள்"]
      ];
      for (const [pattern, rep] of EN_TO_TA) {
        translated = translated.replace(pattern, rep);
      }
    } else {
      const TA_TO_EN: [RegExp, string][] = [
        [/பயிர்:\s*நெல்/gi, "Crop: Paddy"],
        [/இடம்:\s*நாகப்பட்டினம்,\s*தமிழ்நாடு/gi, "Location: Nagapattinam, Tamil Nadu"],
        [/அறிவிக்கப்பட்ட காரணம்:\s*கனமழை/gi, "Cause reported: Heavy rain"],
        [/கடன்:\s*PACS மூலம் விவசாயக் கடன்/gi, "Loan: Agricultural loan through PACS"],
        [/காப்பீடு:\s*பதிவேற்றப்பட்ட ஆவணத்திலிருந்து கண்டறியப்பட்டது/gi, "Insurance: Identified from uploaded document"],
        [/சம்பவம்:\s*பயிர் சேதம் அறிக்கையிடப்பட்டது/gi, "Incident: Crop damage reported"],
        [/பிரித்தெடுக்கப்பட்ட விவரங்கள்/gi, "Extracted details"],
        [/சரிபார்ப்பு/gi, "Verification"],
        [/ஆதாரங்கள்/gi, "Sources"]
      ];
      for (const [pattern, rep] of TA_TO_EN) {
        translated = translated.replace(pattern, rep);
      }
    }

    return translated;
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Response 1 exact texts
  const RESPONSE_1_EN = "I can help you check your crop-insurance details. Please upload your loan or insurance document so I can identify the crop, insurance and policy information.";
  const RESPONSE_1_TA = "உங்கள் பயிர் காப்பீட்டு விவரங்களைச் சரிபார்க்க நான் உதவுகிறேன். நீங்கள் எடுத்துள்ள கடன் அல்லது காப்பீட்டு ஆவணத்தைப் பதிவேற்றவும். அதிலிருந்து பயிர், காப்பீடு மற்றும் பாலிசி தொடர்பான தகவல்களை நான் கண்டறிந்து தருகிறேன்.";

  // Response 2 exact texts
  const RESPONSE_2_EN = "Sure. Upload the document and I'll check the relevant crop, loan and insurance details.";
  const RESPONSE_2_TA = "நிச்சயமாக. ஆவணத்தைப் பதிவேற்றவும், பயிர், கடன் மற்றும் காப்பீட்டு விவரங்களைச் சரிபார்க்கிறேன்.";

  // Response 4 exact texts (Response 3 skipped by user request)
  const RESPONSE_4_EN = "If your loss falls under the applicable coverage, the loss should be reported within the required time period. For PMFBY-related support, I can show you the official reporting channel and help you prepare the information you need.";
  const RESPONSE_4_TA = "உங்கள் சேதம் காப்பீட்டின் கீழ் வந்தால், குறிப்பிட்ட காலத்திற்குள் சேதத்தைப் பதிவு செய்ய வேண்டும். PMFBY தொடர்பான உதவிக்கு, அதிகாரப்பூர்வ தகவல் தொடர்பு வழியைக் காட்டி தேவையான விவரங்களை ஆயத்தப்படுத்த உதவுகிறேன்.";

  const getDisplayedTextForMessage = (msg: ChatMessage, forcedLang?: Language): string => {
    // User messages are never translated
    if (msg.sender === 'user') return msg.text;

    const activeLang = forcedLang || globalChatLang;

    // 1. Check if explicit stored texts exist on the message
    if (activeLang === 'ta' && msg.tamilText) {
      return msg.tamilText;
    }
    if ((activeLang === 'en' || !activeLang) && msg.originalEnglishText) {
      return msg.originalEnglishText;
    }

    // 2. Response 1 matching
    if (
      msg.demoStepIndex === 1 ||
      msg.text.trim() === RESPONSE_1_EN.trim() ||
      msg.text.trim() === RESPONSE_1_TA.trim() ||
      msg.text.includes("I can help you check your crop-insurance details") ||
      msg.text.includes("உங்கள் பயிர் காப்பீட்டு விவரங்களைச்")
    ) {
      return activeLang === 'ta' ? RESPONSE_1_TA : RESPONSE_1_EN;
    }

    // 3. Response 2 matching
    if (
      msg.demoStepIndex === 2 ||
      msg.text.trim() === RESPONSE_2_EN.trim() ||
      msg.text.trim() === RESPONSE_2_TA.trim() ||
      msg.text.includes("Upload the document and I'll check") ||
      msg.text.includes("ஆவணத்தைப் பதிவேற்றவும்")
    ) {
      return activeLang === 'ta' ? RESPONSE_2_TA : RESPONSE_2_EN;
    }

    // 4. Response 4 matching
    if (
      msg.demoStepIndex === 4 ||
      msg.text.trim() === RESPONSE_4_EN.trim() ||
      msg.text.trim() === RESPONSE_4_TA.trim() ||
      msg.text.includes("If your loss falls under the applicable coverage") ||
      msg.text.includes("உங்கள் சேதம் காப்பீட்டின் கீழ் வந்தால்")
    ) {
      return activeLang === 'ta' ? RESPONSE_4_TA : RESPONSE_4_EN;
    }

    // 5. Check DEMO_STEPS by index
    if (msg.demoStepIndex !== undefined && DEMO_STEPS[msg.demoStepIndex]) {
      return activeLang === 'ta' ? DEMO_STEPS[msg.demoStepIndex].civoraResponseTa : DEMO_STEPS[msg.demoStepIndex].civoraResponseEn;
    }

    // 6. General translation fallback
    return translateTextForAudio(msg.originalEnglishText || msg.text, activeLang as 'en' | 'ta');
  };

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Response-specific pre-recorded Tamil audio file mappings (HTML5 Audio API)
  const TAMIL_AUDIO_MAPPINGS: Record<number, string> = {
    1: '/audio/tamil/response-1-ta.m4a',
    2: '/audio/tamil/response-2-ta.m4a',
    4: '/audio/tamil/response-4-ta.m4a',
    // Response 3 skipped by user request
  };

  const getPreRecordedTamilAudioUrl = (msgObj?: ChatMessage): string | null => {
    if (!msgObj) return null;

    // 1. Check by explicit demoStepIndex
    if (msgObj.demoStepIndex !== undefined && TAMIL_AUDIO_MAPPINGS[msgObj.demoStepIndex]) {
      return TAMIL_AUDIO_MAPPINGS[msgObj.demoStepIndex];
    }

    // 2. Check by Response 1 text content matching
    if (
      msgObj.text.trim() === RESPONSE_1_EN.trim() ||
      msgObj.text.trim() === RESPONSE_1_TA.trim() ||
      msgObj.text.includes("I can help you check your crop-insurance details") ||
      msgObj.text.includes("உங்கள் பயிர் காப்பீட்டு விவரங்களைச்")
    ) {
      return TAMIL_AUDIO_MAPPINGS[1];
    }

    // 3. Check by Response 2 text content matching
    if (
      msgObj.text.trim() === RESPONSE_2_EN.trim() ||
      msgObj.text.trim() === RESPONSE_2_TA.trim() ||
      msgObj.text.includes("Upload the document and I'll check") ||
      msgObj.text.includes("ஆவணத்தைப் பதிவேற்றவும்")
    ) {
      return TAMIL_AUDIO_MAPPINGS[2];
    }

    // 4. Check by Response 4 text content matching
    if (
      msgObj.text.trim() === RESPONSE_4_EN.trim() ||
      msgObj.text.trim() === RESPONSE_4_TA.trim() ||
      msgObj.text.includes("If your loss falls under the applicable coverage") ||
      msgObj.text.includes("உங்கள் சேதம் காப்பீட்டின் கீழ் வந்தால்")
    ) {
      return TAMIL_AUDIO_MAPPINGS[4];
    }

    return null;
  };

  const speakTextInLang = (textToSpeak: string, msgId: string, forcedLang?: 'en' | 'ta', msgObj?: ChatMessage) => {
    // 1. If currently speaking for this msgId -> toggle Stop / Pause
    if (speakingMessageId === msgId) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      setSpeakingMessageId(null);
      setAudioMenuOpenId(null);
      return;
    }

    // Stop any ongoing speech or HTML5 audio playback across all messages
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }

    // Automatically detect language if not forced
    const isTamilScript = /[\u0B80-\u0BFF]/.test(textToSpeak);
    const targetLang: 'ta' | 'en' = forcedLang || (isTamilScript ? 'ta' : 'en');

    // 2. Check for pre-recorded Tamil audio file mapping (HTML5 Audio API)
    if (targetLang === 'ta') {
      const preRecordedAudioUrl = getPreRecordedTamilAudioUrl(msgObj);
      if (preRecordedAudioUrl) {
        const audio = new Audio(preRecordedAudioUrl);
        audioElementRef.current = audio;

        audio.onended = () => {
          setSpeakingMessageId(null);
          audioElementRef.current = null;
        };

        audio.onerror = () => {
          setSpeakingMessageId(null);
          audioElementRef.current = null;
        };

        setSpeakingMessageId(msgId);
        setAudioMenuOpenId(null);
        audio.currentTime = 0;
        audio.play().catch(() => {
          setSpeakingMessageId(null);
          audioElementRef.current = null;
        });
        return;
      }
    }

    // 3. Fallback to Web Speech API TTS if no pre-recorded audio file exists
    if (!('speechSynthesis' in window)) return;

    // Clean raw markdown link brackets [Label](url) -> Label so exact visible words are read naturally
    const cleanSpeechText = textToSpeak.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Insert natural speech pauses for line breaks and bullet points for rural/elderly accessibility
    const punctuatedText = cleanSpeechText
      .replace(/\n+/g, '. ')
      .replace(/•/g, ', ');

    const utterance = new SpeechSynthesisUtterance(punctuatedText);

    // Moderate speaking rate (0.88) and natural pitch for rural and elderly accessibility
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.lang = targetLang === 'ta' ? 'ta-IN' : 'en-IN';

    // Pick highest quality native voice from Web Speech API
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (targetLang === 'ta') {
        // Native Tamil voice matching
        const nativeTaVoice = voices.find(v => 
          v.lang.toLowerCase().includes('ta') || 
          v.name.toLowerCase().includes('tamil') ||
          v.name.toLowerCase().includes('தமிழ்') ||
          v.name.toLowerCase().includes('valluvar') ||
          v.name.toLowerCase().includes('kaniya')
        );
        if (nativeTaVoice) utterance.voice = nativeTaVoice;
      } else {
        // Native Indian English or clear English voice matching
        const nativeEnVoice = voices.find(v => 
          v.lang.toLowerCase().includes('en-in') || 
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('heera') ||
          v.name.toLowerCase().includes('prabhat')
        ) || voices.find(v => v.lang.toLowerCase().startsWith('en'));
        if (nativeEnVoice) utterance.voice = nativeEnVoice;
      }
    }

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    setAudioMenuOpenId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="civora-chat-workspace">
      {/* Main Single-Column Conversational Area */}
      <div className="chat-thread-container">
        {/* Subtle Trust Bar */}
        <div className="demo-banner">
          <div className="trust-indicator-left">
            <ShieldCheck size={14} className="text-success" />
            <span>RAG Grounded Verification Engine</span>
          </div>
          <div className="trust-indicator-right">
            <span>Confidence Mode:</span>
            <button
              onClick={onToggleLowConfidenceDemo}
              className={`demo-toggle-chip ${isLowConfidenceDemo ? 'active' : ''}`}
            >
              {isLowConfidenceDemo ? 'Low Confidence (Simulated)' : 'High Verification (Verified)'}
            </button>
          </div>
        </div>

        <div className="messages-scroll-area">
          <div className="messages-inner-max">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              if (isUser) {
                return (
                  <div key={msg.id} className="message-row user-row">
                    <div className="user-message-bubble">
                      <p>{msg.text}</p>
                      {msg.attachedDocName && (
                        <div className="msg-attachment-badge">
                          <Paperclip size={12} />
                          <span>{msg.attachedDocName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Assistant message (ChatGPT style: left aligned, transparent background)
              const isSpeaking = speakingMessageId === msg.id;
              const isEvidenceExpanded = expandedEvidenceIds[msg.id] ?? false;

              const displayedText = getDisplayedTextForMessage(msg);

              return (
                <div key={msg.id} className="message-row assistant-row">
                  <div className="assistant-avatar">
                    <img src="/logo.png" alt="Civora AI" className="bot-logo" />
                  </div>

                  <div className="assistant-message-content">
                    {/* Low Confidence Message Alert (when low confidence demo is active) */}
                    {(isLowConfidenceDemo || msg.isLowConfidence) ? (
                      <div className="low-confidence-msg-card">
                        <div className="low-conf-header">
                          <ShieldAlert size={16} className="text-warning" />
                          <p className="low-conf-text">
                            I couldn't verify this information confidently from the available sources.
                          </p>
                        </div>
                        <div className="low-conf-actions">
                          <button 
                            onClick={() => onSelectNextAction('laws')}
                            className="low-conf-btn"
                          >
                            <span>View Sources</span>
                          </button>
                          <button 
                            onClick={() => onSelectNextAction('grievance')}
                            className="low-conf-btn primary"
                          >
                            <span>Request Review</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Direct Answer / Assistant Message Text */}
                        <div className="assistant-text-body">
                          <div className="main-reply-text">{renderFormattedText(displayedText)}</div>
                        </div>
                      </>
                    )}

                    {/* Render Evidence and Toolbar for all AI responses */}
                    <>
                      {/* Expandable Evidence UI ("Why this answer?") */}
                      <div className="evidence-expandable-section">
                        <button
                          onClick={() => toggleEvidenceExpand(msg.id)}
                          className="evidence-toggle-btn"
                        >
                          <ShieldCheck size={14} className="evidence-icon" />
                          <span>Why this answer?</span>
                          <span className="verified-pill-small">✓ Verified source</span>
                          {isEvidenceExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>

                        {isEvidenceExpanded && (
                          <div className="evidence-expanded-card">
                            <div className="evidence-bucket document-bucket">
                              <div className="bucket-header">
                                <FileCheck2 size={14} className="bucket-icon text-primary" />
                                <span>Extracted from Uploaded Document</span>
                              </div>
                              <div className="bucket-fields">
                                <div className="evidence-field-row">
                                  <span className="field-label">Crop & Location:</span>
                                  <span className="field-val">Paddy — Nagapattinam, Tamil Nadu</span>
                                </div>
                                <div className="evidence-field-row">
                                  <span className="field-label">Loan Facility:</span>
                                  <span className="field-val">PACS Agricultural Loan</span>
                                </div>
                                <div className="evidence-field-row">
                                  <span className="field-label">Insurance Reference:</span>
                                  <span className="field-val">Identified in uploaded document</span>
                                </div>
                                <div className="doc-disclaimer-note">
                                  ⚠️ <em>Identified in document — does NOT confirm active policy enrollment until verified on PMFBY Portal.</em>
                                </div>
                              </div>
                            </div>

                            <div className="evidence-bucket official-bucket">
                              <div className="bucket-header">
                                <ShieldCheck size={14} className="bucket-icon text-success" />
                                <span>Matched with Official PMFBY Sources</span>
                              </div>
                              <div className="bucket-fields">
                                <div className="evidence-field-row">
                                  <span className="field-label">Scheme & Authority:</span>
                                  <span className="field-val">Pradhan Mantri Fasal Bima Yojana (MoA&FW)</span>
                                </div>
                                <div className="evidence-field-row">
                                  <span className="field-label">Coverage Provision:</span>
                                  <span className="field-val">Clause 6.3 — Localized Calamities & Inundation</span>
                                </div>
                                <div className="evidence-field-row">
                                  <span className="field-label">Official Verification Portal:</span>
                                  <span className="field-val">
                                    <a href="https://pmfby.gov.in/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="civora-inline-link">
                                      pmfby.gov.in
                                    </a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Toolbar Actions: Copy, Voice narration */}
                      <div className="msg-action-toolbar">
                        <div className="audio-menu-wrapper">
                          <button
                            onClick={() => {
                              if (isSpeaking) {
                                speakTextInLang(displayedText, msg.id, undefined, msg);
                              } else {
                                setAudioMenuOpenId(audioMenuOpenId === msg.id ? null : msg.id);
                              }
                            }}
                            className={`msg-tool-btn ${isSpeaking ? 'speaking' : ''}`}
                            title="Select audio playback language"
                          >
                            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            <span>{isSpeaking ? "Stop" : "Listen"}</span>
                            <ChevronDown size={12} className="chevron-icon" />
                          </button>

                          {/* Audio Language Selection Menu */}
                          {audioMenuOpenId === msg.id && (
                            <div className="audio-lang-popover">
                              <button
                                onClick={() => {
                                  handleSwitchGlobalLang('en');
                                  const textToSpeak = getDisplayedTextForMessage(msg, 'en');
                                  speakTextInLang(textToSpeak, msg.id, 'en', msg);
                                }}
                                className="audio-lang-opt"
                              >
                                <Volume2 size={13} />
                                <span>English</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleSwitchGlobalLang('ta');
                                  const textToSpeak = getDisplayedTextForMessage(msg, 'ta');
                                  speakTextInLang(textToSpeak, msg.id, 'ta', msg);
                                }}
                                className="audio-lang-opt"
                              >
                                <Volume2 size={13} />
                                <span>தமிழ்</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => copyToClipboard(displayedText, msg.id)}
                          className="msg-tool-btn"
                          title="Copy response"
                        >
                          {copiedMessageId === msg.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                          <span>{copiedMessageId === msg.id ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator with 2.5s Animated AI Processing States */}
            {isGenerating && (
              <div className="message-row assistant-row">
                <div className="assistant-avatar">
                  <img src="/logo.png" alt="Civora AI" className="bot-logo" />
                </div>
                <div className="typing-indicator-box">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <span className="typing-text">{processingStage}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ChatGPT Style Bottom Input Bar (850px width, #2F2F2F background, #444444 border, 18px radius) */}
        <div className="chat-input-wrapper">
          <div className="chat-input-box">
            {attachedFile && (
              <div className="attached-file-chip">
                <Paperclip size={13} />
                <span>{attachedFile.name}</span>
                <button onClick={() => setAttachedFile(null)} className="remove-file-btn">×</button>
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
                  onClick={() => onSelectNextAction('schemes')}
                  className="control-icon-btn"
                  title="More options"
                >
                  <Plus size={18} />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="control-icon-btn"
                  title="Upload document"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      onSendMessage(inputText.trim(), file);
                      setInputText('');
                      setAttachedFile(null);
                    }
                  }}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />

                <button
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
            <span>Verified & PII Protected • Civora AI Assistant</span>
          </div>
        </div>
      </div>

      <style>{`
        .civora-chat-workspace {
          flex: 1;
          display: flex;
          height: calc(100vh - 56px);
          overflow: hidden;
          background-color: #171717;
        }

        .chat-thread-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .demo-banner {
          background-color: #202123;
          border-bottom: 1px solid #2F2F2F;
          padding: 8px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #A7A7A7;
        }

        .trust-indicator-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .trust-indicator-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .demo-toggle-chip {
          padding: 2px 10px;
          border-radius: var(--radius-full);
          border: 1px solid #3A3A3A;
          background-color: #212121;
          font-size: 0.75rem;
          font-weight: 500;
          color: #A7A7A7;
          transition: all 150ms ease;
        }

        .demo-toggle-chip.active {
          background-color: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border-color: rgba(245, 158, 11, 0.4);
        }

        .messages-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .messages-inner-max {
          width: 100%;
          max-width: 850px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .message-row {
          display: flex;
          gap: 16px;
          width: 100%;
        }

        .user-row {
          justify-content: flex-end;
        }

        .user-message-bubble {
          max-width: 75%;
          background-color: #2F2F2F;
          color: #F5F5F5;
          padding: 12px 18px;
          border-radius: 14px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .msg-attachment-badge {
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: rgba(255, 255, 255, 0.1);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: #A7A7A7;
        }

        .assistant-row {
          align-items: flex-start;
        }

        .assistant-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .bot-logo {
          height: 26px;
          width: auto;
          max-width: 32px;
          object-fit: contain;
          border-radius: 4px;
        }

        .assistant-message-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          color: #E5E5E5;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .main-reply-text {
          white-space: pre-wrap;
          word-break: break-word;
        }

        .doc-analyzed-card {
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          max-width: 480px;
        }

        .doc-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .doc-card-icon {
          color: #22C55E;
        }

        .doc-card-title {
          font-weight: 600;
          font-size: 0.88rem;
          color: #F5F5F5;
          flex: 1;
        }

        .doc-status-badge {
          background-color: rgba(34, 197, 94, 0.15);
          color: #22C55E;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .doc-details-list {
          list-style: none;
          padding-left: 0;
          font-size: 0.82rem;
          color: #A7A7A7;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .low-confidence-msg-card {
          background-color: #212121;
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .low-conf-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .low-conf-text {
          font-size: 0.9rem;
          color: #F59E0B;
        }

        .low-conf-actions {
          display: flex;
          gap: 8px;
        }

        .low-conf-btn {
          background-color: #2F2F2F;
          border: 1px solid #3A3A3A;
          color: #F5F5F5;
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 500;
        }

        .low-conf-btn.primary {
          background-color: var(--primary);
          border-color: var(--primary);
          color: #ffffff;
        }

        .official-support-card {
          background-color: #212121;
          border: 1px solid rgba(15, 118, 110, 0.4);
          border-radius: 12px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 6px;
          max-width: 520px;
        }

        .support-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .support-card-title {
          font-weight: 600;
          font-size: 0.9rem;
          color: #F5F5F5;
        }

        .support-badge {
          background-color: rgba(15, 118, 110, 0.15);
          color: #0F766E;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(15, 118, 110, 0.3);
        }

        .support-details-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .support-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .support-label {
          color: #A7A7A7;
        }

        .support-value {
          color: #F5F5F5;
          font-weight: 500;
        }

        .helpline-number-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #22C55E;
          color: #171717;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          text-decoration: none;
          transition: transform 150ms ease;
        }

        .helpline-number-btn:hover {
          transform: scale(1.03);
        }

        .summary-report-card {
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 6px;
          max-width: 560px;
        }

        .summary-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #2F2F2F;
          padding-bottom: 8px;
        }

        .summary-title {
          font-weight: 600;
          font-size: 0.92rem;
          color: #F5F5F5;
        }

        .demo-data-tag {
          background-color: rgba(249, 115, 22, 0.15);
          color: #F97316;
          border: 1px solid rgba(249, 115, 22, 0.4);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          letter-spacing: 0.05em;
        }

        .summary-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.85rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .s-label {
          color: #737373;
        }

        .s-val {
          color: #F5F5F5;
          font-weight: 500;
        }

        .s-val.success {
          color: #22C55E;
          font-weight: 600;
        }

        .main-reply-text {
          color: #E5E5E5;
        }

        .direct-answer {
          font-weight: 600;
          color: #F5F5F5;
        }

        .explanation {
          color: #A7A7A7;
        }

        .important-bullets {
          list-style: none;
          padding-left: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 4px;
        }

        .important-bullets li {
          color: #E5E5E5;
        }

        .verified-answer-card {
          background-color: #212121;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 6px;
        }

        .verified-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .verified-badge-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #22C55E;
        }

        .verified-source-name {
          font-size: 0.75rem;
          color: #737373;
        }

        .verified-content-text {
          font-size: 0.9rem;
          color: #F5F5F5;
          line-height: 1.5;
        }

        .verified-card-actions {
          display: flex;
          gap: 10px;
          padding-top: 4px;
        }

        .verified-action-link {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: #2F2F2F;
          border: 1px solid #3A3A3A;
          color: #F5F5F5;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 500;
          transition: background-color 150ms ease;
        }

        .verified-action-link:hover {
          background-color: #3A3A3A;
        }

        .next-actions-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 6px;
        }

        .next-actions-label {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #737373;
        }

        .next-action-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .next-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          color: #F5F5F5;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 500;
          transition: all 150ms ease;
        }

        .next-action-btn:hover {
          border-color: var(--primary);
          background-color: #2A2A2A;
        }

        .evidence-expandable-section {
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .evidence-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: transparent;
          border: 1px solid #3A3A3A;
          color: #A7A7A7;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          transition: all 150ms ease;
        }

        .evidence-toggle-btn:hover {
          background-color: #212121;
          color: #F5F5F5;
          border-color: #555555;
        }

        .evidence-icon {
          color: #22C55E;
        }

        .verified-pill-small {
          color: #22C55E;
          font-weight: 500;
          margin-right: 2px;
        }

        .evidence-expanded-card {
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.8rem;
          width: 100%;
          max-width: 580px;
        }

        .evidence-bucket {
          background-color: #282828;
          border: 1px solid #3A3A3A;
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bucket-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: #F5F5F5;
          font-size: 0.82rem;
          border-bottom: 1px solid #333333;
          padding-bottom: 6px;
        }

        .bucket-fields {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .doc-disclaimer-note {
          font-size: 0.76rem;
          color: #F59E0B;
          padding-top: 4px;
          line-height: 1.45;
        }

        .civora-inline-link {
          color: #0F766E;
          text-decoration: underline;
          font-weight: 500;
          transition: color 150ms ease;
        }

        .civora-inline-link:hover {
          color: #14B8A6;
        }

        .evidence-field-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .field-label {
          color: #737373;
          font-weight: 500;
        }

        .field-val {
          color: #F5F5F5;
          font-weight: 500;
          text-align: right;
        }

        .msg-action-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 4px;
        }

        .audio-menu-wrapper {
          position: relative;
          display: inline-block;
        }

        .audio-lang-popover {
          position: absolute;
          bottom: 100%;
          left: 0;
          margin-bottom: 6px;
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 8px;
          padding: 4px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          z-index: 50;
          min-width: 100px;
        }

        .audio-lang-opt {
          background-color: transparent;
          border: none;
          color: #A7A7A7;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 120ms ease;
          width: 100%;
        }

        .audio-lang-opt:hover {
          background-color: #2F2F2F;
          color: #F5F5F5;
        }

        .msg-tool-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #737373;
          font-size: 0.78rem;
          padding: 3px 6px;
          border-radius: var(--radius-sm);
          transition: color 150ms ease;
        }

        .msg-tool-btn:hover {
          color: #F5F5F5;
        }

        .msg-tool-btn.speaking {
          color: #F97316;
        }

        .typing-indicator-box {
          background-color: #212121;
          border: 1px solid #3A3A3A;
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .typing-text {
          font-size: 0.85rem;
          color: #737373;
          font-style: italic;
        }

        .chat-input-wrapper {
          width: 100%;
          padding: 12px 16px 16px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background-color: #171717;
        }

        .chat-input-box {
          width: 100%;
          max-width: 850px;
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

        .chat-textarea {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.95rem;
          color: #F5F5F5;
          resize: none;
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
      `}</style>
    </div>
  );
};
