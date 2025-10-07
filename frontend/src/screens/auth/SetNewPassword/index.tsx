/* eslint-disable react-native/no-inline-styles */
import React from 'react';
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
import { useForm } from 'react-hook-form';
import { verticalScale } from 'react-native-size-matters';

import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles';
import ControllerForm from '../../../common/controllerForm';

type FormNewPass = { password: string; repassword: string };

export default function SetNewPasswordScreen() {
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();
  const control = useForm<FormNewPass>({
    defaultValues: { password: '', repassword: '' },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const fields = [
    {
      id: 'password',
      name: 'password',
      label: 'Password',
      type: 'input',
      placeholder: 'Enter your password',
      secureTextEntry: true,
      icon: 'lock-closed-outline',
      error: errors?.password?.message,
      rules: { required: { value: true, message: 'Password is required' } },
    },
    {
      id: 'repassword',
      name: 'repassword',
      label: 'Confirm password',
      type: 'input',
      placeholder: 'Confirm your password',
      secureTextEntry: true,
      icon: 'lock-closed-outline',
      error: errors?.repassword?.message,
      rules: {
        required: { value: true, message: 'Confirm password is required' },
        validate: (value: string) => {
          if (value !== control.getValues('password')) {
            return 'Passwords do not match';
          }
          return true;
        },
      },
    },
  ];

  const handleUpdate = (_: FormNewPass) => {
    navigation.navigate('SignIn');
  };

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
          <Text style={themed(styles.welcomeTitle)}>
            {'Set a new password'}
          </Text>

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
            onPress={handleSubmit(handleUpdate)}
            disabled={!!errors.password || !!errors.repassword}
          >
            <Text style={themed(styles.primaryButtonText)}>
              {'Update Password'}
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
