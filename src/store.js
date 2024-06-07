import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./slices/authSlice";
import questionReducer from "./slices/questionSlice";
import rankingReducer from "./slices/rankingSlice";
import passwordReducer from "./slices/passwordSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    question: questionReducer,
    ranking: rankingReducer,
    password: passwordReducer,
  },
});