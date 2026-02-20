# Development Guide - Pet Shop App

## Quick Start for Developers

### Initial Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd pet-shop
npm install

# 2. Start development
npm start

# 3. Run on platform
# Press 'i' for iOS, 'a' for Android, 'w' for Web
```

## Project Checklist

### ✅ Completed Features

- [x] **Pet Image Upload**
  - Camera integration
  - Gallery picker
  - Random dog image API
  - Image preview

- [x] **Form Validation**
  - Zod schema validation
  - Real-time error messages
  - Required field validation
  - Type-safe forms

- [x] **API Integration**
  - POST pet details to ReqRes.in
  - GET random images from Dog CEO API
  - Error handling
  - Loading states

- [x] **Pet Listing**
  - Card-based UI
  - Image display
  - Pet information
  - Add to cart button

- [x] **Shopping Cart**
  - Add items
  - Remove items
  - Clear cart
  - Total calculation
  - Quantity tracking

- [x] **State Management**
  - Zustand store
  - Global state
  - Cart persistence (memory)
  - Loading indicators

- [x] **UI/UX**
  - Toast notifications
  - Loading indicators
  - Error messages
  - Empty states
  - Cart badge

- [x] **TypeScript**
  - Full type coverage
  - Interface definitions
  - Type-safe API calls

- [x] **Code Quality**
  - Reusable components
  - Clean architecture
  - ESLint configuration

## File Overview

### Key Files to Understand

| File | Purpose | Importance |
|------|---------|------------|
| `store/pet-store.ts` | Global state management | ⭐⭐⭐ |
| `services/api.ts` | API calls and error handling | ⭐⭐⭐ |
| `validation/pet-schema.ts` | Form validation rules | ⭐⭐⭐ |
| `app/(tabs)/add-pet.tsx` | Pet form with validation | ⭐⭐ |
| `app/(tabs)/index.tsx` | Pet listing screen | ⭐⭐ |
| `app/(tabs)/cart.tsx` | Shopping cart | ⭐⭐ |
| `components/pet-card.tsx` | Reusable pet card | ⭐ |
| `components/ui/button.tsx` | Reusable button | ⭐ |
| `components/ui/input.tsx` | Reusable input | ⭐ |

## Common Development Tasks

### Adding a New Field to Pet Form

1. **Update Type** (`types/pet.ts`)
```typescript
export interface Pet {
  // ... existing fields
  color?: string; // Add new field
}
```

2. **Update Validation** (`validation/pet-schema.ts`)
```typescript
export const petSchema = z.object({
  // ... existing fields
  color: z.string().optional(),
});
```

3. **Update Form** (`app/(tabs)/add-pet.tsx`)
```tsx
const [color, setColor] = useState('');

<Input
  label="Color"
  value={color}
  onChangeText={setColor}
  error={errors.color}
/>
```

4. **Update API Call**
```typescript
const petData = {
  name,
  breed,
  age: parseFloat(age),
  price: parseFloat(price),
  imageUri,
  color, // Include new field
};
```

### Adding a New Screen

1. **Create File** in `app/(tabs)/`
```typescript
// app/(tabs)/favorites.tsx
export default function FavoritesScreen() {
  return <View><Text>Favorites</Text></View>;
}
```

2. **Update Navigation** (`app/(tabs)/_layout.tsx`)
```tsx
<Tabs.Screen
  name="favorites"
  options={{
    title: 'Favorites',
    tabBarIcon: ({ color }) => <IconSymbol name="heart.fill" color={color} />,
  }}
/>
```

### Adding State to Store

1. **Update Store** (`store/pet-store.ts`)
```typescript
interface PetStore {
  favorites: Pet[];
  addToFavorites: (pet: Pet) => void;
}

export const usePetStore = create<PetStore>((set) => ({
  favorites: [],
  addToFavorites: (pet) => set((state) => ({
    favorites: [...state.favorites, pet],
  })),
}));
```

2. **Use in Component**
```typescript
const { favorites, addToFavorites } = usePetStore();

<Button
  title="Add to Favorites"
  onPress={() => addToFavorites(pet)}
/>
```

## Debugging Tips

### Common Issues

**Issue: "Cannot find module '@/...'"**
```bash
# Solution: Check tsconfig.json has correct paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Issue: Image not showing**
```typescript
// Check URI format
console.log('Image URI:', imageUri);
// Should start with 'file://' for local or 'https://' for remote
```

**Issue: Form not validating**
```typescript
// Add console.log to see validation errors
try {
  petSchema.parse(data);
} catch (error) {
  console.log('Validation errors:', error.errors);
}
```

**Issue: Store not updating**
```typescript
// Check if you're using the setter correctly
const addPet = usePetStore(state => state.addPet); // Correct
// Not: const { addPet } = usePetStore(); // May cause issues
```

### Debugging Tools

```typescript
// 1. Console logging
console.log('Store state:', usePetStore.getState());

// 2. React DevTools
// Install: npm install -g react-devtools
// Run: react-devtools

// 3. Expo DevTools
// Press 'd' in terminal to open

// 4. Network debugging
// Use Reactotron or Flipper
```

## Testing

### Unit Tests

```typescript
// Example: Testing store
import { renderHook, act } from '@testing-library/react-hooks';
import { usePetStore } from '@/store/pet-store';

test('should add pet to cart', () => {
  const { result } = renderHook(() => usePetStore());
  
  act(() => {
    result.current.addToCart(mockPet);
  });
  
  expect(result.current.cart).toHaveLength(1);
});
```

### Component Tests

```typescript
// Example: Testing button
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/button';

test('calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <Button title="Click Me" onPress={onPress} />
  );
  
  fireEvent.press(getByText('Click Me'));
  expect(onPress).toHaveBeenCalled();
});
```

## Performance Tips

### 1. Optimize Images
```typescript
// Use expo-image for better performance
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUri }}
  cachePolicy="memory-disk" // Enable caching
  contentFit="cover"
/>
```

### 2. Memoize Components
```typescript
import { memo } from 'react';

export const PetCard = memo(({ pet, onAddToCart }) => {
  // Component code
}, (prevProps, nextProps) => {
  return prevProps.pet.id === nextProps.pet.id;
});
```

### 3. Use Zustand Selectors
```typescript
// Only re-render when cart changes
const cart = usePetStore(state => state.cart);

// Instead of:
const { cart, pets, error } = usePetStore(); // Re-renders for any state change
```

### 4. Virtual Lists
```typescript
// For large lists, use FlashList
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={pets}
  renderItem={renderItem}
  estimatedItemSize={200}
/>
```

## Code Style Guide

### Naming Conventions

```typescript
// Components: PascalCase
export function PetCard() {}

// Hooks: camelCase with 'use' prefix
export function usePetData() {}

// Constants: UPPER_SNAKE_CASE
const MAX_PRICE = 1000000;

// Variables: camelCase
const petName = 'Max';

// Types/Interfaces: PascalCase
interface Pet {}
type CartItem = {};
```

### File Organization

```
component-name/
  ├── index.tsx           # Component code
  ├── styles.ts           # Styles
  ├── types.ts            # Local types
  └── __tests__/          # Tests
      └── index.test.tsx
```

### Import Order

```typescript
// 1. React & React Native
import React from 'react';
import { View, Text } from 'react-native';

// 2. External libraries
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// 3. Internal imports
import { usePetStore } from '@/store/pet-store';
import { Button } from '@/components/ui/button';
import { Pet } from '@/types/pet';

// 4. Relative imports
import { styles } from './styles';
```

## Git Workflow

### Branch Naming
```
feature/pet-search
bugfix/cart-total-calculation
hotfix/image-upload-crash
chore/update-dependencies
```

### Commit Messages
```
feat: add search functionality to pet listing
fix: correct cart total calculation
chore: update dependencies to latest versions
docs: add API documentation
style: format code with prettier
refactor: simplify cart logic
test: add unit tests for pet store
```

### Pre-commit Checklist
- [ ] No console.logs left
- [ ] No TypeScript errors
- [ ] Code formatted
- [ ] Tests pass
- [ ] No unused imports

## Environment Variables

Create `.env` file:
```env
EXPO_PUBLIC_API_BASE_URL=https://reqres.in/api
EXPO_PUBLIC_DOG_API_URL=https://dog.ceo/api
```

Access in code:
```typescript
const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
```

## Useful Commands

```bash
# Development
npm start              # Start Expo dev server
npm run ios            # Run on iOS
npm run android        # Run on Android
npm run web            # Run on web

# Building
npx expo prebuild      # Generate native folders
eas build              # Build with EAS

# Code Quality
npm run lint           # Run ESLint
npm run type-check     # Run TypeScript check
npm run format         # Format with Prettier

# Cleanup
rm -rf node_modules    # Remove dependencies
npm install            # Reinstall

npx expo start -c      # Clear cache and start
```

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear React Native cache
npx react-native start --reset-cache

# Clear Expo cache
npx expo start -c

# Clear watchman
watchman watch-del-all
```

### iOS Issues
```bash
# Clear iOS build
cd ios && pod deintegrate && pod install
cd .. && npm run ios

# Reset simulator
xcrun simctl erase all
```

### Android Issues
```bash
# Clear Android build
cd android && ./gradlew clean
cd .. && npm run android

# Reset emulator
emulator -avd <device-name> -wipe-data
```

## Resources

### Documentation
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Zod Docs](https://zod.dev/)

### Communities
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://www.reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

### Tools
- [Expo Snack](https://snack.expo.dev/) - Online playground
- [React Native Directory](https://reactnative.directory/) - Package search
- [Can I Use](https://caniuse.com/) - Web compatibility

## Next Steps

1. **Add Tests**: Write unit and integration tests
2. **Add Persistence**: Use AsyncStorage for cart
3. **Add Authentication**: Implement user login
4. **Add Search**: Search and filter pets
5. **Add Analytics**: Track user behavior
6. **Optimize Performance**: Profile and optimize
7. **Add CI/CD**: Automated testing and deployment

---

Happy coding! 🚀
