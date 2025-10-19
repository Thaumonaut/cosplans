# Checklist: 043-Dev Testing Dashboard & Visual Verification

## Requirements Completion

### Dashboard Core
- [ ] REQ-001: Dev dashboard only accessible in development mode
- [ ] REQ-002: Dashboard excluded from production builds
- [ ] REQ-003: Optional password protection for staging
- [ ] REQ-004: Navigation sidebar with Tests/Components/Coverage/API Mocks sections
- [ ] REQ-005: Real-time status indicators for test execution
- [ ] REQ-006: Responsive design works on mobile/tablet

### Test Execution
- [ ] REQ-007: "Run All Unit Tests" button with progress streaming
- [ ] REQ-008: Run individual test suites/files
- [ ] REQ-009: Results display pass/fail counts, timing, memory
- [ ] REQ-010: Failed tests show error messages and stack traces
- [ ] REQ-011: Filter tests by status, file, or name
- [ ] REQ-012: Can cancel test execution mid-run
- [ ] REQ-013: Historical test runs stored (last 50)

### Visual Component Showcase
- [ ] REQ-014: Auto-discover components from `*.stories.ts` files
- [ ] REQ-015: Components render in isolated iframe sandbox
- [ ] REQ-016: Prop controls auto-generated from TypeScript types
- [ ] REQ-017: Toggle booleans, select enums, input strings/numbers
- [ ] REQ-018: Component state preserved across navigation
- [ ] REQ-019: Screenshot capture for current state
- [ ] REQ-020: Side-by-side comparison with baseline screenshots
- [ ] REQ-021: Accessibility audit report (aXe integration)

### E2E Test Debugging
- [ ] REQ-022: E2E tests run in headed mode with viewport streaming
- [ ] REQ-023: Network tab shows requests with status, timing, payload
- [ ] REQ-024: Console logs captured in real-time
- [ ] REQ-025: Screenshots at each major step
- [ ] REQ-026: Failed assertions show diff viewer
- [ ] REQ-027: Can pause and inspect DOM
- [ ] REQ-028: Playwright trace viewer embedded

### Coverage Visualization
- [ ] REQ-029: Coverage from Vitest Istanbul output
- [ ] REQ-030: File tree with per-file/directory percentages
- [ ] REQ-031: Line-by-line coverage highlighting
- [ ] REQ-032: Red for uncovered, green for covered
- [ ] REQ-033: Branch coverage for conditionals
- [ ] REQ-034: Coverage trends over time
- [ ] REQ-035: Warning if <70% coverage

### API Mock Management
- [ ] REQ-036: List all MSW handlers with responses
- [ ] REQ-037: Inline JSON editor for responses
- [ ] REQ-038: Toggle endpoints on/off
- [ ] REQ-039: Add network delays (50ms/500ms/2s)
- [ ] REQ-040: Trigger error responses (400/401/403/404/500/503)
- [ ] REQ-041: Request history (last 100 calls)
- [ ] REQ-042: Mock state in sessionStorage

### Performance
- [ ] REQ-043: Dashboard loads in <1s
- [ ] REQ-044: Test execution starts <500ms
- [ ] REQ-045: Real-time updates <100ms latency
- [ ] REQ-046: Component sandbox renders <300ms

### Accessibility
- [ ] REQ-047: All controls keyboard accessible
- [ ] REQ-048: Screen reader announces results/status
- [ ] REQ-049: Focus management for modals
- [ ] REQ-050: Color-blind friendly indicators

---

## Success Criteria Testing

- [ ] Can run all unit tests from browser, results in <5s
- [ ] Can view any component in all states without test code
- [ ] E2E debugging takes <50% time vs CLI-only
- [ ] Can identify untested code in <1 minute
- [ ] Can switch API responses without touching files
- [ ] 80%+ team uses dashboard weekly (after rollout)

---

## Routes to Create

- [ ] `/dev/+layout.svelte` - Dev guard and navigation
- [ ] `/dev/tests/+page.svelte` - Test dashboard
- [ ] `/dev/tests/[type]/+page.svelte` - Filtered tests (unit/integration/e2e)
- [ ] `/dev/components/+page.svelte` - Component list
- [ ] `/dev/components/[component]/+page.svelte` - Component sandbox
- [ ] `/dev/coverage/+page.svelte` - Coverage report
- [ ] `/dev/coverage/[file]/+page.svelte` - File coverage detail
- [ ] `/dev/api-mocks/+page.svelte` - Mock management

---

## API Endpoints to Create

- [ ] `/api/dev/run-tests/+server.ts` - Trigger test runs (POST)
- [ ] `/api/dev/test-results/+server.ts` - Fetch results + SSE (GET)
- [ ] `/api/dev/coverage/+server.ts` - Fetch coverage (GET)
- [ ] `/api/dev/components/+server.ts` - List components (GET)
- [ ] `/api/dev/mocks/+server.ts` - Manage mocks (GET/PUT)

---

## Utilities to Create

- [ ] `src/lib/dev/test-runner.ts` - Bun test execution wrapper
- [ ] `src/lib/dev/component-registry.ts` - Auto-discover components
- [ ] `src/lib/dev/coverage-parser.ts` - Parse Istanbul JSON
- [ ] `src/lib/dev/mock-manager.ts` - MSW handler management
- [ ] `src/lib/dev/screenshot-service.ts` - Capture/compare screenshots

---

## Configuration Updates

- [ ] Update `vitest.config.ts` with JSON coverage output
- [ ] Update `playwright.config.ts` with debug mode
- [ ] Add dev route exclusion in `svelte.config.js`
- [ ] Add CSP headers for iframe embedding
- [ ] Add `.env.DEV_PASSWORD` for staging protection

---

## Testing

### Unit Tests
- [ ] Test runner spawns Bun processes correctly
- [ ] Coverage parser handles Istanbul JSON format
- [ ] Component registry finds all `*.stories.ts` files
- [ ] Mock manager persists state in sessionStorage

### Integration Tests
- [ ] Test execution streams results via SSE
- [ ] Component sandbox renders isolated components
- [ ] Coverage report updates when tests run
- [ ] Mock changes affect API requests

### E2E Tests
- [ ] Full workflow: Navigate → Run tests → View results
- [ ] Component showcase: Navigate → Select → Toggle props
- [ ] Coverage viewer: Navigate → Browse files → View lines
- [ ] Mock manager: Navigate → Edit response → Test component

---

## Documentation

- [ ] Developer guide: How to write component stories
- [ ] README: How to access and use dev dashboard
- [ ] Architecture doc: How test runner integration works
- [ ] Troubleshooting guide: Common issues and solutions

---

## Status

**Overall Progress**: 0% (0/50 requirements complete)

**Blocked By**: None (independent infrastructure)

**Blocking**: None (enhances all other features)

**Priority**: P2 (Developer Experience - High value but not critical path)

**Next Steps**:
1. Create basic dev layout with navigation
2. Implement test execution endpoint
3. Build test results dashboard with SSE
4. Add component registry and sandbox
5. Integrate coverage parser
6. Add mock management interface
