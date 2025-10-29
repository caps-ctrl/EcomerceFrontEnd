import productsReducer from "../../features/products/productsSlice";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../features/Cart/cartSlice";
import authReducer from "../../features/Auth/authSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
