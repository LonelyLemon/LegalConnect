import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';
import Header from '../../../components/layout/header/index.tsx';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
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
import { createNewConversation } from '../../../stores/message.slice.ts';
import { t } from '../../../i18n';
import { selectRole } from '../../../stores/user.slice.ts';

type TabType = 'description' | 'review';

export default function LawyerProfileScreen({
  route,
}: {
  route: RouteProp<{ params: { id: string } }, 'params'>;
}) {
  const { id } = route.params;
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  console.log('id: ', id);
  const { themed, theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const userRole = useAppSelector(selectRole);

  // Reset avatar error when lawyer image changes
  useEffect(() => {
    setAvatarError(false);
  }, [lawyer?.image_url]);
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
    { key: 'description', label: t('lawyerProfile.description') },
    { key: 'review', label: t('lawyerProfile.review') },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <Description lawyer={lawyer as Lawyer} />;
      case 'review':
        return <Review lawyerId={id} />;
      default:
        return null;
    }
  };

  const handleChatPress = async () => {
    try {
      const response = await dispatch(
        createNewConversation({ receiverId: lawyer?.user_id || '' }),
      );
      console.log('Full response:', JSON.stringify(response, null, 2));

      if (response?.payload) {
        const payload: any = response.payload;
        console.log('Payload:', payload);

        // Lấy conversation_id từ response (có thể là top-level hoặc trong participants)
        const conversationId =
          payload.id ||
          payload.conversation_id ||
          payload.participants?.[0]?.conversation_id;

        console.log('Conversation ID:', conversationId);

        if (!conversationId) {
          console.error('No conversation ID found in response');
          return;
        }

        // Tìm thông tin lawyer từ participants hoặc dùng từ state
        const lawyerParticipant = payload.participants?.find(
          (p: any) => p.user_id === lawyer?.user_id,
        );

        navigation.navigate(MainStackNames.ChatDetail, {
          chatId: conversationId,
          name:
            lawyerParticipant?.user?.username ||
            lawyer?.display_name ||
            t('lawyerProfile.lawyer'),
          avatar: lawyerParticipant?.user?.image_url || lawyer?.image_url || '',
        });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header />
      <View style={themed(styles.HeaderTitle)}>
        {lawyer?.image_url && !avatarError ? (
          <Image
            source={{
              uri: lawyer.image_url,
            }}
            style={themed(styles.avatar)}
            onError={() => {
              console.log('Avatar image error, showing fallback icon');
              setAvatarError(true);
            }}
            onLoad={() => {
              setAvatarError(false);
            }}
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
            <Text style={themed(styles.statLabel)}>
              {t('lawyerProfile.customerReviews')}
            </Text>
          </View>
          <View style={themed(styles.statItem)}>
            <Text style={themed(styles.statValue)}>-</Text>
            <Text style={themed(styles.statLabel)}>
              {t('lawyerProfile.successfulCases')}
            </Text>
          </View>
          <View style={themed(styles.statItem)}>
            <Text style={themed(styles.statValue)}>
              {lawyer?.years_of_experience || 0}
            </Text>
            <Text style={themed(styles.statLabel)}>
              {t('lawyerProfile.yearsOfExperience')}
            </Text>
          </View>
        </View>

        <View style={themed(styles.buttonContainer)}>
          <TouchableOpacity
            style={themed(styles.secondaryButton)}
            onPress={() => {
              handleChatPress();
            }}
          >
            <Icon
              name="chatbubble-outline"
              size={moderateScale(theme.fontSizes.lg)}
              color={theme.colors.onPrimary}
            />
            <Text style={themed(styles.secondaryButtonText)}>
              {t('lawyerProfile.chat')}
            </Text>
          </TouchableOpacity>
          {userRole !== 'lawyer' && (
            <TouchableOpacity
              style={themed(styles.primaryButton)}
              onPress={() => {
                navigation.navigate(MainStackNames.Schedule, {
                  lawyerId: id,
                  lawyerName: lawyer?.display_name,
                });
              }}
            >
              <Icon
                name="calendar-outline"
                size={moderateScale(theme.fontSizes.lg)}
                color={theme.colors.primary}
              />
              <Text style={themed(styles.primaryButtonText)}>
                {t('lawyerProfile.book')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
