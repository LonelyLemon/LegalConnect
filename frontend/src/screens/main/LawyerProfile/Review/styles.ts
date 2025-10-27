import { ViewStyle } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { ThemedStyle } from '../../../../theme';

export const container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
});

export const listContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: moderateScale(spacing.md),
  paddingBottom: verticalScale(spacing.lg),
});
