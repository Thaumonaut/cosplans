import { lighten, darken, mix } from 'color2k';

/**
 * Generates a complete shade palette from a base color
 * Similar to Tailwind's color scale (50-900)
 * 
 * @param baseColor - The base color in hex format (e.g., '#0891b2')
 * @param mode - 'light' or 'dark' mode (affects shade generation)
 * @returns Object with shades 50-900
 */
export function generateColorShades(baseColor: string, mode: 'light' | 'dark' = 'light') {
  if (mode === 'light') {
    return {
      50: lighten(baseColor, 0.50),   // Lightest - page backgrounds (more contrast)
      100: lighten(baseColor, 0.47),  // Very light - card backgrounds
      150: lighten(baseColor, 0.44),  // Light+ - elevated cards
      200: lighten(baseColor, 0.41),  // Light - input backgrounds (more distinct)
      300: lighten(baseColor, 0.30),  // Medium-light - borders
      400: lighten(baseColor, 0.15),  // Medium - muted text
      500: baseColor,                  // Base - accent color
      600: darken(baseColor, 0.10),   // Medium-dark - hover states
      700: darken(baseColor, 0.20),   // Dark - active states
      800: darken(baseColor, 0.30),   // Very dark - headings
      900: darken(baseColor, 0.40),   // Darkest - primary text
    };
  } else {
    // Dark mode: invert the scale
    return {
      50: darken(baseColor, 0.45),    // Darkest - page backgrounds
      100: darken(baseColor, 0.42),   // Very dark - card backgrounds
      150: darken(baseColor, 0.39),   // Dark+ - elevated cards
      200: darken(baseColor, 0.36),   // Dark - input backgrounds
      300: darken(baseColor, 0.25),   // Medium-dark - borders
      400: darken(baseColor, 0.10),   // Medium - muted text
      500: baseColor,                  // Base - accent color
      600: lighten(baseColor, 0.10),  // Medium-light - hover states
      700: lighten(baseColor, 0.20),  // Light - active states
      800: lighten(baseColor, 0.35),  // Very light - headings
      900: lighten(baseColor, 0.45),  // Lightest - primary text
    };
  }
}

/**
 * Generates neutral gray shades for text and UI elements
 * Uses a desaturated version of the base color for harmony
 */
export function generateNeutralShades(baseColor: string, mode: 'light' | 'dark' = 'light') {
  // Mix base color with gray for harmonious neutrals
  const neutral = mix(baseColor, mode === 'light' ? '#64748b' : '#94a3b8', 0.7);
  
  if (mode === 'light') {
    return {
      50: '#f8fafc',   // Lightest gray
      100: '#f1f5f9',  // Very light gray
      200: '#e2e8f0',  // Light gray - subtle borders
      300: '#cbd5e1',  // Medium-light gray - borders
      400: '#94a3b8',  // Medium gray - muted text
      500: '#64748b',  // Base gray
      600: '#475569',  // Medium-dark gray
      700: '#334155',  // Dark gray
      800: '#1e293b',  // Very dark gray - headings
      900: '#0f172a',  // Darkest gray - primary text
    };
  } else {
    return {
      50: '#0f172a',   // Darkest gray
      100: '#1e293b',  // Very dark gray
      200: '#334155',  // Dark gray
      300: '#475569',  // Medium-dark gray
      400: '#64748b',  // Medium gray - muted text
      500: '#94a3b8',  // Base gray
      600: '#cbd5e1',  // Medium-light gray
      700: '#e2e8f0',  // Light gray
      800: '#f1f5f9',  // Very light gray - headings
      900: '#f8fafc',  // Lightest gray - primary text
    };
  }
}

/**
 * Maps color shades to semantic CSS variable names
 * This creates the actual theme CSS variables from the shade palette
 */
export function mapShadesToThemeVars(
  colorShades: ReturnType<typeof generateColorShades>,
  neutralShades: ReturnType<typeof generateNeutralShades>,
  mode: 'light' | 'dark'
) {
  return {
    // Page structure - subtle color for ambiance, white for inputs
    '--theme-background': colorShades[50],         // Very light color tint
    '--theme-card-bg': colorShades[100],           // Subtle color for cards
    '--theme-card-elevated': colorShades[150],     // Slightly more color for elevation
    '--theme-input-bg': '#ffffff',                 // Pure white inputs (stand out!)
    
    // Borders - mix of neutral and subtle color
    '--theme-border-subtle': colorShades[200],
    '--theme-border': colorShades[300],
    '--theme-sidebar-border': neutralShades[200],
    
    // Text hierarchy - neutral grays
    '--theme-foreground': neutralShades[900],
    '--theme-text-primary': neutralShades[900],
    '--theme-text-secondary': neutralShades[700],
    '--theme-sidebar-text': neutralShades[900],
    '--theme-sidebar-muted': neutralShades[500],
    
    // Sidebar/Navigation - use COLOR shades for accent areas
    '--theme-sidebar-bg': neutralShades[50],       // Light gray sidebar
    '--theme-sidebar-hover': neutralShades[100],   // Subtle hover
    '--theme-sidebar-active': colorShades[100],    // Color tint for active
    '--theme-sidebar-accent': colorShades[600],    // Accent color
    
    // Header/Action bar - neutral with subtle color
    '--theme-header-bg': neutralShades[50],
    '--theme-header-text': neutralShades[900],
    '--theme-header-muted': neutralShades[600],
    '--theme-header-hover': neutralShades[100],
    '--theme-header-active': colorShades[100],
    
    // Interactive states - use COLOR shades
    '--theme-hover': colorShades[600],
    '--theme-active': colorShades[700],
    '--theme-accent': colorShades[500],
    
    // Semantic colors (fixed, not from shades)
    '--theme-success': '#10b981',
    '--theme-error': '#ef4444',
    '--theme-warning': '#f59e0b',
    '--theme-info': '#3b82f6',
    '--theme-alert-color': '#dc2626',
    
    // Shadows
    '--theme-sidebar-shadow': mode === 'light' 
      ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      : '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
    '--theme-header-shadow': mode === 'light'
      ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      : '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
  };
}

/**
 * Complete theme generator from a single base color
 * This is the main function to use for creating new themes
 */
export function generateThemeFromColor(
  baseColor: string,
  mode: 'light' | 'dark' = 'light',
  includePattern: boolean = false
): Record<string, string> {
  const colorShades = generateColorShades(baseColor, mode);
  const neutralShades = generateNeutralShades(baseColor, mode);
  const themeVars: Record<string, string> = mapShadesToThemeVars(colorShades, neutralShades, mode);
  
  // Optionally add background pattern
  if (includePattern) {
    themeVars['--theme-background-pattern'] = mode === 'light'
      ? `radial-gradient(circle at 20% 50%, ${colorShades[300]}40 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${colorShades[300]}30 0%, transparent 50%)`
      : `radial-gradient(circle at 20% 50%, ${colorShades[600]}20 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${colorShades[600]}15 0%, transparent 50%)`;
    themeVars['--theme-background-size'] = 'auto';
    themeVars['--theme-background-position'] = '0 0';
    themeVars['--theme-background-repeat'] = 'no-repeat';
    themeVars['--theme-background-pattern-opacity'] = '1';
  }
  
  return themeVars;
}
