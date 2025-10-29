import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import { moderateScale } from 'react-native-size-matters';
import * as styles from './styles';
import Ionicons from '@react-native-vector-icons/ionicons';
import RadioGroup from '../../../components/common/radio';
import Header from '../../../components/layout/header';
import { useTranslation } from 'react-i18next';

const documentData = {
  'DocType 1': [
    {
      id: '1',
      name: 'Contract Agreement',
      timeApplied: '2 hours ago',
      hasImage: false,
    },
    {
      id: '2',
      name: 'Legal Brief',
      timeApplied: '1 day ago',
      hasImage: false,
    },
    {
      id: '3',
      name: 'Court Filing',
      timeApplied: '3 days ago',
      hasImage: false,
    },
    {
      id: '4',
      name: 'Settlement Document',
      timeApplied: '1 week ago',
      hasImage: false,
    },
  ],
  'DocType 2': [
    {
      id: '5',
      name: 'Evidence Report',
      timeApplied: '4 hours ago',
      hasImage: false,
    },
    {
      id: '6',
      name: 'Witness Statement',
      timeApplied: '2 days ago',
      hasImage: false,
    },
    {
      id: '7',
      name: 'Expert Opinion',
      timeApplied: '5 days ago',
      hasImage: false,
    },
    {
      id: '8',
      name: 'Medical Records',
      timeApplied: '1 week ago',
      hasImage: false,
    },
    {
      id: '9',
      name: 'Financial Analysis',
      timeApplied: '2 weeks ago',
      hasImage: false,
    },
  ],
};


// Separator component for document list
const ItemSeparator = () => <View style={{ height: moderateScale(12) }} />;

export default function DocumentsScreen() {
  const { themed } = useAppTheme();
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const renderDocumentItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={themed(styles.documentCard)}>
      <View style={themed(styles.documentIconContainer)}>
        <Ionicons
          name="document-text-outline"
          size={moderateScale(24)}
          color={themed(({ colors }) => colors.onSurfaceVariant)}
        />
      </View>
      <View style={themed(styles.documentInfo)}>
        <Text style={themed(styles.documentName)}>{item.name}</Text>
        <Text style={themed(styles.documentTime)}>{item.timeApplied}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDocumentSection = (docType: string, documents: any[]) => (
    <View key={docType} style={themed(styles.documentSection)}>
      <Text style={themed(styles.sectionTitle)}>{docType}</Text>
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );

  const getFilteredData = () => {
    if (selectedFilter === 'All') {
      return documentData;
    }
    return {
      [selectedFilter]:
        documentData[selectedFilter as keyof typeof documentData] || [],
    };
  };

  return (
    <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <Header title={t('documents.title')} showBackButton={false} />
      <View style={themed(styles.filterContainer)}>
        <RadioGroup
          options={[
            { label: t('documents.all'), value: 'All' },
            { label: 'DocType 1', value: 'DocType 1' },
            { label: 'DocType 2', value: 'DocType 2' },
          ]}
          selected={selectedFilter}
          onChange={setSelectedFilter}
        />
      </View>

      <ScrollView
        style={themed(styles.scrollView)}
        contentContainerStyle={themed(styles.scrollContent)}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(getFilteredData()).map(([docType, documents]) =>
          renderDocumentSection(docType, documents),
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
