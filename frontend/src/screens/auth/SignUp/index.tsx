/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import CheckBox from '@react-native-community/checkbox'; // Cần cài đặt thư viện này: yarn add @react-native-community/checkbox

import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  selectError,
  selectIsLoading,
  signUpWithEmailPassword,
} from '../../../stores/user.slices';
import { FormSignUp } from '../../../types/auth';
import Logo from '../../../assets/imgs/Logo.png';
import * as styles from './styles';
import ControllerForm from '../../../common/controllerForm';
import { useAppTheme } from '../../../theme/theme.provider';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import { verticalScale } from 'react-native-size-matters';

export default function SignUpScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();
  const control = useForm<FormSignUp>({
    defaultValues: { email: '', password: '', repassword: '', name: '' },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const fields = [
    {
      id: 'email',
      name: 'email',
      label: 'Email',
      type: 'input',
      placeholder: 'Enter you email',
      icon: 'person-outline',
      error: errors?.email?.message,
      rules: {
        required: { value: true, message: 'email is required' },
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Email is invalid',
        },
      },
    },
    {
      id: 'password',
      name: 'password',
      label: 'Password',
      type: 'input',
      placeholder: 'Enter your password',
      secureTextEntry: true,
      icon: 'lock-closed-outline',
      error: errors?.password?.message,
      rules: {
        required: { value: true, message: 'Password is required' },
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      },
    },
    {
      id: 'repassword',
      name: 'repassword',
      label: 'Confirm password',
      type: 'input',
      placeholder: 'Enter your password',
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
    {
      id: 'name',
      name: 'name',
      label: 'Name',
      type: 'input',
      placeholder: 'Enter your name',
      icon: 'person-outline',
      error: errors?.name?.message,
      rules: { required: { value: true, message: 'Name is required' } },
    },
  ];

  const handleSignUp = (data: FormSignUp) => {
    dispatch(
      signUpWithEmailPassword({
        email: data.email,
        password: data.password,
        repassword: data.repassword,
        name: data.name,
      }),
    );
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleNavigateToSignIn = () => {
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
          <View style={themed(styles.appTitleContainer)}>
            <Image
              source={Logo}
              style={themed(styles.logo)}
              resizeMode="contain"
            />
          </View>

          <Text style={themed(styles.welcomeTitle)}>{'Register'}</Text>

          <View
            style={{
              marginBottom: verticalScale(theme.spacing.lg),
              marginTop: verticalScale(theme.spacing.lg),
            }}
          >
            <ControllerForm fields={fields} control={control} />
          </View>

          <View style={themed(styles.optionsContainer)}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={themed(styles.forgotPassword)}>
                {'Forget password?'}
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={themed(styles.error)}>{error}</Text>}

          <TouchableOpacity
            style={themed(styles.signInButton)}
            onPress={handleSubmit(handleSignUp)}
            disabled={
              !!errors.email ||
              !!errors.password ||
              !!errors.repassword ||
              !!errors.name
            }
          >
            <Text style={themed(styles.signInButtonText)}>{'Register'}</Text>
          </TouchableOpacity>

          <View style={themed(styles.signUpRow)}>
            <Text style={themed(styles.signUpMuted)}>
              {'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={handleNavigateToSignIn}>
              <Text style={themed(styles.signUpLink)}>{'Sign in'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {loading && (
        <View style={themed(styles.loadingContainer)}>
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}
