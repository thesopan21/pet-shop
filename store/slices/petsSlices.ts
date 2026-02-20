import { Pet } from "@/types/pet";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface PetState {
  pets: Pet[];
  isSubmitting: boolean;
  isFetchingRandomImage: boolean;
}

const initialState: PetState = {
  pets: [],
  isSubmitting: false,
  isFetchingRandomImage: false,
};

const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    removePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter((pet) => pet.id !== action.payload);
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setIsFetchingRandomImage: (state, action: PayloadAction<boolean>) => {
      state.isFetchingRandomImage = action.payload;
    },
  },
});

export const selectPets = (state: RootState) => state.pets.pets;
export const selectIsSubmitting = (state: RootState) => state.pets.isSubmitting;
export const selectIsFetchingRandomImage = (state: RootState) => state.pets.isFetchingRandomImage;

export const { addPet, removePet, setIsSubmitting, setIsFetchingRandomImage } = petSlice.actions;
export default petSlice.reducer;