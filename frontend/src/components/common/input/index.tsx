import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors } from '../../../theme';
import { fontSizes } from '../../../theme/spacing';
import { spacing } from '../../../theme/spacing';
import { useAppTheme } from '../../../theme/theme.provider';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export type InputStyleOverride = {
  container?: any;
  fieldName?: any;
  inputWrapper?: any;
  textInput?: any;
  leftIcon?: any;
  rightIcon?: any;
  errorText?: any;
};

export interface InputProps {
  label?: string;
  value: string;
  onChange: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  icon?: string;
  secureTextEntry?: boolean;
  error?: string;
  styles?: InputStyleOverride;
  [key: string]: any;
}

export default function Input({
  label,
  value,
  onChange,
  onBlur,
  placeholder = '',
  icon,
  secureTextEntry = false,
  error,
  styles: styleOverrides,
  ...props
}: InputProps) {
  const [hideText, setHideText] = useState(!!secureTextEntry);
  const { themed } = useAppTheme();
  return (
    <View
      style={[themed(localStyles.container), themed(styleOverrides?.container)]}
    >
      {label ? (
        <Text
          style={[
            themed(localStyles.fieldName),
            themed(styleOverrides?.fieldName),
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          themed(localStyles.inputWrapper),
          themed(styleOverrides?.inputWrapper),
          error ? themed(localStyles.inputWrapperError) : undefined,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon as any}
            size={20}
            color={error ? colors.error : colors.onSurface}
            style={[
              themed(localStyles.leftIcon),
              themed(styleOverrides?.leftIcon),
            ]}
          />
        ) : null}

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          secureTextEntry={hideText}
          style={[
            themed(localStyles.textInput),
            themed(styleOverrides?.textInput),
          ]}
          placeholderTextColor={colors.onSurface}
          {...props}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setHideText(prev => !prev)}
            hitSlop={10}
            style={[
              themed(localStyles.rightIcon),
              themed(styleOverrides?.rightIcon),
            ]}
          >
            <Ionicons
              name={hideText ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.onSurface}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text
          style={[
            themed(localStyles.errorText),
            themed(styleOverrides?.errorText),
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  fieldName: {
    marginBottom: scale(spacing.xs),
    color: colors.onSurface,
    fontSize: moderateScale(fontSizes.md),
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: scale(spacing.xxxxs),
    borderColor: colors.outline,
    borderRadius: scale(spacing.sm),
    backgroundColor: colors.surfaceContainer,
    // height: spacing.xxxxxl,
    paddingHorizontal: scale(spacing.md),
    paddingVertical: verticalScale(spacing.xs),
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  leftIcon: {
    marginRight: scale(spacing.sm),
  },
  rightIcon: {
    marginLeft: scale(spacing.sm),
  },
  textInput: {
    flex: 1,
    color: colors.onSurface,
    fontSize: moderateScale(fontSizes.md),
    paddingVertical: 0,
  },
  errorText: {
    marginTop: scale(spacing.xs),
    color: colors.error,
    fontSize: moderateScale(fontSizes.sm),
  },
});
