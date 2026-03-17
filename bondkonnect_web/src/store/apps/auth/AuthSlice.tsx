import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userRole: string; 
  user: UserData | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userRole: '',
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Set the primary role if available
      if (action.payload.roles && action.payload.roles.length > 0) {
        state.userRole = action.payload.roles[0].role_name;
      }
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.userRole = '';
      state.isAuthenticated = false;
    },
    clearUserRole: (state) => {
      state.userRole = '';
    },
  },
});

export const { setUser, setUserRole, logout, clearUserRole } = authSlice.actions;
export default authSlice.reducer;
