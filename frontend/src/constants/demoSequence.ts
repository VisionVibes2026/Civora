import type { ChatMessage, Language } from '../types';

export interface DemoStep {
  stepIndex: number;
  userQueryEn: string;
  userQueryTa: string;
  civoraResponseEn: string;
  civoraResponseTa: string;
  nextSuggestedPillEn?: string;
  nextSuggestedPillTa?: string;
  attachedDocState?: {
    label: string;
    status: 'success' | 'pending' | 'error';
    details: string[];
  };
  verificationState?: {
    label: string;
    steps: string[];
  };
  verifiedAnswer?: {
    title: string;
    content: string;
    source: string;
    actions: string[];
  };
  officialSupportCard?: {
    title: string;
    portal: string;
    helpline: string;
  };
  summaryReportCard?: {
    crop: string;
    location: string;
    cause: string;
    loan: string;
    insurance: string;
    incident: string;
    isDemoData: boolean;
  };
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepIndex: 0,
    userQueryEn: "hi",
    userQueryTa: "வணக்கம்",
    civoraResponseEn: "Hi, I'm Civora. How can I help you?",
    civoraResponseTa: "வணக்கம், நான் சிவோரா. உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?"
  },
  {
    stepIndex: 1,
    userQueryEn: "Hello. I am a paddy farmer from Nagapattinam. Heavy rain has damaged my crop. I have an agricultural loan from PACS, but I don't know whether my crop is insured.",
    userQueryTa: "வணக்கம். நான் நாகப்பட்டினத்தைச் சேர்ந்த நெல் விவசாயி. கனமழையால் எனது பயிர் சேதமடைந்துள்ளது. PACS மூலம் விவசாயக் கடன் பெற்றுள்ளேன், ஆனால் என் பயிர் காப்பீடு செய்யப்பட்டுள்ளதா என்று எனக்குத் தெரியவில்லை.",
    civoraResponseEn: "I can help you check your crop-insurance details. Please upload your loan or insurance document so I can identify the crop, insurance and policy information.",
    civoraResponseTa: "உங்கள் பயிர் காப்பீட்டு விவரங்களைச் சரிபார்க்க நான் உதவுகிறேன். பயிர், காப்பீடு மற்றும் கொள்கை விவரங்களை அடையாளம் காண உங்கள் கடன் அல்லது காப்பீட்டு ஆவணத்தைப் பதிவேற்றவும்."
  },
  {
    stepIndex: 2,
    userQueryEn: "I have my loan document. Please check whether insurance is mentioned.",
    userQueryTa: "என்னிடம் கடன் ஆவணம் உள்ளது. காப்பீடு குறிப்பிடப்பட்டுள்ளதா எனப் பார்க்கவும்.",
    civoraResponseEn: "Sure. Upload the document and I'll check the relevant crop, loan and insurance details.",
    civoraResponseTa: "நிச்சயமாக. ஆவணத்தைப் பதிவேற்றவும், பயிர், கடன் மற்றும் காப்பீட்டு விவரங்களைச் சரிபார்க்கிறேன்."
  },
  {
    stepIndex: 3,
    userQueryEn: "Is this insurance applicable to my crop damage?",
    userQueryTa: "இந்தக் காப்பீடு எனது பயிர் சேதத்திற்குப் பொருந்துமா?",
    civoraResponseEn: "I found insurance information in your document. Rain-related crop damage may be covered under applicable crop-insurance provisions, depending on the notified crop, area, coverage and policy conditions.\n\nI'll check the official information for Tamil Nadu, your paddy crop and the insurance details I found.",
    civoraResponseTa: "உங்கள் ஆவணத்தில் காப்பீட்டுத் தகவல் உள்ளது. கனமழை பயிர் சேதம், அறிவிக்கப்பட்ட பயிர், பகுதி மற்றும் கொள்கை நிபந்தனைகளைப் பொறுத்து காப்பீட்டின் கீழ் வரக்கூடும்.\n\nதமிழ்நாடு அரசு, உங்கள் நெல் பயிர் மற்றும் கண்டறியப்பட்ட காப்பீட்டு விவரங்களுக்கான அதிகாரப்பூர்வத் தகவலைச் சரிபார்க்கிறேன்."
  },
  {
    stepIndex: 4,
    userQueryEn: "What should I do now?",
    userQueryTa: "இப்போது நான் என்ன செய்ய வேண்டும்?",
    civoraResponseEn: "If your loss falls under the applicable coverage, the loss should be reported within the required time period. For PMFBY-related support, I can show you the official reporting channel and help you prepare the information you need.",
    civoraResponseTa: "உங்கள் சேதம் காப்பீட்டின் கீழ் வந்தால், குறிப்பிட்ட காலத்திற்குள் சேதத்தைப் பதிவு செய்ய வேண்டும். PMFBY தொடர்பான உதவிக்கு, அதிகாரப்பூர்வ தகவல் தொடர்பு வழியைக் காட்டி தேவையான விவரங்களை ஆயத்தப்படுத்த உதவுகிறேன்."
  },
  {
    stepIndex: 5,
    userQueryEn: "What information should I keep ready?",
    userQueryTa: "என்னென்ன விவரங்களை ஆயத்தமாக வைத்திருக்க வேண்டும்?",
    civoraResponseEn: "Keep your insurance or policy details, crop details, location, date of damage and supporting evidence ready. I can use the information from your uploaded document to prepare a simple crop-loss summary.",
    civoraResponseTa: "காப்பீட்டு விவரங்கள், பயிர் விவரம், இடம், சேதமடைந்த தேதி மற்றும் ஆதாரங்களை ஆயத்தமாக வைத்திருக்கவும். உங்கள் ஆவணத்திலிருந்து பயிர் இழப்பு சுருக்கத்தைத் தயார் செய்ய முடியும்."
  },
  {
    stepIndex: 6,
    userQueryEn: "Yes, prepare it.",
    userQueryTa: "ஆம், அதைத் தயார் செய்யவும்.",
    civoraResponseEn: "Crop: Paddy\nLocation: Nagapattinam, Tamil Nadu\nCause reported: Heavy rain\nLoan: Agricultural loan through PACS\nInsurance: Identified from uploaded document\nIncident: Crop damage reported",
    civoraResponseTa: "பயிர்: நெல்\nஇடம்: நாகப்பட்டினம், தமிழ்நாடு\nஅறிவிக்கப்பட்ட காரணம்: கனமழை\nகடன்: PACS மூலம் விவசாயக் கடன்\nகாப்பீடு: பதிவேற்றப்பட்ட ஆவணத்திலிருந்து கண்டறியப்பட்டது\nசம்பவம்: பயிர் சேதம் அறிக்கையிடப்பட்டது"
  }
];

export function getInitialDemoSession(_language: Language = 'en'): ChatMessage[] {
  return [];
}
