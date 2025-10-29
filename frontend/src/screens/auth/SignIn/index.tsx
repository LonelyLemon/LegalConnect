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
} from '../../../stores/user.slice';
import { FormLogin } from '../../../types/auth';
import Logo from '../../../assets/imgs/Logo.png';
import { showError } from '../../../types/toast';
import * as styles from './styles';
import ControllerForm from '../../../components/common/controllerForm';
import { useAppTheme } from '../../../theme/theme.provider';
import { useNavigation } from '@react-navigation/native';
import { verticalScale } from 'react-native-size-matters';
import { t } from '../../../i18n';

export default function SignInScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();
  const control = useForm<FormLogin>({
    defaultValues: { email: 'user1@example.com', password: 'string' },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const onError = () => {
    showError(t('auth.signIn.loginFailed'));
  };
  const fields = [
    {
      id: 'email',
      name: 'email',
      label: t('auth.signIn.email'),
      type: 'input',
      placeholder: t('auth.signIn.enterEmail'),
      icon: 'person-outline',
      error: errors?.email?.message,
      rules: {
        required: { value: true, message: t('auth.signIn.emailRequired') },
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: t('auth.signIn.emailInvalid'),
        },
      },
    },
    {
      id: 'password',
      name: 'password',
      label: t('auth.signIn.password'),
      type: 'input',
      placeholder: t('auth.signIn.enterPassword'),
      secureTextEntry: true,
      icon: 'lock-closed-outline',
      error: errors?.password?.message,
      rules: {
        required: { value: true, message: t('auth.signIn.passwordRequired') },
        minLength: {
          value: 4,
          message: t('auth.signIn.passwordMinLength', { count: 4 }),
        },
      },
    },
  ];

  const handleSignIn = (data: FormLogin) => {
    dispatch(
      signInWithEmailPassword({
        email: data.email,
        password: data.password,
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
          <Text style={themed(styles.welcomeTitle)}>{t('auth.signIn.title')}</Text>

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
                {t('auth.signIn.forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={themed(styles.error)}>{error}</Text>}

          {/* Nút đăng nhập full-width */}
          <TouchableOpacity
            style={themed(styles.signInButton)}
            onPress={handleSubmit(handleSignIn, onError)}
            disabled={!!errors.email || !!errors.password}
          >
            <Text style={themed(styles.signInButtonText)}>{t('auth.signIn.logIn')}</Text>
          </TouchableOpacity>

          {/* Hàng Sign up giống ảnh */}
          <View style={themed(styles.signUpRow)}>
            <Text style={themed(styles.signUpMuted)}>
              {t('auth.signIn.dontHaveAccount')}
            </Text>
            <TouchableOpacity onPress={handleNavigateToSignUp}>
              <Text style={themed(styles.signUpLink)}>{t('auth.signIn.signUp')}</Text>
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
