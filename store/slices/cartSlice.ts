import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Pet, CartItem } from "@/types/pet";

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Pet>) => {
      const existingItem = state.cart.find(
        (item) => item.pet.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ pet: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(
        (item) => item.pet.id !== action.payload
      );
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ petId: string; quantity: number }>
    ) => {
      const { petId, quantity } = action.payload;

      if (quantity <= 0) {
        state.cart = state.cart.filter((item) => item.pet.id !== petId);
      } else {
        const item = state.cart.find((item) => item.pet.id === petId);
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartTotal = (state: RootState) =>
  state.cart.cart.reduce(
    (total, item) => total + item.pet.price * item.quantity,
    0
  );
export const selectCartItemsCount = (state: RootState) =>
  state.cart.cart.reduce((count, item) => count + item.quantity, 0);

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
