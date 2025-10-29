import { ThemedStyle } from '../../../theme';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

export const scrollContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
});

export const contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: scale(spacing.md),
  paddingBottom: verticalScale(spacing.xl),
});

export const lawyerInfo: ThemedStyle<ViewStyle> = ({
  colors,
  spacing,
}) => ({
  backgroundColor: colors.surfaceContainer,
  borderRadius: scale(spacing.sm),
  padding: scale(spacing.md),
  alignItems: 'center',
  marginBottom: verticalScale(spacing.lg),
});

export const lawyerAvatar: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: scale(80),
  height: scale(80),
  borderRadius: scale(40),
  marginBottom: verticalScale(spacing.sm),
});

export const lawyerName: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  fontSize: moderateScale(fontSizes.lg),
  fontWeight: 'bold',
  color: colors.onSurface,
  marginBottom: verticalScale(4),
});

export const lawyerBio: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurfaceVariant,
  textAlign: 'center',
  marginTop: verticalScale(spacing.xs),
});

export const formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: verticalScale(spacing.md),
});

export const textAreaContainer: ThemedStyle<ViewStyle> = () => ({
  width: '100%',
});

export const textAreaLabel: ThemedStyle<TextStyle> = ({
  spacing,
  fontSizes,
  colors,
}) => ({
  marginBottom: scale(spacing.xs),
  fontSize: moderateScale(fontSizes.md),
  color: colors.onSurface,
  fontWeight: '600',
});

export const textArea: ThemedStyle<TextStyle> = ({
  colors,
  spacing,
}) => ({
  borderWidth: scale(spacing.xxxxs),
  borderColor: colors.outline,
  borderRadius: scale(spacing.sm),
  backgroundColor: colors.surfaceContainer,
  paddingHorizontal: scale(spacing.md),
  paddingVertical: verticalScale(spacing.sm),
  color: colors.onSurface,
  fontSize: moderateScale(14),
  minHeight: verticalScale(100),
});

export const textAreaError: ThemedStyle<TextStyle> = ({ colors }) => ({
  borderColor: colors.error,
});

export const errorText: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  marginTop: scale(4),
  color: colors.error,
  fontSize: moderateScale(fontSizes.sm),
});

export const submitButton: ThemedStyle<ViewStyle> = ({
  colors,
  spacing,
}) => ({
  backgroundColor: colors.primary,
  paddingVertical: verticalScale(spacing.md),
  borderRadius: scale(spacing.sm),
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: verticalScale(spacing.lg),
});

export const submitButtonDisabled: ThemedStyle<ViewStyle> = ({
  colors,
}) => ({
  backgroundColor: colors.onSurfaceVariant,
  opacity: 0.6,
});

export const submitButtonText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(fontSizes.md),
  fontWeight: '600',
});

