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
  userActions,
} from '../../../stores/user.slice';
import { FormSignUp } from '../../../types/auth';
import Logo from '../../../assets/imgs/Logo.png';
import * as styles from './styles';
import ControllerForm from '../../../components/common/controllerForm';
import { useAppTheme } from '../../../theme/theme.provider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { verticalScale } from 'react-native-size-matters';
import Header from '../../../components/layout/header';
import { t } from '../../../i18n';
import { AuthStackNames } from '../../../navigation/routes';

export default function SignUpScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();
  const control = useForm<FormSignUp>({
    defaultValues: {
      email: 'user1@example.com',
      password: 'string',
      repassword: 'string',
      name: 'user1',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  // Clear stale error when entering/leaving this screen
  useFocusEffect(
    React.useCallback(() => {
      dispatch(userActions.clearError());
      return () => dispatch(userActions.clearError());
    }, [dispatch]),
  );

  const fields = [
    {
      id: 'email',
      name: 'email',
      label: t('auth.signUp.email'),
      type: 'input',
      placeholder: t('auth.signUp.enterEmail'),
      icon: 'person-outline',
      error: errors?.email?.message,
      rules: {
        required: { value: true, message: t('auth.signUp.emailRequired') },
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: t('auth.signUp.emailInvalid'),
        },
      },
    },
    {
      id: 'password',
      name: 'password',
      label: t('auth.signUp.password'),
      type: 'input',
      placeholder: t('auth.signUp.enterPassword'),
      secureTextEntry: true,
      icon: 'lock-closed-outline',
      error: errors?.password?.message,
      rules: {
        required: { value: true, message: t('auth.signUp.passwordRequired') },
        minLength: {
          value: 4,
          message: t('auth.signUp.passwordMinLength', { count: 4 }),
        },
      },
    },
    {
      id: 'repassword',
      name: 'repassword',
      label: t('auth.signUp.confirmPassword'),
      type: 'input',
      placeholder: t('auth.signUp.enterPassword'),
      secureTextEntry: true,
      icon: 'lock-closed-outline',
      error: errors?.repassword?.message,
      rules: {
        required: {
          value: true,
          message: t('auth.signUp.confirmPasswordRequired'),
        },
        validate: (value: string) => {
          if (value !== control.getValues('password')) {
            return t('auth.signUp.passwordsDoNotMatch');
          }
          return true;
        },
      },
    },
    {
      id: 'name',
      name: 'name',
      label: t('auth.signUp.name'),
      type: 'input',
      placeholder: t('auth.signUp.enterName'),
      icon: 'person-outline',
      error: errors?.name?.message,
      rules: {
        required: { value: true, message: t('auth.signUp.nameRequired') },
      },
    },
  ];

  const handleSignUp = (data: FormSignUp) => {
    dispatch(userActions.clearError());
    dispatch(
      signUpWithEmailPassword({
        email: data.email,
        password: data.password,
        repassword: data.repassword,
        name: data.name,
      }),
    );
    navigation.navigate(AuthStackNames.SignIn);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleNavigateToSignIn = () => {
    navigation.navigate('SignIn');
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

          <Text style={themed(styles.welcomeTitle)}>
            {t('auth.signUp.title')}
          </Text>

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
                {t('auth.signUp.forgotPassword')}
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
            <Text style={themed(styles.signInButtonText)}>
              {t('auth.signUp.register')}
            </Text>
          </TouchableOpacity>

          <View style={themed(styles.signUpRow)}>
            <Text style={themed(styles.signUpMuted)}>
              {t('auth.signUp.alreadyHaveAccount')}
            </Text>
            <TouchableOpacity onPress={handleNavigateToSignIn}>
              <Text style={themed(styles.signUpLink)}>
                {t('auth.signUp.signIn')}
              </Text>
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
