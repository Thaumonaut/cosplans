# Specification 043: Development Testing Dashboard & Visual Verification

**Feature**: Interactive dashboard for visualizing test results, running tests on-demand, and verifying UI component functionality in development environment.

**Status**: 📋 SPECIFICATION (Not yet implemented)

---

## Overview

Developers need a unified interface to visualize test results, run tests on-demand, and manually verify UI components during development. This dev-only dashboard provides real-time test execution, visual component showcases, and integration testing tools to improve developer productivity and catch issues early.

---

## User Scenarios & Testing

### Scenario 1: Developer Runs Tests During Development
**User**: Developer working on a new component
**When**: Making changes to a Svelte component
**Then**:
- Navigate to `/dev/tests` in browser
- See live test status dashboard with last run times
- Click "Run Unit Tests" button
- Tests execute in real-time with progress indicator
- Results display with pass/fail counts, timing, and coverage
- Failed tests show detailed error messages and stack traces
- Can filter by test file, component, or status

**Why**: Immediate feedback loop without leaving browser or switching to terminal

**Testing**:
- [ ] Dashboard loads with test suites listed
- [ ] "Run Tests" button triggers test execution
- [ ] Results update in real-time via WebSocket
- [ ] Failed tests show detailed error output
- [ ] Can filter/search test results

---

### Scenario 2: Visual Component Verification
**User**: Designer/Developer reviewing UI components
**When**: Need to verify component looks correct across states
**Then**:
- Navigate to `/dev/components` in browser
- See list of all UI components with thumbnails
- Click on "Sidebar" component
- Component renders in isolated sandbox with state controls
- Can toggle props (collapsed/expanded, themes, etc.)
- Can test interactions (click, hover, keyboard)
- Screenshot comparison with baseline (if available)

**Why**: Visual regression testing and state verification without writing Playwright tests for every state

**Testing**:
- [ ] Component list loads with all registered components
- [ ] Clicking component loads isolated sandbox
- [ ] State controls allow toggling all props
- [ ] Component renders correctly in all states
- [ ] Can capture screenshots for comparison

---

### Scenario 3: Integration Test Debugging
**User**: Developer debugging failing E2E test
**When**: Playwright test fails on CI but passes locally
**Then**:
- Navigate to `/dev/tests/e2e`
- See list of E2E test files with last run status
- Click "Run with Debug" on failing test
- Test executes with browser viewport visible in iframe
- Can see network requests, console logs, and screenshots
- Can pause execution and inspect DOM
- Failed assertion shows expected vs actual values

**Why**: Faster debugging cycle than running Playwright in terminal with `--debug` flag

**Testing**:
- [ ] E2E tests can be triggered from dashboard
- [ ] Browser viewport streams to iframe
- [ ] Network tab shows all requests/responses
- [ ] Console logs display in real-time
- [ ] Failed assertions show diff viewer

---

### Scenario 4: Test Coverage Visualization
**User**: Team lead reviewing test coverage
**When**: Checking if new feature has adequate tests
**Then**:
- Navigate to `/dev/coverage`
- See interactive coverage report with file tree
- Click on `src/lib/components/layout/Sidebar.svelte`
- See line-by-line coverage highlighting
- Uncovered lines highlighted in red
- Can drill down to see which tests cover which lines
- Coverage trends over time shown in graph

**Why**: Understand test gaps and ensure 70% constitutional minimum

**Testing**:
- [ ] Coverage report loads from last test run
- [ ] File tree shows coverage percentages
- [ ] Line-by-line highlighting shows covered/uncovered code
- [ ] Trends graph shows coverage over time
- [ ] Can generate fresh coverage report

---

### Scenario 5: Mock API Inspection
**User**: Developer testing API integration
**When**: Component makes API calls during development
**Then**:
- Navigate to `/dev/api-mocks`
- See list of all MSW mock handlers
- Can view/edit mock responses
- Toggle specific endpoints on/off
- Add delays to simulate slow network
- Trigger error responses to test error handling
- See history of requests made to mocks

**Why**: Test edge cases and error states without backend changes

**Testing**:
- [ ] All MSW handlers listed with current config
- [ ] Can edit mock response data inline
- [ ] Delay and error toggles work correctly
- [ ] Request history shows all mock API calls
- [ ] Changes persist across page reloads (dev session)

---

## Clarifications

### Session: 2025-10-18

**Q1: Scope of Dashboard**  
**Answer**: Dev-only (`/dev/*` routes), not accessible in production. Protected by dev environment check and optional password in staging.

**Impact**: Add environment guards, exclude from production build, add optional password protection for staging deploys.

**Q2: Test Runner Integration**  
**Answer**: Use existing test infrastructure (Vitest, Playwright). Dashboard triggers tests via API endpoints that spawn Bun processes.

**Impact**: Create API endpoints (`/api/dev/run-tests`) that execute `bun test` and stream results. No custom test runner needed.

**Q3: Component Sandbox Approach**  
**Answer**: Similar to Storybook but lighter weight. Components register themselves via auto-discovery or explicit exports in `*.stories.ts` files.

**Impact**: Create component registry system, auto-scan for `*.stories.ts` files, render in isolated iframe with prop controls.

**Q4: Real-time Updates**  
**Answer**: Use Server-Sent Events (SSE) for test progress streaming. WebSocket for interactive debugging sessions.

**Impact**: Implement SSE endpoint for test execution, WebSocket endpoint for debug sessions, client-side event handlers.

**Q5: Coverage Report Format**  
**Answer**: Use Vitest's built-in Istanbul coverage. Parse JSON report and render as interactive HTML.

**Impact**: Configure Vitest for JSON coverage output, create parser for Istanbul JSON format, render as file tree with line highlighting.

---

## Requirements

### Dashboard Core
- **REQ-001**: Dev dashboard must only be accessible in development mode (`import.meta.env.DEV`)
- **REQ-002**: Dashboard must be excluded from production builds
- **REQ-003**: Optional password protection for staging environments
- **REQ-004**: Navigation sidebar with sections: Tests, Components, Coverage, API Mocks
- **REQ-005**: Real-time status indicators showing test execution state
- **REQ-006**: All pages must be responsive and work on mobile/tablet (for testing on devices)

### Test Execution
- **REQ-007**: "Run All Unit Tests" button triggers `bun test` with progress streaming
- **REQ-008**: "Run Specific Suite" allows running individual test files
- **REQ-009**: Test results display with pass/fail counts, execution time, and memory usage
- **REQ-010**: Failed tests show full error messages, stack traces, and code context
- **REQ-011**: Can filter tests by status (passed/failed/skipped), file name, or test name
- **REQ-012**: Test execution can be cancelled mid-run
- **REQ-013**: Historical test runs stored with timestamps (last 50 runs)

### Visual Component Showcase
- **REQ-014**: Component list auto-discovered from `*.stories.ts` files
- **REQ-015**: Each component renders in isolated iframe sandbox
- **REQ-016**: Prop controls auto-generated from TypeScript types
- **REQ-017**: Can toggle boolean props, select enums, input strings/numbers
- **REQ-018**: Component state preserved when navigating away and back
- **REQ-019**: Screenshot capture for current component state
- **REQ-020**: Side-by-side comparison with baseline screenshots (if available)
- **REQ-021**: Accessibility audit report for each component (aXe integration)

### E2E Test Debugging
- **REQ-022**: E2E tests run in headed mode with viewport streamed to dashboard
- **REQ-023**: Network tab shows all requests with status, timing, and payload
- **REQ-024**: Console logs captured and displayed in real-time
- **REQ-025**: Screenshots captured at each major step
- **REQ-026**: Failed assertions show expected vs actual with diff viewer
- **REQ-027**: Can pause execution and inspect DOM at any point
- **REQ-028**: Playwright trace viewer embedded for failed tests

### Coverage Visualization
- **REQ-029**: Coverage report generated from Vitest Istanbul output
- **REQ-030**: File tree shows coverage percentages per file/directory
- **REQ-031**: Clicking file shows line-by-line coverage highlighting
- **REQ-032**: Uncovered lines highlighted in red, covered in green
- **REQ-033**: Branch coverage shown for conditionals
- **REQ-034**: Coverage trends graph shows history over time
- **REQ-035**: Warning if coverage drops below 70% constitutional minimum

### API Mock Management
- **REQ-036**: List all MSW mock handlers with current responses
- **REQ-037**: Inline editor for mock response JSON
- **REQ-038**: Toggle individual endpoints on/off
- **REQ-039**: Add network delay (50ms, 500ms, 2s options)
- **REQ-040**: Trigger error responses (400, 401, 403, 404, 500, 503)
- **REQ-041**: Request history shows last 100 mock API calls
- **REQ-042**: Mock state persists in sessionStorage (dev session only)

### Performance
- **REQ-043**: Dashboard loads in <1s
- **REQ-044**: Test execution starts within 500ms of button click
- **REQ-045**: Real-time updates have <100ms latency
- **REQ-046**: Component sandbox renders in <300ms

### Accessibility
- **REQ-047**: All dashboard controls keyboard accessible
- **REQ-048**: Screen reader announces test results and status changes
- **REQ-049**: Focus management when modals open/close
- **REQ-050**: Color-blind friendly status indicators (icons + colors)

---

## Success Criteria

1. **Test Execution**: Can run all unit tests from browser, see results in <5s for typical suite
2. **Visual Verification**: Can view any UI component in all states without writing test code
3. **Debug Efficiency**: Debugging E2E failure takes <50% of time compared to CLI-only workflow
4. **Coverage Clarity**: Can identify untested code paths in <1 minute
5. **Mock Control**: Can switch API responses without touching code files
6. **Developer Adoption**: 80%+ of team uses dashboard at least weekly

---

## Key Entities

### TestRun
```typescript
interface TestRun {
  id: string;
  type: 'unit' | 'integration' | 'e2e';
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'passed' | 'failed' | 'cancelled';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number; // milliseconds
  coverage?: CoverageReport;
  results: TestResult[];
}

interface TestResult {
  file: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: {
    message: string;
    stack: string;
    expected?: any;
    actual?: any;
  };
}
```

### ComponentStory
```typescript
interface ComponentStory {
  id: string;
  componentName: string;
  filePath: string;
  stories: Story[];
}

interface Story {
  name: string;
  props: Record<string, any>;
  description?: string;
  screenshot?: string;
}
```

### CoverageReport
```typescript
interface CoverageReport {
  total: {
    lines: { covered: number; total: number; pct: number };
    statements: { covered: number; total: number; pct: number };
    functions: { covered: number; total: number; pct: number };
    branches: { covered: number; total: number; pct: number };
  };
  files: Record<string, FileCoverage>;
}

interface FileCoverage {
  path: string;
  lines: Record<number, number>; // line number -> hit count
  statements: Record<string, number>;
  functions: Record<string, number>;
  branches: Record<string, number>;
}
```

### MockHandler
```typescript
interface MockHandler {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  enabled: boolean;
  delay: number; // milliseconds
  response: {
    status: number;
    body: any;
    headers?: Record<string, string>;
  };
}

interface MockRequest {
  timestamp: Date;
  method: string;
  path: string;
  query?: Record<string, string>;
  body?: any;
  response: {
    status: number;
    body: any;
    duration: number;
  };
}
```

---

## Edge Cases

1. **Large Test Suites**: If test suite has >1000 tests, paginate results and show summary first
2. **Long-Running Tests**: If test runs >30s, show progress indicator and allow cancellation
3. **Memory Leaks**: If test execution causes memory issues, show warning and restart test process
4. **Concurrent Runs**: If multiple test runs triggered, queue them and show queue status
5. **Network Failures**: If SSE connection drops, show reconnection indicator and buffer events
6. **Large Coverage Files**: If coverage report >10MB JSON, show compressed view with expand-on-demand
7. **Component Errors**: If component throws error in sandbox, show error boundary with stack trace
8. **Screenshot Storage**: Limit screenshots to last 100 per component, auto-delete old ones

---

## Acceptance Scenarios

### Given: Developer is working on Sidebar component
**When**: Developer navigates to `/dev/components/Sidebar`
**Then**:
- Sidebar component loads in isolated sandbox
- Prop controls show: `collapsed` (boolean), `theme` (select)
- Can toggle between collapsed/expanded states
- Theme selector shows all available themes
- Component updates immediately when props change
- Screenshot button captures current state
- Accessibility audit shows any violations

### Given: Unit test fails in CI
**When**: Developer opens `/dev/tests` and clicks "Run Unit Tests"
**Then**:
- Progress bar shows test execution progress
- Failed test appears in results list with red indicator
- Clicking failed test expands to show error message
- Stack trace points to exact line of failure
- Expected vs actual values shown in diff viewer
- "Open in VS Code" button opens file at failing line

### Given: Need to test component with slow API
**When**: Developer opens `/dev/api-mocks` and adds 2s delay to `/api/shoots` endpoint
**Then**:
- Delay setting saved to sessionStorage
- All requests to `/api/shoots` delayed by 2s
- Component shows loading state correctly
- Request history shows 2s duration for delayed requests
- Can remove delay to return to normal speed

---

## Dependencies

**Depends On**:
- None (independent infrastructure)

**Required By**:
- All specs with UI components (001-017, 020-024, 030-042)
- Testing requirements across all features

---

## Technology Stack

- **Frontend**: SvelteKit (dashboard pages)
- **Test Runner**: Vitest (unit/integration), Playwright (E2E)
- **Coverage**: Istanbul (via Vitest)
- **API Mocking**: MSW (Mock Service Worker)
- **Real-time**: Server-Sent Events (test progress), WebSocket (debug sessions)
- **Code Highlighting**: Shiki (syntax highlighting in coverage viewer)
- **Diff Viewer**: diff2html (expected vs actual comparison)
- **Screenshots**: Playwright screenshot API
- **Accessibility**: @axe-core/playwright (a11y audits)

---

## Assumptions & Constraints

1. Dashboard only accessible in development mode
2. Test execution spawns Bun child processes
3. Component stories follow naming convention (`ComponentName.stories.ts`)
4. Coverage reports generated by Vitest in JSON format
5. MSW handlers defined in `src/mocks/` directory
6. Dashboard excluded from production bundle
7. Historical data stored in browser (localStorage/sessionStorage, not database)

---

## Implementation Notes

### Route Structure
```
/dev/
  +layout.svelte (dev guard, navigation)
  tests/
    +page.svelte (test dashboard)
    [type]/
      +page.svelte (filtered by unit/integration/e2e)
  components/
    +page.svelte (component list)
    [component]/
      +page.svelte (component sandbox)
  coverage/
    +page.svelte (coverage report)
    [file]/
      +page.svelte (file coverage detail)
  api-mocks/
    +page.svelte (mock management)
```

### API Endpoints
```
/api/dev/
  run-tests/
    +server.ts (POST - trigger test run)
  test-results/
    +server.ts (GET - fetch results, SSE for live updates)
  coverage/
    +server.ts (GET - fetch coverage report)
  components/
    +server.ts (GET - list registered components)
  mocks/
    +server.ts (GET/PUT - manage mock handlers)
```

### Security Considerations
- Dev routes protected by `import.meta.env.DEV` check
- Optional password in staging: environment variable `DEV_PASSWORD`
- No sensitive data stored (test results are ephemeral)
- Production builds exclude entire `/dev/*` route tree
- CSP headers allow iframe embedding for component sandbox

---

## Related Files

- `src/routes/dev/+layout.svelte` (to be created)
- `src/routes/dev/tests/+page.svelte` (to be created)
- `src/routes/dev/components/+page.svelte` (to be created)
- `src/routes/dev/coverage/+page.svelte` (to be created)
- `src/routes/dev/api-mocks/+page.svelte` (to be created)
- `src/routes/api/dev/run-tests/+server.ts` (to be created)
- `src/lib/dev/test-runner.ts` (to be created - Bun test execution wrapper)
- `src/lib/dev/component-registry.ts` (to be created - auto-discover components)
- `src/lib/dev/coverage-parser.ts` (to be created - Istanbul JSON parser)
- `vitest.config.ts` (update with JSON coverage output)
- `playwright.config.ts` (update with debug mode config)
