import { useAppSelector } from '../redux/hook';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { AuthStackRoutes } from './routes';
import { selectIsLoggedIn, selectUser } from '../stores/user.slice';
import MainStack from './MainStack';
import AdminStack from './AdminStack';
import LawyerStack from './LawyerStack';

const AppStack = createNativeStackNavigator();

function AuthStack() {
  return (
    <AppStack.Navigator>
      {AuthStackRoutes.map(route => (
        <AppStack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </AppStack.Navigator>
  );
}

export default function AppNavigator() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectUser);
  useEffect(() => {
    console.log('isLoggedIn: ', isLoggedIn, 'user.role:', user?.role);
  }, [isLoggedIn, user]);

  let MainSwitch;
  if (!isLoggedIn)
    MainSwitch = (
      <AppStack.Screen
        name="Auth"
        component={AuthStack}
        options={{ headerShown: false }}
      />
    );
  else if (user?.role === 'admin')
    MainSwitch = (
      <AppStack.Screen
        name="Admin"
        component={AdminStack}
        options={{ headerShown: false }}
      />
    );
  else if (user?.role === 'lawyer')
    MainSwitch = (
      <AppStack.Screen
        name="Lawyer"
        component={LawyerStack}
        options={{ headerShown: false }}
      />
    );
  else
    MainSwitch = (
      <AppStack.Screen
        name="Main"
        component={MainStack}
        options={{ headerShown: false }}
      />
    );

  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: '#F5F7FA',
        contentStyle: {
          backgroundColor: '#F5F7FA',
        },
      }}
    >
      {MainSwitch}
    </AppStack.Navigator>
  );
}
