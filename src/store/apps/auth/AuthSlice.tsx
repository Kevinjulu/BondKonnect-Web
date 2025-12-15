import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userRole: string; 
}

const initialState: AuthState = {
  userRole: '', // Set default role (can be updated after login
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
    },
    clearUserRole: (state) => {
      state.userRole = '';
    },
  },
});

export const { setUserRole, clearUserRole } = authSlice.actions;
export default authSlice.reducer;
