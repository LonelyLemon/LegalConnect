import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LawyerCard from '../../../components/common/lawyerCard';
import { useAppTheme } from '../../../theme/theme.provider';
import RadioGroup from '../../../components/common/radio';
import { moderateScale } from 'react-native-size-matters';
import * as styles from './styles';
import CaseCard from '../../../components/common/caseCard';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import {
  fetchPopularDocuments,
  selectDocuments,
} from '../../../stores/document.slice';
import DocumentCard from '../../../components/common/documentCard';
import {
  fetchPopularLawyers,
  selectLawyers,
} from '../../../stores/lawyer.slices';
import { Lawyer } from '../../../types/lawyer';
import { MainStackNames } from '../../../navigation/routes';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Input from '../../../components/common/input';
import Icon from '@react-native-vector-icons/ionicons';

// Separator component for horizontal list
const ItemSeparator = () => <View style={{ width: moderateScale(12) }} />;

const caseData = [
  {
    id: '1',
    title: 'Divorce Settlement Case',
    lawyerName: 'Sarah Johnson',
    lawyerImage:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop',
    lastActivity: 'Document Review',
    currentTask: 'Preparing settlement documents',
    status: 'Processing' as const,
    progress: 65,
    commentsCount: 8,
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    title: 'Personal Injury Claim',
    lawyerName: 'Michael Chen',
    lawyerImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    lastActivity: 'Court Filing',
    currentTask: 'Filing motion for summary judgment',
    status: 'Pending' as const,
    progress: 30,
    commentsCount: 12,
    lastUpdated: '1 day ago',
  },
  {
    id: '3',
    title: 'Business Contract Dispute',
    lawyerName: 'Emily Rodriguez',
    lawyerImage:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
    lastActivity: 'Client Meeting',
    currentTask: 'Reviewing contract terms',
    status: 'New' as const,
    progress: 15,
    commentsCount: 3,
    lastUpdated: '3 days ago',
  },
  {
    id: '4',
    title: 'Criminal Defense Case',
    lawyerName: 'Headshot Stock',
    lawyerImage:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
    lastActivity: 'Evidence Collection',
    currentTask: 'Gathering witness statements',
    status: 'Completed' as const,
    progress: 100,
    commentsCount: 25,
    lastUpdated: '1 week ago',
  },
  {
    id: '5',
    title: 'Estate Planning Consultation',
    lawyerName: 'Sarah Johnson',
    lawyerImage:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop',
    lastActivity: 'Document Drafting',
    currentTask: 'Creating will and trust documents',
    status: 'Processing' as const,
    progress: 45,
    commentsCount: 6,
    lastUpdated: '4 hours ago',
  },
  {
    id: '6',
    title: 'Employment Law Dispute',
    lawyerName: 'Michael Chen',
    lawyerImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    lastActivity: 'Research',
    currentTask: 'Analyzing labor law precedents',
    status: 'Pending' as const,
    progress: 20,
    commentsCount: 9,
    lastUpdated: '2 days ago',
  },
];

export default function HomeScreen() {
  const { themed, theme } = useAppTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();
  const documentsData = useAppSelector(selectDocuments);
  const lawyersData = useAppSelector(selectLawyers);

  useEffect(() => {
    dispatch(fetchPopularDocuments());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchPopularLawyers());
  }, [dispatch]);

  const refetchData = () => {
    dispatch(fetchPopularDocuments());
    dispatch(fetchPopularLawyers());
  };

  const handleProfilePress = () => {
    navigation.navigate(MainStackNames.Setting);
  };

  const renderDocumentCard = ({ item }: { item: any }) => (
    <DocumentCard title={item.title || 'Title'} previewUrl={item.url} />
  );

  const renderCaseCard = ({ item }: { item: any }) => (
    <CaseCard
      id={item.id}
      title={item.title}
      lawyerName={item.lawyerName}
      lawyerImage={item.lawyerImage}
      lastActivity={item.lastActivity}
      currentTask={item.currentTask}
      status={item.status}
      progress={item.progress}
      commentsCount={item.commentsCount}
      lastUpdated={item.lastUpdated}
      onPress={() => {
        console.log('Pressed case:', item.title);
      }}
    />
  );

  const renderLawyerCard = ({ item }: { item: Lawyer }) => (
    <LawyerCard
      id={item.id}
      name={item.name}
      description={item.bio}
      rating={item.rating_avg}
      price={item.price_per_session_cents}
      imageUri={item.imageUri}
      onPress={() => {
        navigation.navigate(MainStackNames.LawyerProfile, { id: item.id });
      }}
    />
  );

  return (
    <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
      <ScrollView
        style={themed(styles.scrollView)}
        contentContainerStyle={themed(styles.scrollContent)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetchData} />
        }
      >
        {/* Header với search và profile icon */}
        <View style={themed(styles.headerContainer)}>
          <View style={themed(styles.searchContainer)}>
            <Input
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search"
              icon="search"
              styles={{
                container: themed(styles.searchInputContainer),
                inputWrapper: themed(styles.searchInputWrapper),
              }}
            />
          </View>
          <TouchableOpacity
            onPress={handleProfilePress}
            style={themed(styles.profileButton)}
          >
            <Icon
              name="person"
              size={moderateScale(24)}
              color={theme.colors.surface}
            />
          </TouchableOpacity>
        </View>
        <View style={themed(styles.listContainer)}>
          <View style={themed(styles.sectionHeader)}>
            <Text style={themed(styles.sectionTitle)}>Luật sư nổi bật</Text>
            <Text style={themed(styles.viewMoreText)}>Xem thêm {'>'}</Text>
          </View>

          <View style={themed(styles.filterContainer)}>
            <RadioGroup
              options={[
                { label: 'Tất cả', value: 'all' },
                { label: 'Luật sư nổi bật', value: 'featured' },
                { label: 'Luật sư mới nhất', value: 'new' },
              ]}
              selected={selectedFilter}
              onChange={setSelectedFilter}
            />
          </View>

          <FlatList
            data={lawyersData}
            renderItem={renderLawyerCard}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={themed(styles.horizontalListContent)}
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
        <View style={themed(styles.listContainer)}>
          <View style={themed(styles.sectionHeader)}>
            <Text style={themed(styles.sectionTitle)}>Tiến độ vụ án</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(MainStackNames.Cases);
              }}
            >
              <Text style={themed(styles.viewMoreText)}>Xem thêm {'>'}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={caseData}
            renderItem={renderCaseCard}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={themed(styles.horizontalListContent)}
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
        <View style={themed(styles.listContainer)}>
          <View style={themed(styles.sectionHeader)}>
            <Text style={themed(styles.sectionTitle)}>Tài liệu nổi bật</Text>
            <Text style={themed(styles.viewMoreText)}>Xem thêm {'>'}</Text>
          </View>
          <FlatList
            data={documentsData}
            renderItem={renderDocumentCard}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={themed(styles.horizontalListContent)}
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
