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
import { RouteProp, useRoute } from '@react-navigation/native';
import { Case } from '../../../../types/case';
import Icon from '@react-native-vector-icons/ionicons';
import { moderateScale } from 'react-native-size-matters';
import * as styles from './styles';

type CaseDetailRouteProp = RouteProp<{ params: { caseData?: Case } }, 'params'>;

export const CaseDetail = () => {
  const { themed, theme } = useAppTheme();
  const route = useRoute<CaseDetailRouteProp>();
  const caseData = route.params?.caseData;

  // Mock data if no case data is passed
  const mockCase: Case = {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    booking_request_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    lawyer_id: '901abd0c-06ff-437d-b621-50bc0b1d81ae',
    client_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    title: 'Property Dispute Case',
    description:
      'I need to hire a lawyer for my property dispute case. The neighbor has been encroaching on my land and refuses to acknowledge the property boundaries despite clear survey evidence.',
    state: 'IN_PROGRESS',
    attachment_urls: [
      'https://example.com/document1.pdf',
      'https://example.com/document2.pdf',
    ],
    lawyer_note:
      'Initial consultation completed. Gathering evidence for court filing.',
    client_note: 'Please review the survey documents I uploaded.',
    started_at: '2025-01-15T10:00:00Z',
    ending_time: '2025-03-15T10:00:00Z',
    create_at: '2025-01-10T08:30:00Z',
    updated_at: '2025-01-20T14:45:00Z',
  };

  const displayCase = caseData || mockCase;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return theme.colors.processStatus.pending;
      case 'COMPLETED':
        return theme.colors.processStatus.approved;
      case 'CANCELLED':
        return theme.colors.processStatus.rejected;
      default:
        return theme.colors.processStatus.undefined;
    }
  };

  const statusColors = getStatusColor(displayCase.state);

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
            {displayCase.state}
          </Text>
        </View>

        {/* Case Title */}
        <Text style={themed(styles.caseTitle)}>{displayCase.title}</Text>

        {/* Description Section */}
        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>Description</Text>
          <Text style={themed(styles.descriptionText)}>
            {displayCase.description}
          </Text>
        </View>

        {/* Case Information */}
        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>Case Information</Text>
          <View style={themed(styles.infoRow)}>
            <Icon
              name="calendar-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurface}
            />
            <View style={themed(styles.infoTextContainer)}>
              <Text style={themed(styles.infoLabel)}>Started At</Text>
              <Text style={themed(styles.infoValue)}>
                {formatDate(displayCase.started_at)}
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
              <Text style={themed(styles.infoLabel)}>Expected End</Text>
              <Text style={themed(styles.infoValue)}>
                {formatDate(displayCase.ending_time)}
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
              <Text style={themed(styles.infoLabel)}>Last Updated</Text>
              <Text style={themed(styles.infoValue)}>
                {formatDate(displayCase.updated_at)}
              </Text>
            </View>
          </View>
        </View>

        {/* Lawyer Note */}
        {displayCase.lawyer_note && (
          <View style={themed(styles.section)}>
            <Text style={themed(styles.sectionTitle)}>Lawyer's Note</Text>
            <View style={themed(styles.noteContainer)}>
              <Text style={themed(styles.noteText)}>
                {displayCase.lawyer_note}
              </Text>
            </View>
          </View>
        )}

        {/* Client Note */}
        {displayCase.client_note && (
          <View style={themed(styles.section)}>
            <Text style={themed(styles.sectionTitle)}>Your Note</Text>
            <View style={themed(styles.noteContainer)}>
              <Text style={themed(styles.noteText)}>
                {displayCase.client_note}
              </Text>
            </View>
          </View>
        )}

        {/* Attachments */}
        {displayCase.attachment_urls &&
          displayCase.attachment_urls.length > 0 && (
            <View style={themed(styles.section)}>
              <Text style={themed(styles.sectionTitle)}>
                Attachments ({displayCase.attachment_urls.length})
              </Text>
              {displayCase.attachment_urls.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  style={themed(styles.attachmentItem)}
                  onPress={() => {
                    // TODO: Open attachment
                    console.log('Open attachment:', url);
                  }}
                >
                  <Icon
                    name="document-attach-outline"
                    size={moderateScale(24)}
                    color={theme.colors.primary}
                  />
                  <Text style={themed(styles.attachmentText)}>
                    Attachment {index + 1}
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
            <Text style={themed(styles.primaryButtonText)}>Contact Lawyer</Text>
          </Pressable>

          <Pressable style={themed(styles.secondaryButton)}>
            <Icon
              name="document-text-outline"
              size={moderateScale(20)}
              color={theme.colors.primary}
            />
            <Text style={themed(styles.secondaryButtonText)}>
              View Documents
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
