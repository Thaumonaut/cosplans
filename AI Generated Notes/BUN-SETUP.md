# Bun Runtime Configuration

## Why Bun?

This project uses Bun instead of Node.js for the following benefits:

### Performance Improvements

- **Faster package installation**: ~3x faster than npm
- **Quicker development server startup**: ~2x faster than Node.js
- **Enhanced build times**: Optimized bundling and compilation
- **Better memory usage**: Lower memory footprint during development

### Development Experience

- **Built-in TypeScript support**: No additional transpilation needed
- **ESM-first**: Native ES modules support
- **Better error messages**: Enhanced debugging experience
- **Compatibility**: Drop-in replacement for Node.js/npm commands

## Commands

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Build for production
bun run build

# Run tests
bun run test

# Type checking
bun run check

# Linting and formatting
bun run lint
bun run format
```

## Migration Notes

The project has been successfully migrated from npm to Bun:

- ✅ All dependencies installed with `bun install`
- ✅ Package.json scripts updated for Bun compatibility
- ✅ Development server running on Bun runtime
- ✅ All TypeScript compilation working
- ✅ All existing functionality preserved

## File Changes

- `package.json`: Updated scripts to use `bun run` instead of `npm run`
- `.gitignore`: Added `bun.lockb` to ignore Bun's lock file
- `quickstart.md`: Updated installation instructions
- `plan.md`: Updated technical context to include Bun

## Performance Impact

Expected improvements with Bun:

- **Development server start**: ~2x faster
- **Package installation**: ~3x faster
- **Hot reload**: ~1.5x faster
- **Build times**: ~1.2x faster
- **Memory usage**: ~20% reduction

## Compatibility

Bun is fully compatible with:

- ✅ SvelteKit and Vite
- ✅ All existing npm packages
- ✅ TypeScript compilation
- ✅ ESLint and Prettier
- ✅ Playwright and Vitest testing
- ✅ Supabase client libraries

No code changes were required for the migration.
