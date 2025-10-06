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
  signInWithUsernamePassword,
} from '../../../stores/user.slices';
import { FormLogin } from '../../../types/auth';
import Logo from '../../../assets/imgs/Logo.png';
import * as styles from './styles';
import ControllerForm from '../../../common/controllerForm';
import { useAppTheme } from '../../../theme/theme.provider';

export default function SignInScreen() {
  const dispatch = useAppDispatch();
  // const [rememberMe, setRememberMe] = useState<boolean>(false);
  //   const navigation = useNavigation<any>();
  const { themed } = useAppTheme();
  const control = useForm<FormLogin>({
    defaultValues: { username: '', password: '' },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const loading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const fields = [
    {
      id: 'username',
      name: 'username',
      label: 'Username',
      type: 'input',
      placeholder: 'Enter you username',
      icon: 'person-outline',
      error: errors?.username?.message,
      rules: {
        required: { value: true, message: 'Username is required' },
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
      signInWithUsernamePassword({
        username: data.username,
        password: data.password,
        captchaValue: 'test',
      }),
    );
  };

  const handleForgotPassword = () => {
    //     navigation.navigate('ForgotPassword');
  };

  const handleNavigateToSignUp = () => {
    //     navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <ScrollView
        contentContainerStyle={themed(styles.scrollContainer)}
        keyboardShouldPersistTaps="handled"
      >
        <View style={themed(styles.formContainer)}>
          {/* Logo có thể ẩn nếu không muốn giống ảnh */}
          <View style={themed(styles.appTitleContainer)}>
            <Image
              source={Logo}
              style={themed(styles.logo)}
              resizeMode="contain"
            />
          </View>

          {/* Tiêu đề như ảnh */}
          <Text style={themed(styles.welcomeTitle)}>{'Welcome back'}</Text>

          <View style={{ marginBottom: 16 }}>
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
            disabled={!!errors.username || !!errors.password}
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
