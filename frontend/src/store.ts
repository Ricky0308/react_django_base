import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import { localStorageMiddleware } from './middleware/localStorageMiddleware'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 