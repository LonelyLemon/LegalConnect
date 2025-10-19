import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentState } from '../types/document';
import {
  getDocumentByCategory,
  getDocumentById,
  getDocumentByPage,
  getPopularDocuments,
} from '../services/document';

const InitialState: DocumentState = {
  documents: [],
  isLoading: false,
  error: null,
};

export const fetchDocumentsByCategory = createAsyncThunk(
  'document/fetchDocumentsByCategory',
  async (category: string) => {
    try {
      const response = await getDocumentByCategory(category);
      return response;
    } catch (error) {
      throw error;
    }
  },
);
export const fetchDocumentsByPage = createAsyncThunk(
  'document/fetchDocumentsByPage',
  async (page: number) => {
    try {
      const response = await getDocumentByPage(page);
      return response;
    } catch (error) {
      throw error;
    }
  },
);
export const fetchDocumentById = createAsyncThunk(
  'document/fetchDocumentById',
  async (id: string) => {
    try {
      const response = await getDocumentById(id);
      return response;
    } catch (error) {
      throw error;
    }
  },
);

export const fetchPopularDocuments = createAsyncThunk(
  'document/fetchPopularDocuments',
  async () => {
    const response = await getPopularDocuments();
    console.log('response: ', response);
    return response;
  },
);

export const documentSlice = createSlice({
  name: 'document',
  initialState: InitialState,
  reducers: {
    setDocuments: (
      state: DocumentState,
      action: PayloadAction<DocumentState>,
    ) => {
      state.documents = action.payload.documents;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDocumentsByCategory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentsByCategory.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchDocumentsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDocumentsByPage.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentsByPage.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchDocumentsByPage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDocumentById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPopularDocuments.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPopularDocuments.fulfilled, (state, action) => {
        console.log('action.payload: ', action.payload);
        state.documents = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchPopularDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const documentReducer = documentSlice.reducer;
export const documentActions = documentSlice.actions;
export const selectDocuments = (state: { document: DocumentState }) =>
  state.document.documents;
export const selectIsLoading = (state: { document: DocumentState }) =>
  state.document.isLoading;
export const selectError = (state: { document: DocumentState }) =>
  state.document.error;
