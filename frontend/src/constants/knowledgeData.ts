import type { CooperativeScheme, CooperativeLaw, ChatMessage } from '../types';

export const SCHEMES_DATABASE: CooperativeScheme[] = [
  {
    id: 'scheme-pacs-comp',
    title: 'Computerization of Primary Agricultural Credit Societies (PACS)',
    shortDescription: 'Centrally sponsored project to digitize 63,000 PACS across India with ERP software to enhance transparency, efficiency, and member access.',
    sector: 'Credit',
    state: 'National / All States',
    benefits: [
      'Direct online loan applications and status tracking for farmers',
      'Integration with NABARD, State Cooperative Banks (StCBs) & District Central Cooperative Banks (DCCBs)',
      'Transparent accounting and automated audit trail for member deposits',
      'Multi-service PACS capability (fertilizer distribution, storage, PDS)'
    ],
    eligibleEntities: ['Registered PACS', 'Farmer Members of PACS', 'Lamps / FSS'],
    requiredDocuments: [
      'PACS Membership ID / Land Holding Extract (Patta/Chitta)',
      'Aadhaar Card of Primary Member',
      'Active Bank Account Details (Passbook copy)',
      'Crop Cultivation Certificate from Village Administrative Officer (VAO)'
    ],
    officialSource: 'Ministry of Cooperation, Govt. of India',
    version: 'Guidelines v2024.1'
  },
  {
    id: 'scheme-iss-loan',
    title: 'Modified Interest Subvention Scheme (MISS / ISS)',
    shortDescription: 'Concessional short-term crop loans up to ₹3 Lakh at an effective interest rate of 4% per annum for prompt repaying farmers.',
    sector: 'Agriculture',
    state: 'Tamil Nadu / All States',
    benefits: [
      'Base interest rate capped at 7% per annum',
      '3% additional prompt repayment incentive (PRI) making effective interest rate 4%',
      'Collateral-free loan up to ₹1.60 Lakh',
      'Direct Benefit Transfer (DBT) of interest subsidy into member account'
    ],
    eligibleEntities: ['Small & Marginal Farmers', 'Tenant Farmers', 'Kisan Credit Card (KCC) holders in PACS'],
    requiredDocuments: [
      'Kisan Credit Card (KCC) Application Form',
      'Land ownership proof (Patta / Title Deed) or Lease Agreement',
      'Aadhaar Card & PAN / Form 60',
      'No-Dues Certificate from neighboring financial institutions'
    ],
    officialSource: 'NABARD & Dept. of Agriculture & Farmers Welfare',
    version: 'Circular No. 14/2024-25'
  },
  {
    id: 'scheme-aif',
    title: 'Agriculture Infrastructure Fund (AIF) for Cooperatives',
    shortDescription: 'Medium to long term debt financing facility for investment in viable post-harvest management infrastructure and community farming assets.',
    sector: 'Multi-purpose',
    state: 'National',
    benefits: [
      'Interest subvention of 3% per annum up to a loan limit of ₹2 Crore for 7 years',
      'Credit guarantee coverage under CGTMSE for loans up to ₹2 Crore',
      'Capital subsidy stackable with state cooperative infrastructure funds'
    ],
    eligibleEntities: ['PACS', 'Marketing Cooperative Societies', 'Multipurpose Cooperatives', 'FPOs'],
    requiredDocuments: [
      'Detailed Project Report (DPR) approved by General Body',
      'Audited Financial Statements of PACS for last 3 years',
      'Land possession document for warehouse / cold storage site',
      'Board Resolution authorizing borrowing'
    ],
    officialSource: 'Ministry of Agriculture & Farmers Welfare',
    version: 'AIF Guidelines 2024'
  },
  {
    id: 'scheme-ncdc-loan',
    title: 'NCDC Yuva Sahakar & Cooperative Business Assistance',
    shortDescription: 'Financial support and term loans from National Cooperative Development Corporation for new business initiatives and processing units.',
    sector: 'Dairy',
    state: 'National',
    benefits: [
      'Loan assistance up to 80% of project cost for new cooperative startups',
      'Concessional interest rates with 2% interest rebate for prompt repayment',
      'Working capital support for dairy, poultry, and food processing cooperatives'
    ],
    eligibleEntities: ['Registered Cooperatives operating for at least 1 year', 'Dairy Cooperatives'],
    requiredDocuments: [
      'NCDC Loan Application Form',
      'Cooperative Registration Certificate',
      'By-Laws copy & Resolution of Board',
      'Project feasibility report'
    ],
    officialSource: 'National Cooperative Development Corporation (NCDC)',
    version: 'NCDC Direct Funding Policy 2024'
  }
];

export const LAWS_DATABASE: CooperativeLaw[] = [
  {
    id: 'law-tn-act-1983',
    actTitle: 'Tamil Nadu Cooperative Societies Act, 1983',
    jurisdiction: 'Tamil Nadu',
    summary: 'Primary legislation governing the registration, constitution, management, audit, inquiry, and winding up of cooperative societies in Tamil Nadu.',
    effectiveDate: '13-Apr-1988 (Act 30 of 1983)',
    keySections: [
      {
        sectionNumber: 'Section 21',
        title: 'Qualifications for Membership',
        description: 'Specifies criteria for individual membership including age, residence, land holding, and non-disqualification under society bye-laws.'
      },
      {
        sectionNumber: 'Section 33',
        title: 'Constitution and Management of Board',
        description: 'Details election procedure, reservation of seats for SC/ST and Women members, and term of office of elected directors (5 years).'
      },
      {
        sectionNumber: 'Section 80',
        title: 'Statutory Audit of Societies',
        description: 'Mandates annual statutory audit of every society within 6 months of financial year end by designated Cooperative Audit Department.'
      },
      {
        sectionNumber: 'Section 90',
        title: 'Disputes touching the business of a society',
        description: 'Empowers Registrar to arbitrate disputes regarding election, loan recovery, officer misconduct, or member rights.'
      }
    ]
  },
  {
    id: 'law-mscs-act-2002',
    actTitle: 'Multi-State Cooperative Societies Act, 2002 (Amended 2023)',
    jurisdiction: 'National / Multi-State',
    summary: 'Governs cooperative societies with objects not confined to one state, incorporating federal principles, Central Registrar oversight, and Co-op Election Authority.',
    effectiveDate: '03-Aug-2023 Amendment',
    keySections: [
      {
        sectionNumber: 'Section 38',
        title: 'Voting Rights of Members',
        description: 'Enforces principle of One Member One Vote. Active member qualification rules require attending 3 consecutive AGMs and using minimum society services.'
      },
      {
        sectionNumber: 'Section 45',
        title: 'Cooperative Election Authority (CEA)',
        description: 'Establishes an independent authority to conduct fair and timely elections for all multi-state cooperative boards.'
      },
      {
        sectionNumber: 'Section 63',
        title: 'Cooperative Ombudsman',
        description: 'Provides mechanism for appointment of Ombudsman by Central Govt to resolve member grievances regarding service deficiency.'
      }
    ]
  },
  {
    id: 'law-model-byelaws-pacs',
    actTitle: 'Model Bye-Laws for Primary Agricultural Credit Societies (PACS)',
    jurisdiction: 'All States (Adopted 2023-2024)',
    summary: 'Standardized model bye-laws enabling PACS to undertake 25+ business activities including LPG dealership, petrol pump, PDS, CSC center, and cold storage.',
    effectiveDate: '01-Jan-2023',
    keySections: [
      {
        sectionNumber: 'Bye-Law 4',
        title: 'Objects and Multi-Service Business Scope',
        description: 'Authorizes PACS to provide credit, retail agricultural inputs, custom hiring centers, solar power generation, and community storage.'
      },
      {
        sectionNumber: 'Bye-Law 18',
        title: 'Loan Disbursement Transparency',
        description: 'Mandates direct online disbursement through PACS ERP into Aadhaar-seeded member bank accounts.'
      }
    ]
  }
];

export const DEMO_PRESET_MESSAGES: Record<string, ChatMessage> = {
  paddy_farmer_demo: {
    id: 'msg-demo-paddy-farmer',
    sender: 'assistant',
    text: 'I can help you check that. Please upload your loan or insurance document so I can identify the crop and insurance details.',
    timestamp: 'Just now',
    attachedDocState: {
      label: 'Document analyzed',
      status: 'success',
      details: [
        'Crop: Paddy',
        'Location: Nagapattinam, Tamil Nadu',
        'Insurance information: Found'
      ]
    },
    verificationState: {
      label: 'Checking verified sources...',
      steps: [
        'Understanding request',
        'Identifying jurisdiction',
        'Retrieving relevant evidence',
        'Validating response'
      ]
    },
    verifiedAnswer: {
      title: 'Verified information',
      content: 'Rain-related crop damage may fall under applicable crop-insurance provisions depending on the notified crop, area, coverage and policy conditions.',
      source: 'PMFBY Official Source',
      actions: [
        'View Source',
        'View Claim Guidance'
      ]
    },
    jurisdiction: {
      state: 'Tamil Nadu',
      cooperativeType: 'PACS (Primary Agricultural Credit Society)',
      authority: 'Registrar of Cooperative Societies (RCS)',
      policy: 'PMFBY & TNPACS Crop Insurance Policy 2024-25'
    },
    source: {
      label: 'PMFBY Official Source',
      actOrScheme: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      section: 'Clause 6.3 - Localized Calamity Coverage',
      version: 'Kharif/Rabi Notification 2024-25',
      effectiveDate: '01-Aug-2024',
      trustBadge: '✓ Verified source',
      confidence: 0.99
    },
    assistantStructure: {
      directAnswer: 'Rain-related crop damage may fall under applicable crop-insurance provisions depending on the notified crop, area, coverage and policy conditions.',
      explanation: 'Under PMFBY rules for notified areas like Nagapattinam, inundation and excess rainfall crop loss must be reported to PACS or District Agriculture Officer within 72 hours.',
      importantPoints: [
        'Crop: Paddy (Nagapattinam District)',
        'Insurance Status: Found & Linked with PACS Agricultural Loan',
        '72-Hour Intimation Window: Submit loss intimation to PACS Secretary or Helpline 14447',
        'Required Attachment: VAO Crop Damage Assessment Form'
      ],
      nextActions: [
        { label: 'View Source (PMFBY)', actionType: 'schemes', payload: 'scheme-iss-loan' },
        { label: 'View Claim Guidance', actionType: 'grievance' }
      ]
    }
  },
  default_query: {
    id: 'msg-demo-1',
    sender: 'assistant',
    text: 'You may need the following documents for applying to a cooperative agricultural scheme:',
    timestamp: 'Just now',
    jurisdiction: {
      state: 'Tamil Nadu',
      cooperativeType: 'PACS (Primary Agricultural Credit Society)',
      authority: 'Registrar of Cooperative Societies (RCS)',
      policy: 'Cooperative Credit Guidelines 2024-25'
    },
    source: {
      label: 'Official Cooperative Source',
      actOrScheme: 'Tamil Nadu Cooperative Credit Schemes',
      section: 'Section 21 & Scheme Circular No. 12',
      version: 'Current Policy v2024.2',
      effectiveDate: '01-Apr-2024',
      trustBadge: '✓ Verified source',
      confidence: 0.98
    },
    assistantStructure: {
      directAnswer: 'To apply for agricultural cooperative scheme benefits or PACS crop loan interest subvention, you must submit verified identity, land, and membership proof.',
      explanation: 'The verification process ensures that subvention benefits directly reach actual farm cultivators without intermediary delay.',
      importantPoints: [
        'PACS Membership details & Share Certificate number',
        'Identity Document (Aadhaar Card / Voter ID)',
        'Scheme-Specific Document (Land Patta/Chitta or VAO Cultivation Certificate)',
        'Active Bank Account Details (Passbook first page copy)'
      ],
      nextActions: [
        { label: 'Check Document Validity', actionType: 'documents' },
        { label: 'Prepare Grievance Draft', actionType: 'grievance' },
        { label: 'View Related Schemes', actionType: 'schemes' }
      ]
    }
  },
  pacs_scheme: {
    id: 'msg-pacs-scheme',
    sender: 'assistant',
    text: 'Under the PACS Computerization Scheme, Primary Agricultural Credit Societies are provided with standardized Cloud ERP software and hardware.',
    timestamp: 'Just now',
    jurisdiction: {
      state: 'National / All States',
      cooperativeType: 'PACS',
      authority: 'Ministry of Cooperation & NABARD',
      policy: 'PACS Computerization National ERP Framework'
    },
    source: {
      label: 'Ministry of Cooperation Guidelines',
      actOrScheme: 'PACS Computerization Centrally Sponsored Scheme',
      section: 'Guideline Clause 4.2',
      version: 'v2024.1',
      effectiveDate: '15-Jun-2023',
      trustBadge: '✓ Verified source',
      confidence: 0.99
    },
    assistantStructure: {
      directAnswer: 'The computerization project connects PACS directly to District Central Cooperative Banks (DCCBs) to streamline credit, fertilizer sales, and member accounts.',
      explanation: 'Farmers benefit from fast digital loan sanction, SMS alerts for deposit transactions, and transparent passbook statements.',
      importantPoints: [
        'Single-window services for crop loan, fertilizer, and PDS items',
        'Automated interest subvention calculation eliminating manual errors',
        'Direct Integration with State Land Records for instant verification',
        'Zero manual processing fee for ERP transactions'
      ],
      nextActions: [
        { label: 'View Scheme Details', actionType: 'schemes', payload: 'scheme-pacs-comp' },
        { label: 'Check Member Requirements', actionType: 'documents' }
      ]
    }
  },
  grievance_preset: {
    id: 'msg-grievance-preset',
    sender: 'assistant',
    text: 'If your PACS loan subvention or deposit payout is delayed, you have the right to submit a formal representation under Section 90 of the Cooperative Societies Act.',
    timestamp: 'Just now',
    jurisdiction: {
      state: 'Tamil Nadu',
      cooperativeType: 'PACS / District Central Cooperative Bank',
      authority: 'Deputy Registrar of Cooperative Societies (DRCS)',
      policy: 'TN Cooperative Grievance Redressal Mechanism'
    },
    source: {
      label: 'Tamil Nadu Cooperative Societies Act, 1983',
      actOrScheme: 'TN Act 30 of 1983',
      section: 'Section 90 (Dispute Settlement)',
      version: 'Amended Rules 2023',
      effectiveDate: '13-Apr-1988',
      trustBadge: '✓ Verified source',
      confidence: 0.96
    },
    assistantStructure: {
      directAnswer: 'Civora can prepare an official draft representation addressed to the Deputy Registrar of Cooperative Societies for speedy resolution.',
      explanation: 'Cooperative authorities are bound to investigate disputes touching the business of a society within 30 to 60 days of written receipt.',
      importantPoints: [
        'Specify PACS name, registration number, and member ID',
        'Attach loan disbursement receipt or passbook copy',
        'Cite non-receipt of interest subvention despite timely repayment',
        'Request formal inquiry under Section 90'
      ],
      nextActions: [
        { label: 'Prepare a Grievance Now', actionType: 'grievance' },
        { label: 'Read Section 90 Details', actionType: 'laws', payload: 'law-tn-act-1983' }
      ]
    }
  }
};
