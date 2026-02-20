import { z } from 'zod';

export const petSchema = z.object({
  name: z.string()
    .min(2, 'Pet name must be at least 2 characters')
    .max(50, 'Pet name must not exceed 50 characters'),
  breed: z.string()
    .min(2, 'Breed must be at least 2 characters')
    .max(50, 'Breed must not exceed 50 characters'),
  age: z.number()
    .min(0, 'Age must be a positive number')
    .max(30, 'Age must be less than 30 years'),
  price: z.number()
    .min(1, 'Price must be greater than 0')
    .max(1000000, 'Price seems too high'),
  imageUri: z.string()
    .min(1, 'Please select an image for your pet'),
  category: z.enum(['dog', 'cat', 'bird', 'other'], {
    message: 'Please select a pet category',
  }),
});

export type PetFormSchema = z.infer<typeof petSchema>;
