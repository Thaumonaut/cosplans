# Feature Specification: Shoot Transfer Between Teams

**Feature Branch**: `001-shoot-transfer`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: User description: "Add the ability to move a shoot from one team to another. That means creating all the resources linked to that shoot on the new team as well."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Shoot Transfer (Priority: P1)

A team admin needs to transfer a complete shoot (including all costumes, props, and reference materials) from their current team to another team they belong to because the shoot is better suited for the other team's expertise or schedule.

**Why this priority**: This is the core functionality that enables organizational flexibility when team structures change or shoots are better suited for different groups.

**Independent Test**: Can be fully tested by creating a shoot with basic details on Team A, transferring it to Team B, and verifying the shoot appears in Team B with all original data intact and delivers the value of enabling cross-team shoot management.

**Acceptance Scenarios**:

1. **Given** a user is an admin of both Team A (source) and Team B (destination), and Team A has a shoot with costumes, props, and reference images, **When** the user initiates a transfer of the shoot from Team A to Team B, **Then** the shoot appears in Team B with all linked resources (costumes, props, reference images) and maintains all original data (characters, locations, dates, stages).

2. **Given** a user is only an admin of Team A but not Team B, **When** the user attempts to transfer a shoot to Team B, **Then** the system prevents the transfer and displays a clear error message indicating insufficient permissions for the destination team.

3. **Given** a shoot is in the middle of being transferred, **When** the transfer process is interrupted (network failure, app closure), **Then** the system either completes the transfer atomically or rolls back completely, ensuring data integrity and no partial transfers exist.

---

### User Story 2 - Transfer with Team Member Assignments (Priority: P2)

A team admin transferring a shoot needs to reassign team members to roles (photographer, cosplayers, makeup artists) in the destination team, as the original team members may not exist in the new team.

**Why this priority**: Member assignments are critical for shoot coordination, but the transfer can initially succeed with unassigned roles that get filled later.

**Independent Test**: Can be tested independently by transferring a shoot with assigned roles, verifying role assignments are cleared or mapped to available members in the destination team, and confirming users can reassign roles after transfer.

**Acceptance Scenarios**:

1. **Given** a shoot on Team A has members assigned to specific roles (Alice as photographer, Bob as Spiderman cosplayer), **When** the shoot is transferred to Team B where Alice exists but Bob doesn't, **Then** Alice retains her photographer role and Bob's assignment is cleared with a notification to reassign the role.

2. **Given** a shoot is transferred to a new team, **When** the transfer completes, **Then** the team admin receives a summary showing which role assignments were preserved and which need reassignment.

---

### User Story 3 - Transfer History and Audit Trail (Priority: P3)

Team admins and members need to see when a shoot was transferred between teams, who initiated it, and from which team it originated, for accountability and coordination purposes.

**Why this priority**: Audit trails are important for team coordination and troubleshooting, but not essential for the core transfer functionality to work.

**Independent Test**: Can be tested independently by performing transfers and verifying transfer history records appear in shoot details and team activity logs.

**Acceptance Scenarios**:

1. **Given** a shoot has been transferred from Team A to Team B, **When** a team member views the shoot details in Team B, **Then** the shoot displays a transfer history section showing the original team, transfer date, and who initiated the transfer.

2. **Given** multiple shoots have been transferred between teams, **When** a team admin views team activity logs, **Then** all transfer events appear with timestamps, shoot names, source/destination teams, and initiating user.

---

### User Story 4 - Selective Resource Transfer (Priority: P4)

A team admin wants to transfer a shoot but exclude certain resources (like team-specific props that won't be available to the destination team) to avoid confusion.

**Why this priority**: This adds flexibility but is not essential - users can manually remove unwanted resources after transfer in the MVP.

**Independent Test**: Can be tested independently by allowing users to select which costumes, props, and resources to include during transfer and verifying only selected items appear in the destination team.

**Acceptance Scenarios**:

1. **Given** a shoot on Team A has 5 props and 3 costumes, **When** the user initiates a transfer and deselects 2 props, **Then** the destination team receives the shoot with 3 props and 3 costumes, and the deselected props remain only on Team A.

---

### Edge Cases

- What happens when a shoot being transferred has Google Calendar events - should they be duplicated for the new team or remain with the original team?
- How does the system handle a shoot with references to Instagram posts that were saved by the original team but may violate the new team's privacy settings?
- What happens when a shoot's location (from Google Maps) has team-specific notes or permissions that don't apply to the destination team?
- How does the system handle concurrent edits to a shoot while it's being transferred (e.g., someone updates the shoot details mid-transfer)?
- What happens when a costume or prop referenced by the shoot is also used by other shoots on the source team - should it be copied or shared?
- How does the system handle transfer when the destination team has naming conflicts (shoot with same name already exists)?
- What happens when a shoot has custom workflow stages defined by the source team that don't exist in the destination team's workflow?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow team admins to initiate a transfer of any shoot they have admin permissions for to any team where they also have admin permissions.

- **FR-002**: System MUST create copies of all linked resources (costumes, props, reference images, Instagram post references, location data) in the destination team when transferring a shoot.

- **FR-003**: System MUST preserve all shoot metadata during transfer including: shoot name, description, character assignments, dates, current stage, custom stages, reference images with notes, location data, and photography equipment lists.

- **FR-004**: System MUST offer users a choice during transfer to either duplicate Google Calendar events to the destination team's shared calendar or move them exclusively, with clear explanation of each option's impact on both teams' visibility.

- **FR-005**: System MUST either preserve team member role assignments when members exist in both teams or clear assignments and notify the admin when members don't exist in the destination team.

- **FR-006**: System MUST perform transfers atomically - either all data is successfully transferred or the operation fails completely with no partial state.

- **FR-007**: System MUST record transfer history including: source team, destination team, transfer timestamp, initiating user, and maintain this history permanently with the shoot.

- **FR-008**: System MUST maintain workflow stages as separate database references rather than embedded data. When a shoot is transferred, it retains its reference to the original stage definitions, allowing stages to be managed independently from shoots and enabling shoots to reference stages from any team's workflow configuration.

- **FR-009**: System MUST prevent transfers when the user lacks admin permissions on either the source or destination team, displaying a clear permission error.

- **FR-010**: System MUST handle naming conflicts when the destination team already has a shoot with the same name by either auto-renaming, prompting user for new name, or preventing transfer.

- **FR-011**: System MUST maintain costume and prop tracking stages and subtasks during transfer, creating new instances for the destination team rather than moving the originals.

- **FR-012**: Users MUST be able to view transfer history from the shoot detail page showing all previous teams the shoot belonged to.

- **FR-013**: System MUST update all team-scoped views (calendar view, kanban board, map view) immediately after transfer to show the shoot in the destination team and remove it from the source team.

- **FR-014**: System MUST handle offline transfers by queueing the operation and completing it when connection is restored, notifying the user of pending transfers.

### Key Entities

- **Shoot Transfer**: Represents a transfer operation with source team, destination team, timestamp, initiating user, transfer status (pending/completed/failed), and linked resources transferred.

- **Transfer History Entry**: Audit record attached to a shoot showing historical team ownership with team name, transfer date, and initiating user.

- **Resource Copy**: When costumes, props, or equipment are transferred, new instances are created in the destination team linked to the transferred shoot while originals remain with source team.

- **Workflow Stage Reference**: Stages are stored as independent entities in the database with team ownership. Shoots reference stages rather than embedding stage data, allowing shoots transferred between teams to maintain their current stage reference regardless of which team's workflow defined it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Team admins can successfully transfer a complete shoot between teams in under 30 seconds for shoots with up to 20 linked resources.

- **SC-002**: 100% of shoot data (metadata, linked resources, reference materials) is accurately preserved during transfer with zero data loss.

- **SC-003**: Users can view complete transfer history for any shoot, showing all previous team ownerships and transfer events.

- **SC-004**: 95% of transfers complete successfully without requiring manual intervention or data correction.

- **SC-005**: System maintains data integrity with zero partial transfers or inconsistent states even during network interruptions.

- **SC-006**: Team members viewing team shoot lists see updated shoot membership within 3 seconds of transfer completion.

## Assumptions

- Users initiating transfers are admins of both source and destination teams (enforced by permission checks).
- Costumes and props are team-specific resources and should be copied rather than moved, allowing the source team to retain their originals.
- Reference images and Instagram post links are copied to the destination team as new entries.
- Google Maps location data is copied including any notes or custom markers.
- The transfer feature is accessible from the shoot detail page where users can edit shoots.
- Mobile offline support follows the same queueing pattern as other edit operations.
- Transfer operations are relatively infrequent (not performance-critical for high-volume scenarios).
- Workflow stages are stored as separate database entities with team ownership, allowing shoots to reference stages from any team's workflow configuration even after transfer.
