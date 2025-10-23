# Feature Specification: Crew Management

**Feature Branch**: `051-crew`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: Crew management for team members, roles, skills, availability, and contact information.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage Team Members (Priority: P1)

As a team leader, I want to manage team member profiles so that I can track skills, availability, and contact information for project planning.

**Why this priority**: Core team management functionality - essential for crew coordination and project planning.

**Independent Test**: User can create team member profiles with skills, roles, and contact information.

**Acceptance Scenarios**:

1. **Given** I'm on the crew page, **When** I click "Add Member" and enter "Sarah Johnson" with role "Photographer", **Then** member profile is created with basic details
2. **Given** I'm adding a member, **When** I add skills "Portrait Photography, Event Photography" and contact info, **Then** member profile includes skills and contact details
3. **Given** I'm adding a member, **When** I set availability to "Weekends only" and add notes "Prefers outdoor shoots", **Then** member shows availability preferences
4. **Given** I'm on mobile, **When** I add a member, **Then** form is mobile-optimized and easy to complete

---

### User Story 2 - Track Skills and Specializations (Priority: P2)

As a project coordinator, I want to track team member skills and specializations so that I can assign the right people to the right projects.

**Why this priority**: Skill management and project assignment - essential for effective crew utilization.

**Independent Test**: User can assign skills, filter by specialization, and see skill-based recommendations.

**Acceptance Scenarios**:

1. **Given** I'm editing a member profile, **When** I add skills "Makeup Artistry, Special Effects", **Then** member is tagged with relevant skills
2. **Given** I have members with different skills, **When** I filter by "Photography", **Then** only photographers are displayed
3. **Given** I'm planning a project, **When** I search for "Makeup Artist", **Then** I see all members with makeup skills
4. **Given** I'm viewing member profiles, **When** I see skill summaries, **Then** I can quickly identify expertise areas

---

### User Story 3 - Manage Availability and Scheduling (Priority: P3)

As a project manager, I want to track team member availability and scheduling so that I can plan shoots and avoid conflicts.

**Why this priority**: Scheduling and conflict management - helps with project planning and resource allocation.

**Independent Test**: User can set availability, view schedules, and detect conflicts.

**Acceptance Scenarios**:

1. **Given** I'm updating member availability, **When** I set "Available weekdays 9-5", **Then** member shows current availability
2. **Given** I'm planning a shoot, **When** I check member schedules, **Then** I see who's available for the proposed date
3. **Given** I'm scheduling a project, **When** I assign members, **Then** system warns about potential conflicts
4. **Given** I'm viewing availability, **When** I see calendar view, **Then** I can quickly identify free time slots

---

### User Story 4 - Track Performance and Feedback (Priority: P4)

As a team leader, I want to track member performance and collect feedback so that I can improve team dynamics and project outcomes.

**Why this priority**: Performance management and team improvement - helps with team development and project quality.

**Independent Test**: User can record performance notes, collect feedback, and track improvement over time.

**Acceptance Scenarios**:

1. **Given** I'm reviewing a project, **When** I add performance notes "Excellent communication, delivered on time", **Then** notes are saved to member profile
2. **Given** I'm collecting feedback, **When** I request feedback from team members, **Then** feedback is collected and stored
3. **Given** I'm viewing member history, **When** I check performance trends, **Then** I see improvement over time
4. **Given** I'm planning future projects, **When** I view member strengths, **Then** I can make informed assignment decisions

---

### Edge Cases

- What happens when a team member leaves or becomes unavailable? (Mark as inactive, archive profile, transfer projects)
- How to handle team members with multiple roles or changing responsibilities? (Support for role transitions and multi-role assignments)
- What if a team member has conflicting availability or preferences? (Support for conflict resolution and preference management)
- How to handle team members who work remotely or in different time zones? (Support for remote work and time zone management)
- What if a team member needs special accommodations or equipment? (Support for accommodation tracking and resource requirements)
- How to handle team members who are contractors or freelancers? (Support for different employment types and payment tracking)
- What if a team member has performance issues or needs additional training? (Support for performance improvement plans and training tracking)
- How to handle team members who are new or inexperienced? (Support for mentorship and skill development tracking)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating team member profiles with name, role, skills, and contact information
- **FR-002**: System MUST support role categories: Photographer, Cosplayer, Makeup Artist, Prop Maker, Coordinator, Other
- **FR-003**: System MUST allow tracking multiple skills per team member with proficiency levels
- **FR-004**: System MUST support availability management with calendar integration
- **FR-005**: System MUST allow linking team members to specific projects and shoots
- **FR-006**: System MUST provide crew search by name, role, skills, and availability
- **FR-007**: System MUST support crew filtering by role, skills, availability, and performance
- **FR-008**: System MUST allow crew member editing and profile updates with history tracking
- **FR-009**: System MUST support performance tracking and feedback collection
- **FR-010**: System MUST provide conflict detection for scheduling and availability
- **FR-011**: System MUST support crew member communication and messaging
- **FR-012**: System MUST allow crew member archiving and status management
- **FR-013**: System MUST support crew member onboarding and training tracking
- **FR-014**: System MUST provide crew analytics and performance reports
- **FR-015**: System MUST support crew member preferences and accommodation tracking
- **FR-016**: System MUST allow bulk crew operations: update roles, assign to projects, archive
- **FR-017**: System MUST provide crew dashboard with recent activity and alerts
- **FR-018**: System MUST support mobile-optimized crew management
- **FR-019**: System MUST allow crew export for backup and reporting
- **FR-020**: System MUST provide crew member directory with contact information

### Key Entities

- **CrewMember**: Main crew member entity. Attributes: id, name, role, skills, contact_info, availability, performance_notes, status, created_at, updated_at, team_id
- **CrewSkill**: Skill tracking. Attributes: id, member_id, skill_name, proficiency_level, years_experience, notes, created_at
- **CrewAvailability**: Availability management. Attributes: id, member_id, available_days, available_hours, timezone, notes, created_at, updated_at
- **CrewPerformance**: Performance tracking. Attributes: id, member_id, project_id, performance_rating, feedback, notes, created_at
- **CrewProjectAssignment**: Project assignments. Attributes: id, member_id, project_id, role, start_date, end_date, status, created_at
- **CrewCommunication**: Communication tracking. Attributes: id, member_id, communication_type, message, timestamp, created_at

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a crew member in under 3 minutes
- **SC-002**: Crew search returns results within 1 second
- **SC-003**: Availability checking completes within 2 seconds
- **SC-004**: Mobile crew management supports one-handed operation
- **SC-005**: 90% of crew members have complete profiles with skills and contact info
- **SC-006**: Availability conflict detection prevents 95% of scheduling issues
- **SC-007**: Performance tracking increases team productivity by 20%
- **SC-008**: Crew dashboard loads within 3 seconds for 100+ members
- **SC-009**: Crew export completes within 10 seconds for 500+ members
- **SC-010**: Crew communication features increase team engagement by 30%

---

## Data Model

### CrewMember
```typescript
interface CrewMember {
  id: string;
  name: string;
  role: 'photographer' | 'cosplayer' | 'makeup_artist' | 'prop_maker' | 'coordinator' | 'other';
  skills: CrewSkill[];
  contact_info: {
    email: string;
    phone?: string;
    address?: string;
    social_media?: string[];
  };
  availability: CrewAvailability;
  performance_notes: string[];
  status: 'active' | 'inactive' | 'archived';
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### CrewSkill
```typescript
interface CrewSkill {
  id: string;
  member_id: string;
  skill_name: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience: number;
  notes?: string;
  created_at: string;
}
```

### CrewAvailability
```typescript
interface CrewAvailability {
  id: string;
  member_id: string;
  available_days: string[]; // ['monday', 'tuesday', etc.]
  available_hours: {
    start: string;
    end: string;
  };
  timezone: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

### CrewPerformance
```typescript
interface CrewPerformance {
  id: string;
  member_id: string;
  project_id: string;
  performance_rating: 1 | 2 | 3 | 4 | 5;
  feedback: string;
  notes?: string;
  created_at: string;
}
```

---

## Technology Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime for live updates
- **State Management**: Svelte stores
- **Icons**: Lucide Icons
- **Calendar Integration**: FullCalendar or similar
- **Validation**: Zod

---

## Dependencies

**Depends On**:
- 020-user-management-and-access (user context and permissions)
- 021-shoots-teams-creation (team context and project linking)
- 032-calendar-system (availability and scheduling)

**Required By**:
- Project planning and crew assignment
- Performance management and team development
- Communication and collaboration

---

## Implementation Notes

- Use Supabase RLS for crew access control based on team membership
- Implement real-time updates for availability and scheduling changes
- Create skill-based recommendation system for project assignments
- Support calendar integration for availability management
- Implement performance tracking with feedback collection
- Support crew member communication and messaging
- Provide mobile-optimized interface for on-the-go crew management
- Implement conflict detection for scheduling and availability
- Support crew member onboarding and training tracking
- Create crew dashboard with analytics and performance reports