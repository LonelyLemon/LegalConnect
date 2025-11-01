import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../../../theme/theme.provider';
import Header from '../../../../components/layout/header';
import * as styles from './styles';
import { VerificationRequestWithUser } from '../../../../types/verification';
import {
  getVerificationRequestById,
  approveVerificationRequest,
  rejectVerificationRequest,
} from '../../../../services/verification';
import { showError, showSuccess } from '../../../../types/toast';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';

export default function VerificationRequestDetail({ route }: { route: any }) {
  const { requestId } = route.params;
  const { themed, theme } = useAppTheme();
  const navigation = useNavigation<any>();
  const [request, setRequest] = useState<VerificationRequestWithUser | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const requestData = await getVerificationRequestById(requestId);
      setRequest(requestData);
    } catch (error: any) {
      showError(
        'Error',
        error?.response?.data?.message || 'Failed to fetch request details',
      );
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
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

  const handleApprove = async () => {
    Alert.alert(
      'Approve Request',
      `Are you sure you want to approve this verification request for ${
        request?.id || 'this user'
      }?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            try {
              await approveVerificationRequest(requestId);
              showSuccess('Success', 'Request approved successfully');
              navigation.goBack();
            } catch (error: any) {
              showError(
                'Error',
                error?.response?.data?.message || 'Failed to approve request',
              );
            }
          },
        },
      ],
    );
  };

  const handleReject = async () => {
    Alert.prompt(
      'Reject Request',
      'Please provide a reason for rejection:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (reason?: string) => {
            if (!reason || reason.trim().length === 0) {
              showError('Error', 'Rejection reason is required');
              return;
            }
            try {
              await rejectVerificationRequest(requestId, reason.trim());
              showSuccess('Success', 'Request rejected successfully');
              navigation.goBack();
            } catch (error: any) {
              showError(
                'Error',
                error?.response?.data?.message || 'Failed to reject request',
              );
            }
          },
        },
      ],
      'plain-text',
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
        <Header title="Request Details" showBackButton />
        <View style={themed(styles.loadingContainer)}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
        <Header title="Request Details" showBackButton />
        <View style={themed(styles.loadingContainer)}>
          <Text style={themed(styles.infoValue)}>Request not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
      <Header title="Verification Request" showBackButton />

      <ScrollView contentContainerStyle={themed(styles.scrollContent)}>
        {/* Status Section */}
        <View style={themed(styles.statusContainer)}>
          {/* <View
            style={[
              themed(styles.statusBadge),
              { backgroundColor: statusColor as any },
            ]}
          >
            <Text style={themed(styles.statusText)}>
              {getStatusLabel(request.status)}
            </Text>
          </View> */}
          <Text style={themed(styles.statusDate)}>
            Submitted: {formatDate(request.create_at)}
          </Text>
          {request.reviewed_at && (
            <Text style={themed(styles.statusDate)}>
              Reviewed: {formatDate(request.reviewed_at)}
            </Text>
          )}
        </View>

        {/* User Information Section */}
        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>User Information</Text>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="person-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Full Name:</Text>
            <Text style={themed(styles.infoValue)}>
              {request?.full_name || 'N/A'}
            </Text>
          </View>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="mail-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Email:</Text>
            <Text style={themed(styles.infoValue)}>
              {request?.email || 'N/A'}
            </Text>
          </View>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="call-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Phone:</Text>
            <Text style={themed(styles.infoValue)}>
              {request?.phone_number || 'N/A'}
            </Text>
          </View>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="location-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Address:</Text>
            <Text style={themed(styles.infoValue)}>
              {request?.address || 'N/A'}
            </Text>
          </View>

          {/* <View style={themed(styles.infoRow)}>
            <Ionicons
              name="calendar-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Date of Birth:</Text>
            <Text style={themed(styles.infoValue)}>
              {request?.dob ? formatDate(request.dob) : 'N/A'}
            </Text>
          </View>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="male-female-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Gender:</Text>
            <Text style={themed(styles.infoValue)}>
              {request?.gender || 'N/A'}
            </Text>
          </View> */}

          <View style={themed(styles.divider)} />

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="key-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>User ID:</Text>
            <Text style={themed(styles.infoValue)} numberOfLines={1}>
              {request.user_id}
            </Text>
          </View>

          {/* <View style={themed(styles.infoRow)}>
            <Ionicons
              name="shield-checkmark-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Role:</Text>
            <Text style={themed(styles.infoValue)}>
              {userInfo?.role || 'N/A'}
            </Text>
          </View> */}
        </View>

        {/* Professional Information Section */}
        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>
            Professional Information
          </Text>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="briefcase-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Current Position:</Text>
            <Text style={themed(styles.infoValue)}>
              {request.current_job_position}
            </Text>
          </View>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="time-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Years of Experience:</Text>
            <Text style={themed(styles.infoValue)}>
              {request.years_of_experience} years
            </Text>
          </View>
        </View>

        {/* Verification Documents Section */}
        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>
            Verification Documents
          </Text>

          <View style={themed(styles.imageGrid)}>
            {/* Row 1: Portrait Photo & ID Card Front */}
            <View style={themed(styles.imageRow)}>
              <View style={themed(styles.imageContainer)}>
                <Text style={themed(styles.imageLabel)}>Portrait Photo</Text>
                <TouchableOpacity
                  style={themed(styles.imageCard)}
                  onPress={() =>
                    request.portrait_url &&
                    setSelectedImage({
                      url: request.portrait_url,
                      title: 'Portrait Photo',
                    })
                  }
                  disabled={!request.portrait_url}
                >
                  {request.portrait_url ? (
                    <Image
                      source={{ uri: request.portrait_url }}
                      style={themed(styles.image)}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={themed(styles.imagePlaceholder)}>
                      <Ionicons
                        name="person-outline"
                        size={moderateScale(32)}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text style={themed(styles.imagePlaceholderText)}>
                        No image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={themed(styles.imageContainer)}>
                <Text style={themed(styles.imageLabel)}>ID Card (Front)</Text>
                <TouchableOpacity
                  style={themed(styles.imageCard)}
                  onPress={() =>
                    request.identity_card_front_url &&
                    setSelectedImage({
                      url: request.identity_card_front_url,
                      title: 'ID Card (Front)',
                    })
                  }
                  disabled={!request.identity_card_front_url}
                >
                  {request.identity_card_front_url ? (
                    <Image
                      source={{ uri: request.identity_card_front_url }}
                      style={themed(styles.image)}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={themed(styles.imagePlaceholder)}>
                      <Ionicons
                        name="card-outline"
                        size={moderateScale(32)}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text style={themed(styles.imagePlaceholderText)}>
                        No image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Row 2: ID Card Back & Law Certificate */}
            <View style={themed(styles.imageRow)}>
              <View style={themed(styles.imageContainer)}>
                <Text style={themed(styles.imageLabel)}>ID Card (Back)</Text>
                <TouchableOpacity
                  style={themed(styles.imageCard)}
                  onPress={() =>
                    request.identity_card_back_url &&
                    setSelectedImage({
                      url: request.identity_card_back_url,
                      title: 'ID Card (Back)',
                    })
                  }
                  disabled={!request.identity_card_back_url}
                >
                  {request.identity_card_back_url ? (
                    <Image
                      source={{ uri: request.identity_card_back_url }}
                      style={themed(styles.image)}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={themed(styles.imagePlaceholder)}>
                      <Ionicons
                        name="card-outline"
                        size={moderateScale(32)}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text style={themed(styles.imagePlaceholderText)}>
                        No image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={themed(styles.imageContainer)}>
                <Text style={themed(styles.imageLabel)}>Law Certificate</Text>
                <TouchableOpacity
                  style={themed(styles.imageCard)}
                  onPress={() =>
                    request.law_certificate_url &&
                    setSelectedImage({
                      url: request.law_certificate_url,
                      title: 'Law Certificate',
                    })
                  }
                  disabled={!request.law_certificate_url}
                >
                  {request.law_certificate_url ? (
                    <Image
                      source={{ uri: request.law_certificate_url }}
                      style={themed(styles.image)}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={themed(styles.imagePlaceholder)}>
                      <Ionicons
                        name="document-text-outline"
                        size={moderateScale(32)}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text style={themed(styles.imagePlaceholderText)}>
                        No image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Row 3: Bachelor Degree */}
            <View style={themed(styles.imageRow)}>
              <View style={themed(styles.imageContainer)}>
                <Text style={themed(styles.imageLabel)}>Bachelor Degree</Text>
                <TouchableOpacity
                  style={themed(styles.imageCard)}
                  onPress={() =>
                    request.bachelor_degree_url &&
                    setSelectedImage({
                      url: request.bachelor_degree_url,
                      title: 'Bachelor Degree',
                    })
                  }
                  disabled={!request.bachelor_degree_url}
                >
                  {request.bachelor_degree_url ? (
                    <Image
                      source={{ uri: request.bachelor_degree_url }}
                      style={themed(styles.image)}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={themed(styles.imagePlaceholder)}>
                      <Ionicons
                        name="school-outline"
                        size={moderateScale(32)}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text style={themed(styles.imagePlaceholderText)}>
                        No image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={themed(styles.imageContainer)} />
            </View>
          </View>
        </View>

        {/* Rejection Reason (if rejected) */}
        {request.status === 'rejected' && request.rejection_reason && (
          <View style={themed(styles.rejectionSection)}>
            <Text style={themed(styles.rejectionTitle)}>Rejection Reason</Text>
            <Text style={themed(styles.rejectionText)}>
              {request.rejection_reason}
            </Text>
          </View>
        )}

        {/* Request Timeline */}
        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>Request Timeline</Text>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="add-circle-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Created:</Text>
            <Text style={themed(styles.infoValue)}>
              {formatDate(request.create_at)}
            </Text>
          </View>

          <View style={themed(styles.infoRow)}>
            <Ionicons
              name="refresh-outline"
              size={moderateScale(20)}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={themed(styles.infoLabel)}>Last Updated:</Text>
            <Text style={themed(styles.infoValue)}>
              {formatDate(request.updated_at)}
            </Text>
          </View>

          {request.reviewed_at && (
            <View style={themed(styles.infoRow)}>
              <Ionicons
                name="checkmark-done-outline"
                size={moderateScale(20)}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={themed(styles.infoLabel)}>Reviewed:</Text>
              <Text style={themed(styles.infoValue)}>
                {formatDate(request.reviewed_at)}
              </Text>
            </View>
          )}

          {request.reviewed_by_admin_id && (
            <View style={themed(styles.infoRow)}>
              <Ionicons
                name="person-circle-outline"
                size={moderateScale(20)}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={themed(styles.infoLabel)}>Reviewed By:</Text>
              <Text style={themed(styles.infoValue)} numberOfLines={1}>
                {request.reviewed_by_admin_id}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons (only for pending requests) */}
      {request.status === 'pending' && (
        <View style={themed(styles.actionContainer)}>
          <TouchableOpacity
            style={[themed(styles.actionButton), themed(styles.approveButton)]}
            onPress={handleApprove}
          >
            <Ionicons
              name="checkmark-outline"
              size={moderateScale(24)}
              color="#FFFFFF"
            />
            <Text style={themed(styles.buttonText)}>Approve Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[themed(styles.actionButton), themed(styles.rejectButton)]}
            onPress={handleReject}
          >
            <Ionicons
              name="close-outline"
              size={moderateScale(24)}
              color="#FFFFFF"
            />
            <Text style={themed(styles.buttonText)}>Reject Request</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Image Preview Modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={themed(styles.modalOverlay)}>
          <TouchableOpacity
            style={themed(styles.closeButton)}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={moderateScale(32)} color="#FFFFFF" />
          </TouchableOpacity>

          {selectedImage && (
            <>
              <Text style={themed(styles.imageTitle)}>
                {selectedImage.title}
              </Text>
              <View style={themed(styles.modalContent)}>
                <Image
                  source={{ uri: selectedImage.url }}
                  style={themed(styles.fullImage)}
                  resizeMode="contain"
                />
              </View>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
