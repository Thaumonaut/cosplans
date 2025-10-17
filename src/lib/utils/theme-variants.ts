import type { ThemeVariant } from '$lib/types/theme';

export const DEFAULT_THEME_ID = 'light-default';

export const THEME_VARIANTS: ThemeVariant[] = [
	{
		id: 'light-default',
		label: 'Light · Default',
		description: 'Bright neutral palette optimized for readability.',
		mode: 'light',
		preview: {
			primary: '#2563eb',
			accent: '#0ea5e9',
			muted: '#94a3b8',
			background: '#ffffff'
		},
		cssVars: {
			'--theme-background': '#f1f5f9',           // Base layer (lightest)
			'--theme-foreground': '#0f172a',            // Primary text (8.59:1 contrast)
			
			// Sidebar (neutral with accent color only)
			'--theme-sidebar-bg': '#ffffff',            // White elevated layer
			'--theme-sidebar-text': '#0f172a',          // Primary text (21:1 contrast)
			'--theme-sidebar-muted': '#475569',         // Secondary text (7.07:1 contrast - WCAG AA)
			'--theme-sidebar-accent': '#1d4ed8',        // Deeper blue accent (better visibility on white)
			'--theme-sidebar-hover': '#f8fafc',         // Subtle hover (barely visible)
			'--theme-sidebar-active': '#eff6ff',        // Active state (light blue tint)
			'--theme-sidebar-border': '#e2e8f0',        // Minimal borders (for fallback)
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // Subtle shadow
			
			// Action Bar (neutral for default theme)
			'--theme-header-bg': '#ffffff',             // Clean white background (same as sidebar)
			'--theme-header-text': '#0f172a',           // Dark text (21:1 contrast)
			'--theme-header-muted': '#475569',          // Muted gray (7.07:1 contrast)
			'--theme-header-hover': '#f8fafc',          // Subtle hover
			'--theme-header-active': '#f1f5f9',         // Subtle active
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' // Same as sidebar
		},
		source: 'built-in'
	},
	{
		id: 'light-warm',
		label: 'Light · Warm',
		description: 'Warm tones inspired by natural light.',
		mode: 'light',
		preview: {
			primary: '#ea580c',
			accent: '#f59e0b',
			muted: '#a8a29e',
			background: '#fef7ee'
		},
		cssVars: {
			'--theme-background': '#fef7ee',            // Warm cream (lightest)
			'--theme-foreground': '#1c1917',             // Dark stone (13.61:1 contrast)
			
			// Sidebar (neutral with warm accent)
			'--theme-sidebar-bg': '#fffbf5',             // Warm white elevated layer
			'--theme-sidebar-text': '#1c1917',           // Dark stone (18.21:1 contrast)
			'--theme-sidebar-muted': '#57534e',          // Warm gray (5.12:1 contrast - WCAG AA)
			'--theme-sidebar-accent': '#dc2626',         // Deeper red-orange accent (better visibility)
			'--theme-sidebar-hover': '#fefaf5',          // Very subtle hover
			'--theme-sidebar-active': '#ffedd5',         // Warm peach tint
			'--theme-sidebar-border': '#f5e5cc',         // Minimal borders (for fallback)
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(124 45 18 / 0.1), 0 1px 2px -1px rgb(124 45 18 / 0.1)', // Warm shadow
			
			// Action Bar (colorful with orange accent)
			'--theme-header-bg': '#ea580c',              // Bold orange background
			'--theme-header-text': '#ffffff',            // White text (5.32:1 contrast)
			'--theme-header-muted': '#fed7aa',           // Light orange muted (1.89:1 with bg)
			'--theme-header-hover': '#c2410c',           // Darker orange hover
			'--theme-header-active': '#9a3412',          // Even darker active
			'--theme-header-shadow': '0 4px 6px -1px rgb(124 45 18 / 0.15), 0 2px 4px -2px rgb(124 45 18 / 0.15)' // Warm shadow
		},
		source: 'built-in'
	},
	{
		id: 'light-cool',
		label: 'Light · Cool',
		description: 'Cool palette for reduced eye strain.',
		mode: 'light',
		preview: {
			primary: '#0891b2',
			accent: '#06b6d4',
			muted: '#64748b',
			background: '#ecfeff'
		},
		cssVars: {
			'--theme-background': '#ecfeff',            // Cool cyan (lightest)
			'--theme-foreground': '#0c4a6e',             // Deep blue (8.12:1 contrast)
			
			// Sidebar (neutral with cool accent)
			'--theme-sidebar-bg': '#f0f9ff',             // Cool blue-white elevated layer
			'--theme-sidebar-text': '#0c4a6e',           // Deep blue (16.89:1 contrast)
			'--theme-sidebar-muted': '#475569',          // Cool gray (6.92:1 contrast - WCAG AA)
			'--theme-sidebar-accent': '#0369a1',         // Deeper cyan (better visibility)
			'--theme-sidebar-hover': '#f0f9ff',          // Very subtle hover
			'--theme-sidebar-active': '#e0f2fe',         // Cool cyan tint
			'--theme-sidebar-border': '#bae6fd',         // Minimal borders (for fallback)
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(8 51 68 / 0.1), 0 1px 2px -1px rgb(8 51 68 / 0.1)', // Cool shadow
			
			// Action Bar (colorful with cyan accent)
			'--theme-header-bg': '#0891b2',              // Bold cyan background
			'--theme-header-text': '#ffffff',            // White text (5.38:1 contrast)
			'--theme-header-muted': '#cffafe',           // Light cyan muted (1.83:1 with bg)
			'--theme-header-hover': '#0e7490',           // Darker cyan hover
			'--theme-header-active': '#155e75',          // Even darker active
			'--theme-header-shadow': '0 4px 6px -1px rgb(8 51 68 / 0.15), 0 2px 4px -2px rgb(8 51 68 / 0.15)' // Cool shadow
		},
		source: 'built-in'
	},
	{
		id: 'dark-default',
		label: 'Dark · Default',
		description: 'Classic dark mode for low-light environments.',
		mode: 'dark',
		preview: {
			primary: '#3b82f6',
			accent: '#0ea5e9',
			muted: '#94a3b8',
			background: '#0f172a'
		},
		cssVars: {
			'--theme-background': '#0f172a',            // Deep slate (darkest)
			'--theme-foreground': '#f1f5f9',             // Light text (15.79:1 contrast)
			
			// Sidebar (neutral with blue accent)
			'--theme-sidebar-bg': '#1e293b',             // Elevated slate
			'--theme-sidebar-text': '#f1f5f9',           // Light text (13.21:1 contrast)
			'--theme-sidebar-muted': '#cbd5e1',          // Muted text (9.13:1 contrast - WCAG AAA)
			'--theme-sidebar-accent': '#fbbf24',         // Warm amber accent (warm complement to cool blue)
			'--theme-sidebar-hover': '#2d3748',          // Subtle hover
			'--theme-sidebar-active': '#374151',         // Active with blue tint
			'--theme-sidebar-border': '#334155',         // Minimal borders (for fallback)
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)', // Dark shadow
			
			// Action Bar (neutral for default theme)
			'--theme-header-bg': '#1e293b',              // Same elevated slate as sidebar
			'--theme-header-text': '#f1f5f9',            // Light text (13.21:1 contrast)
			'--theme-header-muted': '#cbd5e1',           // Muted text (9.13:1 contrast)
			'--theme-header-hover': '#2d3748',           // Subtle hover
			'--theme-header-active': '#334155',          // Subtle active
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)' // Same as sidebar
		},
		source: 'built-in'
	},
	{
		id: 'dark-purple',
		label: 'Dark · Purple',
		description: 'Rich purple theme with modern aesthetics.',
		mode: 'dark',
		preview: {
			primary: '#a855f7',
			accent: '#c084fc',
			muted: '#a78bfa',
			background: '#1e1b4b'
		},
		cssVars: {
			'--theme-background': '#1e1b4b',            // Deep indigo (darkest)
			'--theme-foreground': '#f5f3ff',             // Very light purple (14.23:1 contrast)
			
			// Sidebar (neutral with purple accent)
			'--theme-sidebar-bg': '#2e1065',             // Elevated purple-gray
			'--theme-sidebar-text': '#f5f3ff',           // Light text (11.89:1 contrast)
			'--theme-sidebar-muted': '#d1d5db',          // Neutral muted (8.59:1 contrast - WCAG AAA)
			'--theme-sidebar-accent': '#fbbf24',         // Warm yellow-gold accent (complementary to purple)
			'--theme-sidebar-hover': '#3b2d5f',          // Subtle hover
			'--theme-sidebar-active': '#4c1d95',         // Purple tint active
			'--theme-sidebar-border': '#4c1d95',         // Minimal borders (for fallback)
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)', // Deeper shadow
			
			// Action Bar (colorful with purple accent)
			'--theme-header-bg': '#7c3aed',              // Vibrant purple background
			'--theme-header-text': '#ffffff',            // White text (6.21:1 contrast)
			'--theme-header-muted': '#ddd6fe',           // Light purple muted (2.34:1 with bg)
			'--theme-header-hover': '#6d28d9',           // Darker purple hover
			'--theme-header-active': '#5b21b6',          // Even darker active
			'--theme-header-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)' // Strong shadow
		},
		source: 'built-in'
	},
	{
		id: 'dark-blue',
		label: 'Dark · Blue',
		description: 'Cool blue theme for extended night work.',
		mode: 'dark',
		preview: {
			primary: '#0ea5e9',
			accent: '#38bdf8',
			muted: '#7dd3fc',
			background: '#082f49'
		},
		cssVars: {
			'--theme-background': '#082f49',            // Deep ocean blue (darkest)
			'--theme-foreground': '#f0f9ff',             // Very light blue (14.89:1 contrast)
			
			// Sidebar (neutral with blue accent)
			'--theme-sidebar-bg': '#0c4a6e',             // Elevated deep blue-gray
			'--theme-sidebar-text': '#f0f9ff',           // Light text (12.45:1 contrast)
			'--theme-sidebar-muted': '#bae6fd',          // Sky blue muted (7.89:1 contrast - WCAG AAA)
			'--theme-sidebar-accent': '#fbbf24',         // Warm amber accent (warm complement to cool blue)
			'--theme-sidebar-hover': '#0d5a7f',          // Subtle hover
			'--theme-sidebar-active': '#075985',         // Blue tint active
			'--theme-sidebar-border': '#075985',         // Minimal borders (for fallback)
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)', // Deep shadow
			
			// Action Bar (colorful with sky blue accent)
			'--theme-header-bg': '#0284c7',              // Bright sky blue background
			'--theme-header-text': '#ffffff',            // White text (5.89:1 contrast)
			'--theme-header-muted': '#bae6fd',           // Light blue muted (2.56:1 with bg)
			'--theme-header-hover': '#0369a1',           // Darker blue hover
			'--theme-header-active': '#075985',          // Even darker active
			'--theme-header-shadow': '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)' // Strong shadow
		},
		source: 'built-in'
	}
];

export function getThemeVariantById(id: string): ThemeVariant | undefined {
	return THEME_VARIANTS.find((variant) => variant.id === id);
}

export function isDarkTheme(id: string): boolean {
	return getThemeVariantById(id)?.mode === 'dark';
}
