export interface ChatbotMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  confidence?: number;
  suggestions?: string[];
  links?: string[];
}

export interface ChatbotState {
  messages: ChatbotMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

export interface LegalAIQueryRequest {
  question: string;
  session_id?: string;
}

export interface RelatedQuestion {
  question: string;
  score: number;
}

export interface LegalAIResponse {
  answer: string;
  confidence: number;
  is_fallback: boolean;
  suggestions: RelatedQuestion[];
  links: string[];
  disclaimer: string;
  model_id: string;
  model_version: string;
  latency_ms: number;
  asked_at: string;
}
