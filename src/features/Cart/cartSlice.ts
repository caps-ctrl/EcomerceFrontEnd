import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "@/app/store/store";

const apiUrl = import.meta.env.VITE_API_URL; // <-- zmienna środowiskowa

// --- Typy ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

interface CartState {
  cart: CartItem[];
  status: "idle" | "loading" | "failed";
}

// --- Initial State ---
const initialState: CartState = {
  cart: [],
  status: "idle",
};

// --- Async Thunks ---
export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState }
>("cart/fetchCart", async (_, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.get(`${apiUrl}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const addToCartBackend = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number },
  { state: RootState }
>("cart/addToCartBackend", async ({ productId, quantity }, { getState }) => {
  const token = getState().auth.token;
  const res = await axios.post(
    `${apiUrl}/api/cart/add`,
    { productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
});

export const removeFromCartBackend = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("cart/removeFromCartBackend", async (productId, { getState }) => {
  const token = getState().auth.token;
  await axios.delete(`${apiUrl}/api/cart/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return productId;
});

export const decreaseQuantityBackend = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number },
  { state: RootState }
>(
  "cart/decreaseQuantityBackend",
  async ({ productId, quantity }, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.post(
      `${apiUrl}/api/cart/decrease`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

export const increaseQuantityBackend = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number },
  { state: RootState }
>(
  "cart/increaseQuantityBackend",
  async ({ productId, quantity }, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.post(
      `${apiUrl}/api/cart/increase`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

export const clearCartBackend = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("cart/clearCartBackend", async (_, { getState }) => {
  const token = getState().auth.token;
  await axios.delete(`${apiUrl}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
});

// --- Slice ---
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.cart = action.payload;
          state.status = "idle";
        }
      )
      .addCase(fetchCart.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(
        addToCartBackend.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const item = state.cart.find(
            (i) => i.productId === action.payload.productId
          );
          if (item) {
            item.quantity = action.payload.quantity; // backend zwraca aktualną ilość
          } else {
            state.cart.push(action.payload);
          }
        }
      )
      .addCase(
        removeFromCartBackend.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.cart = state.cart.filter((i) => i.productId !== action.payload);
        }
      )
      .addCase(
        decreaseQuantityBackend.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const item = state.cart.find(
            (i) => i.productId === action.payload.productId
          );
          if (item) {
            if (action.payload.quantity <= 0) {
              state.cart = state.cart.filter(
                (i) => i.productId !== action.payload.productId
              );
            } else {
              item.quantity = action.payload.quantity;
            }
          }
        }
      )
      .addCase(
        increaseQuantityBackend.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const item = state.cart.find(
            (i) => i.productId === action.payload.productId
          );
          if (item) {
            item.quantity = action.payload.quantity;
          } else {
            state.cart.push(action.payload);
          }
        }
      )
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.cart = [];
      });
  },
});

export const selectCart = (state: RootState) => state.cart.cart;
export default cartSlice.reducer;
