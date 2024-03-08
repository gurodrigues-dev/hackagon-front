import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authServices";

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async ({ nickname, email, password }, thunkAPI) => {
    try {
      const data = await authService.register({ nickname, email, password });

      return data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

  }
);

// Sign in an user
export const login = createAsyncThunk(
  "auth/login",
  async ({ nickname, password }, thunkAPI) => {
    try {
      const data = await authService.login({ nickname, password });

      if(data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      return data;

    } catch (error) {
      console.log(error)
    }

  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });
  }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;