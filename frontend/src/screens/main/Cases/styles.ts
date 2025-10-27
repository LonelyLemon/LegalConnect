import { ThemedStyle } from '../../../theme';
import { TextStyle, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
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
