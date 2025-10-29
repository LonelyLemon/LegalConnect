import { ThemedStyle } from '../../../theme';
import { TextStyle, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const header: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: scale(spacing.md),
  paddingVertical: verticalScale(spacing.lg),
  backgroundColor: colors.surface,
});

export const iconPlaceholder: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: scale(spacing.xl),
  height: scale(spacing.xl),
});

export const title: ThemedStyle<TextStyle> = ({
  fontSizes,
  colors,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.lg),
  fontWeight: 'bold',
  color: colors.onSurface,
  flex: 1,
  flexShrink: 1,
  textAlign: 'center',
  marginHorizontal: scale(spacing.xs),
});
