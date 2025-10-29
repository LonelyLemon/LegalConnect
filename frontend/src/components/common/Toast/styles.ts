import {ThemedStyle} from 'na-components';
import {TextStyle, ViewStyle} from 'react-native';

export const textStyles: ThemedStyle<TextStyle> = ({colors}) => ({
  color: colors.onSurface,
});

export const containerStyle: ThemedStyle<ViewStyle> = ({colors, spacing}) => ({
  backgroundColor: colors.surfaceContainerHighest,
});
