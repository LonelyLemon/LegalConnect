import { moderateScale } from 'react-native-size-matters';
import { TextStyle, ViewStyle } from 'react-native';

export const container = (theme: any): ViewStyle => ({
  flex: 1,
  backgroundColor: theme.colors.background,
});

export const scrollView = (_theme: any): ViewStyle => ({
  flex: 1,
});

export const scrollContent = (theme: any): ViewStyle => ({
  paddingHorizontal: moderateScale(theme.spacing.md),
  paddingBottom: moderateScale(theme.spacing.xl),
});

export const headerTitle = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.md),
  fontWeight: '400' as const,
  color: theme.colors.onSurface,
});

export const caseTitle = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.xxl),
  fontWeight: 'bold' as const,
  color: theme.colors.onSurface,
  marginBottom: moderateScale(theme.spacing.lg),
  lineHeight: moderateScale(32),
});

export const section = (theme: any): ViewStyle => ({
  marginBottom: moderateScale(theme.spacing.xl),
});

export const sectionTitle = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.lg),
  fontWeight: 'bold' as const,
  color: theme.colors.onSurface,
  marginBottom: moderateScale(theme.spacing.sm),
});

export const descriptionText = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.md),
  color: theme.colors.onSurface,
  lineHeight: moderateScale(22),
});

export const contactText = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.md),
  color: theme.colors.onSurface,
  marginBottom: moderateScale(theme.spacing.xs),
});

export const requestButton = (theme: any): ViewStyle => ({
  backgroundColor: theme.colors.primary,
  borderRadius: moderateScale(8),
  paddingVertical: moderateScale(theme.spacing.md),
  paddingHorizontal: moderateScale(theme.spacing.lg),
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginTop: moderateScale(theme.spacing.lg),
});

export const requestButtonText = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.md),
  fontWeight: '600' as const,
  color: theme.colors.onPrimary,
});
