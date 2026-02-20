import { PaginatedPetsResponse, Pet, PetCategory, PetFormData } from '@/types/pet';
import axios from 'axios';

const API_BASE_URL = 'https://reqres.in/api';
const DOG_API_URL = 'https://dog.ceo/api';

export interface RandomDogImageResponse {
  message: string;
  status: string;
}

// Mock pet data for demonstration
const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Cooper',
    breed: 'Golden Retriever',
    age: 0.17, // 2 months in years
    price: 800,
    imageUri: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800',
    createdAt: new Date().toISOString(),
    category: 'dog',
    status: 'available',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Siamese Cat',
    age: 0.25, // 3 months
    price: 450,
    imageUri: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
    createdAt: new Date().toISOString(),
    category: 'cat',
    status: 'available',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Rio',
    breed: 'Macaw Parrot',
    age: 0.5, // 6 months
    price: 1200,
    imageUri: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800',
    createdAt: new Date().toISOString(),
    category: 'bird',
    status: 'new-arrival',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Max',
    breed: 'Labrador',
    age: 1,
    price: 950,
    imageUri: 'https://images.unsplash.com/photo-1534351450181-ea9f78427fe8?w=800',
    createdAt: new Date().toISOString(),
    category: 'dog',
    status: 'available',
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Bella',
    breed: 'Persian Cat',
    age: 0.33, // 4 months
    price: 650,
    imageUri: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    createdAt: new Date().toISOString(),
    category: 'cat',
    status: 'new-arrival',
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Charlie',
    breed: 'Beagle',
    age: 0.5,
    price: 700,
    imageUri: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800',
    createdAt: new Date().toISOString(),
    category: 'dog',
    status: 'available',
    isFavorite: false,
  },
  {
    id: '7',
    name: 'Milo',
    breed: 'British Shorthair',
    age: 0.42, // 5 months
    price: 550,
    imageUri: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=800',
    createdAt: new Date().toISOString(),
    category: 'cat',
    status: 'available',
    isFavorite: false,
  },
  {
    id: '8',
    name: 'Rocky',
    breed: 'German Shepherd',
    age: 0.67, // 8 months
    price: 1100,
    imageUri: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
    createdAt: new Date().toISOString(),
    category: 'dog',
    status: 'available',
    isFavorite: false,
  },
];

/**
 * Fetch paginated pets list
 * Simulates API call with pagination, filtering, and search
 */
export const fetchPaginatedPets = async (
  page: number = 1,
  limit: number = 10,
  category?: PetCategory,
  searchQuery?: string
): Promise<PaginatedPetsResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filteredPets = [...MOCK_PETS];

  // Filter by category
  if (category && category !== 'other') {
    filteredPets = filteredPets.filter(pet => pet.category === category);
  }

  // Filter by search query
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPets = filteredPets.filter(
      pet =>
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query)
    );
  }

  const totalPets = filteredPets.length;
  const totalPages = Math.ceil(totalPets / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPets = filteredPets.slice(startIndex, endIndex);

  return {
    pets: paginatedPets,
    page,
    totalPages,
    totalPets,
    hasMore: page < totalPages,
  };
};

/**
 * Submit pet details to the mock API
 * POST https://reqres.in/api/users
 */
export const submitPetDetails = async (petData: PetFormData): Promise<Pet> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      name: petData.name,
      breed: petData.breed,
      age: petData.age,
      price: petData.price,
      imageUri: petData.imageUri,
      category: petData.category,
    });

    // reqres.in returns id and createdAt, we merge with our data
    return {
      ...petData,
      id: response.data.id,
      createdAt: response.data.createdAt,
      status: 'new-arrival', // New pets are marked as new arrivals
      isFavorite: false,
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
