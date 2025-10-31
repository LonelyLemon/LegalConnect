import { ThemedStyle } from '../../../theme';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const HeaderTitle: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.primary,
  paddingVertical: scale(spacing.sm),
  marginHorizontal: verticalScale(spacing.sm),
  borderRadius: scale(spacing.xs),
  alignItems: 'center',
  justifyContent: 'center',
});

export const avatar: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: scale(80),
  height: scale(80),
  borderRadius: scale(40),
  marginTop: verticalScale(spacing.lg),
});

export const name: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(fontSizes.xl),
  fontWeight: 'bold',
  marginTop: verticalScale(spacing.sm),
  textAlign: 'center',
});

export const tagline: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(fontSizes.sm),
  textAlign: 'center',
  marginTop: verticalScale(spacing.xs),
  opacity: 0.9,
});

export const statsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: verticalScale(spacing.sm),
  width: '100%',
});

export const statItem: ThemedStyle<ViewStyle> = () => ({
  alignItems: 'center',
});

export const statValue: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(fontSizes.md),
  fontWeight: 'bold',
});

export const statLabel: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(fontSizes.sm),
  marginTop: verticalScale(spacing.xxs),
  textAlign: 'center',
  opacity: 0.9,
});

export const buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  marginTop: verticalScale(spacing.md),
  paddingHorizontal: scale(spacing.md),
  gap: scale(spacing.sm),
  width: '100%',
});

export const primaryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.onPrimary,
  paddingVertical: verticalScale(spacing.sm),
  borderRadius: scale(spacing.sm),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: scale(spacing.xs),
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
});

export const secondaryButton: ThemedStyle<ViewStyle> = ({
  colors,
  spacing,
}) => ({
  flex: 1,
  backgroundColor: 'transparent',
  paddingVertical: verticalScale(spacing.sm),
  borderRadius: scale(spacing.sm),
  borderWidth: 2,
  borderColor: colors.onPrimary,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: scale(spacing.xs),
});

export const primaryButtonText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  color: colors.primary,
  fontSize: moderateScale(fontSizes.md),
  fontWeight: '700',
});

export const secondaryButtonText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(fontSizes.md),
  fontWeight: '700',
});

// Deprecated - keeping for backward compatibility
export const editButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.onPrimary,
  paddingHorizontal: scale(spacing.sm),
  paddingVertical: verticalScale(spacing.sm),
  borderRadius: scale(spacing.xs),
  flexDirection: 'row',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  marginTop: verticalScale(spacing.sm),
  gap: scale(spacing.xs),
});

export const editButtonText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  color: colors.primary,
  fontSize: moderateScale(fontSizes.md),
  fontWeight: '600',
});

export const editIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.primary,
  fontSize: moderateScale(16),
  marginLeft: scale(8),
});

export const tabContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: 'row',
  backgroundColor: colors.surface,
});

export const tab =
  (active: boolean): ThemedStyle<ViewStyle> =>
  ({ colors, spacing }) => ({
    flex: 1,
    paddingVertical: verticalScale(spacing.sm),
    alignItems: 'center',
    borderBottomWidth: active ? 1 : 0,
    borderBottomColor: active ? colors.primary : 'transparent',
  });

export const tabText =
  (active: boolean): ThemedStyle<TextStyle> =>
  ({ colors, fontSizes }) => ({
    fontSize: moderateScale(fontSizes.sm),
    fontWeight: active ? '600' : '400',
    color: active ? colors.primary : colors.onSurfaceVariant,
  });

export const scrollContainer: ThemedStyle<ViewStyle> = ({
  colors,
  spacing,
}) => ({
  flex: 1,
  backgroundColor: colors.surface,
  marginVertical: verticalScale(spacing.sm),
});

export const content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: scale(spacing.lg),
});

export const infoSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: verticalScale(spacing.md),
});

export const infoLabel: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  fontSize: moderateScale(fontSizes.sm),
  fontWeight: 'bold',
  color: colors.onSurface,
  marginBottom: verticalScale(4),
});

export const infoValue: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  fontSize: moderateScale(fontSizes.md),
  color: colors.onSurface,
  lineHeight: moderateScale(fontSizes.md * 1.4),
});

export const paragraphSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: verticalScale(spacing.lg),
});

export const paragraphTitle: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.md),
  fontWeight: 'bold',
  color: colors.onSurface,
  marginBottom: verticalScale(spacing.sm),
});

export const paragraphText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurface,
  lineHeight: moderateScale(fontSizes.sm * 1.5),
});

export const placeholderText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.md),
  color: colors.onSurfaceVariant,
  textAlign: 'center',
  marginTop: verticalScale(spacing.xl),
});
