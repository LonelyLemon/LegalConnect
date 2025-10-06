import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

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

  return (
    <View style={[localStyles.container, styleOverrides?.container]}>
      {label ? (
        <Text style={[localStyles.fieldName, styleOverrides?.fieldName]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          localStyles.inputWrapper,
          styleOverrides?.inputWrapper,
          error ? localStyles.inputWrapperError : undefined,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon as any}
            size={20}
            color={error ? '#B00020' : '#9AA0A6'}
            style={[localStyles.leftIcon, styleOverrides?.leftIcon]}
          />
        ) : null}

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          secureTextEntry={hideText}
          style={[localStyles.textInput, styleOverrides?.textInput]}
          placeholderTextColor="#9AA0A6"
          {...props}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setHideText(prev => !prev)}
            hitSlop={10}
            style={[localStyles.rightIcon, styleOverrides?.rightIcon]}
          >
            <Ionicons
              name={hideText ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9AA0A6"
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={[localStyles.errorText, styleOverrides?.errorText]}>
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
    marginBottom: 6,
    color: '#202124',
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E3E7',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    height: 44,
  },
  inputWrapperError: {
    borderColor: '#B00020',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  textInput: {
    flex: 1,
    color: '#202124',
    fontSize: 16,
    paddingVertical: 0,
  },
  errorText: {
    marginTop: 6,
    color: '#B00020',
    fontSize: 12,
  },
});
