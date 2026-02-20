import { create } from 'zustand';
import { Pet, CartItem } from '@/types/pet';

interface PetStore {
  // Pets state
  pets: Pet[];
  addPet: (pet: Pet) => void;
  
  // Cart state
  cart: CartItem[];
  addToCart: (pet: Pet) => void;
  removeFromCart: (petId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  
  // Loading states
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isFetchingRandomImage: boolean;
  setIsFetchingRandomImage: (value: boolean) => void;
  
  // Error states
  error: string | null;
  setError: (error: string | null) => void;
}

export const usePetStore = create<PetStore>((set, get) => ({
  // Initial state
  pets: [],
  cart: [],
  isSubmitting: false,
  isFetchingRandomImage: false,
  error: null,

  // Pet actions
  addPet: (pet) => set((state) => ({
    pets: [pet, ...state.pets],
  })),

  // Cart actions
  addToCart: (pet) => set((state) => {
    const existingItem = state.cart.find((item) => item.pet.id === pet.id);
    
    if (existingItem) {
      return {
        cart: state.cart.map((item) =>
          item.pet.id === pet.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    
    return {
      cart: [...state.cart, { pet, quantity: 1 }],
    };
  }),

  removeFromCart: (petId) => set((state) => ({
    cart: state.cart.filter((item) => item.pet.id !== petId),
  })),

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    const state = get();
    return state.cart.reduce(
      (total, item) => total + item.pet.price * item.quantity,
      0
    );
  },

  getCartItemsCount: () => {
    const state = get();
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Loading actions
  setIsSubmitting: (value) => set({ isSubmitting: value }),
  setIsFetchingRandomImage: (value) => set({ isFetchingRandomImage: value }),

  // Error actions
  setError: (error) => set({ error }),
}));
