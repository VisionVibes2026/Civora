# Civora REST API Reference

Base URL: `http://localhost:8000/api/v1`

---

## 1. Health & Readiness

### `GET /health`
Returns system status, environment mode, and provider health.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "app_name": "Civora",
  "version": "0.1.0",
  "app_mode": "development",
  "is_demo_mode": true,
  "timestamp": "2026-09-28T22:15:00Z"
}
```

---

## 2. Conversational Legal Assistance

### `POST /chat/messages`
Submits a citizen query for multilingual intent classification, RAG retrieval, jurisdiction resolution, and grounded response generation.

**Request Body**:
```json
{
  "message": "I am a paddy farmer from Nagapattinam with heavy crop damage. Is my PACS loan insured?",
  "conversation_id": "conv_a1b2c3d4",
  "language": "en",
  "attached_doc_id": null
}
```

**Response `200 OK`**:
```json
{
  "message_id": "msg_9f8e7d6c",
  "conversation_id": "conv_a1b2c3d4",
  "content": "I can help you check your crop-insurance details. Please upload your loan or insurance document so I can identify the crop, insurance and policy information.",
  "language": "en",
  "intent": "scheme_inquiry",
  "confidence_score": 0.96,
  "jurisdiction": {
    "is_multi_state": false,
    "applicable_act_name": "Tamil Nadu Co-operative Societies Act, 1983",
    "applicable_act_code": "TNCSA_1983",
    "jurisdiction_level": "State",
    "state": "Tamil Nadu",
    "competent_authority": "Deputy Registrar of Cooperative Societies (Circle Level)",
    "appellate_authority": "Co-operative Tribunal",
    "dispute_resolution_section": "Section 90 (Disputes)",
    "inquiry_section": "Section 81 (Inquiry by Registrar)"
  },
  "citations": [
    {
      "source_name": "Tamil Nadu Co-operative Societies Act 1983",
      "section": "Section 90",
      "act_or_scheme_code": "TNCSA_1983",
      "url": "https://tnpacs.tn.gov.in"
    }
  ]
}
```

---

## 3. Document Analysis & OCR

### `POST /documents/analyze`
Uploads and extracts structured metadata from member documents (Passbook, Patta, Loan Receipt, Society Notice).

**Form-Data Request**:
- `file`: Binary file (PDF / PNG / JPG)
- `document_type`: `passbook` | `patta` | `loan_receipt` | `notice`

**Response `200 OK`**:
```json
{
  "document_id": "doc_e3f2a100",
  "file_name": "farmer_passbook.pdf",
  "raw_text": "TAMIL NADU CO-OPERATIVE SOCIETIES...",
  "ocr_confidence": 0.94,
  "extracted_fields": {
    "society_name": {
      "field_key": "society_name",
      "field_label": "Cooperative Society",
      "value": "Thiruvarur North PACCS No. 402",
      "confidence": 0.96
    },
    "loan_amount": {
      "field_key": "loan_amount",
      "field_label": "Sanctioned Crop Loan",
      "value": "₹ 75,000.00",
      "confidence": 0.95
    }
  }
}
```

---

## 4. Statutory Grievance Redressal

### `POST /grievances/draft`
Generates a structured formal representation with statutory citations and prayer clauses.

**Request Body**:
```json
{
  "applicant_name": "S. Ramasamy",
  "society_name": "Thiruvarur PACCS No. 402",
  "category": "Loan Waiver Exclusion",
  "issue_description": "Eligible for 2022 crop waiver under 5 acres rule but excluded due to clerical misspelling in passbook.",
  "state": "Tamil Nadu"
}
```

**Response `200 OK`**:
```json
{
  "grievance_id": "grv_88192a",
  "grievance_number": "GRIEV-2026-88192",
  "addressed_authority": "Deputy Registrar of Cooperative Societies, Thiruvarur Circle",
  "statutory_citations": [
    "Tamil Nadu Co-operative Societies Act 1983, Section 90",
    "Audit & Surcharge Circular Section 81"
  ],
  "formal_draft_text": "TO:\nTHE DEPUTY REGISTRAR OF COOPERATIVE SOCIETIES...",
  "status": "drafted",
  "disclaimer": "Advisory representation draft. Applicant must verify details before presenting to authority."
}
```
