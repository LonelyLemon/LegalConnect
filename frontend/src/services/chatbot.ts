import axios from 'axios';
import { LegalAIQueryRequest, LegalAIResponse } from '../types/chatbot';
import { showError } from '../types/toast';
import { t } from '../i18n';

export const sendChatbotMessage = async (
  question: string,
  sessionId?: string,
): Promise<LegalAIResponse> => {
  try {
    const payload: LegalAIQueryRequest = {
      question,
    };

    if (sessionId) {
      payload.session_id = sessionId;
    }

    const response = await axios.post('/legal-ai/query', payload);
    console.log('Chatbot response:', response.data);
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Failed to send message';
    showError(t('toast.chatbotError'), message);
    throw new Error(message);
  }
};

export const checkChatbotHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get('/legal-ai/health');
    return response.status === 200;
  } catch (error) {
    console.error('Chatbot health check failed:', error);
    return false;
  }
};
