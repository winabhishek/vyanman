
/**
 * Utility functions for handling colors in the application
 */

/**
 * Converts a HEX color to RGBA
 * @param hex - The HEX color to convert (e.g., #1E1F2F)
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
  background: '#1E1F2F',
  primary: '#6C63FF',
  text: '#D9D9D9',
  highlight: '#F8F8FB',
  
  // UI variations
  cardBg: 'rgba(255, 255, 255, 0.1)',
  glassBg: 'rgba(255, 255, 255, 0.15)',
  inputBorder: 'rgba(108, 99, 255, 0.3)',
  
  // Gradients
  primaryGradient: 'linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)',
  accentGradient: 'linear-gradient(135deg, #F8F8FB 0%, #D9D9D9 100%)',
  
  // Semantic colors
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Get a color with alpha
  withAlpha: (color: string, alpha: number): string => {
    return color.startsWith('#') ? hexToRgba(color, alpha) : color;
  }
};
