/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
if (__DEV__) {
  require('./ReactotronConfig');
}
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './src/redux/store';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './src/theme/theme.provider';
import AppNavigator from './src/navigation/AppNavigator';
import ToastContainer from './src/components/common/Toast';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <AppContent />
            <ToastContainer />
          </PersistGate>
        </ReduxProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
