export interface Document {
  id: string;
  display_name: string;
  original_filename: string;
  content_type: string;
  uploaded_by_id: string;
  create_at: string;
  updated_at: string;
  file_url: string;
}

export interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}
