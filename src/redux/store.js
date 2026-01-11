import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    auth: authReducer,
  },
});
