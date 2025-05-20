import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import prosReducer from './slices/prosSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    pros: prosReducer,
  },
});

export default store;
