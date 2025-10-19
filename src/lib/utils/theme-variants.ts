import type { ThemeVariant } from "$lib/types/theme";

export const DEFAULT_THEME_ID = "light-default";

export const THEME_VARIANTS: ThemeVariant[] = [
  {
    id: "light-default",
    label: "Adventurer's Tunic",
    description: "Fresh and ready for any quest or photoshoot.",
    mode: "light",
    preview: {
      primary: "#16a34a",
      accent: "#22c55e",
      muted: "#94a3b8",
      background: "#ffffff",
    },
    cssVars: {
      "--theme-background": "#f8fafc", // Base layer (lightest neutral)
      "--theme-background-pattern":
        "radial-gradient(circle at 20% 50%, rgba(22, 163, 74, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(22, 163, 74, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(22, 163, 74, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 30%, rgba(34, 197, 94, 0.08) 0%, transparent 40%)",
      "--theme-background-size": "auto",
      "--theme-background-position": "0 0",
      "--theme-background-repeat": "no-repeat",
      "--theme-foreground": "#0f172a", // Primary text (dark slate)

      // Sidebar (neutral grays with green accent)
      "--theme-sidebar-bg": "#ffffff", // Pure white for maximum contrast
      "--theme-sidebar-text": "#0f172a", // Dark slate text (21:1 contrast)
      "--theme-sidebar-muted": "#64748b", // Neutral gray (4.54:1 contrast - WCAG AA)
      "--theme-sidebar-accent": "#16a34a", // Fresh green accent (professional)
      "--theme-sidebar-hover": "#f8fafc", // Subtle gray hover
      "--theme-sidebar-active": "#f0fdf4", // Very light green tint
      "--theme-sidebar-border": "#e2e8f0", // Neutral border
      "--theme-sidebar-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)", // Subtle shadow
      "--theme-alert-color": "#dc2626", // Red alert color for urgent items

      // Action Bar (neutral with subtle green hint)
      "--theme-header-bg": "#f8fafc", // Neutral light gray
      "--theme-header-text": "#0f172a", // Dark slate text
      "--theme-header-muted": "#64748b", // Neutral muted
      "--theme-header-hover": "#f1f5f9", // Slightly darker hover
      "--theme-header-active": "#e2e8f0", // Neutral active
      "--theme-header-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)", // Same as sidebar
    },
    source: "built-in",
  },
  {
    id: "light-warm",
    label: "Mystic Sands",
    description: "Warm desert tones for outdoor convention shoots.",
    mode: "light",
    preview: {
      primary: "#ea580c",
      accent: "#f59e0b",
      muted: "#a8a29e",
      background: "#fef7ee",
    },
    cssVars: {
      "--theme-background": "#fef7ee", // Warm cream (lightest)
      "--theme-background-pattern":
        "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(234, 88, 12, 0.04) 40px, rgba(234, 88, 12, 0.04) 80px), repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(234, 88, 12, 0.03) 40px, rgba(234, 88, 12, 0.03) 80px)",
      "--theme-background-size": "auto",
      "--theme-background-position": "0 0",
      "--theme-background-repeat": "repeat",
      "--theme-foreground": "#1c1917", // Dark stone (13.61:1 contrast)

      // Sidebar (neutral with warm accent and better contrast)
      "--theme-sidebar-bg": "#fef3e2", // Warm beige (more contrast vs background)
      "--theme-sidebar-text": "#1c1917", // Dark stone (18.21:1 contrast)
      "--theme-sidebar-muted": "#57534e", // Warm gray (5.12:1 contrast - WCAG AA)
      "--theme-sidebar-accent": "#dc2626", // Deeper red-orange accent (better visibility)
      "--theme-sidebar-hover": "#fef7ee", // Subtle hover
      "--theme-sidebar-active": "#fed7aa", // Warm peach tint
      "--theme-sidebar-border": "#e7d4b5", // Visible borders
      "--theme-sidebar-shadow":
        "0 1px 3px 0 rgb(124 45 18 / 0.1), 0 1px 2px -1px rgb(124 45 18 / 0.1)", // Warm shadow
      "--theme-alert-color": "#dc2626", // Red alert color for urgent items

      // Action Bar (subtle warm tint instead of bold orange)
      "--theme-header-bg": "#fed7aa", // Soft peach (subtle, not bold)
      "--theme-header-text": "#7c2d12", // Deep warm brown text
      "--theme-header-muted": "#9a3412", // Warm red-brown muted
      "--theme-header-hover": "#fdba74", // Slightly darker peach hover
      "--theme-header-active": "#fb923c", // More saturated active
      "--theme-header-shadow":
        "0 1px 3px 0 rgb(124 45 18 / 0.1), 0 1px 2px -1px rgb(124 45 18 / 0.1)", // Same as sidebar
    },
    source: "built-in",
  },
  {
    id: "light-cool",
    label: "Crystal Waters",
    description: "Cool aquatic tones inspired by fantasy pools.",
    mode: "light",
    preview: {
      primary: "#0891b2",
      accent: "#06b6d4",
      muted: "#64748b",
      background: "#ecfeff",
    },
    cssVars: {
      "--theme-background": "#91dff1", // Light cyan-blue
      "--theme-background-pattern": "url(/caustics.svg)",
      "--theme-background-size": "cover",
      "--theme-background-position": "center",
      "--theme-background-repeat": "no-repeat",
      "--theme-background-blend": "overlay", // Overlay blend mode
      "--theme-background-pattern-opacity": "1", // Full opacity for caustics
      "--theme-foreground": "#0c4a6e", // Deep blue (8.12:1 contrast)

      // Sidebar (neutral with cool accent and better contrast)
      "--theme-sidebar-bg": "#e0f2fe", // Cool cyan-white (more contrast)
      "--theme-sidebar-text": "#0c4a6e", // Deep blue (16.89:1 contrast)
      "--theme-sidebar-muted": "#475569", // Cool gray (6.92:1 contrast - WCAG AA)
      "--theme-sidebar-accent": "#0369a1", // Deeper cyan (better visibility)
      "--theme-sidebar-hover": "#ecfeff", // Subtle hover
      "--theme-sidebar-active": "#bae6fd", // Cool cyan tint
      "--theme-sidebar-border": "#7dd3fc", // Visible borders
      "--theme-sidebar-shadow": "0 1px 3px 0 rgb(8 51 68 / 0.1), 0 1px 2px -1px rgb(8 51 68 / 0.1)", // Cool shadow
      "--theme-alert-color": "#dc2626", // Red alert color for urgent items

      // Action Bar (subtle cool tint instead of bold cyan)
      "--theme-header-bg": "#bae6fd", // Soft sky blue (subtle, not bold)
      "--theme-header-text": "#075985", // Deep cyan text
      "--theme-header-muted": "#0c4a6e", // Deep blue muted
      "--theme-header-hover": "#7dd3fc", // Slightly darker sky hover
      "--theme-header-active": "#38bdf8", // More saturated active
      "--theme-header-shadow": "0 1px 3px 0 rgb(8 51 68 / 0.1), 0 1px 2px -1px rgb(8 51 68 / 0.1)", // Same as sidebar
    },
    source: "built-in",
  },
  {
    id: "dark-default",
    label: "Rolling Storm",
    description: "Dramatic stormy skies with electric lightning strikes.",
    mode: "dark",
    preview: {
      primary: "#eab308",
      accent: "#fbbf24",
      muted: "#64748b",
      background: "#1e293b",
    },
    cssVars: {
      "--theme-background": "#0f172a", // Deep slate storm
      "--theme-background-pattern":
        "radial-gradient(ellipse 1200px 400px at 40% 20%, rgba(251, 191, 36, 0.02) 0%, transparent 50%), radial-gradient(ellipse 1000px 350px at 70% 40%, rgba(234, 179, 8, 0.025) 0%, transparent 45%), radial-gradient(ellipse 800px 300px at 30% 70%, rgba(202, 138, 4, 0.015) 0%, transparent 40%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(71, 85, 105, 0.02) 2px, rgba(71, 85, 105, 0.02) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(51, 65, 85, 0.015) 2px, rgba(51, 65, 85, 0.015) 4px), radial-gradient(circle 2px at 25% 15%, rgba(250, 204, 21, 0.3) 0%, transparent 100%), radial-gradient(circle 1px at 75% 30%, rgba(234, 179, 8, 0.25) 0%, transparent 100%), radial-gradient(circle 3px at 15% 60%, rgba(251, 191, 36, 0.22) 0%, transparent 100%), radial-gradient(circle 1px at 85% 75%, rgba(250, 204, 21, 0.18) 0%, transparent 100%), radial-gradient(circle 2px at 45% 85%, rgba(234, 179, 8, 0.28) 0%, transparent 100%), radial-gradient(circle 1px at 55% 45%, rgba(251, 191, 36, 0.24) 0%, transparent 100%)",
      "--theme-background-size": "auto",
      "--theme-background-position": "0 0",
      "--theme-background-repeat": "no-repeat",
      "--theme-foreground": "#f1f5f9", // Light slate text

      // Sidebar (storm gray with yellow accent)
      "--theme-sidebar-bg": "#0a0f1a", // Very deep slate
      "--theme-sidebar-text": "#f1f5f9", // Light slate text
      "--theme-sidebar-muted": "#cbd5e1", // Slate muted (good contrast)
      "--theme-sidebar-accent": "#eab308", // Yellow lightning accent
      "--theme-sidebar-hover": "#1e293b", // Subtle storm hover
      "--theme-sidebar-active": "#334155", // Slate active
      "--theme-sidebar-border": "#475569", // Storm border
      "--theme-sidebar-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)", // Dark shadow
      "--theme-alert-color": "#fbbf24", // Amber/yellow alert color for urgent items (lightning)

      // Action Bar (storm clouds)
      "--theme-header-bg": "#1e293b", // Storm slate
      "--theme-header-text": "#fef3c7", // Warm light text
      "--theme-header-muted": "#fbbf24", // Amber muted
      "--theme-header-hover": "#334155", // Darker slate hover
      "--theme-header-active": "#475569", // Slate active
      "--theme-header-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)", // Same as sidebar
    },
    source: "built-in",
  },
  {
    id: "dark-purple",
    label: "Cozy Burrow",
    description: "Hobbiton warmth with earthy greens and cottage garden charm.",
    mode: "dark",
    preview: {
      primary: "#84cc16",
      accent: "#65a30d",
      muted: "#a16207",
      background: "#1a1410",
    },
    cssVars: {
      "--theme-background": "#1a1410", // Deep warm earth brown
      "--theme-background-pattern":
        "radial-gradient(ellipse 1000px 600px at 35% 45%, rgba(132, 204, 22, 0.06) 0%, transparent 50%), radial-gradient(ellipse 800px 500px at 65% 60%, rgba(101, 163, 13, 0.05) 0%, transparent 45%), radial-gradient(circle 400px at 20% 80%, rgba(161, 98, 7, 0.04) 0%, transparent 40%), repeating-linear-gradient(135deg, transparent, transparent 100px, rgba(74, 57, 29, 0.03) 100px, rgba(74, 57, 29, 0.03) 200px), repeating-linear-gradient(45deg, transparent, transparent 120px, rgba(82, 69, 37, 0.02) 120px, rgba(82, 69, 37, 0.02) 240px)",
      "--theme-background-size": "auto",
      "--theme-background-position": "0 0",
      "--theme-background-repeat": "no-repeat",
      "--theme-foreground": "#fef3c7", // Warm cream text

      // Sidebar (earthy brown with green accent)
      "--theme-sidebar-bg": "#2a2218", // Dark warm earth
      "--theme-sidebar-text": "#fef3c7", // Warm cream text
      "--theme-sidebar-muted": "#bda87a", // Soft tan muted
      "--theme-sidebar-accent": "#84cc16", // Lime green accent (hobbit door)
      "--theme-sidebar-hover": "#352b20", // Subtle earth hover
      "--theme-sidebar-active": "#3f3426", // Earth brown active
      "--theme-sidebar-border": "#4a3a2c", // Dark earth border
      "--theme-sidebar-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)", // Deep shadow
      "--theme-alert-color": "#f59e0b", // Warm amber alert color for urgent items

      // Action Bar (warm earth with green hints)
      "--theme-header-bg": "#352b20", // Medium earth brown
      "--theme-header-text": "#d9f99d", // Light lime text
      "--theme-header-muted": "#a3e635", // Lime muted
      "--theme-header-hover": "#3f3426", // Darker earth hover
      "--theme-header-active": "#4a5d23", // Olive green active
      "--theme-header-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)", // Same as sidebar
    },
    source: "built-in",
  },
  {
    id: "dark-blue",
    label: "Galactic Sea",
    description: "Aurora-lit void blending electric blue, purple, and pink.",
    mode: "dark",
    preview: {
      primary: "#14b8a6",
      accent: "#f0abfc",
      muted: "#818cf8",
      background: "#0a0514",
    },
    cssVars: {
      "--theme-background": "#0a0514", // Much darker deep indigo navy
      "--theme-background-pattern":
        "url(/aurora.svg), radial-gradient(circle 1px at 15% 20%, rgba(186, 230, 253, 0.9) 1px, transparent 1px), radial-gradient(circle 1px at 45% 35%, rgba(196, 181, 253, 0.85) 1px, transparent 1px), radial-gradient(circle 2px at 75% 15%, rgba(165, 243, 252, 0.9) 2px, transparent 2px), radial-gradient(circle 1px at 25% 60%, rgba(251, 207, 232, 0.8) 1px, transparent 1px), radial-gradient(circle 2px at 85% 70%, rgba(167, 139, 250, 0.9) 2px, transparent 2px), radial-gradient(circle 1px at 55% 80%, rgba(94, 234, 212, 0.75) 1px, transparent 1px), radial-gradient(circle 3px at 10% 90%, rgba(186, 230, 253, 0.85) 3px, transparent 3px), radial-gradient(circle 1px at 65% 50%, rgba(232, 121, 249, 0.8) 1px, transparent 1px), radial-gradient(circle 2px at 90% 25%, rgba(165, 243, 252, 0.85) 2px, transparent 2px), radial-gradient(circle 1px at 35% 45%, rgba(244, 114, 182, 0.7) 1px, transparent 1px), radial-gradient(circle 2px at 20% 75%, rgba(129, 140, 248, 0.9) 2px, transparent 2px), radial-gradient(circle 1px at 70% 85%, rgba(94, 234, 212, 0.75) 1px, transparent 1px), radial-gradient(circle 3px at 40% 10%, rgba(186, 230, 253, 0.9) 3px, transparent 3px), radial-gradient(circle 1px at 80% 55%, rgba(251, 207, 232, 0.8) 1px, transparent 1px), radial-gradient(circle 2px at 50% 65%, rgba(216, 180, 254, 0.85) 2px, transparent 2px), radial-gradient(circle 1px at 95% 40%, rgba(165, 243, 252, 0.8) 1px, transparent 1px), radial-gradient(circle 2px at 30% 30%, rgba(240, 171, 252, 0.75) 2px, transparent 2px), radial-gradient(circle 1px at 60% 20%, rgba(94, 234, 212, 0.7) 1px, transparent 1px), radial-gradient(circle 3px at 5% 50%, rgba(167, 139, 250, 0.85) 3px, transparent 3px), radial-gradient(circle 1px at 85% 90%, rgba(244, 114, 182, 0.75) 1px, transparent 1px), radial-gradient(circle 2px at 15% 65%, rgba(129, 140, 248, 0.8) 2px, transparent 2px), radial-gradient(circle 1px at 45% 85%, rgba(186, 230, 253, 0.7) 1px, transparent 1px), radial-gradient(circle 2px at 75% 45%, rgba(251, 207, 232, 0.9) 2px, transparent 2px), radial-gradient(circle 1px at 25% 15%, rgba(94, 234, 212, 0.75) 1px, transparent 1px), radial-gradient(circle 3px at 55% 35%, rgba(196, 181, 253, 0.85) 3px, transparent 3px), radial-gradient(circle 1px at 90% 10%, rgba(165, 243, 252, 0.7) 1px, transparent 1px), radial-gradient(circle 2px at 35% 70%, rgba(240, 171, 252, 0.85) 2px, transparent 2px), radial-gradient(circle 1px at 65% 95%, rgba(244, 114, 182, 0.75) 1px, transparent 1px), radial-gradient(circle 2px at 10% 30%, rgba(129, 140, 248, 0.8) 2px, transparent 2px), radial-gradient(circle 1px at 50% 55%, rgba(94, 234, 212, 0.65) 1px, transparent 1px), radial-gradient(circle 3px at 80% 75%, rgba(167, 139, 250, 0.9) 3px, transparent 3px), radial-gradient(ellipse 1200px 800px at 30% 40%, rgba(94, 234, 212, 0.08) 0%, rgba(99, 102, 241, 0.06) 30%, transparent 50%), radial-gradient(ellipse 1000px 700px at 70% 60%, rgba(129, 140, 248, 0.09) 0%, rgba(236, 72, 153, 0.05) 30%, transparent 45%), radial-gradient(ellipse 800px 600px at 50% 80%, rgba(139, 92, 246, 0.08) 0%, rgba(94, 234, 212, 0.04) 25%, transparent 40%)",
      "--theme-background-size":
        "cover, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto",
      "--theme-background-position":
        "center, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0",
      "--theme-background-repeat": "no-repeat",
      "--theme-foreground": "#e0e7ff", // Light periwinkle text (Moon palette)

      // Sidebar (much darker navy with darker teal accent)
      "--theme-sidebar-bg": "#0f172a", // Much darker blue-gray
      "--theme-sidebar-text": "#ddd6fe", // Light lavender text (Astro)
      "--theme-sidebar-muted": "#a5f3fc", // Light cyan muted (Luna of Gale)
      "--theme-sidebar-accent": "#14b8a6", // Darker teal accent (better contrast)
      "--theme-sidebar-hover": "#1e293b", // Much darker hover
      "--theme-sidebar-active": "#1e1b4b", // Deep indigo active
      "--theme-sidebar-border": "#6366f1", // Indigo border (Night Sky/Astro mix)
      "--theme-sidebar-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)", // Deep shadow
      "--theme-alert-color": "#f472b6", // Pink alert color for urgent items (matches pink stars)

      // Action Bar (much darker purple-pink gradient)
      "--theme-header-bg": "#1e1b4b", // Much darker rich indigo
      "--theme-header-text": "#f5d0fe", // Light pink text (Astro)
      "--theme-header-muted": "#f0abfc", // Fuchsia pink accent (Astro)
      "--theme-header-hover": "#312e81", // Darker purple hover
      "--theme-header-active": "#4338ca", // Purple active
      "--theme-header-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)", // Same as sidebar
    },
    source: "built-in",
  },
];

export function getThemeVariantById(id: string): ThemeVariant | undefined {
  return THEME_VARIANTS.find((variant) => variant.id === id);
}

export function isDarkTheme(id: string): boolean {
  return getThemeVariantById(id)?.mode === "dark";
}
