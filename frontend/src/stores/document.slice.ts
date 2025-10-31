import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentState } from '../types/document';
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentByCategory,
  getDocumentById,
  getDocumentByPage,
  getPopularDocuments,
  updateDocument,
} from '../services/document';
import { File } from '../components/common/filePicker';
const InitialState: DocumentState = {
  documents: [],
  isLoading: false,
  error: null,
};

export const fetchDocuments = createAsyncThunk(
  'document/fetchDocuments',
  async (_, thunkApi) => {
    try {
      const response = await getAllDocuments();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tải danh sách các tài liệu. Vui lòng thử lại sau.',
      );
    }
  },
);
export const fetchDocumentsByCategory = createAsyncThunk(
  'document/fetchDocumentsByCategory',
  async (category: string, thunkApi) => {
    try {
      const response = await getDocumentByCategory(category);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tải danh sách các tài liệu theo danh mục. Vui lòng thử lại sau.',
      );
    }
  },
);
export const fetchDocumentsByPage = createAsyncThunk(
  'document/fetchDocumentsByPage',
  async (page: number, thunkApi) => {
    try {
      const response = await getDocumentByPage(page);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tải danh sách các tài liệu theo trang. Vui lòng thử lại sau.',
      );
    }
  },
);
export const fetchDocumentById = createAsyncThunk(
  'document/fetchDocumentById',
  async (id: string, thunkApi) => {
    try {
      const response = await getDocumentById(id);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tải tài liệu theo id. Vui lòng thử lại sau.',
      );
    }
  },
);

export const fetchPopularDocuments = createAsyncThunk(
  'document/fetchPopularDocuments',
  async (_, thunkApi) => {
    try {
      const response = await getPopularDocuments();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tải danh sách các tài liệu phổ biến. Vui lòng thử lại sau.',
      );
    }
  },
);

export const addDocument = createAsyncThunk(
  'document/addDocument',
  async ({ title, document }: { title: string; document: File }, thunkApi) => {
    try {
      const response = await createDocument({
        title,
        document,
      });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tạo tài liệu. Vui lòng thử lại sau.',
      );
    }
  },
);

export const updateDoc = createAsyncThunk(
  'document/updateDocument',
  async (
    { id, title, document }: { id: string; title: string; document: File },
    thunkApi,
  ) => {
    try {
      const response = await updateDocument(id, {
        title,
        document,
      });
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi cập nhật tài liệu. Vui lòng thử lại sau.',
      );
    }
  },
);

export const deleteDoc = createAsyncThunk(
  'document/deleteDoc',
  async ({ id }: { id: string }, thunkApi) => {
    try {
      const response = await deleteDocument(id);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi xóa tài liệu. Vui lòng thử lại sau.',
      );
    }
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
      })
      .addCase(addDocument.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDoc.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDoc.fulfilled, (state, action) => {
        const existingIndex = state.documents.findIndex(
          document => document.id === action.payload.id,
        );
        if (existingIndex !== -1) {
          state.documents[existingIndex] = action.payload;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateDoc.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDoc.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDoc.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          document => document.id !== action.payload.id,
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteDoc.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDocuments.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
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
