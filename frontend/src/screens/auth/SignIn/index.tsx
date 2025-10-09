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
  signInWithEmailPassword,
} from '../../../stores/user.slices';
import { FormLogin } from '../../../types/auth';
import Logo from '../../../assets/imgs/Logo.png';
import * as styles from './styles';
import ControllerForm from '../../../components/common/controllerForm';
import { useAppTheme } from '../../../theme/theme.provider';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import { verticalScale } from 'react-native-size-matters';
import Header from '../../../components/layout/header';

export default function SignInScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();
  const control = useForm<FormLogin>({
    defaultValues: { email: '', password: '' },
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
        required: { value: true, message: 'Email is required' },
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
  ];

  const handleSignIn = (data: FormLogin) => {
    dispatch(
      signInWithEmailPassword({
        email: data.email,
        password: data.password,
        captchaValue: 'test',
      }),
    );
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleNavigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header navigation="Welcome" />
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

          {/* Tiêu đề như ảnh */}
          <Text style={themed(styles.welcomeTitle)}>{'Welcome back'}</Text>

          <View
            style={{
              marginBottom: verticalScale(theme.spacing.lg),
              marginTop: verticalScale(theme.spacing.lg),
            }}
          >
            <ControllerForm fields={fields} control={control} />
          </View>

          {/* Forgot password? căn phải */}
          <View style={themed(styles.optionsContainer)}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={themed(styles.forgotPassword)}>
                {'Forgot password?'}
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={themed(styles.error)}>{error}</Text>}

          {/* Nút đăng nhập full-width */}
          <TouchableOpacity
            style={themed(styles.signInButton)}
            onPress={handleSubmit(handleSignIn)}
            disabled={!!errors.email || !!errors.password}
          >
            <Text style={themed(styles.signInButtonText)}>{'Log in'}</Text>
          </TouchableOpacity>

          {/* Hàng Sign up giống ảnh */}
          <View style={themed(styles.signUpRow)}>
            <Text style={themed(styles.signUpMuted)}>
              {'Don’t have an Account? '}
            </Text>
            <TouchableOpacity onPress={handleNavigateToSignUp}>
              <Text style={themed(styles.signUpLink)}>{'Sign up'}</Text>
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
