export interface Lawyer {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  phone_number: string;
  website_url: string;
  office_address: string;
  speaking_languages: string[];
  image_url?: string;
  education?: string;
  current_level?: string;
  years_of_experience?: number;
  average_rating?: number;
  create_at?: string;
  updated_at?: string;
}

export interface LawyerState {
  lawyers: Lawyer[];
  isLoading: boolean;
  error: string | null;
}
