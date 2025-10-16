# Phase 1 MVP Implementation: Week 11 Checklist

**Timeline**: Week 11 (5 working days)  
**Focus**: Testing, Accessibility, Performance Optimization  
**Deliverable**: GitHub PR with 70%+ coverage, WCAG 2.1 AA compliance, optimized performance  
**Dependency**: Week 1-10 must be merged first

---

## 🎯 Acceptance Criteria

### Test Coverage to 70%

- [ ] **Current Coverage Assessment**
  - Run: `npm run test:coverage`
  - Identify files below 70%
  - List uncovered code paths

- [ ] **Fill Coverage Gaps**
  - Focus on: API routes, business logic, state management
  - Less critical: UI components (visual regression testing instead)
  - Test edge cases: errors, boundary conditions, race conditions
  - Target: 70%+ overall, 80%+ for critical modules (auth, permissions, sync)

- [ ] **Test Categories**
  - Unit tests: functions, utilities, logic
  - Integration tests: API endpoints with database
  - E2E tests: critical user flows (create shoot, schedule Instagram, etc.)
  - Contract tests: API contract with frontend expectations

- [ ] **Coverage Report**
  - Generate HTML report: `npm run test:coverage -- --reporter=html`
  - Commit: `.coverage/` directory
  - Add badge to README: `Coverage: 70%+`

### Accessibility (WCAG 2.1 Level AA)

- [ ] **Keyboard Navigation**
  - Tab through all pages: no keyboard traps
  - All buttons keyboard-accessible (Enter to activate)
  - Form inputs accessible via Tab
  - Focus visible indicators (outline or highlight)

- [ ] **Screen Reader Testing**
  - Use: NVDA (Windows), JAWS, or VoiceOver (Mac)
  - Test: page structure announced correctly
  - Test: form labels announced with inputs
  - Test: error messages announced
  - Test: status badges (e.g., "Draft") announced

- [ ] **Color Contrast**
  - Text: 4.5:1 contrast ratio (normal), 3:1 (large text 18pt+)
  - Tool: axe DevTools or Lighthouse
  - Scan all pages, fix any violations

- [ ] **Images & Alt Text**
  - All images have alt text
  - Decorative images: `alt=""` (hidden from screen reader)
  - Content images: descriptive alt text
  - Example: `alt="Costume progress: front view of Pikachu costume"`

- [ ] **Form Labels**
  - All inputs have associated labels (`<label for="...">`)
  - Labels visible (not just as placeholder)
  - Error messages linked to fields: `aria-describedby="error-name"`

- [ ] **Focus Management**
  - Modal opens → focus moves to modal
  - Modal closes → focus returns to trigger button
  - Routed page change → focus moves to page title

- [ ] **Accessibility Audit**
  - Run: `npm run test:a11y` (Vitest + axe-core)
  - Generate report: violations, passes, incomplete checks
  - Address all critical/serious violations
  - Document why any violations cannot be fixed

### Performance Optimization

- [ ] **Page Load Time** (Target: <3s on 3G)
  - Measure: `npm run build && npm run preview`
  - Use: Chrome DevTools Lighthouse
  - Optimize:
    - Bundle size (code splitting, tree-shaking)
    - Images (WebP, responsive sizes, lazy loading)
    - Fonts (system fonts or optimized web fonts)
    - JavaScript (critical path only)
    - CSS (minification, unused CSS removal)

- [ ] **API Response Time** (Target: <500ms p95)
  - Measure: Add timing middleware to API routes
  - Log: request duration, endpoint, status code
  - Analyze: identify slow endpoints
  - Optimize: add database indexes, query optimization

- [ ] **Database Query Performance**
  - Add indexes on common queries:
    - `shoots`: `(team_id, created_at DESC)` - list shoots
    - `costumes`: `(team_id, status)` - filter costumes
    - `crew_members`: `(team_id)` - list team
  - Query analyzer: `EXPLAIN ANALYZE` on slow queries
  - Monitor: query execution time

- [ ] **Image Optimization**
  - Verify: Sharp pipeline creating responsive sizes
  - Verify: WebP with JPEG fallback
  - Verify: lazy loading on image galleries
  - Test: gallery with 100+ images loads quickly

- [ ] **Code Splitting**
  - Large page bundles split into chunks
  - Example: Instagram calendar is lazy-loaded route
  - Routes under `(app)` prefix are app shell + route bundles
  - Test: initial bundle <50KB (gzipped)

- [ ] **Caching Headers**
  - Set: `Cache-Control: public, max-age=31536000` for static assets
  - Set: `Cache-Control: no-cache` for HTML
  - Set: `Cache-Control: no-cache` for API endpoints with user data

- [ ] **Database Connection Pooling**
  - Supabase: verify connection pooling enabled
  - Monitor: connection usage
  - Alert: if connections near limit

### Bug Fixes & Stability

- [ ] **Regression Testing**
  - Run full test suite: `npm run test`
  - Fix any failing tests
  - All tests passing before merge

- [ ] **Error Tracking**
  - Implement: error logging to Sentry or similar (deferred to Phase 2)
  - For MVP: log errors to console + toast notifications

- [ ] **Edge Cases**
  - Test: user deletes resource while it's being edited
  - Test: network disconnects mid-upload
  - Test: user navigates away from form (unsaved changes warning)
  - Test: concurrent edits on same resource

- [ ] **Browser Compatibility**
  - Test: Chrome, Firefox, Safari (latest 2 versions)
  - Test: iOS Safari, Chrome Android
  - Use: Can I Use for API compatibility
  - Polyfills: only if needed for critical functionality

### Load Testing (Stretch Goal)

- [ ] **User Load Simulation**
  - Tool: k6 or Apache JMeter
  - Scenario: 50 concurrent users creating shoots
  - Measure: response time, error rate, CPU usage
  - Target: <2% error rate at 50 concurrent users

### Documentation

- [ ] **Test Guide** (`.specify/testing-guide.md`)
  - How to run tests locally
  - Coverage report location
  - Adding new tests (patterns, examples)
  - E2E testing best practices

- [ ] **Accessibility Guide** (`.specify/accessibility-guide.md`)
  - WCAG 2.1 AA checklist
  - How to test with screen readers
  - Color contrast verification
  - Keyboard navigation testing

- [ ] **Performance Guide** (`.specify/performance-guide.md`)
  - Page load optimization tips
  - API response time optimization
  - Image optimization pipeline
  - Database indexing strategy

- [ ] **Known Issues** (`.specify/known-issues.md`)
  - Any accessibility violations that cannot be fixed (with reasoning)
  - Performance limitations (and why)
  - Browser compatibility notes

---

## 🔗 Constitution References

**Principle VI (TDD - Test-Driven Development)**
- [ ] 70%+ code coverage across all modules
- [ ] Tests for all critical paths (auth, permissions, sync)
- [ ] Regression testing before each merge

**Principle I (Web-First, Mobile-Responsive)**
- [ ] Performance targets: <3s page load on 3G
- [ ] Responsive images: lazy loading, WebP/JPEG
- [ ] Mobile browser compatibility: iOS Safari, Chrome Android

**Principle VII (Security & Privacy)**
- [ ] No sensitive data in logs/errors
- [ ] Accessibility for users with disabilities

**Technology Stack (Constitution v2.2.0)**
- [ ] Vitest for unit/integration tests
- [ ] Playwright for E2E tests
- [ ] axe-core for accessibility audits
- [ ] Lighthouse for performance analysis

---

## 📦 Deliverables

### Tests
- [ ] Additional unit tests to reach 70%
- [ ] Additional integration tests
- [ ] Additional E2E tests
- [ ] Accessibility tests (axe-core integration)
- [ ] Performance baselines (Lighthouse runs)

### Performance Improvements
- [ ] Bundle size reduction (if needed)
- [ ] Database indexes added
- [ ] Image optimization verified
- [ ] Code splitting verified
- [ ] Caching headers configured

### Documentation
- [ ] Test guide
- [ ] Accessibility guide
- [ ] Performance guide
- [ ] Known issues list
- [ ] Coverage badge in README

---

## ⚠️ Known Considerations

| Item | Impact | Resolution |
|------|--------|-----------|
| **Load Testing** | Resource-intensive | Optional stretch goal; can use synthetic metrics instead |
| **Browser Polyfills** | Increases bundle size | Use only for critical APIs; leverage modern browsers |
| **Accessibility Violations** | May not achieve 100% AA | Document any exceptions with reasoning |

---

## 📋 Daily Breakdown

**Days 1-2**: Identify coverage gaps + fix critical gaps
- Run coverage report
- Add tests for uncovered paths
- Focus on auth, permissions, sync modules

**Days 3-4**: Accessibility improvements
- Keyboard navigation audit
- Screen reader testing
- Color contrast fixes
- Alt text verification

**Days 5**: Performance optimization + documentation
- Page load time optimization
- API response time optimization
- Database index analysis
- Performance guide + testing guide

---

## ✅ Sign-Off Criteria

**Week 11 COMPLETE when**:
1. ✅ 70%+ code coverage
2. ✅ WCAG 2.1 Level AA compliance (or documented exceptions)
3. ✅ Page load <3s on 3G (Lighthouse score >80)
4. ✅ API response times <500ms p95
5. ✅ All tests passing
6. ✅ Browser compatibility verified (Chrome, Firefox, Safari, iOS, Android)
7. ✅ Documentation complete (test, accessibility, performance guides)
8. ✅ PR approved and merged

---

**Timeline**: Week 11 of 12  
**Dependency**: Week 1-10 merged  
**Next**: Week 12 (Deployment)
