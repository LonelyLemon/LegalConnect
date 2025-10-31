import { ImageStyle, ViewStyle } from 'react-native';
import { ThemedStyle } from '../../../theme';
import { TextStyle } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

export const cardContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.surfaceContainerLowest,
  borderRadius: moderateScale(spacing.sm),
  marginVertical: verticalScale(spacing.xxxs),
  shadowColor: colors.shadow,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  overflow: 'hidden',
  width: moderateScale(spacing.xxxxxl * 3), // Fixed width for horizontal scroll
  marginHorizontal: moderateScale(spacing.xxxs), // Small margin between cards
});

export const imageContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: '90%',
  height: verticalScale(spacing.xxxl * 3), // Fixed height for 2-column layout
  marginBottom: verticalScale(spacing.xxs),
  marginTop: verticalScale(spacing.sm),
  alignSelf: 'center',
});

export const profileImage: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
  borderRadius: moderateScale(spacing.sm),
});

export const profilePlaceholder: ThemedStyle<ViewStyle> = ({
  spacing,
  colors,
}) => ({
  width: '100%',
  height: '100%',
  borderRadius: moderateScale(spacing.sm),
  backgroundColor: colors.surfaceContainer,
  alignItems: 'center',
  justifyContent: 'center',
});

export const contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: moderateScale(spacing.sm),
  paddingBottom: verticalScale(spacing.sm),
});

export const nameText: ThemedStyle<TextStyle> = ({
  colors,
  spacing,
  fontSizes,
}) => ({
  fontSize: moderateScale(fontSizes.md),
  fontWeight: '700',
  color: colors.onSurface,
  marginBottom: verticalScale(spacing.xxs),
});

export const descriptionText: ThemedStyle<TextStyle> = ({
  colors,
  spacing,
  fontSizes,
}) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurfaceVariant,
  lineHeight: moderateScale(fontSizes.sm),
  marginBottom: verticalScale(spacing.xs),
});

export const bottomRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: moderateScale(spacing.xxs),
});

export const ratingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: moderateScale(spacing.xxxs),
});

export const ratingText: ThemedStyle<TextStyle> = ({ fontSizes, colors }) => ({
  fontSize: moderateScale(fontSizes.sm),
  fontWeight: '600',
  color: colors.primary,
});

export const priceText: ThemedStyle<TextStyle> = ({ fontSizes }) => ({
  fontSize: moderateScale(fontSizes.sm),
  fontWeight: '700',
  color: '#059669',
});
