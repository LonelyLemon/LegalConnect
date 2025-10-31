import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';
import Header from '../../../components/layout/header/index.tsx';
import { useAppDispatch } from '../../../redux/hook';
import { fetchLawyerById } from '../../../stores/lawyer.slices.ts';
import {
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { MainStackNames } from '../../../navigation/routes';
import { Lawyer } from '../../../types/lawyer.ts';
import Icon from '@react-native-vector-icons/ionicons';
import { moderateScale } from 'react-native-size-matters';
import Description from './Description/index.tsx';
import Review from './Review/index.tsx';

type TabType = 'description' | 'review' | 'cases';

export default function LawyerProfileScreen({
  route,
}: {
  route: RouteProp<{ params: { id: string } }, 'params'>;
}) {
  const { id } = route.params;
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  console.log('id: ', id);
  const { themed, theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  useEffect(() => {
    const fetchLawyer = async () => {
      const response = await dispatch(fetchLawyerById(id));
      console.log('response: ', response.payload);
      if (response.payload && typeof response.payload === 'object') {
        setLawyer(response.payload as Lawyer);
      }
    };
    fetchLawyer();
  }, [dispatch, id]);

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'review', label: 'Review (30)' },
    { key: 'cases', label: 'Featured cases' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <Description lawyer={lawyer as Lawyer} />;
      case 'review':
        return <Review lawyerId={id} />;
      case 'cases':
        return (
          <View style={themed(styles.content)}>
            <Text style={themed(styles.placeholderText)}>
              Featured cases will be displayed here
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header />
      <View style={themed(styles.HeaderTitle)}>
        {lawyer?.image_url ? (
          <Image
            source={{
              uri: lawyer.image_url,
            }}
            style={themed(styles.avatar)}
          />
        ) : (
          <View style={themed(styles.avatar)}>
            <Icon
              name="person-circle-outline"
              size={moderateScale(theme.spacing.xxxxxxxxxl)}
              color={theme.colors.onPrimary}
            />
          </View>
        )}
        <Text style={themed(styles.name)}>{lawyer?.display_name}</Text>
        <Text style={themed(styles.tagline)}>
          {lawyer?.current_level || lawyer?.education}
        </Text>

        <View style={themed(styles.statsContainer)}>
          <View style={themed(styles.statItem)}>
            <Text style={themed(styles.statValue)}>
              {lawyer?.average_rating
                ? `${lawyer.average_rating.toFixed(1)} ★`
                : 'N/A'}
            </Text>
            <Text style={themed(styles.statLabel)}>Customer reviews</Text>
          </View>
          <View style={themed(styles.statItem)}>
            <Text style={themed(styles.statValue)}>-</Text>
            <Text style={themed(styles.statLabel)}>Successful cases</Text>
          </View>
          <View style={themed(styles.statItem)}>
            <Text style={themed(styles.statValue)}>
              {lawyer?.years_of_experience || 0}
            </Text>
            <Text style={themed(styles.statLabel)}>Years of experience</Text>
          </View>
        </View>

        <TouchableOpacity
          style={themed(styles.editButton)}
          onPress={() => {
            navigation.navigate(MainStackNames.Booking, {
              lawyerId: id,
            });
          }}
        >
          <Text style={themed(styles.editButtonText)}>Order a session</Text>
          <Icon
            name="chevron-forward"
            size={moderateScale(theme.fontSizes.xl)}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

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
