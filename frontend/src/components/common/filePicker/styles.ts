import { ThemedStyle } from '../../../theme';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: verticalScale(spacing.xs),
});

export const label: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  fontSize: moderateScale(fontSizes.md),
  color: colors.onBackground,
});

export const required: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.error,
  fontSize: moderateScale(fontSizes.sm),
});

export const fileName: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.primary,
  textDecorationLine: 'underline',
  fontSize: moderateScale(fontSizes.sm),
});

export const chooseFileContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: scale(spacing.xs),
});

export const chooseFile: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.surfaceContainerHighest,
  paddingVertical: verticalScale(spacing.xs),
  paddingHorizontal: scale(spacing.sm),
  borderRadius: spacing.xs,
  borderWidth: scale(spacing.xxxxs),
  borderColor: colors.outline,
  alignSelf: 'flex-start',
});

export const chooseFileText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  color: colors.onBackground,
  fontSize: moderateScale(fontSizes.md),
});

export const image: ThemedStyle<ImageStyle> = () => ({
  width: '100%',
  aspectRatio: 1,
  resizeMode: 'cover',
});

export const imagePlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: '100%',
  aspectRatio: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.outlineVariant,
});

export const imagePlaceholderError: ThemedStyle<ViewStyle> = ({
  colors,
  spacing,
}) => ({
  borderColor: colors.error,
  borderWidth: scale(spacing.xxxxs),
});

export const error: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.error,
  fontSize: moderateScale(fontSizes.sm),
});

export const fileList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: scale(spacing.xs),
});
