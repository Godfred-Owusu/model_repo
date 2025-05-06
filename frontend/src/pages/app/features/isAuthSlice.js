import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
};

const isAuthSlice = createSlice({
  name: "isAuth",
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
  },
});

export const { setIsAuth } = isAuthSlice.actions;
export default isAuthSlice.reducer;
