import type { Language } from '../types';

export interface TranslationSet {
  languageName: string;
  nativeName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  inputPlaceholder: string;
  quickActions: {
    scheme: string;
    laws: string;
    docs: string;
    grievance: string;
  };
  nav: {
    newChat: string;
    chat: string;
    schemes: string;
    laws: string;
    grievance: string;
    documents: string;
    help: string;
    settings: string;
    kioskMode: string;
  };
  evidencePanel: {
    title: string;
    jurisdiction: string;
    cooperativeType: string;
    authority: string;
    source: string;
    section: string;
    version: string;
    effectiveDate: string;
    confidence: string;
    verifiedBadge: string;
  };
  trustSafety: {
    piiProtected: string;
    sourceVerified: string;
    lowConfidenceWarning: string;
    reviewSource: string;
    requestHumanReview: string;
  };
  kiosk: {
    welcome: string;
    subWelcome: string;
    talkToCivora: string;
    schemesButton: string;
    lawsButton: string;
    pacsServicesButton: string;
    grievanceButton: string;
    docHelpButton: string;
    micPrompt: string;
  };
  voice: {
    listening: string;
    processing: string;
    speaking: string;
    tapToSpeak: string;
  };
}

export const LANGUAGES: Record<Language, TranslationSet> = {
  en: {
    languageName: 'English',
    nativeName: 'English',
    tagline: 'Ask. Verify. Act.',
    heroHeadline: 'How can I help you today?',
    heroSubheadline: 'Ask about cooperative laws, schemes, services or grievances.',
    inputPlaceholder: 'Ask Civora anything about cooperatives...',
    quickActions: {
      scheme: 'Explain a scheme',
      laws: 'Ask about cooperative laws',
      docs: 'Check required documents',
      grievance: 'Prepare a grievance',
    },
    nav: {
      newChat: 'New Chat',
      chat: 'Chat Workspace',
      schemes: 'Schemes Directory',
      laws: 'Laws & By-Laws',
      grievance: 'Grievance Support',
      documents: 'Document Help',
      help: 'Help & FAQ',
      settings: 'Settings',
      kioskMode: 'Kiosk Mode',
    },
    evidencePanel: {
      title: 'Why this answer?',
      jurisdiction: 'Jurisdiction',
      cooperativeType: 'Cooperative Type',
      authority: 'Authority',
      source: 'Source',
      section: 'Section',
      version: 'Version',
      effectiveDate: 'Effective Date',
      confidence: 'Verification Score',
      verifiedBadge: 'Verified from source',
    },
    trustSafety: {
      piiProtected: 'PII Protected & Masked',
      sourceVerified: 'Verified Official Source',
      lowConfidenceWarning: "I couldn't verify this information confidently from the available sources.",
      reviewSource: 'Review Source Documents',
      requestHumanReview: 'Request Human Review',
    },
    kiosk: {
      welcome: 'Civora Cooperative Kiosk',
      subWelcome: 'Select a service or tap the microphone to talk',
      talkToCivora: 'Talk to Civora',
      schemesButton: 'Cooperative Schemes',
      lawsButton: 'Laws & By-Laws',
      pacsServicesButton: 'PACS Credit & Services',
      grievanceButton: 'Prepare Grievance',
      docHelpButton: 'Document Analysis',
      micPrompt: 'Tap microphone to speak in your language',
    },
    voice: {
      listening: 'Listening... Speak clearly',
      processing: 'Processing voice query...',
      speaking: 'Civora is responding...',
      tapToSpeak: 'Tap to speak',
    },
  },
  ta: {
    languageName: 'Tamil',
    nativeName: 'தமிழ்',
    tagline: 'கேளுங்கள். சரிபாருங்கள். செயல்படுங்கள்.',
    heroHeadline: 'இன்று உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?',
    heroSubheadline: 'கூட்டுறவு சட்டம், திட்டங்கள், சேவைகள் அல்லது குறைகள் குறித்து கேளுங்கள்.',
    inputPlaceholder: 'கூட்டுறவு குறித்து சிவோராவை எது வேண்டுமானாலும் கேளுங்கள்...',
    quickActions: {
      scheme: 'திட்டத்தை விளக்குக',
      laws: 'கூட்டுறவு சட்டங்கள் பற்றி கேள்',
      docs: 'தேவையான ஆவணங்களை சரிபார்',
      grievance: 'மனு தயாரிக்கவும்',
    },
    nav: {
      newChat: 'புதிய உரையாடல்',
      chat: 'உரையாடல்',
      schemes: 'கூட்டுறவு திட்டங்கள்',
      laws: 'சட்டங்கள் & விதிகள்',
      grievance: 'குறைதீர்ப்பு மனு',
      documents: 'ஆவண உதவி',
      help: 'உதவி',
      settings: 'அமைப்புகள்',
      kioskMode: 'கியோஸ்க் பயன்முறை',
    },
    evidencePanel: {
      title: 'இந்த பதிலுக்கான ஆதாரம்?',
      jurisdiction: 'அதிகார வரம்பு',
      cooperativeType: 'கூட்டுறவு வகை',
      authority: 'அதிகாரம் பெற்ற நிறுவனம்',
      source: 'அதிகாரப்பூர்வ ஆதாரம்',
      section: 'பிரிவு / விதி',
      version: 'பதிப்பு',
      effectiveDate: 'அமல்படுத்தப்பட்ட தேதி',
      confidence: 'சரிபார்ப்பு நிலை',
      verifiedBadge: 'ஆதாரத்தில் இருந்து சரிபார்க்கப்பட்டது',
    },
    trustSafety: {
      piiProtected: 'தனிநபர் விவரங்கள் பாதுகாக்கப்பட்டது',
      sourceVerified: 'சரிபார்க்கப்பட்ட ஆதாரம்',
      lowConfidenceWarning: 'கிடைக்கக்கூடிய ஆதாரங்களில் இருந்து இந்தத் தகவலை உறுதியாக சரிபார்க்க முடியவில்லை.',
      reviewSource: 'ஆதார ஆவணங்களை மதிப்பாய்வு செய்யவும்',
      requestHumanReview: 'மனித மதிப்பாய்வைக் கோரவும்',
    },
    kiosk: {
      welcome: 'சிவோரா கூட்டுறவு சேவை மையம்',
      subWelcome: 'சேவையைத் தேர்ந்தெடுக்கவும் அல்லது பேச மைக்கை அழுத்தவும்',
      talkToCivora: 'சிவோராவிடம் பேசுங்கள்',
      schemesButton: 'கூட்டுறவு திட்டங்கள்',
      lawsButton: 'சட்டங்கள் & விதிகள்',
      pacsServicesButton: 'PACS கடன் சேவைகள்',
      grievanceButton: 'மனு தயாரிக்கவும்',
      docHelpButton: 'ஆவண பகுப்பாய்வு',
      micPrompt: 'உங்கள் மொழியில் பேச மைக்கை அழுத்தவும்',
    },
    voice: {
      listening: 'கேட்கிறது... தெளிவாகப் பேசுங்கள்',
      processing: 'குரல் கோரிக்கை செயலாக்கப்படுகிறது...',
      speaking: 'சிவோரா பதில் அளிக்கிறது...',
      tapToSpeak: 'பேச அழுத்தவும்',
    },
  },
  hi: {
    languageName: 'Hindi',
    nativeName: 'हिंदी',
    tagline: 'पूछें। सत्यापित करें। कार्य करें।',
    heroHeadline: 'आज मैं आपकी क्या सहायता कर सकता हूँ?',
    heroSubheadline: 'सहकारी कानूनों, योजनाओं, सेवाओं या शिकायतों के बारे में पूछें।',
    inputPlaceholder: 'सहकारिता के बारे में सिवोरा से कुछ भी पूछें...',
    quickActions: {
      scheme: 'योजना समझें',
      laws: 'सहकारी कानून पूछें',
      docs: 'आवश्यक दस्तावेज जांचें',
      grievance: 'शिकायत तैयार करें',
    },
    nav: {
      newChat: 'नई बातचीत',
      chat: 'चैट',
      schemes: 'सहकारी योजनाएं',
      laws: 'कानून और उप-नियम',
      grievance: 'शिकायत निवारण',
      documents: 'दस्तावेज़ सहायता',
      help: 'सहायता',
      settings: 'सेटिंग्स',
      kioskMode: 'कियोस्क मोड',
    },
    evidencePanel: {
      title: 'यह उत्तर क्यों?',
      jurisdiction: 'क्षेत्राधिकार',
      cooperativeType: 'सहकारी प्रकार',
      authority: 'प्राधिकरण',
      source: 'आधिकारिक स्रोत',
      section: 'धारा / नियम',
      version: 'संस्करण',
      effectiveDate: 'प्रभावी तिथि',
      confidence: 'सत्यापन स्कोर',
      verifiedBadge: 'स्रोत से सत्यापित',
    },
    trustSafety: {
      piiProtected: 'व्यक्तिगत डेटा सुरक्षित',
      sourceVerified: 'सत्यापित आधिकारिक स्रोत',
      lowConfidenceWarning: 'उपलब्ध स्रोतों से इस जानकारी को आत्मविश्वास से सत्यापित नहीं किया जा सका।',
      reviewSource: 'स्रोत दस्तावेजों की समीक्षा करें',
      requestHumanReview: 'मानव समीक्षा का अनुरोध करें',
    },
    kiosk: {
      welcome: 'सिवोरा सहकारी कियोस्क',
      subWelcome: 'एक सेवा चुनें या बात करने के लिए माइक दबाएं',
      talkToCivora: 'सिवोरा से बात करें',
      schemesButton: 'सहकारी योजनाएं',
      lawsButton: 'कानून और उप-नियम',
      pacsServicesButton: 'पैक्स ऋण एवं सेवाएं',
      grievanceButton: 'शिकायत ड्राफ्ट करें',
      docHelpButton: 'दस्तावेज़ विश्लेषण',
      micPrompt: 'अपनी भाषा में बोलने के लिए माइक दबाएं',
    },
    voice: {
      listening: 'सुन रहा हूँ... स्पष्ट बोलें',
      processing: 'ध्वनि अनुरोध संसाधित हो रहा है...',
      speaking: 'सिवोरा जवाब दे रहा है...',
      tapToSpeak: 'बोलने के लिए टैप करें',
    },
  },
  te: {
    languageName: 'Telugu',
    nativeName: 'తెలుగు',
    tagline: 'అడగండి. ధృవీకరించండి. వర్తించండి.',
    heroHeadline: 'ఈరోజు నేను మీకు ఎలా సహాయపడగలను?',
    heroSubheadline: 'సహకార చట్టాలు, పథకాలు, సేవలు లేదా ఫిర్యాదుల గురించి అడగండి.',
    inputPlaceholder: 'సహకార సంఘాల గురించి శివోరాను ఏదైనా అడగండి...',
    quickActions: {
      scheme: 'పథకం వివరించండి',
      laws: 'సహకార చట్టాలు అడగండి',
      docs: 'అవసరమైన పత్రాలు తనిఖీ చేయండి',
      grievance: 'ఫిర్యాదు సిద్ధం చేయండి',
    },
    nav: {
      newChat: 'కొత్త చాట్',
      chat: 'చాట్ వర్క్‌స్పేస్',
      schemes: 'సహకార పథకాలు',
      laws: 'చట్టాలు & నిబంధనలు',
      grievance: 'ఫిర్యాదు మద్దతు',
      documents: 'పత్రాల సహాయం',
      help: 'సహాయం',
      settings: 'సెట్టింగ్‌లు',
      kioskMode: 'కియోస్క్ మోడ్',
    },
    evidencePanel: {
      title: 'ఈ సమాధానం ఎందుకు?',
      jurisdiction: 'అధికార పరిధి',
      cooperativeType: 'సహకార రకం',
      authority: 'అధికార సంస్థ',
      source: 'ఆధికారిక మూలం',
      section: 'సెక్షన్ / నియమం',
      version: 'వెర్షన్',
      effectiveDate: 'అమలు తేదీ',
      confidence: 'ధృవీకరణ స్కోర్',
      verifiedBadge: 'మూలం నుండి ధృవీకరించబడింది',
    },
    trustSafety: {
      piiProtected: 'వ్యక్తిగత సమాచారం సురక్షితం',
      sourceVerified: 'ధృవీకరించబడిన మూలం',
      lowConfidenceWarning: 'అందుబాటులో ఉన్న మూలాల నుండి ఈ సమాచారాన్ని ఖచ్చితంగా ధృవీకరించలేకపోయాము.',
      reviewSource: 'మూల పత్రాలను సమీక్షించండి',
      requestHumanReview: 'మానవ సమీక్షను అభ్యర్థించండి',
    },
    kiosk: {
      welcome: 'శివోరా సహకార కియోస్క్',
      subWelcome: 'సేవను ఎంచుకోండి లేదా మాట్లాడటానికి మైక్ నొక్కండి',
      talkToCivora: 'శివోరాతో మాట్లాడండి',
      schemesButton: 'సహకార పథకాలు',
      lawsButton: 'చట్టాలు & నిబంధనలు',
      pacsServicesButton: 'PACS రుణాలు & సేవలు',
      grievanceButton: 'ఫిర్యాదు నమోదు చేయండి',
      docHelpButton: 'పత్రాల విశ్లేషణ',
      micPrompt: 'మీ భాషలో మాట్లాడటానికి మైక్ నొక్కండి',
    },
    voice: {
      listening: 'వింటోంది... స్పష్టంగా మాట్లాడండి',
      processing: 'వాయిస్ ప్రాసెస్ అవుతోంది...',
      speaking: 'శివోరా సమాధానమిస్తోంది...',
      tapToSpeak: 'మాట్లాడటానికి నొక్కండి',
    },
  },
  kn: {
    languageName: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    tagline: 'ಕೇಳಿ. ಪರಿಶೀಲಿಸಿ. ಕಾರ್ಯನಿರ್ವಹಿಸಿ.',
    heroHeadline: 'ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    heroSubheadline: 'ಸಹಕಾರ ಕಾಯ್ದೆಗಳು, ಯೋಜನೆಗಳು, ಸೇವೆಗಳು ಅಥವಾ ದೂರುಗಳ ಬಗ್ಗೆ ಕೇಳಿ.',
    inputPlaceholder: 'ಸಹಕಾರ ಸಂಘಗಳ ಬಗ್ಗೆ ಸಿವೋರಾ ಕೇಳಿ...',
    quickActions: {
      scheme: 'ಯೋಜನೆ ವಿವರಿಸಿ',
      laws: 'ಸಹಕಾರ ಕಾನೂನುಗಳನ್ನು ಕೇಳಿ',
      docs: 'ಅಗತ್ಯ ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ',
      grievance: 'ದೂರು ಸಿದ್ಧಪಡಿಸಿ',
    },
    nav: {
      newChat: 'ಹೊಸ ಸಂಭಾಷಣೆ',
      chat: 'ಚಾಟ್ ವರ್ಕ್‌ಸ್ಪೇಸ್',
      schemes: 'ಸಹಕಾರ ಯೋಜನೆಗಳು',
      laws: 'ಕಾನೂನುಗಳು & ನಿಯಮಗಳು',
      grievance: 'ದೂರು ಪರಿಹಾರ',
      documents: 'ದಾಖಲೆ ನೆರವು',
      help: 'ಸಹಾಯ',
      settings: 'ಸಂಯೋಜನೆಗಳು',
      kioskMode: 'ಕಿಯಾಸ್ಕ್ ಮೋಡ್',
    },
    evidencePanel: {
      title: 'ಈ ಉತ್ತರ ಏಕೆ?',
      jurisdiction: 'ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ',
      cooperativeType: 'ಸಹಕಾರ ಪ್ರಕಾರ',
      authority: 'ಪ್ರಾಧಿಕಾರ',
      source: 'ಅಧಿಕೃತ ಮೂಲ',
      section: 'ವಿಭಾಗ / ನಿಯಮ',
      version: 'ಆವೃತ್ತಿ',
      effectiveDate: 'ಜಾರಿ ದಿನಾಂಕ',
      confidence: 'ಪರಿಶೀಲನೆ ಸ್ಕೋರ್',
      verifiedBadge: 'ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    },
    trustSafety: {
      piiProtected: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಸುರಕ್ಷಿತ',
      sourceVerified: 'ಪರಿಶೀಲಿಸಿದ ಅಧಿಕೃತ ಮೂಲ',
      lowConfidenceWarning: 'ಲಭ್ಯವಿರುವ ಮೂಲಗಳಿಂದ ಈ ಮಾಹಿತಿಯನ್ನು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
      reviewSource: 'ಮೂಲ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
      requestHumanReview: 'ಮಾನವ ಪರಿಶೀಲನೆಗೆ ವಿನಂತಿಸಿ',
    },
    kiosk: {
      welcome: 'ಸಿವೋರಾ ಸಹಕಾರ ಕಿಯಾಸ್ಕ್',
      subWelcome: 'ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ',
      talkToCivora: 'ಸಿವೋರಾ ಜೊತೆ ಮಾತನಾಡಿ',
      schemesButton: 'ಸಹಕಾರ ಯೋಜನೆಗಳು',
      lawsButton: 'ಕಾನೂನುಗಳು & ನಿಯಮಗಳು',
      pacsServicesButton: 'PACS ಸಾಲ ಸೇವೆಗಳು',
      grievanceButton: 'ದೂರು ಸಿದ್ಧಪಡಿಸಿ',
      docHelpButton: 'ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ',
      micPrompt: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ',
    },
    voice: {
      listening: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ',
      processing: 'ಧ್ವನಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
      speaking: 'ಸಿವೋರಾ ಉತ್ತರಿಸುತ್ತಿದೆ...',
      tapToSpeak: 'ಮಾತನಾಡಲು ಸ್ಪರ್ಶಿಸಿ',
    },
  },
};
