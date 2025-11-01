import { TextStyle, ViewStyle } from 'react-native';
import { ThemedStyle } from '../../../theme';
import { moderateScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const pdfContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const pdfStyle: ThemedStyle<TextStyle> = ({}) => ({
  flex: 1,
  width: '100%',
});

export const loadingOverlay: ThemedStyle<ViewStyle> = ({}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.05)',
});

export const pdfText: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onSurfaceVariant,
  fontSize: moderateScale(fontSizes.md),
  textAlign: 'center',
});
