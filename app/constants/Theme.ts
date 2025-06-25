/**
 * Design System - VaquejadaPro
 * Paleta de cores profissional baseada em tons de azul
 */

export const colors = {
  // Paleta principal
  primary: {
    50: '#F8FAFC', // Muito claro
    100: '#F1F5F9', // Claro
    200: '#E2E8F0', // Suave
    300: '#CBD5E1', // Médio claro
    400: '#94A3B8', // Médio
    500: '#778DA9', // Base (blue gray)
    600: '#415A77', // Escuro médio (slate blue)
    700: '#1B263B', // Escuro (navy)
    800: '#0D1B2A', // Muito escuro (navy deep)
    900: '#0A141F', // Ultra escuro
  },

  // Cores de apoio
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Cores funcionais
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  // Gradientes
  gradients: {
    primary: ['#415A77', '#1B263B'],
    primaryLight: ['#778DA9', '#415A77'],
    dark: ['#1B263B', '#0D1B2A'],
    success: ['#22C55E', '#16A34A'],
  },
};

export const typography = {
  // Tamanhos de fonte
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Pesos
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Alturas de linha
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.primary[800],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.primary[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.primary[800],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.primary[800],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Classes utilitárias para NativeWind
export const tailwindClasses = {
  // Backgrounds
  bgPrimary: 'bg-[#415A77]',
  bgPrimaryDark: 'bg-[#1B263B]',
  bgPrimaryLight: 'bg-[#778DA9]',
  bgSurface: 'bg-[#E0E1DD]',
  bgDark: 'bg-[#0D1B2A]',

  // Text colors
  textPrimary: 'text-[#0D1B2A]',
  textSecondary: 'text-[#415A77]',
  textMuted: 'text-[#778DA9]',
  textLight: 'text-[#E0E1DD]',

  // Borders
  borderPrimary: 'border-[#415A77]',
  borderLight: 'border-[#E0E1DD]',

  // Gradients (para uso com LinearGradient)
  gradientPrimary: ['#415A77', '#1B263B'],
  gradientLight: ['#778DA9', '#415A77'],
  gradientDark: ['#1B263B', '#0D1B2A'],
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  tailwindClasses,
};
