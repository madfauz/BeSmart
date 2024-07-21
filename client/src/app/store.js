import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import tokenReducer from "../features/tokenSlice";
import accessClassReducer from "../features/accessClassSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    token: tokenReducer,
    accessClass: accessClassReducer,
  },
});
