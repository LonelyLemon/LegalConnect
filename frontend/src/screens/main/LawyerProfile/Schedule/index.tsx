import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import * as styles from './styles';
import Header from '../../../../components/layout/header';
import {
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { Schedule } from '../../../../types/schedule';
import Icon from '@react-native-vector-icons/ionicons';
import { moderateScale } from 'react-native-size-matters';
import { MainStackNames } from '../../../../navigation/routes';
import { fetchLawyerSchedule } from '../../../../stores/lawyer.slices';
import { useAppDispatch } from '../../../../redux/hook';
import { useSelector } from 'react-redux';
import { LawyerState } from '../../../../types/lawyer';

export default function ScheduleScreen({
  route,
}: {
  route: RouteProp<
    { params: { lawyerId: string; lawyerName?: string } },
    'params'
  >;
}) {
  const { lawyerId, lawyerName } = route.params;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { themed, theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();
  const { isLoading } = useSelector(
    (state: { lawyer: LawyerState }) => state.lawyer,
  );
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await dispatch(fetchLawyerSchedule(lawyerId));
        const data = response.payload as Schedule[];
        const availableSlots = data.filter((slot: Schedule) => !slot.is_booked);
        setSchedules(availableSlots);
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      }
    };
    fetchSchedule();
  }, [dispatch, lawyerId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
      });
    } catch {
      return dateString;
    }
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    // Navigate to booking screen with pre-filled schedule data
    navigation.navigate(MainStackNames.Booking, {
      lawyerId,
      scheduleId: schedule.id,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
    });
  };

  const renderScheduleItem = ({ item }: { item: Schedule }) => {
    const startDate = new Date(item.start_time);
    const endDate = new Date(item.end_time);
    const durationHours = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
    );

    return (
      <TouchableOpacity
        style={themed(styles.scheduleCard)}
        onPress={() => handleSelectSchedule(item)}
        activeOpacity={0.7}
      >
        <View style={themed(styles.scheduleHeader)}>
          <View style={themed(styles.dateContainer)}>
            <Icon
              name="calendar-outline"
              size={moderateScale(20)}
              color={theme.colors.primary}
            />
            <Text style={themed(styles.dateText)}>
              {formatDate(item.start_time)}
            </Text>
          </View>
          <View style={themed(styles.statusBadge)}>
            <Text style={themed(styles.statusText)}>Available</Text>
          </View>
        </View>

        <View style={themed(styles.timeRow)}>
          <View style={themed(styles.timeContainer)}>
            <Icon
              name="time-outline"
              size={moderateScale(18)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.timeLabel)}>Start:</Text>
            <Text style={themed(styles.timeValue)}>
              {formatTime(item.start_time)}
            </Text>
          </View>
          <Icon
            name="arrow-forward"
            size={moderateScale(16)}
            color={theme.colors.onSurfaceVariant}
          />
          <View style={themed(styles.timeContainer)}>
            <Icon
              name="time-outline"
              size={moderateScale(18)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.timeLabel)}>End:</Text>
            <Text style={themed(styles.timeValue)}>
              {formatTime(item.end_time)}
            </Text>
          </View>
        </View>

        <View style={themed(styles.durationContainer)}>
          <Icon
            name="hourglass-outline"
            size={moderateScale(16)}
            color={theme.colors.onSurfaceVariant}
          />
          <Text style={themed(styles.durationText)}>
            Duration: {durationHours} {durationHours === 1 ? 'hour' : 'hours'}
          </Text>
        </View>

        <View style={themed(styles.selectButton)}>
          <Text style={themed(styles.selectButtonText)}>Select this slot</Text>
          <Icon
            name="chevron-forward"
            size={moderateScale(20)}
            color={theme.colors.primary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={themed(styles.emptyContainer)}>
      <Icon
        name="calendar-clear-outline"
        size={moderateScale(64)}
        color={theme.colors.onSurfaceVariant}
      />
      <Text style={themed(styles.emptyTitle)}>No Available Slots</Text>
      <Text style={themed(styles.emptyMessage)}>
        This lawyer has no available time slots at the moment. Please check back
        later or contact them directly.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={themed(styles.container)}>
        <Header
          title={lawyerName ? `${lawyerName}'s Schedule` : 'Schedule'}
          showBackButton={true}
        />
        <View style={themed(styles.loadingContainer)}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={themed(styles.loadingText)}>Loading schedule...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header
        title={lawyerName ? `${lawyerName}'s Schedule` : 'Available Schedule'}
        showBackButton={true}
      />
      <View style={themed(styles.content)}>
        {schedules.length > 0 && (
          <View style={themed(styles.headerInfo)}>
            <Text style={themed(styles.headerTitle)}>
              Available Time Slots ({schedules.length})
            </Text>
            <Text style={themed(styles.headerSubtitle)}>
              Select a time slot to book a consultation (Times shown in UTC)
            </Text>
          </View>
        )}
        <FlatList
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={item => item.id}
          contentContainerStyle={themed(styles.listContainer)}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
