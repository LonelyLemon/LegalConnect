import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LawyerCard from '../../../components/common/lawyerCard';
import { useAppTheme } from '../../../theme/theme.provider';
import RadioGroup from '../../../components/common/radio';
import { moderateScale } from 'react-native-size-matters';
import * as styles from './styles';
import CaseCard from '../../../components/common/caseCard';

// Separator component for horizontal list
const ItemSeparator = () => <View style={{ width: moderateScale(12) }} />;
const lawyersData = [
  {
    id: '1',
    name: 'Headshot Stock',
    description:
      'Experienced lawyer with 9 years of litigation practice specializing in corporate law and contract disputes.',
    rating: 4.8,
    price: 200,
    imageUri:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    description:
      'Criminal defense attorney with 12 years of experience in high-profile cases and trial advocacy.',
    rating: 4.9,
    price: 350,
    imageUri:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Michael Chen',
    description:
      'Family law specialist helping clients with divorce, custody, and estate planning matters.',
    rating: 4.7,
    price: 180,
    imageUri:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    description:
      'Personal injury lawyer with a track record of successful settlements and courtroom victories.',
    rating: 4.6,
    price: 250,
    imageUri:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
  },
];

export default function HomeScreen() {
  const { themed } = useAppTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const renderLawyerCard = ({ item }: { item: (typeof lawyersData)[0] }) => (
    <LawyerCard
      id={item.id}
      name={item.name}
      description={item.description}
      rating={item.rating}
      price={item.price}
      imageUri={item.imageUri}
      onPress={() => {
        // Handle card press
        console.log('Pressed lawyer:', item.name);
      }}
    />
  );

  return (
    <SafeAreaView style={themed(styles.container)}>
      <ScrollView
        style={themed(styles.scrollView)}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={themed(styles.header)}>
          <Text style={themed(styles.title)}>Trang chủ</Text>
          <Text style={themed(styles.subtitle)}>
            Chào mừng đến với LegalConnect
          </Text>
        </View>

        {/* Lawyers List */}
        <View style={themed(styles.listContainer)}>
          <View style={themed(styles.sectionHeader)}>
            <Text style={themed(styles.sectionTitle)}>Luật sư nổi bật</Text>
            <Text style={themed(styles.viewMoreText)}>Xem thêm {'>'}</Text>
          </View>

          {/* Filter Pills */}
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
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={themed(styles.horizontalListContent)}
            ItemSeparatorComponent={ItemSeparator}
          />

          <CaseCard
            id="1"
            title="Case title"
            lawyerName="Headshot Stock"
            lawyerImage="https://example.com/image.jpg"
            lastActivity="3 weeks ago"
            currentTask="Finding Documents"
            status="Processing"
            progress={20}
            commentsCount={2}
            lastUpdated="2 days ago"
            onPress={() => console.log('Case pressed')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
