export interface Document {
  id: string;
  code: string;
  title: string;
  description: string;
  sumary: string;
  category: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}
