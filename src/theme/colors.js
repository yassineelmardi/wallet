// Palette de couleurs principale — thème fintech premium
export const Colors = {
  // Fonds
  background: '#0A0E1A',
  surface: '#141928',
  card: '#1C2333',
  cardAlt: '#232B40',

  // Accents
  primary: '#4F7EFF',
  primaryLight: '#7B9FFF',
  primaryDark: '#2D5BCC',
  accent: '#00C896',
  accentWarn: '#FF6B6B',
  accentYellow: '#FFB740',

  // Textes
  textPrimary: '#FFFFFF',
  textSecondary: '#8A9BB8',
  textMuted: '#4A5568',
  textInverse: '#0A0E1A',

  // Bordures
  border: '#2A3347',
  borderLight: '#1E2740',

  // Statuts
  success: '#00C896',
  error: '#FF6B6B',
  warning: '#FFB740',
  info: '#4F7EFF',

  // Gradients (à utiliser avec expo-linear-gradient)
  gradientPrimary: ['#4F7EFF', '#2D5BCC'],
  gradientSuccess: ['#00C896', '#00A67E'],
  gradientWarn: ['#FF6B6B', '#CC4F4F'],
  gradientCard: ['#1C2333', '#141928'],
  gradientGold: ['#FFB740', '#FF8C00'],
};

// Thème clair
export const LightColors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardAlt: '#F0F4FF',
  primary: '#4F7EFF',
  primaryLight: '#7B9FFF',
  primaryDark: '#2D5BCC',
  accent: '#00C896',
  accentWarn: '#FF6B6B',
  accentYellow: '#FFB740',
  textPrimary: '#0A0E1A',
  textSecondary: '#5A6A85',
  textMuted: '#A0AEC0',
  textInverse: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  success: '#00C896',
  error: '#FF6B6B',
  warning: '#FFB740',
  info: '#4F7EFF',
  gradientPrimary: ['#4F7EFF', '#2D5BCC'],
  gradientSuccess: ['#00C896', '#00A67E'],
  gradientWarn: ['#FF6B6B', '#CC4F4F'],
  gradientCard: ['#FFFFFF', '#F0F4FF'],
  gradientGold: ['#FFB740', '#FF8C00'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#4F7EFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
};
