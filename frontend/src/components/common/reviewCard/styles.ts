import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { ThemedStyle } from '../../../theme';

export const cardContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.surfaceContainerLowest,
  borderRadius: moderateScale(spacing.sm),
  padding: moderateScale(spacing.md),
  marginVertical: verticalScale(spacing.xxxs),
  shadowColor: colors.shadow,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
});

export const headerRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: verticalScale(spacing.sm),
});

export const profileImage: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: moderateScale(40),
  height: moderateScale(40),
  borderRadius: moderateScale(20),
  marginRight: moderateScale(spacing.sm),
});

export const headerInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  gap: moderateScale(spacing.xxxs),
});

export const nameText: ThemedStyle<TextStyle> = ({
  fontSizes,
  colors,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.md),
  fontWeight: 'bold' as const,
  color: colors.primary,
  marginRight: moderateScale(spacing.xxxs),
});

export const dateContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: moderateScale(spacing.xxxs),
});

export const dot: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: moderateScale(4),
  height: moderateScale(4),
  borderRadius: moderateScale(2),
  backgroundColor: colors.onSurface,
  opacity: 0.5,
});

export const dateText: ThemedStyle<TextStyle> = ({ fontSizes, colors }) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurface,
  opacity: 0.7,
});

export const reviewText: ThemedStyle<TextStyle> = ({
  fontSizes,
  colors,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.md),
  color: colors.onSurfaceVariant,
  lineHeight: moderateScale(fontSizes.md * 1.5),
  marginBottom: verticalScale(spacing.sm),
});

export const ratingBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.primary,
  borderRadius: moderateScale(spacing.xs),
  paddingHorizontal: moderateScale(spacing.sm),
  paddingVertical: moderateScale(spacing.xxxs),
  alignSelf: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  gap: moderateScale(spacing.xxxs),
});

export const ratingText: ThemedStyle<TextStyle> = ({ fontSizes, colors }) => ({
  fontSize: moderateScale(fontSizes.sm),
  fontWeight: '600' as const,
  color: colors.onSurface,
});

export const reviewImagesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: verticalScale(spacing.sm),
  maxHeight: moderateScale(120),
});

export const reviewImagesContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: moderateScale(spacing.xs),
  paddingRight: moderateScale(spacing.md),
});

export const reviewImage: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: moderateScale(100),
  height: moderateScale(100),
  borderRadius: moderateScale(spacing.xs),
  marginRight: moderateScale(spacing.xs),
});
