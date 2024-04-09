import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authServices";

const user = JSON.parse(localStorage.getItem("data"));

const initialState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ nickname, email, password }, thunkAPI) => {
    try {
      const data = await authService.register({ nickname, email, password });

      if(data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      return data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

  }
);

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

export const logout = createAsyncThunk(
  "auth/logout",
  async () => {
    await authService.logout();
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
        state.success = {
          message: "Usuário cadastrado com sucesso!"
        };
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.error = { 
          message: "Desculpe, o usuário que você está tentando cadastrar já existe em nosso sistema. Por favor, tente novamente com um Nickname ou E-mail diferente."
        };
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
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = {
          message: "E-mail ou senhas inválidas. Por favor, tente novamente."
        };
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = null;
      });
  }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;