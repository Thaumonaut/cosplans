# Feature Specification: Model Release Forms

**Feature Branch**: `013-model-release-forms`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: Digital model release form templates, e-signature, track signing status per person/shoot, photo usage rights documentation

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send Digital Release Forms (Priority: P1)

As a photographer, I want to send digital model release forms to models/cosplayers via email or link so that I can get legal permission to use photos without dealing with paper forms.

**Why this priority**: Core legal protection - essential for photographers selling or publishing work commercially.

**Independent Test**: User can select form template, send to model, model receives email with form link.

**Acceptance Scenarios**:

1. **Given** I'm planning shoot with model, **When** I select "Standard Model Release" template and enter model's email, **Then** model receives email with secure form link
2. **Given** model receives form link, **When** they open it, **Then** form displays with shoot details, photographer name, usage terms
3. **Given** I sent 3 forms, **When** I view shoot, **Then** I see "Release forms: 1 signed, 2 pending"
4. **Given** model doesn't have account, **When** they receive form, **Then** they can view and sign without creating account

---

### User Story 2 - E-Signature & Completion (Priority: P2)

As a model/cosplayer, I want to review and electronically sign release forms so that I understand usage rights and can provide consent quickly from my phone.

**Why this priority**: Makes P1 forms actually usable - without signing capability, forms are just documents.

**Independent Test**: Model can read form, draw signature, submit, photographer receives signed copy with timestamp.

**Acceptance Scenarios**:

1. **Given** I open release form, **When** I scroll through terms, **Then** "Sign" button enables only after scrolling to bottom
2. **Given** form is ready to sign, **When** I draw signature with finger/mouse and click "Submit", **Then** signature saves with timestamp
3. **Given** I submitted form, **When** photographer views it, **Then** they see my signature, sign date, and IP address for verification
4. **Given** form requires witness, **When** I sign, **Then** system prompts for witness name and signature before submission

---

### User Story 3 - Custom Form Templates (Priority: P3)

As a professional photographer, I want to create custom release form templates with my branding, specific usage terms, and compensation clauses so that forms match my business needs.

**Why this priority**: Flexibility for business users. Basic template works for many, but pros need customization.

**Independent Test**: User can create custom template, add/remove fields, save as reusable template, use for multiple shoots.

**Acceptance Scenarios**:

1. **Given** I need custom terms, **When** I create new template and add field "Compensation: $__", **Then** field appears in form editor
2. **Given** I want my branding, **When** I upload logo and set brand colors, **Then** form displays with my visual identity
3. **Given** I created template, **When** I save as "Commercial Shoots v2", **Then** template appears in my library for future use
4. **Given** I have 5 templates, **When** sending form, **Then** I select which template to use for this shoot

---

### User Story 4 - Signed Form Archive & Export (Priority: P4)

As a photographer managing legal documents, I want to download signed release forms as PDFs and maintain searchable archive so that I can provide proof of release if questioned years later.

**Why this priority**: Long-term record keeping. Important for liability but not needed until forms are being signed.

**Independent Test**: User can download individual signed form as PDF, export all forms for shoot, search archive by model name/date.

**Acceptance Scenarios**:

1. **Given** model signed form, **When** I click "Download PDF", **Then** PDF generates with signature, timestamp, all form data
2. **Given** shoot has 8 signed forms, **When** I click "Export all", **Then** ZIP file downloads with 8 PDFs named by model
3. **Given** I need to find old release, **When** I search "Sarah Smith", **Then** all releases she signed appear with shoot context
4. **Given** form was signed 2 years ago, **When** I view it, **Then** original signature and data display exactly as signed (immutable)

---

### Edge Cases

- What if model wants to revoke release after signing? (No revocation in system, contact photographer directly, note this in terms)
- How to handle minors requiring parent/guardian signature? (Add guardian consent field, require DOB verification)
- What about international laws (GDPR, CCPA)? (Privacy policy link, data retention settings, export/delete capabilities)
- Should there be form expiration dates? (Optional expiration, auto-remind to renew)
- How to handle disputes about what was signed? (Immutable record with signature hash, audit log)
- What if photographer's email bounces? (Allow sharing via unique link without email requirement)
- Should models get copy of signed form? (Auto-send PDF copy to model's email after signing)
- How to prevent form tampering? (Digital signature with hash verification, detect modifications)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide default model release form templates (Standard, Commercial, Social Media Only, Event/Convention)
- **FR-002**: System MUST allow photographer to send release form via email to model
- **FR-003**: System MUST generate unique, secure form link valid for 30 days (configurable)
- **FR-004**: System MUST allow models to view and complete form without account login
- **FR-005**: System MUST display form with shoot details, photographer info, usage terms
- **FR-006**: System MUST track signing status per person: Pending, Viewed, Signed, Declined
- **FR-007**: System MUST require scrolling to bottom of form before enabling "Sign" button
- **FR-008**: System MUST support touch/mouse signature drawing with "Clear and retry" option
- **FR-009**: System MUST capture signature, sign timestamp, model name, IP address for verification
- **FR-010**: System MUST support optional witness signature field
- **FR-011**: System MUST send signed form confirmation email to both model and photographer
- **FR-012**: System MUST allow creating custom form templates with text fields, checkboxes, signature fields
- **FR-013**: System MUST support adding photographer logo and brand colors to forms
- **FR-014**: System MUST save custom templates for reuse across shoots
- **FR-015**: System MUST allow editing template content (terms, fields) with version tracking
- **FR-016**: System MUST generate signed form as PDF with signature, timestamp, all data
- **FR-017**: System MUST provide bulk export of all signed forms per shoot as ZIP
- **FR-018**: System MUST maintain searchable archive of signed forms by model name, shoot, date range
- **FR-019**: System MUST make signed forms immutable (cannot edit after submission)
- **FR-020**: System MUST generate signature hash for tamper detection
- **FR-021**: System MUST support minor consent with parent/guardian signature requirement
- **FR-022**: System MUST allow configuring form expiration and auto-renewal reminders

### Key Entities

- **ReleaseFormTemplate**: Form design. Attributes: template name, creator user ID, is default template, content (HTML/JSON), required fields, logo image path, brand colors, version number, created date, last modified date
- **ReleaseFormInstance**: Specific form sent for shoot. Attributes: shoot ID, template ID, recipient email, recipient name, unique secure link token, expiration date, sent timestamp, viewed timestamp (optional), signed timestamp (optional), status (pending/viewed/signed/declined)
- **FormSignature**: Captured signature. Attributes: form instance ID, signature image data, signer name, signer IP address, sign timestamp, signature hash, witness name (optional), witness signature (optional)
- **FormFieldData**: Captured form data. Attributes: form instance ID, field name, field value, field type
- **FormAuditLog**: Tamper detection. Attributes: form instance ID, event type (sent/viewed/signed/modified), event timestamp, event data

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can send release form in under 1 minute
- **SC-002**: Form email delivers to recipient within 2 minutes
- **SC-003**: Models can complete and sign form in under 3 minutes on mobile
- **SC-004**: PDF generation completes within 5 seconds for signed form
- **SC-005**: Signature hash verification detects 100% of tampering attempts
- **SC-006**: 95% of sent forms are viewed within 48 hours (indicates good email delivery)
- **SC-007**: 80% of viewed forms are signed within 7 days (indicates form usability)
- **SC-008**: Professional photographers using custom templates report 60% time savings vs paper forms (measured via survey)
- **SC-009**: Zero legal disputes due to invalid/missing signatures (indicates form validity)
- **SC-010**: Signed forms remain accessible and valid for 10+ years (long-term archival reliability)

