import { parseToRgba, toHex } from 'color2k';

/**
 * Color Harmony Generator
 * Automatically generates harmonious color schemes from a single base color
 */

export type HarmonyType = 
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic';

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return [h * 360, s * 100, l * 100];
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Rotate hue by degrees
 */
function rotateHue(color: string, degrees: number): string {
  const [r, g, b] = parseToRgba(color);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  let newHue = (h + degrees) % 360;
  if (newHue < 0) newHue += 360;
  
  const [newR, newG, newB] = hslToRgb(newHue, s, l);
  return toHex(`rgba(${newR}, ${newG}, ${newB}, 1)`);
}

/**
 * Generate color harmony from a base color
 */
export function generateHarmony(baseColor: string, harmonyType: HarmonyType): {
  primary: string;
  secondary: string;
  accent: string;
} {
  switch (harmonyType) {
    case 'monochromatic':
      // Same hue, different saturations/lightness
      return {
        primary: baseColor,
        secondary: baseColor,
        accent: baseColor,
      };
    
    case 'analogous':
      // Adjacent colors on the wheel (±30°)
      return {
        primary: baseColor,
        secondary: rotateHue(baseColor, -30),
        accent: rotateHue(baseColor, 30),
      };
    
    case 'complementary':
      // Opposite on the wheel (180°)
      return {
        primary: baseColor,
        secondary: rotateHue(baseColor, 180),
        accent: rotateHue(baseColor, 60), // Triadic for variety
      };
    
    case 'split-complementary':
      // Base + two adjacent to complement (150°, 210°)
      return {
        primary: baseColor,
        secondary: rotateHue(baseColor, 150),
        accent: rotateHue(baseColor, 210),
      };
    
    case 'triadic':
      // Three colors evenly spaced (120° apart)
      return {
        primary: baseColor,
        secondary: rotateHue(baseColor, 120),
        accent: rotateHue(baseColor, 240),
      };
    
    case 'tetradic':
      // Four colors (two complementary pairs)
      // Using primary + 90° + 180° for variety
      return {
        primary: baseColor,
        secondary: rotateHue(baseColor, 90),
        accent: rotateHue(baseColor, 180),
      };
    
    default:
      return {
        primary: baseColor,
        secondary: baseColor,
        accent: baseColor,
      };
  }
}

/**
 * Get harmony description for UI
 */
export function getHarmonyDescription(harmonyType: HarmonyType): string {
  const descriptions: Record<HarmonyType, string> = {
    'monochromatic': 'Single color with varying shades - subtle and cohesive',
    'analogous': 'Adjacent colors - harmonious and serene',
    'complementary': 'Opposite colors - high contrast and vibrant',
    'split-complementary': 'Base + two adjacent to complement - balanced contrast',
    'triadic': 'Three evenly spaced colors - vibrant and balanced',
    'tetradic': 'Two complementary pairs - rich and varied',
  };
  
  return descriptions[harmonyType];
}
