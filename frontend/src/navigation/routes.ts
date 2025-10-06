import SignInScreen from '../screens/auth/Login';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
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
    options: { headerShown: true },
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
