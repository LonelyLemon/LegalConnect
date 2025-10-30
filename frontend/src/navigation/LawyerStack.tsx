import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();
const LawyerHome = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Lawyer Home</Text>
  </View>
);

export default function LawyerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LawyerHome" component={LawyerHome} />
      {/* Add more lawyer screens here */}
    </Stack.Navigator>
  );
}
