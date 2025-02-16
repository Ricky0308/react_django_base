import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string | null;
  email: string | null;
  username: string | null;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer 