# Spec Review Checklist

Use this checklist to validate each phase of the spec-driven workflow before proceeding to the next phase.

---

## Phase 1: SPECIFY Review

**Reviewer**: ________________  
**Date**: ________________  
**Spec**: `specs/[number]-[feature-name]/spec.md`

### Problem Definition
- [ ] Problem statement is clear and specific
- [ ] User pain point is well-articulated
- [ ] Success metrics are defined
- [ ] Problem aligns with user research/feedback

### User Stories
- [ ] All user personas are identified
- [ ] User stories follow "As a [role], I want [goal], so that [benefit]" format
- [ ] Edge cases and error scenarios included
- [ ] User stories are testable

### Acceptance Criteria
- [ ] Criteria are specific and measurable
- [ ] Criteria cover happy path and error cases
- [ ] Criteria are testable (can write tests from them)
- [ ] Success/failure states are clear

### Scope
- [ ] In-scope features are clearly listed
- [ ] Out-of-scope items are explicitly stated
- [ ] MVP vs future enhancements are distinguished
- [ ] Scope is achievable within timeline

### Dependencies
- [ ] All dependent features are identified
- [ ] Dependency order is clear
- [ ] Blocking dependencies are highlighted
- [ ] External API dependencies listed

### Constitutional Alignment
- [ ] Aligns with at least one constitutional principle
- [ ] Principle number and name cited
- [ ] Rationale for alignment provided
- [ ] No conflicts with other principles

### Monetization Impact
- [ ] Free tier impact assessed
- [ ] Premium tier impact assessed
- [ ] Conversion hooks identified (if applicable)
- [ ] Tier-gating logic specified

### Cost Impact
- [ ] Infrastructure costs estimated
- [ ] API costs estimated (if using external APIs)
- [ ] Storage costs estimated (if applicable)
- [ ] Cost optimization strategy identified

### Completeness
- [ ] All template sections filled out
- [ ] No placeholder text remaining
- [ ] References and links are valid
- [ ] Spec is ready for planning phase

**Approval**: ☐ Approved  ☐ Needs Revision  
**Reviewer Signature**: ________________  
**Notes**:

---

## Phase 2: PLAN Review

**Reviewer**: ________________  
**Date**: ________________  
**Plan**: `specs/[number]-[feature-name]/plan.md`

### Architecture
- [ ] Component architecture is sound
- [ ] Service boundaries are clear
- [ ] Data flow is logical
- [ ] Architecture supports scalability

### Data Model
- [ ] Tables are normalized (3NF minimum)
- [ ] Relationships are properly defined
- [ ] Indexes are planned for performance
- [ ] Data types are appropriate
- [ ] No redundant data storage

### Security
- [ ] RLS policies defined for all tables
- [ ] Permission checks documented
- [ ] Authentication requirements specified
- [ ] Data encryption addressed (if sensitive data)
- [ ] Input validation requirements listed

### API Design
- [ ] Endpoints follow REST conventions
- [ ] Request/response formats documented
- [ ] Error responses defined
- [ ] Rate limiting considered
- [ ] Versioning strategy (if applicable)

### Integration Points
- [ ] External APIs identified
- [ ] OAuth flows documented (if applicable)
- [ ] Webhook requirements specified
- [ ] Fallback behavior defined for API failures
- [ ] Integration testing approach outlined

### Performance
- [ ] Load time requirements specified
- [ ] Query optimization strategies identified
- [ ] Caching strategy defined
- [ ] CDN usage planned (if media-heavy)
- [ ] Performance testing approach outlined

### Dependency Analysis
- [ ] Build order is clear
- [ ] Foundational features identified
- [ ] Blocking dependencies highlighted
- [ ] Parallel work opportunities identified

### Cost Optimization
- [ ] Cloudflare R2 vs Supabase Storage decision made
- [ ] Cloudflare Workers vs Edge Functions decision made
- [ ] Cold storage strategy (if applicable)
- [ ] API call optimization planned
- [ ] Cost monitoring approach defined

### UI/UX Flow
- [ ] User journey is documented
- [ ] Wireframes or mockups provided (if UI-heavy)
- [ ] Mobile responsiveness addressed
- [ ] Accessibility considerations included
- [ ] Error states and loading states defined

### Completeness
- [ ] All template sections filled out
- [ ] Technical decisions are justified
- [ ] Plan is implementable by the team
- [ ] Plan aligns with spec acceptance criteria

**Approval**: ☐ Approved  ☐ Needs Revision  
**Reviewer Signature**: ________________  
**Notes**:

---

## Phase 3: TASK Review

**Reviewer**: ________________  
**Date**: ________________  
**Tasks**: `specs/[number]-[feature-name]/tasks.md`

### Task Structure
- [ ] Tasks are dependency-ordered
- [ ] Each task is < 4 hours estimated time
- [ ] Task titles are descriptive
- [ ] Task types are labeled (Database/Backend/Frontend/Testing/Docs)

### Database Tasks
- [ ] Migration files planned
- [ ] Rollback procedures documented
- [ ] RLS policies included in tasks
- [ ] Data seeding tasks (if needed)

### Backend Tasks
- [ ] API routes defined
- [ ] Business logic tasks separated
- [ ] Service layer tasks identified
- [ ] Error handling tasks included

### Frontend Tasks
- [ ] Component creation tasks listed
- [ ] Page/route tasks identified
- [ ] Form validation tasks included
- [ ] State management tasks (if needed)

### Testing Tasks
- [ ] Unit test tasks for each feature
- [ ] Integration test tasks included
- [ ] E2E test tasks (for critical flows)
- [ ] Test coverage target specified

### Documentation Tasks
- [ ] API documentation tasks
- [ ] User guide tasks (if user-facing)
- [ ] Inline code documentation tasks
- [ ] README updates (if needed)

### Deployment Tasks
- [ ] Migration execution tasks
- [ ] Environment variable tasks
- [ ] Feature flag tasks (if applicable)
- [ ] Monitoring/alerting tasks

### Acceptance Criteria
- [ ] Each task has clear acceptance criteria
- [ ] Criteria are testable
- [ ] Criteria align with spec acceptance criteria
- [ ] Success/failure states are clear

### Completeness
- [ ] All plan components have corresponding tasks
- [ ] No missing implementation steps
- [ ] Task list is complete and executable
- [ ] Estimated total time is reasonable

**Approval**: ☐ Approved  ☐ Needs Revision  
**Reviewer Signature**: ________________  
**Notes**:

---

## Phase 4: IMPLEMENT Review

**Reviewer**: ________________  
**Date**: ________________  
**Implementation**: Code in `src/`, `tests/`, `supabase/migrations/`

### Code Quality
- [ ] Code follows project style guidelines
- [ ] No debug code or console.logs
- [ ] Functions are small and focused
- [ ] Variable names are descriptive
- [ ] Complex logic is commented

### Testing
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass (if applicable)
- [ ] Test coverage ≥ 70%
- [ ] Edge cases are tested

### Acceptance Criteria
- [ ] All spec acceptance criteria met
- [ ] All task acceptance criteria met
- [ ] Success states verified
- [ ] Error states verified

### Documentation
- [ ] API documentation updated
- [ ] Inline comments added for complex logic
- [ ] README updated (if needed)
- [ ] User-facing docs updated (if needed)

### Database
- [ ] Migrations tested with rollback
- [ ] RLS policies implemented correctly
- [ ] Indexes created for performance
- [ ] No data loss risk

### Security
- [ ] Input validation implemented
- [ ] Permission checks enforced
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Sensitive data encrypted

### Performance
- [ ] Load time requirements met
- [ ] Query performance acceptable
- [ ] No N+1 query problems
- [ ] Caching implemented (if planned)
- [ ] Mobile performance acceptable

### Constitutional Compliance
- [ ] Aligns with cited constitutional principle
- [ ] Cost optimization applied
- [ ] Dependency order followed
- [ ] Monetization tier logic correct (if applicable)

### Deployment Readiness
- [ ] Environment variables documented
- [ ] Feature flags configured (if applicable)
- [ ] Rollback plan documented
- [ ] Monitoring/alerts configured (if needed)

**Approval**: ☐ Approved  ☐ Needs Revision  
**Reviewer Signature**: ________________  
**Notes**:

---

## Final Approval

**Spec-Driven Workflow Complete**: ☐ Yes  ☐ No

**All Phases Approved**:
- [ ] Phase 1: Specify
- [ ] Phase 2: Plan
- [ ] Phase 3: Task
- [ ] Phase 4: Implement

**Ready for Merge**: ☐ Yes  ☐ No

**Final Approver**: ________________  
**Date**: ________________  

---

## Notes for Solo Developers

When working solo, use this checklist with a **24-hour cooling period** between phases:

1. Complete Phase 1 (Specify) → Wait 24 hours → Self-review
2. Complete Phase 2 (Plan) → Wait 24 hours → Self-review
3. Complete Phase 3 (Task) → Wait 24 hours → Self-review
4. Complete Phase 4 (Implement) → Wait 24 hours → Self-review

The cooling period helps catch issues you might miss in the moment. Fresh eyes prevent costly rework.

---

## Common Review Failures

### Specify Phase
- ❌ Vague problem statements ("improve user experience")
- ❌ Missing acceptance criteria
- ❌ No constitutional alignment cited
- ❌ Dependencies not identified

### Plan Phase
- ❌ Denormalized database schema
- ❌ Missing RLS policies
- ❌ No error handling strategy
- ❌ Cost optimization not considered

### Task Phase
- ❌ Tasks not dependency-ordered
- ❌ Tasks too large (> 4 hours)
- ❌ Missing testing tasks
- ❌ Vague acceptance criteria

### Implement Phase
- ❌ Tests not passing
- ❌ Acceptance criteria not met
- ❌ Documentation not updated
- ❌ Performance requirements not met

---

## Revision Process

If a phase is marked "Needs Revision":

1. **Document Issues**: List specific issues in Notes section
2. **Assign Action Items**: Clear tasks for what needs to change
3. **Set Deadline**: When revised version is due
4. **Re-Review**: Schedule follow-up review after revisions
5. **Track Changes**: Document what was changed and why

---

## Checklist Version

**Version**: 1.0.0  
**Last Updated**: 2025-10-21  
**Maintained By**: Cascade AI  
**Constitutional Reference**: Principle VI.7 (Spec-Driven Development Workflow)
