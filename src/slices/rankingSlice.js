import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import rankingServices from "../services/rankingServices";

const initialState = {
  ranking: [],
  error: false,
  success: false,
  loading: false,
};

export const getRanking = createAsyncThunk(
  "ranking/getRanking",
  async(thunkAPI) => {
    try {
      const userData = JSON.parse(localStorage.getItem("data"));

      const data = await rankingServices.getRanking(userData.token.value);

      if(data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      return data;

    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const rankingSlice = createSlice({
  name: "ranking",
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
      .addCase(getRanking.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getRanking.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.ranking = action.payload
      })
      .addCase(getRanking.rejected, (state) => {
        state.loading = false;
        state.error = true;
        state.success = false;
      })
  }
});

export const { reset } = rankingSlice.actions;
export default rankingSlice.reducer;