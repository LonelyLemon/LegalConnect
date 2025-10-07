/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import { verticalScale } from 'react-native-size-matters';

import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles';
import ControllerForm from '../../../common/controllerForm';

type FormForgot = { email: string };

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();
  const control = useForm<FormForgot>({ defaultValues: { email: '' } });

  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const handleReset = (_: FormForgot) => {
    navigation.navigate('VerifyCode');
  };

  const fields = [
    {
      id: 'email',
      name: 'email',
      label: 'Email',
      type: 'input',
      placeholder: 'Enter your email',
      icon: 'mail-outline',
      error: errors?.email?.message,
      rules: {
        required: { value: true, message: 'Email is required' },
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // simple email regex
          message: 'Email is invalid',
        },
      },
    },
  ];

  return (
    <SafeAreaView style={themed(styles.container)}>
      <TouchableOpacity
        style={themed(styles.backButton)}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={theme.fontSizes.xl} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={themed(styles.scrollContainer)}
        keyboardShouldPersistTaps="handled"
      >
        <View style={themed(styles.formContainer)}>
          <Text style={themed(styles.welcomeTitle)}>{'Forgot password'}</Text>

          <View
            style={{
              marginBottom: verticalScale(theme.spacing.lg),
              marginTop: verticalScale(theme.spacing.lg),
            }}
          >
            <ControllerForm fields={fields} control={control} />
          </View>

          <TouchableOpacity
            style={themed(styles.primaryButton)}
            onPress={handleSubmit(handleReset)}
            disabled={!!errors.email}
          >
            <Text style={themed(styles.primaryButtonText)}>
              {'Reset password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {false && (
        <View style={themed(styles.loadingContainer)}>
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}
