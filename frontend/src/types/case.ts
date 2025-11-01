export type CaseStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Case {
  id: string;
  booking_request_id: string;
  lawyer_id: string;
  client_id: string;
  title: string;
  description: string;
  state: CaseStatus;
  attachment_urls: string[];
  lawyer_note: string;
  client_note: string;
  started_at: string;
  ending_time: string;
  create_at: string;
  updated_at: string;
}

export interface CaseState {
  cases: Case[];
  isLoading: boolean;
  error: string | null;
  currentCase: Case | null;
}
