/**
 * Design Token System
 *
 * Centralized design tokens for consistent theming across the app.
 * Based on competitive analysis of v0 and Rork mobile patterns.
 *
 * USAGE:
 * import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: colors.background,
 *     padding: spacing.md,
 *     borderRadius: borderRadius.lg,
 *     ...shadows.md,
 *   },
 * });
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Brand Colors (White Sanctuary with Purple Accents)
  primary: '#7C3AED',      // Vibrant Purple (from reference image)
  primaryDark: '#5B21B6',
  primaryLight: '#8B5CF6',
  primaryTint: '#EDE9FE',

  secondary: '#F8FAFC',    // Soft Silver / Neutral
  secondaryDark: '#F1F5F9',
  secondaryLight: '#FFFFFF',
  secondaryTint: '#E2E8F0',

  accent: '#A78BFA',       // Soft Lavender
  accentDark: '#7C3AED',
  accentLight: '#C4B5FD',
  accentTint: '#DDD6FE',

  // Background Colors (Pure White & Elegant Neutrals)
  background: '#FFFFFF',   // Pure White Base
  backgroundSecondary: '#F9FAFB', // Whisper Grey
  backgroundTertiary: '#F3F4F6',  // Soft Silver

  // Dark Mode Backgrounds (Kept but flipped for "White Sanctuary" logic)
  backgroundDark: '#FFFFFF',
  backgroundDarkSecondary: '#F9FAFB',
  backgroundDarkTertiary: '#F3F4F6',

  // Text Colors (Weightless & Precise)
  text: '#111827',         // Deep Charcoal (for absolute clarity)
  textSecondary: '#4B5563', // Soft Grey secondary
  textTertiary: '#9CA3AF',  // Quiet tertiary
  textDisabled: '#D1D5DB',

  // Dark Mode Text
  textDark: '#111827',
  textDarkSecondary: '#4B5563',
  textDarkTertiary: '#9CA3AF',

  // Semantic Colors
  success: '#10B981',      // Emerald
  successDark: '#059669',
  successLight: '#34D399',
  successTint: '#D1FAE5',

  error: '#EF4444',        // Rose
  errorDark: '#DC2626',
  errorLight: '#F87171',
  errorTint: '#FEE2E2',

  warning: '#F59E0B',
  warningDark: '#D97706',
  warningLight: '#FBBF24',
  warningTint: '#FEF3C7',

  info: '#3B82F6',
  infoDark: '#2563EB',
  infoLight: '#60A5FA',
  infoTint: '#DBEAFFE',

  // Border Colors
  border: '#E5E7EB',       // Subtle separation
  borderDark: '#D1D5DB',
  borderLight: '#F3F4F6',

  // Dark Mode Borders
  borderDarkMode: '#E5E7EB',
  borderDarkModeLight: '#F3F4F6',

  // Overlay Colors
  overlay: 'rgba(255, 255, 255, 0.8)',
  overlayLight: 'rgba(255, 255, 255, 0.5)',
  overlayDark: 'rgba(255, 255, 255, 0.95)',

  // Special Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// ============================================================================
// SPACING
// ============================================================================

/**
 * Spacing scale based on 8pt grid
 * Use for padding, margin, gap
 */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  xxxxl: 96,
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Typography presets
 * Use with spread operator: { ...typography.h1 }
 */
export const typography = {
  display: {
    fontSize: 48,
    fontWeight: '300' as const, // Weightless
    lineHeight: 56,
    letterSpacing: -1,
  },
  h1: {
    fontSize: 32,
    fontWeight: '400' as const, // Precise
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '400' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  body: {
    fontSize: 16,
    fontWeight: '300' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 14,
    fontWeight: '300' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  small: {
    fontSize: 12,
    fontWeight: '300' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '300' as const,
    lineHeight: 12,
    letterSpacing: 0,
  },
};

// ============================================================================
// SHADOWS
// ============================================================================

/**
 * Shadow presets for iOS (shadowColor, shadowOffset, etc.)
 * and Android (elevation)
 * Use with spread operator: { ...shadows.md }
 */
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  xxl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Border radius scale
 * Use for consistent rounded corners
 */
export const borderRadius = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  xxl: 16,
  xxxl: 24,
  full: 9999,
};

// ============================================================================
// TOUCH TARGETS
// ============================================================================

/**
 * Minimum touch target sizes
 * iOS HIG: 44x44 points
 * Android Material: 48x48dp
 */
export const touchTargets = {
  minimum: 44,      // iOS HIG minimum
  comfortable: 48,  // Android Material minimum
  large: 56,        // Large touch targets for primary actions
};

// ============================================================================
// OPACITY
// ============================================================================

/**
 * Opacity values for different states
 */
export const opacity = {
  disabled: 0.4,
  pressed: 0.7,
  hover: 0.8,
  overlay: 0.5,
  overlayLight: 0.3,
  overlayDark: 0.7,
};

// ============================================================================
// Z-INDEX
// ============================================================================

/**
 * Z-index scale for layering
 */
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
};

// ============================================================================
// ICON SIZES
// ============================================================================

/**
 * Standard icon sizes
 */
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// ============================================================================
// AVATAR SIZES
// ============================================================================

/**
 * Standard avatar sizes
 */
export const avatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  xxl: 120,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color with opacity
 * @param color - Hex color (e.g., '#2563EB')
 * @param opacity - Opacity value 0-1 (e.g., 0.5)
 */
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get dark mode color based on current theme
 * @param lightColor - Color for light mode
 * @param darkColor - Color for dark mode
 * @param isDark - Current theme mode
 */
export const getThemedColor = (
  lightColor: string,
  darkColor: string,
  isDark: boolean
): string => {
  return isDark ? darkColor : lightColor;
};