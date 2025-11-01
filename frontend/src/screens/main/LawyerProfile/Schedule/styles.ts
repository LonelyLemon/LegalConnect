import { moderateScale } from 'react-native-size-matters';
import { TextStyle, ViewStyle } from 'react-native';

export const container = (theme: any): ViewStyle => ({
  flex: 1,
  backgroundColor: theme.colors.background,
});

export const content = (theme: any): ViewStyle => ({
  flex: 1,
  paddingHorizontal: moderateScale(theme.spacing.md),
});

export const loadingContainer = (theme: any): ViewStyle => ({
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  gap: moderateScale(theme.spacing.md),
});

export const loadingText = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.md),
  color: theme.colors.onSurfaceVariant,
});

export const headerInfo = (theme: any): ViewStyle => ({
  paddingVertical: moderateScale(theme.spacing.md),
});

export const headerTitle = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.xl),
  fontWeight: 'bold' as const,
  color: theme.colors.onSurface,
  marginBottom: moderateScale(theme.spacing.xs),
});

export const headerSubtitle = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.sm),
  color: theme.colors.onSurfaceVariant,
});

export const listContainer = (theme: any): ViewStyle => ({
  paddingBottom: moderateScale(theme.spacing.xl),
});

export const scheduleCard = (theme: any): ViewStyle => ({
  backgroundColor: theme.colors.surface,
  borderRadius: moderateScale(12),
  padding: moderateScale(theme.spacing.md),
  marginBottom: moderateScale(theme.spacing.md),
  borderWidth: 1,
  borderColor: theme.colors.outline,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
});

export const scheduleHeader = (theme: any): ViewStyle => ({
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  marginBottom: moderateScale(theme.spacing.md),
});

export const dateContainer = (theme: any): ViewStyle => ({
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: moderateScale(theme.spacing.xs),
});

export const dateText = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.md),
  fontWeight: '600' as const,
  color: theme.colors.onSurface,
});

export const statusBadge = (theme: any): ViewStyle => ({
  backgroundColor: theme.colors.processStatus.approved.badgeColor,
  paddingHorizontal: moderateScale(theme.spacing.sm),
  paddingVertical: moderateScale(theme.spacing.xs),
  borderRadius: moderateScale(12),
});

export const statusText = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.xs),
  fontWeight: '600' as const,
  color: theme.colors.processStatus.approved.textColor,
});

export const timeRow = (theme: any): ViewStyle => ({
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'space-between' as const,
  marginBottom: moderateScale(theme.spacing.sm),
  paddingVertical: moderateScale(theme.spacing.xs),
});

export const timeContainer = (theme: any): ViewStyle => ({
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: moderateScale(theme.spacing.xs),
  flex: 1,
});

export const timeLabel = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.sm),
  color: theme.colors.onSurfaceVariant,
});

export const timeValue = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.sm),
  fontWeight: '600' as const,
  color: theme.colors.onSurface,
});

export const durationContainer = (theme: any): ViewStyle => ({
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: moderateScale(theme.spacing.xs),
  paddingVertical: moderateScale(theme.spacing.xs),
  marginBottom: moderateScale(theme.spacing.sm),
});

export const durationText = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.sm),
  color: theme.colors.onSurfaceVariant,
});

export const selectButton = (theme: any): ViewStyle => ({
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'space-between' as const,
  backgroundColor: theme.colors.primaryContainer,
  paddingVertical: moderateScale(theme.spacing.sm),
  paddingHorizontal: moderateScale(theme.spacing.md),
  borderRadius: moderateScale(8),
  marginTop: moderateScale(theme.spacing.xs),
});

export const selectButtonText = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.md),
  fontWeight: '600' as const,
  color: theme.colors.primary,
});

export const emptyContainer = (theme: any): ViewStyle => ({
  flex: 1,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  paddingHorizontal: moderateScale(theme.spacing.xl),
  paddingVertical: moderateScale(theme.spacing.xxl),
});

export const emptyTitle = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.xl),
  fontWeight: 'bold' as const,
  color: theme.colors.onSurface,
  marginTop: moderateScale(theme.spacing.md),
  marginBottom: moderateScale(theme.spacing.sm),
});

export const emptyMessage = (theme: any): TextStyle => ({
  fontSize: moderateScale(theme.fontSizes.md),
  color: theme.colors.onSurfaceVariant,
  textAlign: 'center' as const,
  lineHeight: moderateScale(22),
});
