import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import Header from '../../../components/layout/header';
import { useAppDispatch } from '../../../redux/hook';
import * as styles from './styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackNames } from '../../../navigation/routes';
type TabType = 'pending' | 'processing' | 'completed';

export default function CasesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const { themed, theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const tabs = useMemo(
    () => [
      { key: 'pending', label: 'Pending' },
      { key: 'processing', label: 'Processing' },
      { key: 'completed', label: 'Completed' },
    ],
    [],
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pending':
        return (
          <View style={themed(styles.content)}>
            <Text style={themed(styles.placeholderText)}>
              Pending cases will be displayed here
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(MainStackNames.CaseDetail)}
            >
              <Text>Case Detail</Text>
            </TouchableOpacity>
          </View>
        );
      case 'processing':
        return (
          <View style={themed(styles.content)}>
            <Text style={themed(styles.placeholderText)}>
              Processing cases will be displayed here
            </Text>
          </View>
        );
      case 'completed':
        return (
          <View style={themed(styles.content)}>
            <Text style={themed(styles.placeholderText)}>
              Completed cases will be displayed here
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={themed(() => ({ flex: 1 }))}>
      <Header title="Cases" showBackButton={false} />
      <View style={themed(styles.tabContainer)}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={themed(styles.tab(activeTab === tab.key))}
            onPress={() => setActiveTab(tab.key as TabType)}
          >
            <Text style={themed(styles.tabText(activeTab === tab.key))}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        style={themed(styles.scrollContainer)}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
