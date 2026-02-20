# Pet Shop - Technical Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     React Native App                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Pets      │  │   Add Pet   │  │    Cart     │     │
│  │   Screen    │  │   Screen    │  │   Screen    │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                 │                 │             │
│         └─────────────────┼─────────────────┘             │
│                           │                               │
│                  ┌────────▼────────┐                      │
│                  │  Zustand Store  │                      │
│                  │  (Global State) │                      │
│                  └────────┬────────┘                      │
│                           │                               │
│                  ┌────────▼────────┐                      │
│                  │  API Services   │                      │
│                  └────────┬────────┘                      │
│                           │                               │
├───────────────────────────┼───────────────────────────────┤
│                           │                               │
│        ┌──────────────────┴──────────────────┐            │
│        │                                     │            │
│   ┌────▼─────┐                        ┌─────▼──────┐     │
│   │ ReqRes   │                        │  Dog CEO   │     │
│   │   API    │                        │    API     │     │
│   └──────────┘                        └────────────┘     │
│   (Submit Pet)                        (Random Images)    │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### 1. Adding a Pet

```
User Input → Form Validation (Zod) → API Service → ReqRes API
                    ↓
              Error/Success
                    ↓
            Zustand Store Update
                    ↓
            UI Re-render (Pet List)
                    ↓
            Toast Notification
```

### 2. Adding to Cart

```
User Tap "Add to Cart" → Zustand Store → Update Cart State
                              ↓
                     Cart Badge Update
                              ↓
                     Toast Notification
```

### 3. Image Upload Flow

```
User Choice → Permission Request → Image Picker/Camera/API
                     ↓
              Local URI/Remote URL
                     ↓
              Image Preview
                     ↓
              Form State Update
```

## State Management Architecture

### Zustand Store Structure

```typescript
PetStore {
  // Data
  pets: Pet[]           // All pets in the shop
  cart: CartItem[]      // Shopping cart items
  
  // UI State
  isSubmitting: boolean
  isFetchingRandomImage: boolean
  error: string | null
  
  // Actions
  addPet()
  addToCart()
  removeFromCart()
  clearCart()
  getCartTotal()
  getCartItemsCount()
  setIsSubmitting()
  setIsFetchingRandomImage()
  setError()
}
```

### Why Zustand?

**Pros**:
- ✅ Simple API (no boilerplate)
- ✅ Small bundle size (~1KB)
- ✅ TypeScript support
- ✅ No Provider wrapper
- ✅ Direct component access
- ✅ Easy to test

**Comparison**:
```
Redux:     ~15KB + middleware
MobX:      ~16KB + decorators
Context:   Built-in but verbose
Zustand:   ~1KB minimal setup
```

## Component Architecture

### Component Hierarchy

```
App (_layout.tsx)
├── Toast Provider
└── Tab Navigator (_layout.tsx in (tabs))
    ├── Pets Screen (index.tsx)
    │   └── PetCard (reusable)
    │       └── Button (reusable)
    ├── Add Pet Screen (add-pet.tsx)
    │   ├── Input (reusable)
    │   └── Button (reusable)
    └── Cart Screen (cart.tsx)
        ├── CartItemCard (reusable)
        └── Button (reusable)
```

### Reusability Strategy

**Atomic Design Principles**:
1. **Atoms**: Button, Input (basic UI elements)
2. **Molecules**: PetCard, CartItemCard (composed elements)
3. **Organisms**: Forms, Lists (complex components)
4. **Templates**: Screen layouts
5. **Pages**: Actual screens

## Navigation Architecture

### File-Based Routing (Expo Router)

```
app/
├── _layout.tsx              # Root layout
└── (tabs)/                  # Tab group
    ├── _layout.tsx          # Tab navigator
    ├── index.tsx            # /         (Pets)
    ├── add-pet.tsx          # /add-pet  (Add Pet)
    └── cart.tsx             # /cart     (Cart)
```

**Benefits**:
- File system = Route structure
- Type-safe navigation
- Deep linking support
- SEO friendly (web)

## API Service Layer

### Service Architecture

```typescript
// services/api.ts
export const submitPetDetails = async (data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
```

**Benefits**:
- Centralized API calls
- Consistent error handling
- Easy to mock for testing
- Type-safe responses
- Single source of truth

## Form Validation Architecture

### Zod Schema Validation

```typescript
// validation/pet-schema.ts
export const petSchema = z.object({
  name: z.string().min(2).max(50),
  breed: z.string().min(2).max(50),
  age: z.number().min(0).max(30),
  price: z.number().min(1).max(1000000),
  imageUri: z.string().min(1),
});
```

**Validation Flow**:
```
User Input → Real-time Validation → Error State
                    ↓
            Display Inline Errors
                    ↓
           Submit Validation
                    ↓
         API Call (if valid)
```

## Performance Optimizations

### 1. Component Memoization
```typescript
// Avoid unnecessary re-renders
const MemoizedPetCard = React.memo(PetCard);
```

### 2. Zustand Selectors
```typescript
// Only re-render when specific data changes
const cart = usePetStore(state => state.cart);
```

### 3. Lazy Loading
```typescript
// Load screens on demand
const CartScreen = lazy(() => import('./cart'));
```

### 4. Image Optimization
```typescript
// expo-image with caching
<Image cachePolicy="memory-disk" />
```

## Security Considerations

### Current Implementation
- ✅ Client-side validation
- ✅ HTTPS API calls
- ✅ Permission handling
- ⚠️ No authentication
- ⚠️ No data encryption
- ⚠️ No input sanitization

### Production Requirements
- 🔒 JWT authentication
- 🔒 Secure token storage
- 🔒 Input sanitization
- 🔒 Rate limiting
- 🔒 HTTPS only
- 🔒 Content Security Policy

## Error Handling Strategy

### Layered Error Handling

```
1. API Service Layer
   ↓ (Catch & Format)
2. Store Layer
   ↓ (Set Error State)
3. Component Layer
   ↓ (Display Toast)
4. User Sees Friendly Message
```

### Error Types

```typescript
// Network Error
try {
  await api.call();
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle network/API errors
  }
}

// Validation Error
try {
  schema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
  }
}
```

## Testing Strategy

### Test Pyramid

```
        E2E Tests
           /\
          /  \
         /    \
    Integration
        /\
       /  \
      /    \
   Unit Tests
```

**Recommended Tools**:
- **Unit**: Jest + React Native Testing Library
- **Integration**: Jest + MSW (Mock Service Worker)
- **E2E**: Detox or Maestro

### Example Tests

```typescript
// Store test
describe('PetStore', () => {
  it('should add pet to cart', () => {
    const store = usePetStore.getState();
    store.addToCart(mockPet);
    expect(store.cart.length).toBe(1);
  });
});

// Component test
describe('PetCard', () => {
  it('should call onAddToCart when button pressed', () => {
    const onAddToCart = jest.fn();
    render(<PetCard pet={mockPet} onAddToCart={onAddToCart} />);
    fireEvent.press(screen.getByText('Add to Cart'));
    expect(onAddToCart).toHaveBeenCalledWith(mockPet);
  });
});
```

## Deployment Architecture

### Development
```
Local → Expo Go App (instant preview)
```

### Staging
```
Local → EAS Build → TestFlight/Internal Testing
```

### Production
```
Local → EAS Build → App Store / Play Store
```

### Over-The-Air (OTA) Updates
```
Code Change → EAS Update → Users receive instantly
(No app store review needed for JS changes)
```

## Scalability Considerations

### Current Limitations
- Single device storage (no sync)
- No pagination
- Memory-only cart
- No offline support

### Scaling Solutions

**Backend**:
- Add real database (PostgreSQL)
- Implement pagination
- Add caching (Redis)
- Use CDN for images

**Frontend**:
- AsyncStorage for persistence
- React Query for server state
- Virtual lists for large datasets
- Background sync

**Infrastructure**:
- Deploy backend to AWS/GCP
- Use CloudFront for assets
- Implement monitoring (Sentry)
- Add analytics (Firebase)

## Code Quality Tools

### Linting & Formatting
```json
{
  "eslint": "Code quality",
  "prettier": "Code formatting",
  "typescript": "Type checking"
}
```

### Pre-commit Hooks
```bash
# .husky/pre-commit
npm run lint
npm run typecheck
npm test
```

## Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Firebase Analytics
- **Performance**: Firebase Performance
- **Crash Reporting**: Firebase Crashlytics

### Key Metrics to Track
- App launch time
- Screen load time
- API response time
- Error rates
- User engagement
- Cart abandonment rate

## Future Architecture Improvements

1. **Backend Integration**: Real database and API
2. **Authentication**: User accounts with Firebase Auth
3. **Real-time Updates**: WebSockets or Firebase Realtime DB
4. **Offline Support**: AsyncStorage + sync queue
5. **Image CDN**: Cloudinary or AWS S3
6. **Push Notifications**: Expo Notifications
7. **Payment Integration**: Stripe SDK
8. **Search/Filter**: Elasticsearch or Algolia
9. **Admin Dashboard**: Web admin panel
10. **Analytics Dashboard**: Business intelligence

---

This architecture is designed to be:
- ✅ Maintainable
- ✅ Scalable  
- ✅ Testable
- ✅ Type-safe
- ✅ Developer-friendly
