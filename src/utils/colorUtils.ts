
/**
 * Utility functions for handling colors in the application
 */

/**
 * Converts a HEX color to RGBA
 * @param hex - The HEX color to convert (e.g., #FFB800)
 * @param alpha - The alpha value (0-1)
 * @returns RGBA color string
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  
  // Return as rgba
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Applies the Vyānamana color theme
 * These colors are defined both in the CSS variables (for Tailwind)
 * and used in some components directly
 */
export const vyanamanaPalette = {
  // Main colors
  background: '#3D1C12', // Dark amber/brown
  primary: '#FFB800', // Gold/amber
  text: '#FFE8B3', // Light amber/cream
  highlight: '#FFF8E5', // soft amber white
  
  // UI variations
  cardBg: 'rgba(255, 255, 255, 0.05)',
  glassBg: 'rgba(255, 255, 255, 0.1)',
  inputBorder: 'rgba(255, 184, 0, 0.3)',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)',
  accentGradient: 'linear-gradient(135deg, #FFF8E5 0%, #FFE8B3 100%)',
  
  // Semantic colors
  success: '#7EB356', // Muted green
  warning: '#FBBF24', // Amber warning
  error: '#F87171', // Soft red
  info: '#64B5F6', // Soft blue
  
  // Get a color with alpha
  withAlpha: (color: string, alpha: number): string => {
    return color.startsWith('#') ? hexToRgba(color, alpha) : color;
  }
};
