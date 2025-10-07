import { ThemedStyle } from '../../../theme';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

export const container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

export const scrollContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 1,
  justifyContent: 'center',
  paddingHorizontal: scale(spacing.md),
  paddingTop: verticalScale(spacing.lg),
  paddingBottom: verticalScale(spacing.xl),
});

export const formContainer: ThemedStyle<ViewStyle> = () => ({});

export const welcomeTitle: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.xl), // cỡ ~20–22
  fontWeight: '800',
  color: colors.onBackground,
  textAlign: 'center',
  marginBottom: verticalScale(spacing.md),
});

export const appTitleContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: 'center',
});
export const logo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: scale(spacing.xxxxxxxxxxxl * 2),
  height: verticalScale(spacing.xxxxxxxxxxxl),
  alignSelf: 'center',
});

export const optionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: verticalScale(spacing.xxs),
  marginBottom: verticalScale(spacing.xs),
});

export const forgotPassword: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  color: colors.primary,
  fontWeight: '700',
  fontSize: moderateScale(fontSizes.sm),
  textDecorationLine: 'none',
});

export const error: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  color: colors.error,
  textAlign: 'center',
  fontSize: moderateScale(fontSizes.md),
  fontWeight: 'bold',
  marginTop: verticalScale(spacing.xxs),
});

export const signInButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: '100%',
  height: verticalScale(spacing.xxxxl),
  backgroundColor: colors.primary, // xanh đậm như ảnh
  borderRadius: scale(spacing.sm),
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: verticalScale(spacing.md),
});

export const signInButtonText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  color: colors.onPrimary,
  fontWeight: '700',
  fontSize: moderateScale(fontSizes.md),
});

export const signUpRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: verticalScale(spacing.md),
});

export const signUpMuted: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.onSurfaceVariant, // xám mờ như ảnh
  fontSize: moderateScale(fontSizes.sm),
});

export const signUpLink: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.primary, // màu link
  fontWeight: '700',
  fontSize: moderateScale(fontSizes.sm),
  textDecorationLine: 'underline',
});

export const loadingContainer: ThemedStyle<ViewStyle> = () => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
});

export const backButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: 'absolute',
  top: verticalScale(spacing.xl),
  left: scale(spacing.sm),
  paddingVertical: verticalScale(spacing.xxs),
  paddingHorizontal: scale(spacing.xs),
  zIndex: 10,
});
