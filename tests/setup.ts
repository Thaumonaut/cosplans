import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables
vi.mock('$env/static/private', () => ({
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_ANON_KEY: 'test-anon-key'
}));

// Mock SvelteKit stores
vi.mock('$app/stores', () => ({
  page: vi.fn(),
  navigating: vi.fn(),
  updated: vi.fn()
}));

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    })),
    realtime: {
      channel: vi.fn(() => ({
        on: vi.fn(),
        subscribe: vi.fn()
      }))
    }
  }))
}));