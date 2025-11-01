import axios from 'axios';
import { showError } from '../types/toast';
import { t } from '../i18n';

export interface BookingRequestPayload {
  lawyer_id: string;
  title: string;
  short_description: string;
  desired_start_time: string; // ISO 8601 format
  desired_end_time: string; // ISO 8601 format
  attachment?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface ScheduleSlot {
  id: string;
  lawyer_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  create_at: string;
  updated_at: string;
}

export const createBookingRequest = async (
  data: BookingRequestPayload,
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('lawyer_id', data.lawyer_id);
    formData.append('title', data.title);
    formData.append('short_description', data.short_description);
    formData.append('desired_start_time', data.desired_start_time);
    formData.append('desired_end_time', data.desired_end_time);

    if (data.attachment) {
      formData.append('attachment', {
        uri: data.attachment.uri,
        type: data.attachment.type,
        name: data.attachment.name,
      } as any);
    }

    const response = await axios.post('/booking/requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    const errmsg = error?.response?.data;
    const message =
      errmsg?.message ||
      errmsg?.detail ||
      errmsg?.error ||
      error?.message ||
      'Failed to create booking request';
    throw new Error(message);
  }
};

export const getPersonalBookingRequest = async (): Promise<any> => {
  try {
    const response = await axios.get('/booking/requests/me');
    return response.data;
  } catch (error: any) {
    const errmsg = error?.response?.data;
    const message =
      errmsg?.message ||
      errmsg?.detail ||
      errmsg?.error ||
      error?.message ||
      'Failed to create booking request';
    showError(t('toast.getBookingRequestFailed'), message);
    throw new Error(message);
  }
};
