import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import Header from '../../../components/layout/header';
import * as styles from './styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackNames } from '../../../navigation/routes';
import { Case, BookingRequest } from '../../../types/case';
// import { verticalScale } from 'react-native-size-matters';
import CaseCard from '../../../components/common/caseCard';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  fetchPendingCase,
  fetchUserCases,
  selectCases,
  selectPendingCases,
} from '../../../stores/case.slice';

type TabType = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type DisplayItem = Case | BookingRequest;

export default function CasesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('PENDING');
  const { themed } = useAppTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const pendingCases = useAppSelector(selectPendingCases);
  const cases = useAppSelector(selectCases);

  const tabs = useMemo(
    () => [
      { key: 'PENDING' as TabType, label: t('case.pending') },
      { key: 'IN_PROGRESS' as TabType, label: t('cases.inProgress') },
      { key: 'COMPLETED' as TabType, label: t('cases.completed') },
      { key: 'CANCELLED' as TabType, label: t('cases.cancelled') },
    ],
    [t],
  );

  // Get data based on active tab
  const displayData = useMemo(() => {
    if (activeTab === 'PENDING') {
      return pendingCases;
    }
    return cases.filter(caseItem => caseItem.state === activeTab);
  }, [activeTab, pendingCases, cases]);

  useEffect(() => {
    dispatch(fetchPendingCase());
    dispatch(fetchUserCases());
  }, [dispatch]);

  // Helper function to check if item is BookingRequest
  const isBookingRequest = (item: DisplayItem): item is BookingRequest => {
    return 'short_description' in item && 'status' in item;
  };

  const renderCaseCard = ({ item }: { item: DisplayItem }) => {
    // Convert BookingRequest to Case format for display
    const caseData: Case = isBookingRequest(item)
      ? {
          id: item.id,
          booking_request_id: item.id,
          lawyer_id: item.lawyer_id,
          client_id: item.client_id,
          title: item.title,
          description: item.short_description,
          state: 'IN_PROGRESS', // Use IN_PROGRESS for pending bookings to show yellow badge
          attachment_urls: [],
          lawyer_note: '',
          client_note: `Status: ${item.status}`,
          started_at: item.desired_start_time,
          ending_time: item.desired_end_time,
          create_at: item.create_at,
          updated_at: item.updated_at,
        }
      : item;

    return (
      <CaseCard
        caseData={caseData}
        onPress={() =>
          navigation.navigate(MainStackNames.CaseDetail, { caseData })
        }
        stylesOverride={{
          cardContainer: () => ({
            width: '100%',
            marginHorizontal: 0,
          }),
        }}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={themed(styles.content)}>
      <Text style={themed(styles.placeholderText)}>
        {t('cases.noCasesFound', { status: t(`cases.${activeTab}`) })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header title={t('cases.title')} showBackButton={false} />
      <View style={themed(styles.tabContainer)}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={themed(styles.tab(activeTab === tab.key))}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={themed(styles.tabText(activeTab === tab.key))}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={displayData}
        renderItem={renderCaseCard}
        keyExtractor={item => item.id}
        contentContainerStyle={themed(styles.listContainer)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}
