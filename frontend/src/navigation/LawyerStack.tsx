import setupAxiosInterceptors from '../services/axiosConfig';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MainStackNames, MainStackRoutes } from './routes';
import { useAppSelector } from '../redux/hook';
import { selectUser } from '../stores/user.slice';

const AppStack = createNativeStackNavigator();

setupAxiosInterceptors();

export default function LawyerStack() {
  const user = useAppSelector(selectUser);
  const needsProfile = !user?.phone_number || !user?.address;
  const initial = needsProfile
    ? MainStackNames.CompleteProfile
    : MainStackNames.HomeTabs;

  return (
    <AppStack.Navigator initialRouteName={initial}>
      {MainStackRoutes.map(route => (
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

