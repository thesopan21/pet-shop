import { fetchPaginatedPets } from "@/services/api";
import { Pet, PetCategory } from "@/types/pet";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface PetState {
  pets: Pet[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isSubmitting: boolean;
  isFetchingRandomImage: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  totalPets: number;
}

const initialState: PetState = {
  pets: [],
  isLoading: false,
  isLoadingMore: false,
  isSubmitting: false,
  isFetchingRandomImage: false,
  error: null,
  currentPage: 0,
  hasMore: true,
  totalPets: 0,
};

// Async thunk for fetching pets
export const fetchPets = createAsyncThunk(
  'pets/fetchPets',
  async ({
    page = 1,
    limit = 10,
    category,
    searchQuery
  }: {
    page?: number;
    limit?: number;
    category?: PetCategory;
    searchQuery?: string;
  }) => {
    const response = await fetchPaginatedPets(page, limit, category, searchQuery);
    return response;
  }
);

const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.unshift(action.payload);
      state.totalPets += 1;
    },
    removePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter((pet) => pet.id !== action.payload);
      state.totalPets -= 1;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const pet = state.pets.find((p) => p.id === action.payload);
      if (pet) {
        pet.isFavorite = !pet.isFavorite;
      }
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setIsFetchingRandomImage: (state, action: PayloadAction<boolean>) => {
      state.isFetchingRandomImage = action.payload;
    },
    resetPets: (state) => {
      state.pets = [];
      state.currentPage = 0;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pets
      .addCase(fetchPets.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.isLoading = true;
          state.error = null;
        } else {
          state.isLoadingMore = true;
        }
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;

        if (action.payload.page === 1) {
          state.pets = action.payload.pets;
        } else {
          state.pets = [...state.pets, ...action.payload.pets];
        }

        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
        state.totalPets = action.payload.totalPets;
        state.error = null;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.error.message || 'Failed to fetch pets';
      });
  },
});

export const selectPets = (state: RootState) => state.pets.pets;
export const selectIsLoading = (state: RootState) => state.pets.isLoading;
export const selectIsLoadingMore = (state: RootState) => state.pets.isLoadingMore;
export const selectIsSubmitting = (state: RootState) => state.pets.isSubmitting;
export const selectIsFetchingRandomImage = (state: RootState) => state.pets.isFetchingRandomImage;
export const selectError = (state: RootState) => state.pets.error;
export const selectCurrentPage = (state: RootState) => state.pets.currentPage;
export const selectHasMore = (state: RootState) => state.pets.hasMore;
export const selectTotalPets = (state: RootState) => state.pets.totalPets;

export const {
  addPet,
  removePet,
  toggleFavorite,
  setIsSubmitting,
  setIsFetchingRandomImage,
  resetPets
} = petSlice.actions;
export default petSlice.reducer;