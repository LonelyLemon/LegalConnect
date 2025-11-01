import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import Header from '../../../components/layout/header';
import * as styles from './styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackNames } from '../../../navigation/routes';
import { Case, CaseStatus } from '../../../types/case';
// import { verticalScale } from 'react-native-size-matters';
import CaseCard from '../../../components/common/caseCard';
import { useTranslation } from 'react-i18next';

type TabType = 'in_progress' | 'completed' | 'cancelled';

type MockCase = {
  id: string;
  title: string;
  lawyerName: string;
  lawyerImage: string;
  lastActivity: string;
  currentTask: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  progress: number;
  commentsCount: number;
  lastUpdated: string;
  tab: TabType;
  onPress?: () => void;
};

export default function CasesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('in_progress');
  const { themed } = useAppTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const { t } = useTranslation();
  const tabs = useMemo(
    () => [
      { key: 'in_progress', label: t('cases.inProgress') },
      { key: 'completed', label: t('cases.completed') },
      { key: 'cancelled', label: t('cases.cancelled') },
    ],
    [t],
  );

  // Mock data for cases
  const mockCases: MockCase[] = useMemo(
    () => [
      // In Progress cases
      {
        id: '1',
        title: 'Property Dispute Case',
        lawyerName: 'John Smith',
        lawyerImage: 'https://i.pravatar.cc/150?img=1',
        lastActivity: 'Real Estate Law',
        currentTask: 'Documentation review in progress',
        status: 'IN_PROGRESS',
        progress: 10,
        commentsCount: 2,
        lastUpdated: '2 hours ago',
        tab: 'in_progress',
      },
      {
        id: '2',
        title: 'Employment Contract Review',
        lawyerName: 'Emma Johnson',
        lawyerImage: 'https://i.pravatar.cc/150?img=2',
        lastActivity: 'Corporate Law',
        currentTask: 'Awaiting contract draft',
        status: 'IN_PROGRESS',
        progress: 5,
        commentsCount: 0,
        lastUpdated: '1 day ago',
        tab: 'in_progress',
      },
      {
        id: '3',
        title: 'Divorce Proceedings',
        lawyerName: 'Michael Brown',
        lawyerImage: 'https://i.pravatar.cc/150?img=3',
        lastActivity: 'Family Law',
        currentTask: 'Initial consultation scheduled',
        status: 'IN_PROGRESS',
        progress: 0,
        commentsCount: 1,
        lastUpdated: '3 days ago',
        tab: 'in_progress',
      },
      {
        id: '4',
        title: 'Patent Application',
        lawyerName: 'Sarah Williams',
        lawyerImage: 'https://i.pravatar.cc/150?img=4',
        lastActivity: 'Intellectual Property',
        currentTask: 'Finalizing patent claims',
        status: 'IN_PROGRESS',
        progress: 65,
        commentsCount: 5,
        lastUpdated: '1 hour ago',
        tab: 'in_progress',
      },
      {
        id: '5',
        title: 'Merger & Acquisition',
        lawyerName: 'David Lee',
        lawyerImage: 'https://i.pravatar.cc/150?img=5',
        lastActivity: 'Corporate Law',
        currentTask: 'Due diligence in progress',
        status: 'IN_PROGRESS',
        progress: 80,
        commentsCount: 12,
        lastUpdated: '5 hours ago',
        tab: 'in_progress',
      },
      {
        id: '6',
        title: 'Personal Injury Claim',
        lawyerName: 'Lisa Anderson',
        lawyerImage: 'https://i.pravatar.cc/150?img=6',
        lastActivity: 'Civil Law',
        currentTask: 'Gathering medical evidence',
        status: 'IN_PROGRESS',
        progress: 45,
        commentsCount: 8,
        lastUpdated: '2 hours ago',
        tab: 'in_progress',
      },
      // Completed cases
      {
        id: '7',
        title: 'Contract Negotiation',
        lawyerName: 'Robert Taylor',
        lawyerImage: 'https://i.pravatar.cc/150?img=7',
        lastActivity: 'Corporate Law',
        currentTask: 'Contract finalized and signed',
        status: 'COMPLETED',
        progress: 100,
        commentsCount: 20,
        lastUpdated: '1 week ago',
        tab: 'completed',
      },
      {
        id: '8',
        title: 'Trademark Registration',
        lawyerName: 'Jennifer Martinez',
        lawyerImage: 'https://i.pravatar.cc/150?img=8',
        lastActivity: 'Intellectual Property',
        currentTask: 'Trademark approved and registered',
        status: 'COMPLETED',
        progress: 100,
        commentsCount: 15,
        lastUpdated: '2 weeks ago',
        tab: 'completed',
      },
      {
        id: '9',
        title: 'Will and Estate Planning',
        lawyerName: 'Thomas Wilson',
        lawyerImage: 'https://i.pravatar.cc/150?img=9',
        lastActivity: 'Estate Law',
        currentTask: 'Documents notarized and filed',
        status: 'COMPLETED',
        progress: 100,
        commentsCount: 6,
        lastUpdated: '1 month ago',
        tab: 'completed',
      },
      // Cancelled cases
      {
        id: '10',
        title: 'Business Partnership Dispute',
        lawyerName: 'James Wilson',
        lawyerImage: 'https://i.pravatar.cc/150?img=10',
        lastActivity: 'Corporate Law',
        currentTask: 'Client withdrew case',
        status: 'CANCELLED',
        progress: 30,
        commentsCount: 4,
        lastUpdated: '2 weeks ago',
        tab: 'cancelled',
      },
      {
        id: '11',
        title: 'Immigration Case',
        lawyerName: 'Maria Garcia',
        lawyerImage: 'https://i.pravatar.cc/150?img=11',
        lastActivity: 'Immigration Law',
        currentTask: 'Case cancelled by client',
        status: 'CANCELLED',
        progress: 15,
        commentsCount: 2,
        lastUpdated: '1 month ago',
        tab: 'cancelled',
      },
    ],
    [navigation],
  );

  // Filter cases based on active tab
  const filteredCases = mockCases.filter(
    caseItem => caseItem.tab === activeTab,
  );

  const renderCaseCard = ({ item }: { item: MockCase }) => {
    const caseData: Case = {
      id: item.id,
      booking_request_id: item.id,
      lawyer_id: 'n/a',
      client_id: 'n/a',
      title: item.title,
      description: item.currentTask || item.lastActivity,
      state: item.status,
      attachment_urls: [],
      lawyer_note:
        'Working on gathering evidence and preparing documents for the case.',
      client_note: 'Please keep me updated on the progress.',
      started_at: new Date().toISOString(),
      ending_time: new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 60 days from now
      create_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

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
            onPress={() => setActiveTab(tab.key as TabType)}
          >
            <Text style={themed(styles.tabText(activeTab === tab.key))}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredCases}
        renderItem={renderCaseCard}
        keyExtractor={item => item.id}
        contentContainerStyle={themed(styles.listContainer)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}
