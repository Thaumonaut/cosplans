# Pull Request

## Description
<!-- Provide a brief description of the changes in this PR -->

## Type of Change
<!-- Mark the relevant option with an 'x' -->
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test coverage improvement

---

## Spec-Driven Workflow Compliance ⚠️ REQUIRED

**Constitutional Requirement**: All feature development MUST follow the spec-driven workflow (Principle VI.7)

### Spec Reference
<!-- Link to the spec directory for this feature -->
- [ ] **Spec**: `specs/[number]-[feature-name]/spec.md`
- [ ] **Plan**: `specs/[number]-[feature-name]/plan.md`
- [ ] **Tasks**: `specs/[number]-[feature-name]/tasks.md`

**If this is a bug fix or minor change without a spec, explain why:**
<!-- e.g., "Fixing typo in user-facing text" or "Correcting RLS policy bug" -->

---

## Checkpoint Verification

### Phase 1: Specify
- [ ] Spec approved by: `@[reviewer]` on `[date]`
- [ ] Problem statement is clear
- [ ] User stories are complete
- [ ] Acceptance criteria are testable
- [ ] Dependencies identified

### Phase 2: Plan
- [ ] Plan approved by: `@[reviewer]` on `[date]`
- [ ] Architecture decisions documented
- [ ] Data model is normalized
- [ ] Security considerations addressed
- [ ] Performance requirements specified

### Phase 3: Task
- [ ] Tasks approved by: `@[reviewer]` on `[date]`
- [ ] Tasks are dependency-ordered
- [ ] Each task < 4 hours
- [ ] Testing tasks included
- [ ] All tasks completed

### Phase 4: Implement
- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed

---

## Constitutional Compliance

### Principle Alignment
<!-- Which constitutional principle(s) does this support? -->
- [ ] Aligns with Principle: **[Principle Number and Name]**
- [ ] Rationale: <!-- Explain how this aligns -->

### Cost Impact Assessment
<!-- Required for all changes that affect infrastructure -->
- [ ] **Cost Impact**: [None / Low / Medium / High]
- [ ] **Infrastructure Changes**: <!-- List any new services, APIs, storage -->
- [ ] **Optimization Applied**: <!-- Cloudflare R2 vs Supabase, Workers vs Edge Functions -->

### Dependency Order
- [ ] **Dependencies Built First**: [Yes / No / N/A]
- [ ] **Dependency List**: <!-- List features this depends on -->

### Monetization Impact
<!-- Does this affect free/premium tiers? -->
- [ ] **Affects Free Tier**: [Yes / No]
- [ ] **Affects Premium Tier**: [Yes / No]
- [ ] **Tier Logic Implemented**: [Yes / No / N/A]

---

## Testing

### Test Coverage
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (if applicable)
- [ ] All tests passing locally
- [ ] Test coverage ≥ 70%

### Manual Testing
<!-- Describe manual testing performed -->
- [ ] Tested in development environment
- [ ] Tested on mobile viewport (if UI change)
- [ ] Tested with different user roles (if permission change)
- [ ] Tested edge cases

---

## Database Changes

### Migrations
- [ ] Migration file created: `supabase/migrations/[timestamp]_[description].sql`
- [ ] Migration tested with rollback
- [ ] RLS policies defined for new tables
- [ ] Indexes added for performance
- [ ] Migration documented in plan

### Data Safety
- [ ] No data loss risk
- [ ] Backward compatible (or migration plan documented)
- [ ] Tested on staging data

---

## Documentation

- [ ] README updated (if needed)
- [ ] API documentation updated (if API changes)
- [ ] Spec updated (if implementation deviated from plan)
- [ ] Inline code comments added for complex logic
- [ ] User-facing documentation updated (if needed)

---

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables documented (if new)
- [ ] Feature flags configured (if applicable)
- [ ] Rollback plan documented
- [ ] Monitoring/alerts configured (if needed)

### Post-Deployment
- [ ] Deployment verified in staging
- [ ] Performance metrics checked
- [ ] Error rates monitored
- [ ] User feedback collected (if user-facing)

---

## Breaking Changes
<!-- If this is a breaking change, describe the impact and migration path -->

**Impact**:
<!-- Who/what is affected? -->

**Migration Path**:
<!-- How do users/systems migrate to the new version? -->

---

## Screenshots / Videos
<!-- For UI changes, include before/after screenshots or demo videos -->

**Before**:
<!-- Screenshot or description -->

**After**:
<!-- Screenshot or description -->

---

## Reviewer Notes
<!-- Any specific areas you want reviewers to focus on? -->

---

## Checklist Before Requesting Review

- [ ] Self-reviewed my own code
- [ ] Removed debug code and console.logs
- [ ] Followed code style guidelines
- [ ] No merge conflicts
- [ ] Branch is up to date with main
- [ ] Commit messages are clear and descriptive
- [ ] All CI/CD checks passing

---

## Related Issues/PRs
<!-- Link related issues or PRs -->

Closes #[issue-number]
Related to #[issue-number]
Depends on #[pr-number]

---

## Additional Context
<!-- Any other context or information reviewers should know -->
