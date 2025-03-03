import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import diagnosisReducer from './slices/diagnosisSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    diagnosis: diagnosisReducer,
  },
});