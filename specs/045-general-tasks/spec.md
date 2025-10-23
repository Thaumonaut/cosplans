# Feature Specification: General Tasks Management

**Feature Branch**: `045-general-tasks`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: General task management for non-resource specific activities like reaching out to contacts, research, planning activities, etc.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create General Tasks (Priority: P1)

As a team member, I want to create general tasks that aren't specific to props or outfits so that I can track miscellaneous activities like reaching out to photographers, researching locations, or planning team meetings.

**Why this priority**: Core functionality for general task management - essential for comprehensive project tracking beyond resource-specific tasks.

**Independent Test**: User can create a task with title, description, assignee, due date, and priority level.

**Acceptance Scenarios**:

1. **Given** I'm on the general tasks page, **When** I click "Create Task" and fill in "Reach out to photographer John about availability", **Then** task is created and appears in my task list
2. **Given** I'm creating a task, **When** I assign it to "Sarah" with due date "Next Friday", **Then** task shows assigned to Sarah with proper due date
3. **Given** I'm creating a task, **When** I set priority to "High" and add notes "Check portfolio first", **Then** task displays with high priority indicator and notes
4. **Given** I'm on mobile, **When** I create a task, **Then** form is mobile-optimized and easy to complete

---

### User Story 2 - Categorize Tasks by Type (Priority: P2)

As a team organizer, I want to categorize general tasks by type (Communication, Research, Planning, Administrative, Other) so that team members can focus on their areas of responsibility.

**Why this priority**: Adds organization and helps team members understand task context and requirements.

**Independent Test**: User can assign categories to tasks, filter by category, and see category-specific progress.

**Acceptance Scenarios**:

1. **Given** I'm creating a task, **When** I select "Communication" category for "Email venue about availability", **Then** task is tagged as Communication type
2. **Given** I have tasks in multiple categories, **When** I filter by "Research" category, **Then** only research tasks are displayed
3. **Given** I'm viewing my dashboard, **When** I see task summary, **Then** it shows "Communication: 3 tasks, Research: 1 task, Planning: 2 tasks"
4. **Given** I'm the photographer, **When** I view tasks, **Then** I can focus on Communication and Research categories relevant to my role

---

### User Story 3 - Link Tasks to Shoots (Priority: P3)

As a project manager, I want to optionally link general tasks to specific shoots so that I can see all related activities in one place and ensure nothing falls through the cracks.

**Why this priority**: Provides context and helps with project organization, but tasks should work independently too.

**Independent Test**: User can link tasks to shoots, view tasks by shoot, and see task context within shoot details.

**Acceptance Scenarios**:

1. **Given** I'm creating a task "Book photographer for convention shoot", **When** I link it to "Convention 2025" shoot, **Then** task appears in both general tasks and shoot details
2. **Given** I'm viewing a shoot, **When** I check the tasks section, **Then** I see all linked general tasks for that shoot
3. **Given** I have a task linked to a shoot, **When** the shoot is cancelled, **Then** I get a notification to update or unlink the task
4. **Given** I'm viewing general tasks, **When** I see a linked task, **Then** it shows which shoot it's linked to with a clickable link

---

### User Story 4 - Task Templates and Recurring Tasks (Priority: P4)

As a frequent organizer, I want to create task templates and set up recurring tasks so that I don't have to recreate common activities for each project.

**Why this priority**: Efficiency feature for repeat users - valuable time-saver but not essential for basic functionality.

**Independent Test**: User can save task as template, create recurring tasks, and apply templates to new projects.

**Acceptance Scenarios**:

1. **Given** I have a completed task "Send shoot details to team", **When** I save it as template "Team Communication", **Then** template is available for future use
2. **Given** I'm creating a new shoot, **When** I apply "Team Communication" template, **Then** all template tasks are created for the new shoot
3. **Given** I have a recurring task "Weekly team check-in", **When** I set it to repeat weekly, **Then** new instances are automatically created
4. **Given** I'm managing templates, **When** I edit a template, **Then** changes affect only future uses, not existing tasks

---

### Edge Cases

- What happens when a task is assigned to someone who leaves the team? (Reassignment prompt, or revert to unassigned)
- How to handle tasks that become irrelevant due to project changes? (Archive or mark as cancelled with reason)
- Should there be task dependencies between general tasks? (Future enhancement: task chains and prerequisites)
- How to handle tasks that span multiple shoots or are ongoing? (Support for multi-shoot tasks or project-level tasks)
- What if a task needs to be split into multiple subtasks? (Support for task breakdown and subtask management)
- How to handle tasks that require external tools or integrations? (Support for task descriptions with links to external resources)
- Should there be task time tracking? (Future enhancement: time logging and estimation)
- How to handle task attachments or file uploads? (Support for task-related documents and images)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating general tasks with title, description, assignee, due date, priority, and category
- **FR-002**: System MUST support task categories: Communication, Research, Planning, Administrative, Other
- **FR-003**: System MUST allow assigning tasks to team members with real-time updates
- **FR-004**: System MUST support task priorities: Low, Medium, High, Urgent
- **FR-005**: System MUST provide task status tracking: Not Started, In Progress, Completed, Cancelled
- **FR-006**: System MUST allow optional linking of tasks to specific shoots
- **FR-007**: System MUST provide task filtering by category, assignee, status, priority, and due date
- **FR-008**: System MUST support task search by title, description, and assignee name
- **FR-009**: System MUST allow task editing and status updates with change history
- **FR-010**: System MUST provide task templates for common activities
- **FR-011**: System MUST support recurring tasks with configurable frequency
- **FR-012**: System MUST display task due dates with overdue highlighting
- **FR-013**: System MUST provide task assignment notifications via in-app and email
- **FR-014**: System MUST support bulk task operations: assign, change status, delete
- **FR-015**: System MUST provide task progress tracking and completion statistics
- **FR-016**: System MUST support task comments and collaboration
- **FR-017**: System MUST allow task archiving for completed or cancelled tasks
- **FR-018**: System MUST provide mobile-optimized task management interface
- **FR-019**: System MUST support task export for reporting and backup
- **FR-020**: System MUST provide task dashboard with summary statistics and recent activity

### Key Entities

- **GeneralTask**: Main task entity. Attributes: id, title, description, category, priority, status, assignee_id, creator_id, due_date, created_at, updated_at, completed_at, shoot_id (optional), template_id (optional), recurring_config (optional)
- **TaskTemplate**: Reusable task pattern. Attributes: id, name, description, category, priority, estimated_duration, created_by, is_team_shared, created_at, updated_at
- **TaskComment**: Task collaboration. Attributes: id, task_id, user_id, comment, created_at, updated_at
- **TaskHistory**: Change tracking. Attributes: id, task_id, field_name, old_value, new_value, changed_by, changed_at
- **RecurringTaskConfig**: Recurring task settings. Attributes: id, task_id, frequency (daily/weekly/monthly), interval, end_date (optional), created_at

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a task in under 30 seconds
- **SC-002**: Task assignment notifications delivered within 5 seconds
- **SC-003**: Task filtering and search results display within 1 second
- **SC-004**: Mobile task interface supports one-handed operation
- **SC-005**: 90% of tasks are completed by their due date
- **SC-006**: Task templates reduce task creation time by 60%
- **SC-007**: Recurring tasks are created automatically with 99% reliability
- **SC-008**: Task collaboration features increase team engagement by 40%
- **SC-009**: Task export completes within 10 seconds for 1000+ tasks
- **SC-010**: Task dashboard loads within 2 seconds with real-time updates

---

## Data Model

### GeneralTask
```typescript
interface GeneralTask {
  id: string;
  title: string;
  description?: string;
  category: 'communication' | 'research' | 'planning' | 'administrative' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  assignee_id: string;
  creator_id: string;
  due_date?: string;
  completed_at?: string;
  shoot_id?: string; // optional link to shoot
  template_id?: string; // if created from template
  recurring_config_id?: string; // if recurring task
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### TaskTemplate
```typescript
interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'research' | 'planning' | 'administrative' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_duration?: number; // in hours
  created_by: string;
  is_team_shared: boolean;
  team_id: string;
  created_at: string;
  updated_at: string;
}
```

### RecurringTaskConfig
```typescript
interface RecurringTaskConfig {
  id: string;
  task_id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // every N days/weeks/months
  end_date?: string;
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
- **Date Handling**: date-fns
- **Validation**: Zod

---

## Dependencies

**Depends On**:
- 020-user-management-and-access (user context and permissions)
- 021-shoots-teams-creation (team context and shoot linking)
- 031-notification-system (task assignment notifications)

**Required By**:
- All resource management features (for comprehensive task tracking)
- Dashboard widgets (for task summaries and progress)

---

## Implementation Notes

- Use Supabase RLS for task access control based on team membership
- Implement real-time updates for task status changes and assignments
- Create task templates as reusable patterns for common activities
- Support both standalone tasks and shoot-linked tasks
- Provide mobile-optimized interface for on-the-go task management
- Implement task history tracking for audit and collaboration
- Support task export in multiple formats (CSV, JSON, PDF)
- Create task dashboard with summary statistics and recent activity
- Implement recurring task system with configurable frequency
- Support task comments and collaboration features