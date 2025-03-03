import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  diagnoses: [],
  loading: false,
  error: null,
};

const diagnosisSlice = createSlice({
  name: 'diagnosis',
  initialState,
  reducers: {
    fetchDiagnosesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDiagnosesSuccess: (state, action) => {
      state.loading = false;
      state.diagnoses = action.payload;
    },
    fetchDiagnosesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addDiagnosis: (state, action) => {
      state.diagnoses.push(action.payload);
    },
  },
});

export const { fetchDiagnosesStart, fetchDiagnosesSuccess, fetchDiagnosesFailure, addDiagnosis } = diagnosisSlice.actions;

export default diagnosisSlice.reducer;