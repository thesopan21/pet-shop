import axios from 'axios';
import { PetFormData } from '@/types/pet';

const API_BASE_URL = 'https://reqres.in/api';
const DOG_API_URL = 'https://dog.ceo/api';

export interface SubmitPetResponse {
  id: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  imageUri: string;
  createdAt: string;
}

export interface RandomDogImageResponse {
  message: string;
  status: string;
}

/**
 * Submit pet details to the mock API
 * POST https://reqres.in/api/users
 */
export const submitPetDetails = async (petData: PetFormData): Promise<SubmitPetResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      name: petData.name,
      breed: petData.breed,
      age: petData.age,
      price: petData.price,
      imageUri: petData.imageUri,
    });

    // reqres.in returns id and createdAt, we merge with our data
    return {
      ...petData,
      id: response.data.id,
      createdAt: response.data.createdAt,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to submit pet details');
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Fetch random dog image
 * GET https://dog.ceo/api/breeds/image/random
 */
export const fetchRandomDogImage = async (): Promise<string> => {
  try {
    const response = await axios.get<RandomDogImageResponse>(`${DOG_API_URL}/breeds/image/random`);
    
    if (response.data.status === 'success') {
      return response.data.message;
    }
    
    throw new Error('Failed to fetch random dog image');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch random dog image');
    }
    throw new Error('An unexpected error occurred');
  }
};
