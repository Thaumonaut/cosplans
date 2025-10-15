<!--
Sync Impact Report:
- Version change: 1.1.0 → 1.2.0
- Modified principles: III. External Integration Integrity (expanded to include email reminders in v1.1.0)
- Added principles: VI. Test-Driven Development
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  * ✅ tasks-template.md: Updated test requirement from OPTIONAL to MANDATORY per TDD principle
  * ✅ plan-template.md: Already includes testing requirements, aligned with TDD principle
  * ✅ spec-template.md: Already includes testing scenarios, aligned with TDD principle
- Follow-up TODOs: None
-->

# Cosplans Constitution

## Core Principles

### I. Mobile-First Architecture
All features MUST be designed with mobile users as the primary experience. Desktop and web 
interfaces are supplementary. Core workflows (shoot creation, editing, status updates, 
calendar view) MUST be fully functional on mobile devices. Responsive design is mandatory 
for all interfaces.

**Rationale**: Cosplayers work on-location and need immediate access to shoot details, 
communication, and updates while traveling or at events.

### II. Real-Time Collaboration 
Team members MUST be able to view and edit shared data in real-time. Changes to shoots, 
costumes, props, and schedules MUST be synchronized across all team members immediately. 
Offline capability with sync-on-reconnect is required for location scouting and remote shoots.

**Rationale**: Cosplay teams coordinate complex logistics across multiple people, locations, 
and timelines requiring instant communication and updates.

### III. External Integration Integrity
Google Maps, Google Calendar, Google Docs, and email reminder integrations MUST maintain 
data consistency. Calendar events MUST sync bidirectionally. Document summaries MUST 
preserve user edits while updating automated content. Email reminders MUST be reliable and 
respect user notification preferences. API failures MUST not corrupt local data.

**Rationale**: Teams rely on existing Google ecosystem tools and communication channels. 
Email reminders ensure critical deadlines and shoot preparations are not missed. Disrupting 
these workflows would reduce adoption and productivity.

### IV. Customizable Workflow States
Teams MUST be able to customize shoot stages (idea → planning → scheduled → editing → 
posting → complete) and costume/prop tracking stages (acquisition → in-progress → ready). 
Default workflows are provided but teams can modify stage names, add/remove stages, and 
define stage transition rules.

**Rationale**: Different cosplay teams have varying processes, skill levels, and complexity 
requirements that cannot be served by rigid predefined workflows.

### V. Visual-First Content Management
Reference images, Instagram posts/reels, and progress photos MUST be first-class content 
types with inline viewing, annotation capabilities, and organized galleries. Visual content 
MUST be accessible from multiple views (calendar, kanban, detail pages) without navigation 
friction.

**Rationale**: Cosplay is fundamentally visual art requiring constant reference to source 
material, inspiration, and progress documentation.

### VI. Test-Driven Development
Tests MUST be written before implementation for all new features. Each user story MUST have 
corresponding test coverage that verifies acceptance criteria. Tests MUST be maintained as 
features evolve to ensure functionality remains tracked and verifiable. Feature completion 
is defined as passing tests, not just code existence.

**Rationale**: Test-driven development ensures features work as intended from inception, 
provides living documentation of expected behavior, catches regressions early, and enables 
confident refactoring. Without tests, feature quality degrades over time and bugs propagate 
undetected.

## Mobile-First Constraints

**Performance Requirements**: App MUST load core features within 3 seconds on 3G networks. 
Image loading MUST be progressive with low-resolution previews. Battery usage MUST not 
exceed social media app benchmarks during normal usage.

**Offline Capabilities**: Read access to shoot details, costume/prop status, and cached 
reference images MUST work offline. Edit capabilities MUST queue changes for sync when 
connection resumes. Location data MUST cache for offline map viewing.

**Touch Interface Standards**: All interactive elements MUST meet minimum 44px touch targets. 
Gesture navigation (swipe, pinch-to-zoom) MUST be intuitive. Form inputs MUST use 
appropriate mobile keyboards and validation patterns.

## Development Workflow

**Feature Priority Order**: Core CRUD operations for shoots → Mobile responsiveness → 
Calendar integration → Google Maps integration → Advanced views (kanban, map) → 
Instagram integration → Document generation.

**Testing Requirements**: Tests MUST be written before implementation (test-first approach). 
Every user story MUST have corresponding mobile device tests. Integration tests MUST verify 
Google API interactions. Performance tests MUST validate mobile network conditions and 
battery usage. Test coverage MUST be maintained as features evolve.

**Code Review Gates**: Test coverage and passing status verification required before review. 
Mobile UI changes require device testing verification. External API integrations require 
error handling and fallback behavior review. Database schema changes require migration plan 
approval.

## Governance

Constitution supersedes all feature decisions and architectural choices. All pull requests 
MUST verify mobile-first compliance, integration integrity, and test-driven development 
compliance. Feature complexity beyond core cosplay workflows MUST be justified against user 
adoption impact.

**Amendment Process**: Constitution changes require documentation of impact on existing 
integrations and mobile performance. Major principle changes require user feedback 
validation.

**Version**: 1.2.0 | **Ratified**: 2025-10-15 | **Last Amended**: 2025-10-15