import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import AuthReducer  from "./apps/auth/AuthSlice";
import  CustomizerReducer  from "./apps/customizer/CustomizerSlice";
import PaymentReducer from "./apps/payment/PaymentSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    customizer: CustomizerReducer,
    payment: PaymentReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

const rootReducer = combineReducers({
  auth: AuthReducer,
      customizer: CustomizerReducer,
      payment: PaymentReducer,
  });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
