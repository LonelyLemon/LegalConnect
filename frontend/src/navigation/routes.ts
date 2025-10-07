import SignInScreen from '../screens/auth/SignIn';
import SignUpScreen from '../screens/auth/SignUp';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword';
import VerifyCodeScreen from '../screens/auth/VerifyCode';
import ResetSuccessScreen from '../screens/auth/ResetSuccess';
import SetNewPasswordScreen from '../screens/auth/SetNewPassword';
import HomeScreen from '../screens/main/Home';
import SettingsScreen from '../screens/main/Settings';

export type StackScreenRoute = {
  name: string;
  component: React.ComponentType<any>;
  options?: any;
};

export const AuthStackNames = {
  Welcome: 'Welcome',
  SignIn: 'SignIn',
  SignUp: 'SignUp',
  ForgotPassword: 'ForgotPassword',
  VerifyCode: 'VerifyCode',
  ResetSuccess: 'ResetSuccess',
  SetNewPassword: 'SetNewPassword',
};

export const MainStackNames = {};

export const HomeTabsNames = {
  Home: 'Home',
  Notifications: 'Notifications',
  CreateForm: 'CreateForm',
  Setting: 'Settings',
};

export const AuthStackRoutes: StackScreenRoute[] = [
  {
    name: AuthStackNames.Welcome,
    component: WelcomeScreen,
    options: { headerShown: false },
  },
  {
    name: AuthStackNames.SignIn,
    component: SignInScreen,
    options: { headerShown: false },
  },
  {
    name: AuthStackNames.SignUp,
    component: SignUpScreen,
    options: { headerShown: false },
  },
  {
    name: AuthStackNames.ForgotPassword,
    component: ForgotPasswordScreen,
    options: { headerShown: false },
  },
  {
    name: AuthStackNames.VerifyCode,
    component: VerifyCodeScreen,
    options: { headerShown: false },
  },
  {
    name: AuthStackNames.ResetSuccess,
    component: ResetSuccessScreen,
    options: { headerShown: false },
  },
  {
    name: AuthStackNames.SetNewPassword,
    component: SetNewPasswordScreen,
    options: { headerShown: false },
  },
];

export const MainStackRoutes: StackScreenRoute[] = [];

export const HomeTabsRoutes: StackScreenRoute[] = [
  {
    name: HomeTabsNames.Home,
    component: HomeScreen,
    options: { headerShown: false },
  },
  {
    name: HomeTabsNames.Setting,
    component: SettingsScreen,
    options: { headerShown: false },
  },
];
