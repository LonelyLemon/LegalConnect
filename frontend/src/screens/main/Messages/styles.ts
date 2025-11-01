import { ThemedStyle } from '../../../theme';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: scale(spacing.md),
  paddingBottom: verticalScale(spacing.xxxxxl),
  gap: verticalScale(spacing.sm),
});

export const card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.surface,
  borderRadius: scale(spacing.md),
  padding: scale(spacing.md),
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
});

export const avatarWrapper: ThemedStyle<ViewStyle> = () => ({
  position: 'relative',
});

export const avatar: ThemedStyle<ImageStyle> = () => ({
  width: scale(44),
  height: scale(44),
  borderRadius: scale(22),
});

export const avatarPlaceholder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: scale(44),
  height: scale(44),
  borderRadius: 100,
  backgroundColor: colors.surfaceVariant,
  alignItems: 'center',
  justifyContent: 'center',
});

export const onlineDot: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: scale(10),
  height: scale(10),
  borderRadius: scale(5),
  backgroundColor: '#27AE60',
  borderWidth: scale(2),
  borderColor: colors.surface,
});

export const content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  marginLeft: scale(spacing.md),
});

export const nameRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const name: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onSurface,
  fontSize: moderateScale(fontSizes.md),
  fontWeight: '700' as any,
});

export const timeText: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onSurfaceVariant,
  fontSize: moderateScale(fontSizes.sm),
});

export const messageRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: verticalScale(4),
});

export const lastMessage: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  flex: 1,
  color: colors.onSurfaceVariant,
  fontSize: moderateScale(fontSizes.sm),
});

export const ticks: ThemedStyle<TextStyle> = ({ colors }) => ({
  marginLeft: scale(8),
  color: colors.primary,
});

export const loadingContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.background,
});
