import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../../components/layout/header';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
import { getBookingRequest, decideBookingRequest } from '../../../../services/booking';
import { useAppSelector } from '../../../../redux/hook';
import { selectUser } from '../../../../stores/user.slice';

type CaseDetailRouteProp = RouteProp<
  { params: { caseData?: Case | BookingRequest } },
  'params'
>;

export const CaseDetail = () => {
  const { themed, theme } = useAppTheme();
  const route = useRoute<CaseDetailRouteProp>();
  const navigation = useNavigation<NavigationProp<any>>();
  const user = useAppSelector(selectUser);
  const caseData = route.params?.caseData;
  const [bookingRequestData, setBookingRequestData] = useState<BookingRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper function to check if item is BookingRequest (pending case)
  const isBookingRequest = (
    item: Case | BookingRequest | undefined,
  ): item is BookingRequest => {
    return item !== undefined && 'short_description' in item && 'status' in item;
  };

  const isPending = isBookingRequest(caseData);

  // Fetch booking request details if it's a pending request
  useEffect(() => {
    if (isPending && caseData?.id) {
      setIsLoading(true);
      getBookingRequest(caseData.id)
        .then(data => {
          setBookingRequestData(data);
        })
        .catch(error => {
          console.error('Failed to fetch booking request:', error);
          // Use the caseData if fetch fails
          setBookingRequestData(caseData as BookingRequest);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isPending, caseData]);

  const displayCase = isPending && bookingRequestData ? bookingRequestData : caseData;

  // Check if this is an incoming request (user is the lawyer, not the client)
  // Use the bookingRequestData if available, otherwise use caseData
  const bookingRequest = isPending 
    ? (bookingRequestData || caseData as BookingRequest)
    : null;

  const isIncomingRequest =
    isPending &&
    bookingRequest &&
    user?.id &&
    bookingRequest.lawyer_id === user.id &&
    bookingRequest.client_id !== user.id &&
    bookingRequest.status === 'PENDING';

  // Debug logging
  React.useEffect(() => {
    if (isPending && bookingRequest) {
      console.log('Booking Request Debug:', {
        isPending,
        lawyer_id: bookingRequest.lawyer_id,
        client_id: bookingRequest.client_id,
        user_id: user?.id,
        status: bookingRequest.status,
        isIncomingRequest,
      });
    }
  }, [isPending, bookingRequest, user?.id, isIncomingRequest]);

  const handleDecision = async (accept: boolean) => {
    if (!isPending || !bookingRequest) return;

    Alert.alert(
      accept ? 'Accept Request' : 'Decline Request',
      accept
        ? 'Are you sure you want to accept this booking request?'
        : 'Are you sure you want to decline this booking request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: accept ? 'Accept' : 'Decline',
          style: accept ? 'default' : 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            try {
              const requestId = bookingRequest?.id || displayCase?.id;
              if (!requestId) {
                console.error('No booking request ID found');
                return;
              }
              const result = await decideBookingRequest(requestId, {
                accept,
              });
              // Update the booking request data with the response
              if (result?.booking) {
                setBookingRequestData(result.booking);
              } else if (result) {
                setBookingRequestData(result);
              }
              // Navigate back and refresh
              navigation.goBack();
            } catch (error) {
              console.error('Failed to decide booking request:', error);
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ],
    );
  };

  if (!displayCase) {
    return (
      <SafeAreaView style={themed(styles.container)}>
        <Header title="Case Detail" showBackButton={true} />
        <View style={themed(styles.scrollContent)}>
          <Text style={themed(styles.descriptionText)}>Case not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={themed(styles.container)}>
        <Header title="Case Detail" showBackButton={true} />
        <View style={themed(styles.scrollContent)}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'IN_PROGRESS':
        return theme.colors.processStatus.pending;
      case 'ACCEPTED':
      case 'APPROVED':
      case 'COMPLETED':
        return theme.colors.processStatus.approved;
      case 'DECLINED':
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
          {isIncomingRequest ? (
            <>
              <TouchableOpacity
                style={themed(styles.primaryButton)}
                onPress={() => handleDecision(true)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.onPrimary}
                  />
                ) : (
                  <>
                    <Icon
                      name="checkmark-circle-outline"
                      size={moderateScale(20)}
                      color={theme.colors.onPrimary}
                    />
                    <Text style={themed(styles.primaryButtonText)}>Accept</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={themed(styles.secondaryButton)}
                onPress={() => handleDecision(false)}
                disabled={isProcessing}
              >
                <Icon
                  name="close-circle-outline"
                  size={moderateScale(20)}
                  color={theme.colors.primary}
                />
                <Text style={themed(styles.secondaryButtonText)}>Decline</Text>
              </TouchableOpacity>
            </>
          ) : (
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
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
