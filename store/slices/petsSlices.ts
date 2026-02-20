import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Pet {
  message: string;
  status: string;
}

interface PetState {
  pet: Pet | null;
  isFetchingRandomImage: boolean;
}

const initialState: PetState = {
  pet: null,
  isFetchingRandomImage: false,
};

const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

  }
});

export const selectPets = (state: RootState) => state.pets;
export const { } = petSlice.actions;
export default petSlice.reducer;