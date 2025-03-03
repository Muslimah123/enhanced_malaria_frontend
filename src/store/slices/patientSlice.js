import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    fetchPatientsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPatientsSuccess: (state, action) => {
      state.loading = false;
      state.patients = action.payload;
    },
    fetchPatientsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPatient: (state, action) => {
      state.patients.push(action.payload);
    },
  },
});

export const { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure, addPatient } = patientSlice.actions;

export default patientSlice.reducer;