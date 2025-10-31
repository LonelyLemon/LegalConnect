import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboard';
import SettingScreen from '../screens/main/Setting';
import DocumentListScreen from '../screens/admin/AdminDashboard/DocumentListScreen';
import PdfViewerScreen from '../components/common/PdfViewer';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminDashboardScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="DocumentList" component={DocumentListScreen} />
      <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
    </Stack.Navigator>
  );
}
