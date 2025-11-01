import axios from 'axios';
import {
  VerificationRequest,
  VerificationRequestWithUser,
} from '../types/verification';

/**
 * Get all lawyer verification requests (admin only)
 */
export const getAllVerificationRequests = async (): Promise<
  VerificationRequest[]
> => {
  try {
    const response = await axios.get('/lawyer/verification-requests');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching verification requests:', error);
    throw error;
  }
};

/**
 * Get my verification requests (lawyer)
 */
export const getMyVerificationRequests = async (): Promise<
  VerificationRequest[]
> => {
  try {
    const response = await axios.get('/lawyer/verification-requests/me');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching my verification requests:', error);
    throw error;
  }
};

/**
 * Get verification request by ID
 */
export const getVerificationRequestById = async (
  requestId: string,
): Promise<VerificationRequestWithUser> => {
  try {
    const response = await axios.get(
      `/lawyer/verification-requests/${requestId}`,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching verification request:', error);
    throw error;
  }
};

/**
 * Approve verification request (admin only)
 */
export const approveVerificationRequest = async (
  requestId: string,
): Promise<void> => {
  try {
    await axios.patch(`/lawyer/verification-requests/${requestId}/approve`);
  } catch (error: any) {
    console.error('Error approving verification request:', error);
    throw error;
  }
};

/**
 * Reject verification request (admin only)
 */
export const rejectVerificationRequest = async (
  requestId: string,
  rejectionReason: string,
): Promise<void> => {
  try {
    await axios.patch(`/lawyer/verification-requests/${requestId}/reject`, {
      rejection_reason: rejectionReason,
    });
  } catch (error: any) {
    console.error('Error rejecting verification request:', error);
    throw error;
  }
};
