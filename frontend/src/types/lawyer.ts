export interface Lawyer {
  id: number;
  user_id: number;
  name: string;
  bio: string;
  years_experience: number;
  price_per_session_cents: number;
  currency: string;
  province: string;
  rating_avg: number;
  rating_count: number;
  imageUri: string;
  updated_at: string;
}

export interface LawyerState {
  lawyers: Lawyer[];
  isLoading: boolean;
  error: string | null;
}
