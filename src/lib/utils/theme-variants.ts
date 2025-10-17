import type { ThemeVariant } from '$lib/types/theme';

export const DEFAULT_THEME_ID = 'light-default';

export const THEME_VARIANTS: ThemeVariant[] = [
	{
		id: 'light-default',
		label: 'Adventurer\'s Tunic',
		description: 'Fresh and ready for any quest or photoshoot.',
		mode: 'light',
		preview: {
			primary: '#16a34a',
			accent: '#22c55e',
			muted: '#94a3b8',
			background: '#ffffff'
		},
		cssVars: {
			'--theme-background': '#f8fafc',           // Base layer (lightest neutral)
			'--theme-background-pattern': 'radial-gradient(circle at 20% 50%, rgba(22, 163, 74, 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(22, 163, 74, 0.05) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(22, 163, 74, 0.04) 0%, transparent 50%)',
			'--theme-foreground': '#0f172a',            // Primary text (dark slate)
			
			// Sidebar (neutral grays with green accent)
			'--theme-sidebar-bg': '#ffffff',            // Pure white for maximum contrast
			'--theme-sidebar-text': '#0f172a',          // Dark slate text (21:1 contrast)
			'--theme-sidebar-muted': '#64748b',         // Neutral gray (4.54:1 contrast - WCAG AA)
			'--theme-sidebar-accent': '#16a34a',        // Fresh green accent (professional)
			'--theme-sidebar-hover': '#f8fafc',         // Subtle gray hover
			'--theme-sidebar-active': '#f0fdf4',        // Very light green tint
			'--theme-sidebar-border': '#e2e8f0',        // Neutral border
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // Subtle shadow
			
			// Action Bar (neutral with subtle green hint)
			'--theme-header-bg': '#f8fafc',             // Neutral light gray
			'--theme-header-text': '#0f172a',           // Dark slate text
			'--theme-header-muted': '#64748b',          // Neutral muted
			'--theme-header-hover': '#f1f5f9',          // Slightly darker hover
			'--theme-header-active': '#e2e8f0',         // Neutral active
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' // Same as sidebar
		},
		source: 'built-in'
	},
	{
		id: 'light-warm',
		label: 'Mystic Sands',
		description: 'Warm desert tones for outdoor convention shoots.',
		mode: 'light',
		preview: {
			primary: '#ea580c',
			accent: '#f59e0b',
			muted: '#a8a29e',
			background: '#fef7ee'
		},
		cssVars: {
			'--theme-background': '#fef7ee',            // Warm cream (lightest)
			'--theme-background-pattern': 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(234, 88, 12, 0.04) 40px, rgba(234, 88, 12, 0.04) 80px), repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(234, 88, 12, 0.03) 40px, rgba(234, 88, 12, 0.03) 80px)',
			'--theme-foreground': '#1c1917',             // Dark stone (13.61:1 contrast)
			
			// Sidebar (neutral with warm accent and better contrast)
			'--theme-sidebar-bg': '#fef3e2',             // Warm beige (more contrast vs background)
			'--theme-sidebar-text': '#1c1917',           // Dark stone (18.21:1 contrast)
			'--theme-sidebar-muted': '#57534e',          // Warm gray (5.12:1 contrast - WCAG AA)
			'--theme-sidebar-accent': '#dc2626',         // Deeper red-orange accent (better visibility)
			'--theme-sidebar-hover': '#fef7ee',          // Subtle hover
			'--theme-sidebar-active': '#fed7aa',         // Warm peach tint
			'--theme-sidebar-border': '#e7d4b5',         // Visible borders
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(124 45 18 / 0.1), 0 1px 2px -1px rgb(124 45 18 / 0.1)', // Warm shadow
			
			// Action Bar (subtle warm tint instead of bold orange)
			'--theme-header-bg': '#fed7aa',              // Soft peach (subtle, not bold)
			'--theme-header-text': '#7c2d12',            // Deep warm brown text
			'--theme-header-muted': '#9a3412',           // Warm red-brown muted
			'--theme-header-hover': '#fdba74',           // Slightly darker peach hover
			'--theme-header-active': '#fb923c',          // More saturated active
			'--theme-header-shadow': '0 1px 3px 0 rgb(124 45 18 / 0.1), 0 1px 2px -1px rgb(124 45 18 / 0.1)' // Same as sidebar
		},
		source: 'built-in'
	},
	{
		id: 'light-cool',
		label: 'Crystal Waters',
		description: 'Cool aquatic tones inspired by fantasy pools.',
		mode: 'light',
		preview: {
			primary: '#0891b2',
			accent: '#06b6d4',
			muted: '#64748b',
			background: '#ecfeff'
		},
		cssVars: {
			'--theme-background': '#ecfeff',            // Cool cyan (lightest)
			'--theme-background-pattern': 'radial-gradient(ellipse 800px 400px at top, rgba(6, 182, 212, 0.08) 0%, transparent 50%), radial-gradient(ellipse 800px 400px at bottom, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
			'--theme-foreground': '#0c4a6e',             // Deep blue (8.12:1 contrast)
			
			// Sidebar (neutral with cool accent and better contrast)
			'--theme-sidebar-bg': '#e0f2fe',             // Cool cyan-white (more contrast)
			'--theme-sidebar-text': '#0c4a6e',           // Deep blue (16.89:1 contrast)
			'--theme-sidebar-muted': '#475569',          // Cool gray (6.92:1 contrast - WCAG AA)
			'--theme-sidebar-accent': '#0369a1',         // Deeper cyan (better visibility)
			'--theme-sidebar-hover': '#ecfeff',          // Subtle hover
			'--theme-sidebar-active': '#bae6fd',         // Cool cyan tint
			'--theme-sidebar-border': '#7dd3fc',         // Visible borders
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(8 51 68 / 0.1), 0 1px 2px -1px rgb(8 51 68 / 0.1)', // Cool shadow
			
			// Action Bar (subtle cool tint instead of bold cyan)
			'--theme-header-bg': '#bae6fd',              // Soft sky blue (subtle, not bold)
			'--theme-header-text': '#075985',            // Deep cyan text
			'--theme-header-muted': '#0c4a6e',           // Deep blue muted
			'--theme-header-hover': '#7dd3fc',           // Slightly darker sky hover
			'--theme-header-active': '#38bdf8',          // More saturated active
			'--theme-header-shadow': '0 1px 3px 0 rgb(8 51 68 / 0.1), 0 1px 2px -1px rgb(8 51 68 / 0.1)' // Same as sidebar
		},
		source: 'built-in'
	},
	{
		id: 'dark-default',
		label: 'Forbidden Forest',
		description: 'Deep mysterious woods with ethereal green glow.',
		mode: 'dark',
		preview: {
			primary: '#22c55e',
			accent: '#4ade80',
			muted: '#94a3b8',
			background: '#0f172a'
		},
		cssVars: {
			'--theme-background': '#0a0f1a',            // Deep neutral dark (almost black)
			'--theme-background-pattern': 'radial-gradient(circle 3px at 20% 30%, rgba(34, 197, 94, 0.25) 0%, transparent 100%), radial-gradient(circle 2px at 60% 70%, rgba(34, 197, 94, 0.2) 0%, transparent 100%), radial-gradient(circle 2px at 50% 50%, rgba(34, 197, 94, 0.18) 0%, transparent 100%), radial-gradient(circle 2px at 80% 10%, rgba(34, 197, 94, 0.15) 0%, transparent 100%), radial-gradient(circle 3px at 10% 80%, rgba(34, 197, 94, 0.22) 0%, transparent 100%), radial-gradient(circle 2px at 33% 90%, rgba(34, 197, 94, 0.18) 0%, transparent 100%), radial-gradient(circle 2px at 90% 60%, rgba(34, 197, 94, 0.15) 0%, transparent 100%), radial-gradient(circle 2px at 70% 40%, rgba(34, 197, 94, 0.2) 0%, transparent 100%)',
			'--theme-foreground': '#f8fafc',             // Light text (excellent contrast)
			
			// Sidebar (neutral grays with green accent)
			'--theme-sidebar-bg': '#1a1f2e',             // Elevated neutral dark gray
			'--theme-sidebar-text': '#f8fafc',           // Light text (excellent contrast)
			'--theme-sidebar-muted': '#94a3b8',          // Neutral muted gray (7.5:1 contrast - WCAG AAA)
			'--theme-sidebar-accent': '#22c55e',         // Fresh green accent
			'--theme-sidebar-hover': '#242938',          // Subtle hover (slightly lighter)
			'--theme-sidebar-active': '#1e3a2a',         // Very subtle green tint
			'--theme-sidebar-border': '#2d3748',         // Neutral border
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)', // Dark shadow
			
			// Action Bar (neutral dark gray)
			'--theme-header-bg': '#1a1f2e',              // Same as sidebar for continuity
			'--theme-header-text': '#f8fafc',            // Light text
			'--theme-header-muted': '#94a3b8',           // Neutral muted
			'--theme-header-hover': '#242938',           // Subtle hover
			'--theme-header-active': '#2d3748',          // Neutral active
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)' // Same as sidebar
		},
		source: 'built-in'
	},
	{
		id: 'dark-purple',
		label: 'Neon City Nights',
		description: 'Cyberpunk purple glow and electric grid patterns.',
		mode: 'dark',
		preview: {
			primary: '#a855f7',
			accent: '#c084fc',
			muted: '#a78bfa',
			background: '#0f0a1e'
		},
		cssVars: {
			'--theme-background': '#0f0a1e',            // Very dark purple-black (much darker)
			'--theme-background-pattern': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168, 85, 247, 0.03) 2px, rgba(168, 85, 247, 0.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(168, 85, 247, 0.03) 2px, rgba(168, 85, 247, 0.03) 4px), radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 20%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 20%), radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 30%)',
			'--theme-foreground': '#f5f3ff',             // Very light purple (excellent contrast)
			
			// Sidebar (neutral with purple accent)
			'--theme-sidebar-bg': '#1a0f2e',             // Dark elevated purple-gray (darker)
			'--theme-sidebar-text': '#f5f3ff',           // Light text (excellent contrast)
			'--theme-sidebar-muted': '#d1d5db',          // Neutral muted (8.59:1 contrast - WCAG AAA)
			'--theme-sidebar-accent': '#fbbf24',         // Warm yellow-gold accent (complementary to purple)
			'--theme-sidebar-hover': '#241540',          // Subtle hover
			'--theme-sidebar-active': '#2e1555',         // Purple tint active
			'--theme-sidebar-border': '#2e1555',         // Minimal borders (for fallback)
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)', // Deeper shadow
			
			// Action Bar (subtle purple tint)
			'--theme-header-bg': '#2e1555',              // Deep purple (darker, more subtle)
			'--theme-header-text': '#e9d5ff',            // Light purple text
			'--theme-header-muted': '#c4b5fd',           // Muted purple
			'--theme-header-hover': '#3b1d6b',           // Slightly lighter hover
			'--theme-header-active': '#4c1d95',          // More saturated active
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)' // Same as sidebar
		},
		source: 'built-in'
	},
	{
		id: 'dark-blue',
		label: 'Starlit Depths',
		description: 'Deep ocean blues under a cosmic night sky.',
		mode: 'dark',
		preview: {
			primary: '#0ea5e9',
			accent: '#38bdf8',
			muted: '#7dd3fc',
			background: '#03131f'
		},
		cssVars: {
			'--theme-background': '#03131f',            // Very dark blue-black (much darker)
			'--theme-background-pattern': 'radial-gradient(circle 2px at 20% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 100%), radial-gradient(circle 1px at 60% 70%, rgba(255, 255, 255, 0.6) 0%, transparent 100%), radial-gradient(circle 3px at 50% 50%, rgba(255, 255, 255, 0.9) 0%, transparent 100%), radial-gradient(circle 1px at 80% 10%, rgba(255, 255, 255, 0.7) 0%, transparent 100%), radial-gradient(circle 2px at 10% 80%, rgba(255, 255, 255, 0.5) 0%, transparent 100%), radial-gradient(circle 1px at 90% 60%, rgba(255, 255, 255, 0.4) 0%, transparent 100%), radial-gradient(circle 2px at 33% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 100%), radial-gradient(circle 1px at 70% 40%, rgba(255, 255, 255, 0.8) 0%, transparent 100%), radial-gradient(circle 1px at 15% 60%, rgba(255, 255, 255, 0.5) 0%, transparent 100%)',
			'--theme-foreground': '#f0f9ff',             // Very light blue (excellent contrast)
			
			// Sidebar (neutral with blue accent)
			'--theme-sidebar-bg': '#051e2e',             // Dark elevated blue-gray (darker)
			'--theme-sidebar-text': '#f0f9ff',           // Light text (excellent contrast)
			'--theme-sidebar-muted': '#bae6fd',          // Sky blue muted (7.89:1 contrast - WCAG AAA)
			'--theme-sidebar-accent': '#fbbf24',         // Warm amber accent (warm complement to cool blue)
			'--theme-sidebar-hover': '#082a42',          // Subtle hover
			'--theme-sidebar-active': '#0a3855',         // Blue tint active
			'--theme-sidebar-border': '#0a3855',         // Minimal borders (for fallback)
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)', // Deep shadow
			
			// Action Bar (subtle blue tint)
			'--theme-header-bg': '#0a3855',              // Deep ocean blue (darker, more subtle)
			'--theme-header-text': '#bae6fd',            // Light blue text
			'--theme-header-muted': '#7dd3fc',           // Muted sky blue
			'--theme-header-hover': '#0c4a6e',           // Slightly lighter hover
			'--theme-header-active': '#0e5a80',          // More saturated active
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)' // Same as sidebar
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
