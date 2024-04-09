import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import questionServices from "../services/questionServices";

const initialState = {
  question: null,
  error: false,
  success: false,
  loading: false,
};

export const getQuestion = createAsyncThunk(
  "question/getQuestion",
  async(thunkAPI) => {
    try {
      const userData = JSON.parse(localStorage.getItem("data"));

      const data = await questionServices.getQuestion(userData.token.value);
      
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

export const createQuestion = createAsyncThunk(
  "question/create",
  async(dataQuestion, thunkAPI) => {
    try {
      const data = await questionServices.createQuestion(dataQuestion);
      if(data.error) {
        return thunkAPI.rejectWithValue(data.error);
      }

      return data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    } 
  }
);


export const questionSlice = createSlice({
  name: "question",
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
      .addCase(getQuestion.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.question = action.payload
      })
      .addCase(getQuestion.rejected, (state) => {
        state.loading = false;
        state.error = true;
        state.success = false;
      })
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(createQuestion.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(createQuestion.rejected, (state) => {
        state.loading = false;
        state.error = true;
        state.success = false;
      });
  }
});

export const { reset } = questionSlice.actions;
export default questionSlice.reducer;