import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useAppTheme } from '../../../theme/theme.provider';
import { ThemedStyle } from '../../../theme';

type Option = { label: string; value: string };

export default function RadioGroup({
  options,
  selected,
  onChange,
  label,
}: {
  options: Option[];
  selected?: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const { themed } = useAppTheme();

  return (
    <View style={themed($container)}>
      {label ? <Text style={themed($label)}>{label}</Text> : null}
      <View style={themed($row)}>
        {options.map(opt => {
          const isActive = selected === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={themed($chip(isActive))}
              activeOpacity={0.8}
            >
              <Text style={themed($chipText(isActive))}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: '100%',
  gap: verticalScale(spacing.xs),
});

const $label: ThemedStyle<TextStyle> = ({ colors, fontSizes }) => ({
  color: colors.primary,
  fontSize: moderateScale(fontSizes.sm),
  fontWeight: '700' as any,
});

const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  gap: scale(spacing.sm),
});

const $chip =
  (active: boolean): ThemedStyle<ViewStyle> =>
  ({ colors, spacing }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: scale(spacing.xxxxs),
    borderColor: colors.outline,
    borderRadius: scale(spacing.sm),
    // height: spacing.xxxxxl,
    paddingHorizontal: scale(spacing.md),
    paddingVertical: verticalScale(spacing.xs),
    backgroundColor: active ? colors.primary : colors.surfaceContainer,
  });

const $chipText =
  (active: boolean): ThemedStyle<TextStyle> =>
  ({ colors, fontSizes }) => ({
    color: active ? colors.onPrimary : colors.onSurface,
    fontWeight: '600' as any,
    fontSize: moderateScale(fontSizes.sm),
  });
