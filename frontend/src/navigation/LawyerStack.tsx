import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessagesScreen from '../screens/main/Messages';
import ChatDetailScreen from '../screens/main/Messages/ChatDetail';

const Stack = createNativeStackNavigator();

export default function LawyerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="LawyerHome" component={LawyerHome} /> */}
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
}
