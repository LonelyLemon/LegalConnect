import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';

export default function DocumentsScreen() {
  const { themed } = useAppTheme();
  return (
    <SafeAreaView style={themed(() => ({ flex: 1 }))}>
      <View
        style={themed(() => ({
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }))}
      >
        <Text>Documents</Text>
      </View>
    </SafeAreaView>
  );
}
