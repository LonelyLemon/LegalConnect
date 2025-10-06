import { ThemedStyle } from '../../../theme';
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const centerContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: scale(spacing.lg),
});

export const logo: ThemedStyle<ImageStyle> = () => ({
  width: scale(120),
  height: verticalScale(120),
  marginBottom: verticalScale(16),
});

export const appName: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  fontSize: moderateScale(fontSizes.xl),
  fontWeight: '700',
  color: colors.onBackground,
  marginBottom: verticalScale(8),
  textAlign: 'center',
});

export const slogan: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  fontSize: moderateScale(fontSizes.md),
  color: colors.onSurfaceVariant,
  textAlign: 'center',
  marginBottom: verticalScale(32),
});

export const buttonGroup: ThemedStyle<ViewStyle> = () => ({
  width: '100%',
  alignItems: 'center',
  gap: verticalScale(12),
});

export const primaryButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: '100%',
  backgroundColor: colors.primary,
  paddingVertical: verticalScale(12),
  borderRadius: scale(8),
  alignItems: 'center',
});

export const buttonText: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onPrimary,
  fontWeight: '600',
  fontSize: moderateScale(fontSizes.md),
});
