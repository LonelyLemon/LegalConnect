import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemedStyle } from '../../../theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';

export const cardContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.surface,
  borderRadius: moderateScale(12),
  padding: moderateScale(spacing.md),
  marginVertical: verticalScale(spacing.xs),
  marginHorizontal: moderateScale(spacing.sm),
  shadowColor: colors.shadow,
  shadowOffset: {
    width: 0,
    height: moderateScale(2),
  },
  shadowOpacity: 0.1,
  shadowRadius: moderateScale(4),
  elevation: 3,
});

export const headerSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: verticalScale(spacing.sm),
});

export const profileSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  flex: 1,
  marginRight: moderateScale(spacing.sm),
});

export const profileImage: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: moderateScale(48),
  height: moderateScale(48),
  borderRadius: moderateScale(8),
  marginRight: moderateScale(spacing.sm),
});

export const titleSection: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: 'center',
});

export const titleText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.lg),
  fontWeight: 'bold',
  color: colors.onSurface,
  marginBottom: verticalScale(spacing.xxxs),
});

export const lawyerText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurfaceVariant,
  marginBottom: verticalScale(spacing.xxxs),
});

export const activityText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurfaceVariant,
});

export const statusBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: moderateScale(spacing.sm),
  paddingVertical: verticalScale(spacing.xxxs),
  borderRadius: moderateScale(16),
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.1)',
});

export const statusText: ThemedStyle<TextStyle> = ({ fontSizes }) => ({
  fontSize: moderateScale(fontSizes.sm),
  fontWeight: '500',
});

export const currentTaskText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.md),
  color: colors.onSurface,
  marginBottom: verticalScale(spacing.sm),
  fontWeight: '500',
});

export const progressSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: verticalScale(spacing.sm),
});

export const progressBarContainer: ThemedStyle<ViewStyle> = ({
  spacing: _spacing,
}) => ({
  flexDirection: 'row',
  alignItems: 'center',
});

export const progressBarBackground: ThemedStyle<ViewStyle> = ({
  colors,
  spacing,
}) => ({
  flex: 1,
  height: moderateScale(6),
  backgroundColor: colors.surfaceVariant,
  borderRadius: moderateScale(3),
  marginRight: moderateScale(spacing.sm),
});

export const progressBarFill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: '100%',
  backgroundColor: colors.primary,
  borderRadius: moderateScale(3),
});

export const progressText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurface,
  fontWeight: '500',
  minWidth: moderateScale(32),
  textAlign: 'right',
});

export const footerSection: ThemedStyle<ViewStyle> = () => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const commentsSection: ThemedStyle<ViewStyle> = ({
  spacing: _spacing,
}) => ({
  flexDirection: 'row',
  alignItems: 'center',
});

export const commentsText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
  spacing,
}) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurface,
  marginLeft: moderateScale(spacing.xxxs),
});

export const lastUpdatedText: ThemedStyle<TextStyle> = ({
  colors,
  fontSizes,
}) => ({
  fontSize: moderateScale(fontSizes.sm),
  color: colors.onSurfaceVariant,
});

// Default export for compatibility
export default {
  cardContainer,
  headerSection,
  profileSection,
  profileImage,
  titleSection,
  titleText,
  lawyerText,
  activityText,
  statusBadge,
  statusText,
  currentTaskText,
  progressSection,
  progressBarContainer,
  progressBarBackground,
  progressBarFill,
  progressText,
  footerSection,
  commentsSection,
  commentsText,
  lastUpdatedText,
};
