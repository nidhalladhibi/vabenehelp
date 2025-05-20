import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  professionals: [],
  loading: false,
  error: null,
};

const prosSlice = createSlice({
  name: 'pros',
  initialState,
  reducers: {
    fetchProsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProsSuccess: (state, action) => {
      state.loading = false;
      state.professionals = action.payload;
    },
    fetchProsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchProsStart, fetchProsSuccess, fetchProsFailure } = prosSlice.actions;

export default prosSlice.reducer;
