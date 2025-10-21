import type { ThemeVariant } from "$lib/types/theme";
import { createTheme } from "./theme-builder";
import { generateHarmony } from "./color-harmony";

export const DEFAULT_THEME_ID = "light-default";

export const THEME_VARIANTS: ThemeVariant[] = [
	// === LIGHT THEMES ===
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
		cssVars: (() => {
			const colors = generateHarmony('#16a34a', 'analogous');
			const pattern = 'radial-gradient(circle at 20% 50%, rgba(22, 163, 74, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(22, 163, 74, 0.06) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(22, 163, 74, 0.05) 0%, transparent 50%)';
			return createTheme(colors.primary, colors.secondary, colors.accent, 'light', pattern);
		})(),
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
		cssVars: (() => {
			const colors = generateHarmony('#ea580c', 'analogous');
			const pattern = 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(234, 88, 12, 0.04) 40px, rgba(234, 88, 12, 0.04) 80px), repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(234, 88, 12, 0.03) 40px, rgba(234, 88, 12, 0.03) 80px)';
			return createTheme(colors.primary, colors.secondary, colors.accent, 'light', pattern);
		})(),
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
		cssVars: (() => {
			const colors = generateHarmony('#0891b2', 'analogous');
			const pattern = 'url(/caustics.svg)';
			return createTheme(colors.primary, colors.secondary, colors.accent, 'light', pattern);
		})(),
		source: 'built-in'
	},
	
	// === DARK THEMES (Original Hand-Crafted) ===
	{
		id: 'dark-default',
		label: 'Rolling Storm',
		description: 'Dramatic stormy skies with electric lightning strikes.',
		mode: 'dark',
		preview: {
			primary: '#eab308',
			accent: '#fbbf24',
			muted: '#64748b',
			background: '#1e293b'
		},
		cssVars: {
			'--theme-background': '#0f172a',
			'--theme-background-pattern': 'radial-gradient(ellipse 1200px 400px at 40% 20%, rgba(251, 191, 36, 0.02) 0%, transparent 50%), radial-gradient(ellipse 1000px 350px at 70% 40%, rgba(234, 179, 8, 0.025) 0%, transparent 45%), radial-gradient(ellipse 800px 300px at 30% 70%, rgba(202, 138, 4, 0.015) 0%, transparent 40%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(71, 85, 105, 0.02) 2px, rgba(71, 85, 105, 0.02) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(51, 65, 85, 0.015) 2px, rgba(51, 65, 85, 0.015) 4px), radial-gradient(circle 2px at 25% 15%, rgba(250, 204, 21, 0.3) 0%, transparent 100%), radial-gradient(circle 1px at 75% 30%, rgba(234, 179, 8, 0.25) 0%, transparent 100%), radial-gradient(circle 3px at 15% 60%, rgba(251, 191, 36, 0.22) 0%, transparent 100%), radial-gradient(circle 1px at 85% 75%, rgba(250, 204, 21, 0.18) 0%, transparent 100%), radial-gradient(circle 2px at 45% 85%, rgba(234, 179, 8, 0.28) 0%, transparent 100%), radial-gradient(circle 1px at 55% 45%, rgba(251, 191, 36, 0.24) 0%, transparent 100%)',
			'--theme-foreground': '#f1f5f9',
			'--theme-sidebar-bg': '#0a0f1a',
			'--theme-sidebar-text': '#f1f5f9',
			'--theme-sidebar-muted': '#cbd5e1',
			'--theme-sidebar-accent': '#eab308',
			'--theme-sidebar-hover': '#1e293b',
			'--theme-sidebar-active': '#334155',
			'--theme-sidebar-border': '#475569',
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
			'--theme-header-bg': '#1e293b',
			'--theme-header-text': '#fef3c7',
			'--theme-header-muted': '#fbbf24',
			'--theme-header-hover': '#334155',
			'--theme-header-active': '#475569',
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
			'--theme-success': '#10b981',
			'--theme-error': '#ef4444',
			'--theme-warning': '#f59e0b',
			'--theme-info': '#3b82f6'
		},
		source: 'built-in'
	},
	{
		id: 'dark-purple',
		label: 'Cozy Burrow',
		description: 'Hobbiton warmth with earthy greens and cottage garden charm.',
		mode: 'dark',
		preview: {
			primary: '#84cc16',
			accent: '#65a30d',
			muted: '#a16207',
			background: '#1a1410'
		},
		cssVars: {
			'--theme-background': '#1a1410',
			'--theme-background-pattern': 'radial-gradient(ellipse 1000px 600px at 35% 45%, rgba(132, 204, 22, 0.06) 0%, transparent 50%), radial-gradient(ellipse 800px 500px at 65% 60%, rgba(101, 163, 13, 0.05) 0%, transparent 45%), radial-gradient(circle 400px at 20% 80%, rgba(161, 98, 7, 0.04) 0%, transparent 40%), repeating-linear-gradient(135deg, transparent, transparent 100px, rgba(74, 57, 29, 0.03) 100px, rgba(74, 57, 29, 0.03) 200px), repeating-linear-gradient(45deg, transparent, transparent 120px, rgba(82, 69, 37, 0.02) 120px, rgba(82, 69, 37, 0.02) 240px)',
			'--theme-foreground': '#fef3c7',
			'--theme-sidebar-bg': '#2a2218',
			'--theme-sidebar-text': '#fef3c7',
			'--theme-sidebar-muted': '#bda87a',
			'--theme-sidebar-accent': '#84cc16',
			'--theme-sidebar-hover': '#352b20',
			'--theme-sidebar-active': '#3f3426',
			'--theme-sidebar-border': '#4a3a2c',
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
			'--theme-header-bg': '#352b20',
			'--theme-header-text': '#d9f99d',
			'--theme-header-muted': '#a3e635',
			'--theme-header-hover': '#3f3426',
			'--theme-header-active': '#4a5d23',
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
			'--theme-success': '#10b981',
			'--theme-error': '#ef4444',
			'--theme-warning': '#f59e0b',
			'--theme-info': '#3b82f6'
		},
		source: 'built-in'
	},
	{
		id: 'dark-blue',
		label: 'Galactic Sea',
		description: 'Aurora-lit void blending electric blue, purple, and pink.',
		mode: 'dark',
		preview: {
			primary: '#14b8a6',
			accent: '#f0abfc',
			muted: '#818cf8',
			background: '#0a0514'
		},
		cssVars: {
			'--theme-background': '#0a0514',
			'--theme-background-pattern': 'url(/aurora.svg), radial-gradient(circle 1px at 15% 20%, rgba(186, 230, 253, 0.9) 1px, transparent 1px), radial-gradient(circle 1px at 45% 35%, rgba(196, 181, 253, 0.85) 1px, transparent 1px), radial-gradient(circle 2px at 75% 15%, rgba(165, 243, 252, 0.9) 2px, transparent 2px), radial-gradient(circle 1px at 25% 60%, rgba(251, 207, 232, 0.8) 1px, transparent 1px), radial-gradient(circle 2px at 85% 70%, rgba(167, 139, 250, 0.9) 2px, transparent 2px), radial-gradient(circle 1px at 55% 80%, rgba(94, 234, 212, 0.75) 1px, transparent 1px), radial-gradient(circle 3px at 10% 90%, rgba(186, 230, 253, 0.85) 3px, transparent 3px), radial-gradient(ellipse 1200px 800px at 30% 40%, rgba(94, 234, 212, 0.08) 0%, rgba(99, 102, 241, 0.06) 30%, transparent 50%), radial-gradient(ellipse 1000px 700px at 70% 60%, rgba(129, 140, 248, 0.09) 0%, rgba(236, 72, 153, 0.05) 30%, transparent 45%)',
			'--theme-background-size': 'cover, auto, auto, auto, auto, auto, auto, auto, auto, auto',
			'--theme-background-position': 'center, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0',
			'--theme-background-repeat': 'no-repeat',
			'--theme-foreground': '#e0e7ff',
			'--theme-sidebar-bg': '#0f172a',
			'--theme-sidebar-text': '#ddd6fe',
			'--theme-sidebar-muted': '#a5f3fc',
			'--theme-sidebar-accent': '#14b8a6',
			'--theme-sidebar-hover': '#1e293b',
			'--theme-sidebar-active': '#1e1b4b',
			'--theme-sidebar-border': '#6366f1',
			'--theme-sidebar-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
			'--theme-header-bg': '#1e1b4b',
			'--theme-header-text': '#f5d0fe',
			'--theme-header-muted': '#f0abfc',
			'--theme-header-hover': '#312e81',
			'--theme-header-active': '#4338ca',
			'--theme-header-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
			'--theme-success': '#10b981',
			'--theme-error': '#ef4444',
			'--theme-warning': '#f59e0b',
			'--theme-info': '#3b82f6'
		},
		source: 'built-in'
	}
];

export function getThemeVariantById(id: string): ThemeVariant | undefined {
	return THEME_VARIANTS.find((variant) => variant.id === id);
}
