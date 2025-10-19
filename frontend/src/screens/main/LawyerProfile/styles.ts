import { ThemedStyle } from '../../../theme';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.primary,
  paddingHorizontal: scale(spacing.lg),
  paddingVertical: verticalScale(spacing.xl),
  alignItems: 'center',
});

export const backButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: 'absolute',
  top: verticalScale(spacing.lg),
  left: scale(spacing.lg),
  zIndex: 1,
});

export const backIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(24),
  fontWeight: 'bold',
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
  fontSize: moderateScale(fontSizes.xxl),
  fontWeight: 'bold',
  marginTop: verticalScale(spacing.md),
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
  marginTop: verticalScale(spacing.lg),
  width: '100%',
});

export const statItem: ThemedStyle<ViewStyle> = () => ({
  alignItems: 'center',
});

export const statValue: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(fontSizes.lg),
  fontWeight: 'bold',
});

export const statLabel: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onPrimary,
  fontSize: moderateScale(fontSizes.xs),
  marginTop: verticalScale(4),
  textAlign: 'center',
  opacity: 0.9,
});

export const editButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.onPrimary,
  paddingHorizontal: scale(spacing.lg),
  paddingVertical: verticalScale(spacing.sm),
  borderRadius: scale(spacing.md),
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(spacing.lg),
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
  borderBottomWidth: 1,
  borderBottomColor: colors.outline,
});

export const tab =
  (active: boolean): ThemedStyle<ViewStyle> =>
  ({ colors, spacing }) => ({
    flex: 1,
    paddingVertical: verticalScale(spacing.md),
    alignItems: 'center',
    borderBottomWidth: active ? 2 : 0,
    borderBottomColor: active ? colors.primary : 'transparent',
  });

export const tabText =
  (active: boolean): ThemedStyle<TextStyle> =>
  ({ colors, fontSizes }) => ({
    fontSize: moderateScale(fontSizes.sm),
    fontWeight: active ? '600' : '400',
    color: active ? colors.primary : colors.onSurfaceVariant,
  });

export const scrollContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.surface,
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
