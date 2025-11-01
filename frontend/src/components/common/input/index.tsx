import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
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
  const { themed, theme } = useAppTheme();
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
            color={error ? theme.colors.error : theme.colors.onSurface}
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
          placeholderTextColor={theme.colors.onSurfaceVariant}
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
              color={theme.colors.onSurface}
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

const localStyles = {
  container: (_theme: any) => ({
    width: '100%',
  }),
  fieldName: (theme: any) => ({
    marginBottom: scale(theme.spacing.xs),
    color: theme.colors.onSurface,
    fontSize: moderateScale(theme.fontSizes.md),
    fontWeight: '600' as const,
  }),
  inputWrapper: (theme: any) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: scale(theme.spacing.xxxxs),
    borderColor: theme.colors.outline,
    borderRadius: scale(theme.spacing.sm),
    backgroundColor: theme.colors.surfaceContainer,
    paddingHorizontal: scale(theme.spacing.md),
    paddingVertical: verticalScale(theme.spacing.xs),
  }),
  inputWrapperError: (theme: any) => ({
    borderColor: theme.colors.error,
  }),
  leftIcon: (theme: any) => ({
    marginRight: scale(theme.spacing.sm),
  }),
  rightIcon: (theme: any) => ({
    marginLeft: scale(theme.spacing.sm),
  }),
  textInput: (theme: any) => ({
    flex: 1,
    color: theme.colors.onSurface,
    fontSize: moderateScale(theme.fontSizes.md),
    paddingVertical: 0,
  }),
  errorText: (theme: any) => ({
    marginTop: scale(theme.spacing.xs),
    color: theme.colors.error,
    fontSize: moderateScale(theme.fontSizes.sm),
  }),
};
