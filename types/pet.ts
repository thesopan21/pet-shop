export type PetCategory = 'dog' | 'cat' | 'bird' | 'other';
export type PetStatus = 'available' | 'new-arrival' | 'sold';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  imageUri: string;
  createdAt: string;
  category: PetCategory;
  status: PetStatus;
  isFavorite?: boolean;
}

export interface CartItem {
  pet: Pet;
  quantity: number;
}

export interface PetFormData {
  name: string;
  breed: string;
  age: number;
  price: number;
  imageUri: string;
  category: PetCategory;
}

export interface PaginatedPetsResponse {
  pets: Pet[];
  page: number;
  totalPages: number;
  totalPets: number;
  hasMore: boolean;
}
