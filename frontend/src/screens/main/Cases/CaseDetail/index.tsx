import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../../components/layout/header';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { Case, BookingRequest } from '../../../../types/case';
import Icon from '@react-native-vector-icons/ionicons';
import { moderateScale } from 'react-native-size-matters';
import * as styles from './styles';
import { t } from '../../../../i18n';
import { MainStackNames } from '../../../../navigation/routes';

type CaseDetailRouteProp = RouteProp<
  { params: { caseData?: Case | BookingRequest } },
  'params'
>;

export const CaseDetail = () => {
  const { themed, theme } = useAppTheme();
  const route = useRoute<CaseDetailRouteProp>();
  const navigation = useNavigation<NavigationProp<any>>();
  const caseData = route.params?.caseData;

  // Mock data if no case data is passed
  // const mockCase: Case = {
  //   id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //   booking_request_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //   lawyer_id: '901abd0c-06ff-437d-b621-50bc0b1d81ae',
  //   client_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  //   title: 'Property Dispute Case',
  //   description:
  //     'I need to hire a lawyer for my property dispute case. The neighbor has been encroaching on my land and refuses to acknowledge the property boundaries despite clear survey evidence.',
  //   state: 'IN_PROGRESS',
  //   attachment_urls: [
  //     'https://example.com/document1.pdf',
  //     'https://example.com/document2.pdf',
  //   ],
  //   lawyer_note:
  //     'Initial consultation completed. Gathering evidence for court filing.',
  //   client_note: 'Please review the survey documents I uploaded.',
  //   started_at: '2025-01-15T10:00:00Z',
  //   ending_time: '2025-03-15T10:00:00Z',
  //   create_at: '2025-01-10T08:30:00Z',
  //   updated_at: '2025-01-20T14:45:00Z',
  // };

  const displayCase = caseData;
  // const displayCase = mockCase;

  // Helper function to check if item is BookingRequest (pending case)
  const isBookingRequest = (
    item: Case | BookingRequest,
  ): item is BookingRequest => {
    return 'short_description' in item && 'status' in item;
  };

  const isPending = isBookingRequest(displayCase as Case | BookingRequest);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'IN_PROGRESS':
        return theme.colors.processStatus.pending;
      case 'APPROVED':
      case 'COMPLETED':
        return theme.colors.processStatus.approved;
      case 'REJECTED':
      case 'CANCELLED':
        return theme.colors.processStatus.rejected;
      default:
        return theme.colors.processStatus.undefined;
    }
  };

  // Get status based on whether it's pending or active case
  const currentStatus = isPending
    ? (displayCase as BookingRequest).status
    : (displayCase as Case).state;
  const statusColors = getStatusColor(currentStatus);

  // Get description based on type
  const description = isPending
    ? (displayCase as BookingRequest).short_description
    : (displayCase as Case).description;

  // Get attachment URLs (only for Cases, not BookingRequests)
  const attachmentUrls = isPending
    ? []
    : (displayCase as Case).attachment_urls || [];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header title={displayCase.title} showBackButton={true} />
      <ScrollView
        style={themed(styles.scrollView)}
        contentContainerStyle={themed(styles.scrollContent)}
      >
        {/* Status Badge */}
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
            {currentStatus}
          </Text>
        </View>

        {/* Case Title */}
        <Text style={themed(styles.caseTitle)}>{displayCase.title}</Text>

        {/* Description Section */}
        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>
            {isPending
              ? t('caseDetail.requestDetails')
              : t('caseDetail.description')}
          </Text>
          <Text style={themed(styles.descriptionText)}>{description}</Text>
        </View>

        {/* Case Information - Show different info for pending vs active cases */}
        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>
            {isPending
              ? t('caseDetail.requestInformation')
              : t('caseDetail.caseInformation')}
          </Text>
          <View style={themed(styles.infoRow)}>
            <Icon
              name="calendar-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurface}
            />
            <View style={themed(styles.infoTextContainer)}>
              <Text style={themed(styles.infoLabel)}>
                {isPending
                  ? t('caseDetail.desiredStartTime')
                  : t('caseDetail.startedAt')}
              </Text>
              <Text style={themed(styles.infoValue)}>
                {formatDate(
                  isPending
                    ? (displayCase as BookingRequest).desired_start_time
                    : (displayCase as Case).started_at,
                )}
              </Text>
            </View>
          </View>
          <View style={themed(styles.infoRow)}>
            <Icon
              name="calendar-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurface}
            />
            <View style={themed(styles.infoTextContainer)}>
              <Text style={themed(styles.infoLabel)}>
                {isPending
                  ? t('caseDetail.desiredEndTime')
                  : t('caseDetail.expectedEnd')}
              </Text>
              <Text style={themed(styles.infoValue)}>
                {formatDate(
                  isPending
                    ? (displayCase as BookingRequest).desired_end_time
                    : (displayCase as Case).ending_time,
                )}
              </Text>
            </View>
          </View>
          <View style={themed(styles.infoRow)}>
            <Icon
              name="time-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurface}
            />
            <View style={themed(styles.infoTextContainer)}>
              <Text style={themed(styles.infoLabel)}>
                {t('caseDetail.lastUpdated')}
              </Text>
              <Text style={themed(styles.infoValue)}>
                {formatDate(displayCase.updated_at)}
              </Text>
            </View>
          </View>
        </View>

        {/* Lawyer Note - Only for active cases */}
        {!isPending && (displayCase as Case).lawyer_note && (
          <View style={themed(styles.section)}>
            <Text style={themed(styles.sectionTitle)}>
              {t('caseDetail.lawyersNote')}
            </Text>
            <View style={themed(styles.noteContainer)}>
              <Text style={themed(styles.noteText)}>
                {(displayCase as Case).lawyer_note}
              </Text>
            </View>
          </View>
        )}

        {/* Client Note - Only for active cases */}
        {!isPending && (displayCase as Case).client_note && (
          <View style={themed(styles.section)}>
            <Text style={themed(styles.sectionTitle)}>
              {t('caseDetail.yourNote')}
            </Text>
            <View style={themed(styles.noteContainer)}>
              <Text style={themed(styles.noteText)}>
                {(displayCase as Case).client_note}
              </Text>
            </View>
          </View>
        )}

        {/* Attachments - Only for active cases with attachments */}
        {!isPending && attachmentUrls.length > 0 && (
          <View style={themed(styles.section)}>
            <Text style={themed(styles.sectionTitle)}>
              {t('caseDetail.attachments')} ({attachmentUrls.length})
            </Text>
            {attachmentUrls.map((url, index) => (
              <TouchableOpacity
                key={index}
                style={themed(styles.attachmentItem)}
                onPress={() => {
                  navigation.navigate(MainStackNames.PdfViewer, {
                    url: url,
                    title: t('caseDetail.attachmentNumber', {
                      number: index + 1,
                    }),
                  });
                }}
              >
                <Icon
                  name="document-attach-outline"
                  size={moderateScale(24)}
                  color={theme.colors.primary}
                />
                <Text style={themed(styles.attachmentText)}>
                  {t('caseDetail.attachmentNumber', { number: index + 1 })}
                </Text>
                <Icon
                  name="chevron-forward-outline"
                  size={moderateScale(20)}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={themed(styles.buttonContainer)}>
          <Pressable style={themed(styles.primaryButton)}>
            <Icon
              name="chatbubble-outline"
              size={moderateScale(20)}
              color={theme.colors.onPrimary}
            />
            <Text style={themed(styles.primaryButtonText)}>
              {t('caseDetail.contactLawyer')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
