import { ThemedStyle } from '../../../theme';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const card: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: scale(120),
  gap: verticalScale(spacing.xs),
});

export const thumbnail: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: '100%',
  height: verticalScale(100),
  backgroundColor: colors.surfaceVariant,
  borderRadius: scale(spacing.sm),
  overflow: 'hidden',
});

export const image: ThemedStyle<ImageStyle> = () => ({
  width: '100%',
  height: '100%',
});

export const placeholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.surfaceVariant,
});

export const title: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  textAlign: 'center',
  color: colors.onSurface,
  fontWeight: '700' as any,
  fontSize: moderateScale(fontSizes.sm),
});
