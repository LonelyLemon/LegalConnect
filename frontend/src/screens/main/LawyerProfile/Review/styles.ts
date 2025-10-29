import { ViewStyle, TextStyle } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { ThemedStyle } from '../../../../theme';

export const container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
});

export const listContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: moderateScale(spacing.md),
  paddingBottom: verticalScale(spacing.lg),
});

export const loadingText: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  fontSize: moderateScale(fontSizes.md),
  color: colors.text,
  textAlign: 'center',
  marginTop: verticalScale(20),
});

export const noReviewsText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  fontSize: moderateScale(fontSizes.md),
  color: colors.text,
  textAlign: 'center',
  marginTop: verticalScale(20),
});
