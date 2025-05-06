import { configureStore } from "@reduxjs/toolkit";
import isAuthReducer from "./features/isAuthSlice";

export const store = configureStore({
  reducer: {
    isAuth: isAuthReducer,
  },
});
