import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CaseState, Case } from '../types/case';
import { getUserCase } from '../services/case';
import { AxiosError } from 'axios';

const initialState: CaseState = {
  cases: [],
  isLoading: false,
  error: null,
  currentCase: null,
};

export const fetchUserCases = createAsyncThunk(
  'case/fetchUserCases',
  async (_, thunkApi) => {
    try {
      const response = await getUserCase();
      return response;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const data: any = error.response?.data;
        const message =
          data?.message ||
          data?.detail ||
          data?.error ||
          error.message ||
          'Fetch cases failed';
        return thunkApi.rejectWithValue(message);
      }
      return thunkApi.rejectWithValue(error?.message || 'Fetch cases failed');
    }
  },
);

export const caseSlice = createSlice({
  name: 'case',
  initialState,
  reducers: {
    setCurrentCase: (state, action: { payload: Case | null }) => {
      state.currentCase = action.payload;
    },
    clearCases: state => {
      state.cases = [];
      state.currentCase = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserCases.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserCases.fulfilled, (state, action) => {
        // Handle both array and single object responses
        if (Array.isArray(action.payload)) {
          state.cases = action.payload;
        } else {
          state.cases = [action.payload];
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserCases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const caseReducer = caseSlice.reducer;
export const caseActions = caseSlice.actions;

// Selectors
export const selectCases = (state: { case: CaseState }) => state.case.cases;
export const selectIsLoading = (state: { case: CaseState }) =>
  state.case.isLoading;
export const selectError = (state: { case: CaseState }) => state.case.error;
export const selectCurrentCase = (state: { case: CaseState }) =>
  state.case.currentCase;
export const selectCaseById = (state: { case: CaseState }, id: string) =>
  state.case.cases.find(c => c.id === id);
