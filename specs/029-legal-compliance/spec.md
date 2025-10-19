# Feature Specification: Legal & Compliance

**Feature Branch**: `029-legal-compliance`  
**Created**: October 16, 2025  
**Status**: Draft  
**Tier**: 0 - Foundation (Critical - required for public launch)  
**Priority**: P0 (Must complete before launch)

## Overview

Legal and compliance requirements must be in place before Cosplans launches publicly. This includes privacy policies, terms of service, cookie policies, GDPR compliance, CCPA compliance, and other regulatory requirements. Non-compliance creates legal liability and loss of user trust.

---

## User Scenarios & Testing

### User Story 1 - Access Privacy Policy (Priority: P1)

User wants to understand what personal data Cosplans collects and how it's used.

**Why this priority**: Privacy policy is legally required and builds user trust.

**Independent Test**: Users can access and understand privacy policy independently.

**Acceptance Scenarios**:

1. **Given** user lands on site, **When** user looks for privacy policy, **Then** privacy policy linked in footer
2. **Given** user clicks privacy policy link, **When** link clicked, **Then** policy page opens/displays
3. **Given** policy displayed, **When** user reads, **Then** policy clearly explains data collection and usage
4. **Given** policy references retention, **When** retention period read, **Then** user knows how long data stored
5. **Given** policy discusses GDPR, **When** GDPR section read, **Then** user rights explained (access, delete, etc.)

---

### User Story 2 - Review Terms of Service (Priority: P1)

User wants to understand their obligations and Cosplans' liability limitations.

**Why this priority**: Terms of Service is legally required and protects Cosplans.

**Independent Test**: Users can access and understand terms independently.

**Acceptance Scenarios**:

1. **Given** user considers signup, **When** user seeks ToS, **Then** ToS linked clearly
2. **Given** user reads ToS, **When** policy displayed, **Then** terms are clear (plain language where possible)
3. **Given** ToS discusses data rights, **When** section read, **Then** clear who owns user data
4. **Given** ToS mentions liability limits, **When** section read, **Then** limitations clearly stated

---

### User Story 3 - Understand Cookie Usage (Priority: P2)

User wants to know what cookies are set and why.

**Why this priority**: Important for privacy-conscious users and GDPR compliance.

**Independent Test**: Users can understand cookie usage independently.

**Acceptance Scenarios**:

1. **Given** user visits site, **When** cookies set, **Then** cookie banner displays (if required by law)
2. **Given** cookie banner shown, **When** user reads, **Then** banner explains cookie purposes clearly
3. **Given** banner displays, **When** user interacts, **Then** user can accept all, reject all, or customize
4. **Given** user selects preferences, **When** preferences saved, **Then** only approved cookies set

---

### User Story 4 - GDPR Compliance (Priority: P1)

EU users need assurance that Cosplans is GDPR-compliant.

**Why this priority**: GDPR is legally required for EU access. Non-compliance incurs heavy fines.

**Independent Test**: GDPR requirements can be verified independently.

**Acceptance Scenarios**:

1. **Given** EU user signs up, **When** signup form shown, **Then** explicit consent checkbox for data processing
2. **Given** user profile page accessed, **When** user logged in, **Then** "Download my data" option available
3. **Given** user requests data, **When** request submitted, **Then** data provided in standard format (JSON/CSV)
4. **Given** user requests deletion, **When** request submitted, **Then** account deletion initiated (30-day grace period)
5. **Given** user profile page accessed, **When** page displayed, **Then** privacy controls visible and functional

---

### User Story 5 - CCPA Compliance (Priority: P2)

California users need assurance that Cosplans respects their data rights.

**Why this priority**: CCPA required for US compliance but lower priority than GDPR.

**Independent Test**: CCPA requirements can be verified independently.

**Acceptance Scenarios**:

1. **Given** California user visits site, **When** page viewed, **Then** "California Privacy Rights" link visible
2. **Given** user clicks link, **When** link clicked, **Then** CCPA rights explained
3. **Given** user requests data, **When** request made, **Then** data provided within 45 days
4. **Given** user requests opt-out, **When** request made, **Then** user removed from data sales

---

### User Story 6 - Data Processing Agreement (Priority: P2)

Enterprise customers need assurance about data handling.

**Why this priority**: Important for B2B sales but optional for MVP.

**Independent Test**: DPA can be accessed independently.

**Acceptance Scenarios**:

1. **Given** enterprise customer inquires, **When** sales contacted, **Then** DPA available upon request
2. **Given** DPA requested, **When** requested by customer, **Then** DPA provided and can be customized
3. **Given** DPA reviewed, **When** reviewed by legal, **Then** DPA addresses data protection, subprocessors, security

---

## Requirements

### Legal Documents Required

#### 1. Privacy Policy
**Contents**:
- Information we collect (account info, usage data, cookies, payment info)
- How we use information (service provision, improvement, marketing, legal)
- Data retention periods (how long data stored by type)
- Your rights (access, delete, export, opt-out)
- GDPR specific rights (for EU users)
- CCPA specific rights (for CA users)
- Contact information for privacy questions
- Date of last update
- Cookie explanation
- Third-party services and data sharing

**Functional Requirements**:
- **FR-001**: Privacy policy MUST be accessible from every page (footer link)
- **FR-002**: Policy MUST be in plain language (8th grade reading level where possible)
- **FR-003**: Policy MUST be updated within 30 days of any material change
- **FR-004**: Policy MUST clearly disclose all data collection methods
- **FR-005**: Policy MUST explain GDPR rights for EU users
- **FR-006**: Policy MUST explain CCPA rights for California users
- **FR-007**: Policy MUST list all third parties who receive data
- **FR-008**: Policy MUST specify data retention periods for each data type
- **FR-009**: Policy MUST include contact info for privacy inquiries
- **FR-010**: Policy MUST be available in plain text and PDF

#### 2. Terms of Service
**Contents**:
- Who can use the service (age 13+, terms acceptance)
- License to use Cosplans (limited, non-exclusive, revocable)
- User responsibilities (no illegal use, no harassment, IP respect)
- Ownership of content (users own uploads, grant Cosplans license)
- Disclaimer of warranties (service "as is", no guarantees)
- Limitation of liability (Cosplans not liable for damages)
- Indemnification (users defend Cosplans against claims)
- Dispute resolution (arbitration or small claims)
- Modification rights (Cosplans can modify terms)
- Termination (Cosplans can terminate accounts)
- Governing law (which jurisdiction)
- Entire agreement clause

**Functional Requirements**:
- **FR-011**: Terms MUST be accessible from footer
- **FR-012**: Terms MUST be presented at signup for acceptance
- **FR-013**: Terms MUST be in plain language where possible
- **FR-014**: Terms MUST clearly define what content users own
- **FR-015**: Terms MUST limit Cosplans' liability
- **FR-016**: Terms MUST specify prohibited uses
- **FR-017**: Terms MUST be updated with 30-day notice to users
- **FR-018**: Old versions of terms MUST be archived
- **FR-019**: Terms MUST address copyright/IP infringement
- **FR-020**: Terms MUST clarify account termination conditions

#### 3. Cookie Policy
**Contents**:
- What cookies are (definition, technology)
- Cookies Cosplans uses (session, preferences, analytics)
- Purpose of each cookie
- How long cookies stored
- How to manage cookies
- Option to refuse cookies
- Link to privacy policy

**Functional Requirements**:
- **FR-021**: Cookie policy MUST be accessible from footer
- **FR-022**: Cookie policy MUST explain each cookie type
- **FR-023**: Cookie banner MUST appear on first visit
- **FR-024**: Banner MUST allow user to accept/reject all
- **FR-025**: Banner MUST allow user to customize preferences
- **FR-026**: User preferences MUST be saved and respected
- **FR-027**: Rejected cookies MUST not be set (except technically necessary)
- **FR-028**: Cookie settings MUST be changeable in user preferences

#### 4. GDPR Compliance Features
- **FR-029**: System MUST provide data access capability (users can download data)
- **FR-030**: System MUST provide data deletion capability (users can request deletion)
- **FR-031**: System MUST provide data portability (export in standard format)
- **FR-032**: System MUST have legitimate interest assessment (for each data use)
- **FR-033**: System MUST collect explicit consent for marketing emails
- **FR-034**: System MUST honor data subject requests within 30 days
- **FR-035**: System MUST have Data Processing Agreement (DPA) with subprocessors
- **FR-036**: System MUST notify users of data breaches (within 72 hours)
- **FR-037**: System MUST document all data processing activities
- **FR-038**: System MUST designate Data Protection Officer (or equivalent)

#### 5. CCPA Compliance Features
- **FR-039**: System MUST show "California Privacy Rights" disclosure
- **FR-040**: System MUST allow users to request data (accessible, verifiable)
- **FR-041**: System MUST provide data in portable format
- **FR-042**: System MUST allow opt-out of data sale (if applicable)
- **FR-043**: System MUST not discriminate for exercising CCPA rights
- **FR-044**: System MUST respond to requests within 45 days
- **FR-045**: System MUST verify user identity before providing data

#### 6. Data Processing Agreement
- **FR-046**: DPA template MUST be available for B2B customers
- **FR-047**: DPA MUST specify data protection measures
- **FR-048**: DPA MUST list subprocessors and allow inspection
- **FR-049**: DPA MUST address standard contractual clauses (for GDPR)
- **FR-050**: DPA MUST be reviewed by legal counsel

### Key Entities

- **LegalDocument**: Stores legal docs
  - Attributes: id, type (privacy/terms/cookies/dpa), content, version, approved_date, effective_date, updated_at
  - Relationships: has_many Versions

- **UserConsent**: Tracks user acceptance
  - Attributes: id, user_id, document_type, version, accepted_at, ip_address
  - Relationships: belongs_to User, belongs_to LegalDocument

- **DataRequest**: GDPR/CCPA data requests
  - Attributes: id, user_id, request_type (access/delete/portability), status, requested_at, responded_at, request_data (JSON)
  - Relationships: belongs_to User

- **CookiePreference**: User cookie settings
  - Attributes: id, user_id, preference_type (analytics/marketing/functional), accepted, set_at
  - Relationships: belongs_to User

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of legal documents present and accessible before launch
- **SC-002**: Legal review completed and approved (by attorney or legal counsel)
- **SC-003**: 0 legal compliance violations
- **SC-004**: GDPR data access request completes in under 30 days
- **SC-005**: GDPR data deletion request completes in under 30 days
- **SC-006**: CCPA requests comply with 45-day requirement
- **SC-007**: Cookie banner appears on first visit and complies with ePrivacy directive
- **SC-008**: All third-party services are documented in privacy policy
- **SC-009**: Data breach notification system is documented (if required)
- **SC-010**: Legal documents are version-controlled and archived

---

## Assumptions

- Company has access to legal counsel or template resources
- Data will be stored in compliant manner (encryption at rest, TLS in transit)
- Data retention policy is defined separately
- Initial launch does not include international expansion (expand compliance later)
- Subprocessors are clearly documented (Supabase, AWS, etc.)

---

## Dependencies

- **Blocks**: Public launch (cannot go live without legal docs)
- **Depends on**: Business decisions (data retention, marketing policy, etc.)
- **Required**: Legal review before launch

---

## Out of Scope (For Future Phases)

- Multiple language versions of legal docs (US English primary for MVP)
- Advanced consent management platform (CMP)
- Blockchain-based consent verification
- Automated compliance monitoring
- GDPR fines insurance
- Advanced security/penetration testing
