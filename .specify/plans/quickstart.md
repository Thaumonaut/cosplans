# Cosplans Quickstart Guide (Phase 1 Developer Onboarding)

**Date**: October 16, 2025  
**Version**: 1.0  
**Framework**: SvelteKit + TypeScript  
**Tech Stack Version**: Constitution v2.2.0  
**Phase**: 1 (Core Web Application)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Package Installation](#package-installation)
4. [Configuration Setup](#configuration-setup)
5. [Local Development](#local-development)
6. [Recommended Project Structure](#recommended-project-structure)
7. [Common Development Tasks](#common-development-tasks)
8. [Testing Setup](#testing-setup)
9. [Deployment Checklist](#deployment-checklist)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18.0 or later (LTS recommended)
- **npm**: v9 or later (included with Node.js)
- **Git**: v2.30 or later
- **Supabase Account**: Free tier sufficient for Phase 1 development
- **Code Editor**: VS Code recommended with Svelte extension

### Check Your Environment

```bash
node --version        # Should be v18.0+
npm --version         # Should be v9+
git --version         # Should be v2.30+
```

---

## Project Setup

### 1. Clone Repository

```bash
cd c:\Projects\Web\Vibe Coding
git clone <repository-url> cosplans
cd cosplans
```

### 2. Create SvelteKit Project (If Starting Fresh)

**Option A: Using create-svelte**

```bash
npm create svelte@latest cosplans -- --template default --typescript
cd cosplans
npm install
```

**Option B: Using existing repository** (Recommended)

```bash
# Skip this step - repository structure already exists
npm install
```

### 3. Initialize Git Workflow

```bash
# Create feature branch for Phase 1
git checkout -b 001-phase-1-core-setup
git config user.email "your.email@example.com"
git config user.name "Your Name"
```

---

## Package Installation

### Recommended Packages (from Constitution v2.2.0)

**Install all packages with locked versions**:

```bash
# Core Framework & UI
npm install --save-exact svelte@4.2.0
npm install --save-exact sveltekit@2.0.0
npm install --save-exact tailwindcss@3.3.0
npm install --save-exact shadcn-svelte@0.11.0
npm install --save-exact lucide-svelte@0.263.0

# Form Handling & Validation
npm install --save-exact sveltekit-superforms@2.0.0
npm install --save-exact zod@3.22.0

# Real-Time Sync & Conflict Resolution
npm install --save-exact yjs@13.6.0
npm install --save-exact y-protocols@1.0.6
npm install --save-exact y-websocket@1.5.0

# Database & Backend
npm install --save-exact @supabase/supabase-js@2.38.0
npm install --save-exact sharp@0.32.0
npm install --save-exact date-fns@2.30.0

# Authorization & Permissions
npm install --save-exact @casl/core@6.2.0
npm install --save-exact @casl/ability@6.2.0
npm install --save-exact @casl/svelte@5.2.0

# Testing (Dev Dependencies)
npm install --save-dev --save-exact vitest@1.0.0
npm install --save-dev --save-exact @playwright/test@1.40.0
npm install --save-dev --save-exact msw@2.0.0
npm install --save-dev --save-exact @testing-library/svelte@4.0.0
npm install --save-dev --save-exact @testing-library/user-event@14.5.0
npm install --save-dev --save-exact happy-dom@12.10.0

# Development Tools (Dev Dependencies)
npm install --save-dev --save-exact @sveltejs/adapter-auto@2.0.0
npm install --save-dev --save-exact @sveltejs/adapter-static@2.0.0
npm install --save-dev --save-exact @typescript-eslint/eslint-plugin@6.13.0
npm install --save-dev --save-exact eslint@8.55.0
npm install --save-dev --save-exact prettier@3.1.0
npm install --save-dev --save-exact svelte-check@3.6.0
```

### Quick Install Script

Create `install-packages.sh` (or `.ps1` for Windows):

```bash
#!/bin/bash
# Core packages
npm install --save-exact svelte@4.2.0 sveltekit@2.0.0 tailwindcss@3.3.0 shadcn-svelte@0.11.0 lucide-svelte@0.263.0

# Forms
npm install --save-exact sveltekit-superforms@2.0.0 zod@3.22.0

# Real-time
npm install --save-exact yjs@13.6.0 y-protocols@1.0.6 y-websocket@1.5.0

# Backend
npm install --save-exact @supabase/supabase-js@2.38.0 sharp@0.32.0 date-fns@2.30.0

# Auth & Permissions
npm install --save-exact @casl/core@6.2.0 @casl/ability@6.2.0 @casl/svelte@5.2.0

# Dev dependencies
npm install --save-dev --save-exact vitest@1.0.0 @playwright/test@1.40.0 msw@2.0.0 @testing-library/svelte@4.0.0

echo "✅ All packages installed with exact versions"
```

Run the script:

```bash
bash install-packages.sh
# or on Windows PowerShell:
# powershell -ExecutionPolicy Bypass -File install-packages.sh
```

### Verify Installation

```bash
npm list | grep -E "(svelte|zod|yjs|superforms|supabase|vitest|playwright)"
```

**Expected Output**: All packages listed with their versions

---

## Configuration Setup

### 1. SvelteKit Configuration (svelte.config.js)

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		paths: {
			base: process.env.BASE_PATH || ''
		}
	}
};

export default config;
```

### 2. Tailwind CSS Configuration (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo
        secondary: '#ec4899', // Pink
        accent: '#f59e0b', // Amber
      },
    },
  },
  plugins: [],
};
```

### 3. Tailwind CSS Import (src/app.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
body {
  @apply bg-white text-gray-900;
}

@media (prefers-color-scheme: dark) {
  body {
    @apply bg-slate-950 text-slate-50;
  }
}
```

### 4. SvelteKit Layout (src/routes/+layout.svelte)

```svelte
<script>
  import '../app.css';
</script>

<div class="flex flex-col min-h-screen">
  <header class="bg-white border-b border-gray-200 dark:bg-slate-900">
    <!-- Navigation here -->
  </header>

  <main class="flex-1">
    <slot />
  </main>

  <footer class="bg-gray-100 border-t border-gray-200 text-center py-4 dark:bg-slate-800">
    <p class="text-sm text-gray-600 dark:text-gray-400">© 2025 Cosplans. All rights reserved.</p>
  </footer>
</div>
```

### 5. Environment Variables (.env.local)

Create `.env.local` in project root (DO NOT commit to git):

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# API Configuration
PUBLIC_API_URL=http://localhost:5173
PUBLIC_API_TIMEOUT=30000

# Feature Flags
PUBLIC_ENABLE_MARKETPLACE=false
PUBLIC_ENABLE_INSTAGRAM_INTEGRATION=false

# Development
VITE_LOG_LEVEL=debug
```

### 6. TypeScript Configuration (tsconfig.json)

```json
{
	"compilerOptions": {
		"moduleResolution": "bundler",
		"lib": ["ES2020", "DOM", "DOM.Iterable"],
		"target": "ES2020",
		"module": "ESNext",
		"resolveJsonModule": true,
		"allowJs": true,
		"checkJs": true,
		"sourceMap": true,
		"strict": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"forceConsistentCasingInFileNames": true,
		"baseUrl": ".",
		"paths": {
			"$lib": ["src/lib"],
			"$lib/*": ["src/lib/*"],
			"$models": ["src/models"],
			"$services": ["src/services"],
			"$stores": ["src/stores"],
			"$types": ["src/types"]
		}
	},
	"include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.svelte"]
}
```

### 7. Vitest Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'happy-dom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			statements: 70,
			branches: 70,
			functions: 70,
			lines: 70,
		},
	},
	resolve: {
		alias: {
			$lib: resolve('./src/lib'),
			$models: resolve('./src/models'),
			$services: resolve('./src/services'),
			$stores: resolve('./src/stores'),
			$types: resolve('./src/types'),
		},
	},
});
```

### 8. Playwright Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
	],

	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
	},
});
```

---

## Local Development

### 1. Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

### 2. Supabase Local Development (Optional)

If using Supabase locally:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local Supabase
supabase start
```

### 3. IDE Extensions (VS Code)

Recommended extensions:

- **Svelte for VS Code** (svelte.svelte-vscode)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Prettier** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)
- **Thunder Client** or **REST Client** (for API testing)

---

## Recommended Project Structure

```
cosplans/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable Svelte components
│   │   │   ├── forms/           # Form components (with Superforms)
│   │   │   ├── layouts/         # Layout components
│   │   │   └── common/          # Common UI components
│   │   ├── services/            # Business logic, API calls
│   │   │   ├── supabase.ts      # Supabase client setup
│   │   │   ├── auth.ts          # Authentication service
│   │   │   ├── shoots.ts        # Shoot management
│   │   │   ├── costumes.ts      # Costume management
│   │   │   ├── sync.ts          # Real-time sync with Yjs
│   │   │   └── permissions.ts   # @casl/ability setup
│   │   ├── stores/              # Svelte stores (writable, readable)
│   │   │   ├── auth.ts          # Current user
│   │   │   ├── shoots.ts        # Shoot state
│   │   │   └── ui.ts            # UI state
│   │   ├── types/               # TypeScript types
│   │   │   ├── database.ts      # Database types
│   │   │   ├── api.ts           # API response types
│   │   │   └── domain.ts        # Domain models
│   │   └── utils/               # Utility functions
│   │       ├── date.ts          # Date helpers (date-fns)
│   │       ├── image.ts         # Image optimization (Sharp)
│   │       └── validation.ts    # Zod schemas
│   ├── routes/
│   │   ├── +layout.svelte       # Root layout
│   │   ├── +page.svelte         # Home page
│   │   ├── auth/
│   │   │   └── +page.svelte     # Login/signup
│   │   ├── shoots/
│   │   │   ├── +page.svelte     # Shoots list
│   │   │   ├── [id]/
│   │   │   │   └── +page.svelte # Shoot detail
│   │   │   └── create/
│   │   │       └── +page.svelte # Create shoot
│   │   ├── api/
│   │   │   ├── shoots/
│   │   │   │   ├── +server.ts   # GET /api/shoots, POST /api/shoots
│   │   │   │   └── [id]/
│   │   │   │       └── +server.ts # GET, PATCH, DELETE
│   │   │   ├── images/
│   │   │   │   └── upload/
│   │   │   │       └── +server.ts # POST image upload
│   │   │   └── sync/
│   │   │       └── +server.ts   # Real-time sync endpoint
│   │   └── +error.svelte        # Error page
│   ├── app.css                  # Global styles
│   ├── app.d.ts                 # Global types
│   └── hooks.server.ts          # Server hooks (auth check)
├── tests/
│   ├── unit/                    # Unit tests
│   │   ├── services.test.ts
│   │   ├── stores.test.ts
│   │   └── utils.test.ts
│   ├── integration/             # Integration tests
│   │   └── api.test.ts
│   └── e2e/                     # End-to-end tests
│       └── example.spec.ts
├── .env.local                   # Local environment (NOT git)
├── .env.example                 # Template (commit to git)
├── svelte.config.js             # SvelteKit config
├── tailwind.config.js           # Tailwind config
├── vite.config.ts               # Vite config
├── vitest.config.ts             # Vitest config
├── playwright.config.ts         # Playwright config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── package-lock.json            # Lock file
└── README.md                    # Project docs
```

---

## Common Development Tasks

### Create a New Shoot (Example Feature)

**1. Create Zod Schema** (`src/lib/utils/validation.ts`):

```typescript
import { z } from 'zod';

export const shootSchema = z.object({
  title: z.string().min(1, 'Title required').max(100),
  description: z.string().optional(),
  scheduled_date: z.string().refine((date) => new Date(date) > new Date()),
  location: z.string().optional(),
  team_id: z.string().uuid(),
});

export type ShootFormData = z.infer<typeof shootSchema>;
```

**2. Create Form Component** (`src/lib/components/forms/ShootForm.svelte`):

```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import { shootSchema } from '$lib/utils/validation';
  import SuperDebug, { SuperDebugSerialized } from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const { form, errors, submitting } = superForm(data.form, {
    validators: shootSchema,
  });
</script>

<form method="POST" class="space-y-4">
  <div>
    <label for="title" class="block text-sm font-medium">Title *</label>
    <input
      type="text"
      id="title"
      name="title"
      bind:value={$form.title}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
    {#if $errors.title}
      <p class="mt-1 text-sm text-red-600">{$errors.title}</p>
    {/if}
  </div>

  <div>
    <label for="scheduled_date" class="block text-sm font-medium">Date *</label>
    <input
      type="datetime-local"
      id="scheduled_date"
      name="scheduled_date"
      bind:value={$form.scheduled_date}
      required
    />
    {#if $errors.scheduled_date}
      <p class="mt-1 text-sm text-red-600">{$errors.scheduled_date}</p>
    {/if}
  </div>

  <button
    type="submit"
    disabled={$submitting}
    class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
  >
    {$submitting ? 'Creating...' : 'Create Shoot'}
  </button>
</form>
```

**3. Create API Route** (`src/routes/api/shoots/+server.ts`):

```typescript
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { shootSchema } from '$lib/utils/validation';
import { createSupabaseClient } from '$lib/services/supabase';

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();

  // Validate with Zod
  const parsed = shootSchema.safeParse(data);
  if (!parsed.success) {
    return error(400, { message: 'Validation failed', errors: parsed.error.flatten() });
  }

  // Create shoot in database
  const supabase = createSupabaseClient();
  const { data: shoot, error: dbError } = await supabase
    .from('shoots')
    .insert([parsed.data])
    .select()
    .single();

  if (dbError) {
    return error(500, { message: 'Database error', details: dbError.message });
  }

  return json({ shoot }, { status: 201 });
};
```

**4. Create Page** (`src/routes/shoots/create/+page.svelte`):

```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import ShootForm from '$lib/components/forms/ShootForm.svelte';

  export let data;
</script>

<div class="max-w-2xl mx-auto py-8">
  <h1 class="text-3xl font-bold mb-8">Create New Shoot</h1>
  <ShootForm {data} />
</div>
```

### Running Tests

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:coverage

# Watch mode (auto-rerun on changes)
npm run test:watch
```

### Real-Time Sync with Yjs (Example)

```typescript
// src/lib/services/sync.ts
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function initializeSync(docName: string, awareness?: Map<string, unknown>) {
  // Create shared document
  const ydoc = new Y.Doc();
  
  // Create WebSocket connection
  const provider = new WebsocketProvider(
    import.meta.env.PUBLIC_WEBSOCKET_URL || 'ws://localhost:1234',
    docName,
    ydoc,
    { awareness }
  );

  // Map for storing shared data
  const ymap = ydoc.getMap('shared-data');

  return {
    ydoc,
    provider,
    ymap,
    destroy: () => {
      provider.disconnect();
      ydoc.destroy();
    },
  };
}
```

### Image Optimization (Sharp)

```typescript
// src/lib/services/image.ts
import sharp from 'sharp';
import path from 'path';

export async function optimizeImage(filePath: string, outputDir: string) {
  const filename = path.basename(filePath, path.extname(filePath));

  // WebP for modern browsers
  await sharp(filePath)
    .resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(path.join(outputDir, `${filename}-1280.webp`));

  // Responsive sizes
  for (const size of [320, 640, 2560]) {
    await sharp(filePath)
      .resize(size, size, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(path.join(outputDir, `${filename}-${size}.webp`));
  }

  // JPEG fallback
  await sharp(filePath)
    .resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toFile(path.join(outputDir, `${filename}.jpg`));
}
```

---

## Testing Setup

### Unit Test Example (Vitest)

```typescript
// tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '$lib/utils/date';

describe('Date utilities', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-10-16');
    const result = formatDate(date);
    expect(result).toBe('16 Oct 2025');
  });
});
```

### E2E Test Example (Playwright)

```typescript
// tests/e2e/shoots.spec.ts
import { test, expect } from '@playwright/test';

test('create a new shoot', async ({ page }) => {
  // Navigate to shoots page
  await page.goto('/shoots/create');

  // Fill form
  await page.fill('input[name="title"]', 'My Cosplay Shoot');
  await page.fill('input[type="datetime-local"]', '2025-12-20T14:00');

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for success message
  await expect(page.locator('text=Shoot created successfully')).toBeVisible();
});
```

### Run Tests with Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing (`npm run test`)
- [ ] Code coverage at least 70% (`npm run test:coverage`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Performance budget met (<3s on 3G)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] All environment variables set in hosting platform
- [ ] Database migrations tested
- [ ] API endpoints tested in staging

### Staging Deployment

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to staging
npm run deploy:staging
```

### Production Deployment

```bash
# Create release tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Deploy to production (CI/CD pipeline)
npm run deploy:production
```

### Post-Deployment

- [ ] Monitor error rates (should be <1%)
- [ ] Check real-time sync performance (<2s propagation)
- [ ] Verify image optimization working
- [ ] Test payment processing (if Phase 1.5)
- [ ] Monitor database performance

---

## Troubleshooting

### Common Issues

#### Issue: `npm install` fails with package conflicts

**Solution**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Issue: SvelteKit dev server won't start

**Solution**:
```bash
# Kill any existing process on port 5173
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows

# Start fresh
npm run dev
```

#### Issue: Supabase connection timeout

**Solution**:
```bash
# Check .env.local has correct Supabase credentials
# Verify Supabase project is running
# Check firewall/VPN not blocking connection

# Test connection
node -e "
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.PUBLIC_SUPABASE_URL, process.env.PUBLIC_SUPABASE_ANON_KEY);
client.auth.getSession().then(console.log).catch(console.error);
"
```

#### Issue: Yjs real-time sync not working

**Solution**:
```bash
# Ensure WebSocket server is running
# Check y-websocket is installed
npm list y-websocket

# Verify WebSocket URL in .env.local
# Check firewall allows WebSocket connections
```

#### Issue: Tests failing in CI but passing locally

**Solution**:
```bash
# Run tests with CI environment variables
CI=true npm run test:e2e

# Check for environment-specific issues
# Verify test database is isolated per test
# Check tests don't have race conditions (use beforeEach/afterEach)
```

---

## Next Steps

After completing setup:

1. **Read Constitution v2.2.0** (`.specify/memory/constitution.md`)
   - Understand 10 core principles
   - Review technology stack rationale
   - Check testing & deployment standards

2. **Review Data Model** (`.specify/plans/data-model-v2.md`)
   - Create Supabase tables
   - Set up row-level security (RLS) policies
   - Create database functions

3. **Implement First Feature** (Image optimization)
   - Create Sharp integration
   - Set up image upload endpoint
   - Test responsive image generation

4. **Set Up CI/CD** (GitHub Actions)
   - Run tests on every commit
   - Lint code
   - Build and deploy to staging

5. **Begin Phase 1 Development** (12-week timeline)
   - Follow TDD approach (tests first)
   - Maintain 70% code coverage
   - Deploy to staging weekly
   - Gather user feedback

---

## Getting Help

**Resources**:
- Constitution v2.2.0: `.specify/memory/constitution.md`
- Data Model: `.specify/plans/data-model-v2.md`
- Social Media Spec: `.specify/plans/social-media-integration-v2.md`
- API Contracts: `.specify/plans/contracts/` (OpenAPI specs)
- Copilot Context: `.github/copilot-context.md`

**Common Questions**:
- Q: Why Sveltekit-Superforms instead of manual form handling?
  - A: Server-first validation, CSRF protection, 10-15 days saved
- Q: Why Yjs instead of custom OT algorithm?
  - A: Battle-tested, automatic conflict resolution, 10-14 days saved
- Q: Why @casl/ability for permissions?
  - A: Declarative rules, centralized, 3-5 days saved
- Q: What if I need a different package?
  - A: Check Constitution v2.2.0 antipatterns first, discuss with team before adding

---

**Happy coding! 🚀**

**Next**: Begin Phase 1 core CRUD implementation with image optimization.
