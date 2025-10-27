import { useAppSelector } from '../redux/hook';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { AuthStackRoutes } from './routes';
import { selectIsLoggedIn } from '../stores/user.slice';
import MainStack from './MainStack';

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
  // const isLoggedIn = true;
  useEffect(() => {
    console.log('isLoggedIn: ', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: '#F5F7FA',
        contentStyle: {
          backgroundColor: '#F5F7FA',
        },
      }}
      initialRouteName={isLoggedIn ? 'Main' : 'Auth'}
    >
      {isLoggedIn ? (
        <AppStack.Screen
          name="Main"
          component={MainStack}
          options={{ headerShown: false }}
        />
      ) : (
        <AppStack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </AppStack.Navigator>
  );
}
