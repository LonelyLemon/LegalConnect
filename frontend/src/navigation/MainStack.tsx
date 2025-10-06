import setupAxiosInterceptors from '../services/axiosConfig';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { MainStackRoutes } from './routes';

const AppStack = createNativeStackNavigator();

setupAxiosInterceptors();

export default function MainStack() {
  return (
    <AppStack.Navigator>
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
