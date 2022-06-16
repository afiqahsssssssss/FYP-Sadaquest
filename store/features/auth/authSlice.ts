import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { FIREBASE_WEB_API_KEY } from '@env';
import { User } from '../../../types/user';

export interface AuthState {
  user: User | undefined;
  error: string | undefined;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: undefined,
  error: undefined,
  isLoggedIn: false,
  isLoading: false,
};

interface AuthData {
  email: string;
  password: string;
}

export const login = createAsyncThunk<User, AuthData>('auth/login', async (loginData) => {
  try {
    const { data } = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
      {
        email: loginData.email,
        password: loginData.password,
        returnSecureToken: true,
      }
    );

    return {
      token: data.idToken,
      id: data.localId,
      email: data.email,
    };
  } catch (err) {
    const message: 'EMAIL_NOT_FOUND' | 'INVALID_PASSWORD' = err.response.data.error.message;

    if (message === 'EMAIL_NOT_FOUND') {
      throw new Error('Email not found');
    } else if (message === 'INVALID_PASSWORD') {
      throw new Error('Invalid password');
    }

    throw new Error('Something went wrong. Please try again');
  }
});

export const signup = createAsyncThunk<User, AuthData>('auth/signup', async (loginData) => {
  try {
    const { data } = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_WEB_API_KEY}`,
      {
        email: loginData.email,
        password: loginData.password,
        returnSecureToken: true,
      }
    );

    return {
      token: data.idToken,
      id: data.localId,
      email: data.email,
    };
  } catch (err) {
    const message: 'EMAIL_EXISTS' = err.response.data.error.message;

    if (message === 'EMAIL_EXISTS') {
      throw new Error('Email already exists');
    }

    throw new Error('Something went wrong. Please try again');
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = undefined;
      state.isLoggedIn = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.user = undefined;
      state.error = action.error.message;
      state.isLoggedIn = false;
    });
    builder.addCase(signup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = undefined;
      state.isLoggedIn = true;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;
      state.user = undefined;
      state.error = action.error.message;
      state.isLoggedIn = false;
    });
  },
});

export const authActions = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
