import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import passwordServices from "../services/passwordServices";

const initialState = {
  email: null,
  error: false,
  successEmail: false,
  successCode: false,
  successNewPassword: false,
  loading: false,
}

export const sendCodeToEmail = createAsyncThunk(
  "password/sendCodeToEmail",
  async (email, thunkAPI) => {
    try {
      const data = await passwordServices.sendCodeToEmail(email);
      console.log(data)
      if(data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      return data;

    } catch (error) {
      console.log(error);
    }
  }
);

export const verificationCode = createAsyncThunk(
  "password/verificationCode",
  async ({ code, email }, thunkAPI) => {
    try {
      const data = await passwordServices.verificationCode({ code, email});

      if(data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      return data;

    } catch (error) {
      console.log(error);
    }
  }
);

export const changePassword = createAsyncThunk(
  "password/changePassword",
  async ({ password, email }, thunkAPI) => {
    try {
      const data = await passwordServices.changePassword({ password, email});

      if(data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      return data;

    } catch (error) {
      console.log(error);
    }
  }
);

export const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.successEmail = false;
      state.successCode = false;
      state.successNewPassword = false;
    },
    saveEmail: (state, action) => {
      state.email = action.payload;
    },
    resetEmail: (state) => {
      state.email = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendCodeToEmail.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(sendCodeToEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.successEmail = true;
      })
      .addCase(sendCodeToEmail.rejected, (state) => {
        state.loading = false;
        state.error = { 
          message: "O e-mail inserido não foi encontrado em nossa base de dados"
        };
      })
      .addCase(verificationCode.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(verificationCode.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.successCode = true;
      })
      .addCase(verificationCode.rejected, (state) => {
        state.loading = false;
        state.error = { 
          message: "Código inválido"
        };
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.successNewPassword = true;
      })
      .addCase(changePassword.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
  }
});

export const { reset, saveEmail, resetEmail } = passwordSlice.actions
export default passwordSlice.reducer;