import { ThemedStyle } from '../../../theme';
import { TextStyle, ViewStyle } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = () => ({
  width: '100%',
});

export const fieldName: ThemedStyle<TextStyle> = ({
  spacing,
  fontSizes,
  colors,
}) => ({
  marginBottom: scale(spacing.xs),
  fontSize: moderateScale(fontSizes.md),
  color: colors.onSurface,
  fontWeight: '600' as any,
});

export const input: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: scale(spacing.xxxxs),
  borderColor: colors.outline,
  borderRadius: scale(spacing.sm),
  paddingHorizontal: scale(spacing.md),
  paddingVertical: verticalScale(spacing.xs),
  backgroundColor: colors.surfaceContainer,
  // match Input height by using padding instead of fixed height
});

export const dateText: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onSurface,
  fontSize: moderateScale(fontSizes.md),
});

export const inputError: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.error,
});

export const inputDisabled: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.surfaceVariant,
  opacity: 0.6,
});

export const dateTextDisabled: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.onSurfaceVariant,
});

export const errorText: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  marginTop: scale(4),
  color: colors.error,
  fontSize: moderateScale(fontSizes.sm),
});
