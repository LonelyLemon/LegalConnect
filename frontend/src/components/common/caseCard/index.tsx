import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import { moderateScale } from 'react-native-size-matters';
import Icon from '@react-native-vector-icons/ionicons';
import * as styles from './styles';

export interface CaseCardProps {
  id: string;
  title: string;
  lawyerName: string;
  lawyerImage: string;
  lastActivity: string;
  currentTask: string;
  status: 'Processing' | 'Completed' | 'Pending' | 'New';
  progress: number;
  commentsCount: number;
  lastUpdated: string;
  onPress?: () => void;
}

export default function CaseCard({
  id: _id,
  title,
  lawyerName,
  lawyerImage,
  lastActivity,
  currentTask,
  status,
  progress,
  commentsCount,
  lastUpdated,
  onPress,
}: CaseCardProps) {
  const { themed, theme } = useAppTheme();

  const getStatusColor = (caseStatus: string) => {
    switch (caseStatus) {
      case 'Processing':
        return theme.colors.processStatus.pending;
      case 'Completed':
        return theme.colors.processStatus.approved;
      case 'Pending':
        return theme.colors.processStatus.pending;
      case 'New':
        return theme.colors.processStatus.new;
      default:
        return theme.colors.processStatus.undefined;
    }
  };

  const statusColors = getStatusColor(status);

  return (
    <TouchableOpacity
      style={themed(styles.cardContainer)}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header Section */}
      <View style={themed(styles.headerSection)}>
        <View style={themed(styles.profileSection)}>
          <Image
            source={{ uri: lawyerImage }}
            style={themed(styles.profileImage)}
          />
          <View style={themed(styles.titleSection)}>
            <Text style={themed(styles.titleText)} numberOfLines={1}>
              {title}
            </Text>
            <Text style={themed(styles.lawyerText)} numberOfLines={1}>
              Lawyer: {lawyerName}
            </Text>
            <Text style={themed(styles.activityText)} numberOfLines={1}>
              Labor: {lastActivity}
            </Text>
          </View>
        </View>

        <View
          style={[
            themed(styles.statusBadge),
            { backgroundColor: statusColors.badgeColor },
          ]}
        >
          <Text
            style={[
              themed(styles.statusText),
              { color: statusColors.textColor },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <Text style={themed(styles.currentTaskText)} numberOfLines={1}>
        {currentTask}
      </Text>

      <View style={themed(styles.progressSection)}>
        <View style={themed(styles.progressBarContainer)}>
          <View style={themed(styles.progressBarBackground)}>
            <View
              style={[
                themed(styles.progressBarFill),
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={themed(styles.progressText)}>{progress}%</Text>
        </View>
      </View>

      {/* Footer Section */}
      <View style={themed(styles.footerSection)}>
        <View style={themed(styles.commentsSection)}>
          <Icon
            name="chatbubble-outline"
            size={moderateScale(theme.fontSizes.sm)}
            color={theme.colors.onSurface}
          />
          <Text style={themed(styles.commentsText)}>{commentsCount}</Text>
        </View>

        <Text style={themed(styles.lastUpdatedText)}>
          Updated: {lastUpdated}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
