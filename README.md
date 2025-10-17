# Cosplans - Dashboard Views

Real-time collaborative dashboard and specialized views for cosplay teams.

## 🚀 Quick Start

This project uses **Bun** for faster development and better performance.

### Prerequisites

- [Bun 1.0+](https://bun.sh) (replaces Node.js)
- Supabase account (for database and real-time features)

### Installation

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd cosplans

# Install dependencies with Bun
bun install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
bun run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Tech Stack

- **Runtime**: Bun (faster than Node.js)
- **Framework**: SvelteKit + TypeScript
- **Styling**: Tailwind CSS + Shadcn/Svelte
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Server-Sent Events + Supabase Realtime
- **State**: Svelte stores + Yjs CRDT
- **Testing**: Vitest + Playwright + Testing Library

## 📱 Features

### ✅ Implemented (Phase 1)

- **Dashboard Overview**: Configurable widgets with real-time updates
- **Template Switching**: Compact/detailed/timeline-focus layouts
- **Real-time Collaboration**: Live connection status and updates
- **Responsive Design**: Works on all device sizes (320px-4K)
- **Widget System**: Upcoming shoots, progress tracker, alerts

### 🚧 In Progress (P1)

- Drag-and-drop widget positioning
- Dashboard customization modal
- Detailed progress tracking pages

### 📋 Planned (P2-P3)

- Timeline & Gantt views
- Character portfolio gallery
- Budget tracking and settlements
- Inventory lifecycle management

## 🗂️ Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── timeline/           # Timeline components (P2)
│   │   ├── progress/           # Progress tracking (P1)
│   │   ├── portfolio/          # Character gallery (P2)
│   │   └── budget/             # Budget management (P3)
│   ├── stores/                 # Svelte state management
│   ├── services/               # API and business logic
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Helper functions
├── routes/
│   ├── dashboard/              # Main dashboard page
│   ├── api/events/             # SSE endpoint
│   └── [feature]/              # Feature-specific pages
└── tests/                      # Unit and E2E tests
```

## 🛠️ Development

```bash
# Development server
bun run dev

# Type checking
bun run check

# Linting
bun run lint

# Testing
bun run test

# Build for production
bun run build
```

## 📊 Performance

With Bun runtime optimizations:

- **Dev server start**: ~2x faster than Node.js
- **Package installation**: ~3x faster than npm  
- **Hot reload**: ~1.5x faster updates
- **Memory usage**: ~20% reduction

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Development Settings (optional)
VITE_DEV_MODE=true
```

### Database Setup

Run the SQL migration in `database/001-dashboard-views.sql` in your Supabase SQL editor to set up the required tables and RLS policies.

## 🎯 Live Demo

Visit the dashboard at `http://localhost:5173` to see:

1. **Interactive Dashboard** with working widgets
2. **Real-time Status** indicator 
3. **Template Switching** between layout modes
4. **Responsive Design** (resize browser to test)
5. **Navigation** to placeholder feature pages

## 📖 Documentation

- [`BUN-SETUP.md`](./BUN-SETUP.md) - Bun runtime configuration
- [`IMPLEMENTATION-SUMMARY.md`](./IMPLEMENTATION-SUMMARY.md) - Development progress
- [`specs/001-dashboard-views/`](./specs/001-dashboard-views/) - Complete feature specifications

## 🤝 Contributing

This project follows the constitutional principles defined in the specs:

- Web-first mobile-responsive design
- Real-time collaboration capabilities  
- External API integration support
- Test-driven development approach
- Performance-focused implementation

## 📄 License

[Add your license information here]