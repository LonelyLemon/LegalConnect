import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LawyerState } from '../types/lawyer';
import { getPopularLawyers } from '../services/lawyer';

const InitialState: LawyerState = {
  lawyers: [],
  isLoading: false,
  error: null,
};

export const fetchPopularLawyers = createAsyncThunk(
  'lawyer/fetchPopularLawyers',
  async () => {
    const response = await getPopularLawyers();
    return response;
  },
);

export const lawyerSlice = createSlice({
  name: 'lawyer',
  initialState: InitialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPopularLawyers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPopularLawyers.fulfilled, (state, action) => {
        state.lawyers = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchPopularLawyers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectLawyers = (state: { lawyer: LawyerState }) =>
  state.lawyer.lawyers;
export const selectIsLoading = (state: { lawyer: LawyerState }) =>
  state.lawyer.isLoading;
export const selectError = (state: { lawyer: LawyerState }) =>
  state.lawyer.error;
export const lawyerReducer = lawyerSlice.reducer;
export const lawyerActions = lawyerSlice.actions;
