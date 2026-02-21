# 🐾 Pet Shop Mobile App

A modern React Native pet adoption app built with Expo. Browse pets, discover random dogs, manage your cart, and adopt your perfect furry friend!

## 📱 Platform Support

- ✅ **iOS** (Simulator & Device)
- ✅ **Android** (Emulator & Device)
- ✅ **Web** (Progressive Web App)

Built with **Expo SDK 54** and **React Native 0.81.5**

## ✨ Features

### Core Functionality

1. **Pet Listing (Home)**
   - Browse available pets with pagination
   - Filter by category (Dogs, Cats, All)
   - Real-time search functionality
   - Pull-to-refresh support
   - Add to cart from listing
   - Favorite pets toggle
   - Cart badge with item count
   - Navigate to cart screen

2. **Pet Discovery (Explore)**
   - Discover random dogs with a single tap
   - Real-time integration with Dog CEO API
   - Beautiful card-based UI
   - Add to favorites
   - Save pets for later
   - Share pets with friends
   - Quick add to cart
   - Auto-extract breed from API

3. **Add Pet Form**
   - Upload images from Camera or Gallery
   - Fetch random dog images from API
   - Pet Name, Breed, Age, Price fields
   - Real-time form validation using Zod
   - Enhanced keyboard handling
   - Smart input navigation
   - Auto-scroll to focused input

4. **Shopping Cart**
   - Accessible from home screen
   - View all cart items with details
   - Remove individual items with confirmation
   - Real-time total calculation
   - Checkout functionality
   - Empty state messaging

5. **State Management**
   - Redux Toolkit for predictable state
   - RTK Query for API caching
   - Persistent cart across screens
   - Optimized re-renders

6. **UI/UX Features**
   - Toast notifications for user feedback
   - Loading states with skeletons
   - Pull-to-refresh on listings
   - Haptic feedback on interactions
   - Responsive design
   - Clean and modern UI

## 🏗️ Architecture Overview

### Project Structure

```
pet-shop/
├── app/                          # Expo Router file-based navigation
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Pet Listing screen (Home)
│   │   ├── add-pet.tsx          # Add Pet form screen
│   │   └── explore.tsx          # Pet Discovery screen
│   ├── cart.tsx                 # Shopping cart (Root level)
│   └── _layout.tsx              # Root layout with providers
├── components/                   # Reusable components
│   ├── ui/                      # UI primitives
│   │   ├── button.tsx           # Custom button component
│   │   ├── input.tsx            # Form input component
│   │   └── icon-symbol.tsx      # Cross-platform icons
│   ├── pet-card.tsx             # Pet display card
│   ├── cart-item-card.tsx       # Cart item display
│   └── haptic-tab.tsx           # Tab with haptic feedback
├── store/                       # Redux Toolkit state management
│   ├── store.ts                 # Redux store configuration
│   └── slices/                  # Redux slices
│       ├── petsSlices.ts        # Pets state & thunks
│       └── cartSlice.ts         # Cart state & actions
├── services/                    # API layer
│   └── api.ts                   # API service functions
├── types/                       # TypeScript definitions
│   └── pet.ts                   # Pet and Cart interfaces
├── validation/                  # Form validation schemas
│   └── pet-schema.ts            # Zod validation schema
└── constants/                   # App constants
    └── theme.ts                 # Theme configuration
```

### State Management Architecture

The app uses **Redux Toolkit** for predictable state management:
- Industry-standard solution
- Excellent DevTools support
- Built-in immer for immutable updates
- Redux Thunk for async actions
- TypeScript-first approach

**Store Structure:**
```typescript
// Pets Slice
{
  pets: Pet[],
  isLoading: boolean,
  isLoadingMore: boolean,
  currentPage: number,
  hasMore: boolean,
  totalPets: number
}

// Cart Slice
{
  items: CartItem[],
  total: number,
  itemsCount: number
}
```

### Form Validation Strategy

Using **Zod** for schema validation because:
- TypeScript-first design
- Runtime type checking
- Composable schemas
- Better error messages than Yup
- Smaller bundle size
- More modern API

## 🛠️ Libraries & Dependencies

### Core Dependencies
- **expo** (~54.0.33) - Development framework
- **react** (19.1.0) - UI library
- **react-native** (0.81.5) - Mobile framework
- **expo-router** (~6.0.23) - File-based navigation

### State Management
- **@reduxjs/toolkit** - Modern Redux with less boilerplate
- **react-redux** - React bindings for Redux
  - Industry standard and battle-tested
  - Excellent DevTools and debugging
  - Built-in TypeScript support
  - Immer for immutable updates

### Form Validation
- **zod** (^3.24.1) - Schema validation
  - TypeScript-first approach
  - Better type inference than alternatives
  - Modern and actively maintained

### API & Data
- **axios** (^1.7.9) - HTTP client
  - Better error handling than fetch
  - Request/response interceptors
  - Automatic JSON transformation

### Media & Images
- **expo-image-picker** (~16.0.9) - Camera & gallery access
  - Native image selection
  - Built-in cropping and quality settings
  - Permission handling

### Keyboard Handling
- **react-native-keyboard-controller** (latest) - Enhanced keyboard management
  - Consistent behavior across iOS and Android
  - Smooth keyboard animations
  - KeyboardAwareScrollView for auto-scrolling
  - Better performance than KeyboardAvoidingView
  - Native feel and responsiveness

### UI/UX
- **react-native-toast-message** (^2.2.1) - Toast notifications
- **react-native-safe-area-context** - Safe area handling
- **@expo/vector-icons** - Icon library
- **expo-symbols** - SF Symbols for iOS

### Navigation
- **@react-navigation/native** - Navigation foundation
- **expo-router** - File-based routing

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- iOS: Xcode 14+ (for iOS Simulator)
- Android: Android Studio with Android SDK (for Android Emulator)
- Expo Go app (for testing on physical devices)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

### Running on Different Platforms

#### iOS Simulator
```bash
npm run ios
# or press 'i' in the Expo CLI
```

#### Android Emulator
```bash
npm run android
# or press 'a' in the Expo CLI
```

#### Web Browser
```bash
npm run web
# or press 'w' in the Expo CLI
```

#### Physical Device
1. Install **Expo Go** from App Store or Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

## 📖 Usage Guide

### Browsing Pets (Home)

1. Navigate to **"Home"** tab
2. Browse available pets with pagination
3. Filter by category: All Pets, Dogs, or Cats
4. Tap cart icon (top-right) to view cart
5. Tap **"Add to Cart"** on any pet card
6. Pull down to refresh the listing

### Discovering Random Pets (Explore)

1. Navigate to **"Explore"** tab
2. View a random dog from Dog CEO API
3. Tap **"Fetch New Friend!"** to discover another
4. **Add to Favorites**: Tap the heart icon
5. **Save for Later**: Save pets to your list
6. **Share**: Share pet details with friends
7. **Add to Cart**: Quick add from explore screen

### Adding a New Pet

1. Navigate to **"Add Pet"** tab
2. Upload an image (Camera/Gallery/Random)
3. Fill in: Name, Breed, Age, Price
4. Tap **"Submit Pet Details"**
5. Pet appears in the home listing

### Managing Cart

1. Tap **cart icon** from Home screen
2. View all items with details
3. **Remove items**: Tap trash icon with confirmation
4. **Checkout**: Tap "Proceed to Checkout"
5. **Go Back**: Tap back arrow to return home

## 🔧 Development

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
```

### Code Structure Guidelines

- **Screens**: Page-level components in `/app`
- **Components**: Reusable UI in `/components`
- **Store**: Redux slices in `/store/slices`
- **Services**: API functions in `/services`
- **Types**: TypeScript interfaces in `/types`
- **Validation**: Zod schemas in `/validation`

### Adding New Features

1. Define TypeScript types in `/types`
2. Create Redux slice in `/store/slices` (if needed)
3. Add API service in `/services` (if needed)
4. Create validation schema in `/validation` (if needed)
5. Build UI components in `/components`
6. Create screen in `/app`

## 🎨 Design Decisions

### Why Redux Toolkit?
- **Industry Standard**: Widely adopted and supported
- **DevTools**: Excellent debugging with Redux DevTools
- **TypeScript**: First-class TypeScript support
- **Scalability**: Handles complex state requirements
- **Middleware**: Easy integration with thunks and sagas

### Why Expo Router?
- **File-based Routing**: Intuitive navigation structure
- **Type Safety**: Automatic route typing
- **Deep Linking**: Built-in support out of the box
- **Shared Routes**: Easy layouts and nested navigation

### Navigation Architecture
- **Cart as Root Screen**: Allows access from any screen
- **Tab Navigation**: Quick access to main features
- **Stack Navigation**: Natural back/forward flow

## 🐛 Known Issues & Limitations

1. **Cart Persistence**: Cart resets on app reload
2. **Authentication**: No user authentication
3. **Payment**: Simulated checkout only
4. **Image Storage**: Local URIs only

## 🚀 Future Enhancements

- [ ] Persistent cart with AsyncStorage/Redux Persist
- [ ] User authentication
- [ ] Payment gateway integration
- [ ] Advanced search and filters
- [ ] Favorites persistence
- [ ] Dark mode
- [ ] Push notifications
- [ ] Order history
- [ ] Pet detail screen
- [ ] Cloud image storage
- [ ] Cat API integration for Explore screen

## 📄 License

This project is part of a coding challenge assignment.

## 👤 Author

Built as part of the Pet Shop Mobile App Challenge.

## 🙏 Acknowledgments

- **Dog CEO API** (https://dog.ceo/dog-api/) - For random dog images
- **Reqres.in** (https://reqres.in/) - For mock API endpoints
- **Expo Team** - For the amazing development framework
- **Zustand Team** - For the simple state management solution

