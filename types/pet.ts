export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  imageUri: string;
  createdAt: string;
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
}
