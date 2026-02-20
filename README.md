# 🐾 Pet Shop Mobile App

A full-featured React Native mobile application for managing a pet shop, built with Expo. Users can upload pet details with images, browse available pets, manage a shopping cart, and complete purchases.

## 📱 Platform Support

- ✅ **iOS** (Simulator & Device)
- ✅ **Android** (Emulator & Device)
- ✅ **Web** (Progressive Web App)

Built with **Expo SDK 54** and **React Native 0.81.5**

## ✨ Features

### Core Functionality

1. **Pet Image Upload**
   - Upload images from Camera or Gallery
   - Fetch random dog images from external API
   - Real-time image preview before submission
   - Permission handling for camera and media library

2. **Pet Details Form**
   - Pet Name (Required, 2-50 characters)
   - Breed (Required, 2-50 characters)
   - Age (Required, 0-30 years)
   - Price (Required, $1-$1,000,000)
   - Real-time form validation using Zod
   - Clear error messages for validation failures

3. **Pet Listing**
   - Card-based UI with pet images
   - Display pet details (name, breed, age, price)
   - Add to cart functionality from listing
   - Empty state when no pets available

4. **Shopping Cart**
   - Add multiple pets to cart
   - Quantity tracking per pet
   - Remove individual items
   - Clear entire cart
   - Real-time total calculation
   - Cart badge showing item count
   - Checkout functionality

5. **API Integration**
   - Submit pet details: `POST https://reqres.in/api/users`
   - Fetch random dog images: `GET https://dog.ceo/api/breeds/image/random`
   - Error handling with user-friendly messages
   - Loading states during API calls

6. **State Management**
   - Global state with Zustand
   - Persistent cart across screens
   - Loading and error states
   - Optimistic UI updates

7. **UI/UX Features**
   - Toast notifications for user feedback
   - Loading indicators during async operations
   - Form validation with inline error messages
   - **Enhanced keyboard handling** with smooth animations
   - **Smart input navigation** - Press "Next" to move between fields
   - **Auto-scroll to focused input** when keyboard appears
   - Haptic feedback on tab navigation
   - Responsive design for different screen sizes
   - Clean and modern UI with consistent styling

## 🏗️ Architecture Overview

### Project Structure

```
pet-shop/
├── app/                          # Expo Router file-based navigation
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Pet Listing screen (Home)
│   │   ├── add-pet.tsx          # Add Pet form screen
│   │   └── cart.tsx             # Shopping cart screen
│   └── _layout.tsx              # Root layout with providers
├── components/                   # Reusable components
│   ├── ui/                      # UI primitives
│   │   ├── button.tsx           # Custom button component
│   │   └── input.tsx            # Form input component
│   ├── pet-card.tsx             # Pet display card
│   └── cart-item-card.tsx       # Cart item display
├── store/                       # State management
│   └── pet-store.ts             # Zustand store (pets & cart)
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

The app uses **Zustand** for global state management, providing:
- Simple, hook-based API
- No boilerplate compared to Redux
- Excellent TypeScript support
- Small bundle size (~1KB)
- No context provider wrapper needed

**Store Structure:**
```typescript
{
  pets: Pet[],              // All added pets
  cart: CartItem[],         // Shopping cart items
  isSubmitting: boolean,    // Form submission state
  isFetchingRandomImage: boolean,  // Image fetch state
  error: string | null      // Error messages
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
- **zustand** (^5.0.3) - Global state management
  - Chosen for simplicity and TypeScript support
  - No Provider wrapper needed
  - Minimal boilerplate

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
  - Customizable notifications
  - Queue management
  - Smooth animations

### Navigation & Icons
- **@react-navigation/native** (^7.1.8) - Navigation foundation
- **@expo/vector-icons** (^15.0.3) - Icon library

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

### Adding a New Pet

1. Navigate to **"Add Pet"** tab
2. Tap the image placeholder to select an image:
   - **Camera**: Take a new photo
   - **Gallery**: Choose from existing photos
   - **Random Dog**: Fetch a random dog image from API
3. Fill in the required fields:
   - Pet Name
   - Breed
   - Age (in years)
   - Price (in dollars)
4. Tap **"Submit Pet Details"**
5. Pet will be added to the listing and you'll see a success toast

### Browsing Pets

1. Navigate to **"Pets"** tab (Home)
2. Scroll through the list of available pets
3. Each card shows:
   - Pet image
   - Name and breed
   - Age
   - Price
4. Tap **"Add to Cart"** to add a pet to your cart

### Managing Cart

1. Navigate to **"Cart"** tab
2. View all items in your cart with:
   - Pet details
   - Quantity
   - Individual and total prices
3. **Remove items**: Tap the trash icon
4. **Clear cart**: Tap "Clear All" in header
5. **Checkout**: Tap "Proceed to Checkout"

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

- **Components**: Reusable UI components in `/components`
- **Screens**: Page-level components in `/app`
- **Services**: API calls and external services in `/services`
- **Store**: State management in `/store`
- **Types**: TypeScript interfaces in `/types`
- **Validation**: Form schemas in `/validation`

### Adding New Features

1. Define TypeScript types in `/types`
2. Create validation schema in `/validation` (if needed)
3. Add state management in `/store` (if needed)
4. Create API service functions in `/services` (if needed)
5. Build UI components in `/components`
6. Create screen in `/app`

## 🎨 Design Decisions

### Why Zustand over Redux?
- **Simplicity**: No actions, reducers, or dispatch needed
- **Performance**: Minimal re-renders with selector-based subscriptions
- **Bundle Size**: ~1KB vs Redux's ~15KB
- **TypeScript**: Better type inference out of the box
- **Learning Curve**: Easier for new developers

### Why Zod over Yup?
- **Type Safety**: Better TypeScript integration
- **Modern API**: More intuitive schema definition
- **Performance**: Faster validation
- **Bundle Size**: Smaller footprint
- **Active Development**: Better maintained

### Why Expo over React Native CLI?
- **Easy Setup**: No native configuration needed
- **OTA Updates**: Update app without app store approval
- **Cross-Platform**: Write once, run on iOS, Android, and Web
- **Rich Ecosystem**: Pre-built modules for common features
- **Development Speed**: Faster iteration with Expo Go

## 🐛 Known Issues & Limitations

1. **Image Upload**: Currently uses local URIs. In production, images should be uploaded to a CDN/cloud storage.
2. **Cart Persistence**: Cart state is lost on app reload. Consider adding AsyncStorage for persistence.
3. **Authentication**: No user authentication implemented.
4. **Payment**: Checkout is simulated, no real payment integration.

## 🚀 Future Enhancements

- [ ] Persistent cart with AsyncStorage
- [ ] User authentication (Firebase Auth)
- [ ] Real payment integration (Stripe)
- [ ] Pet search and filtering
- [ ] Favorite pets feature
- [ ] Push notifications
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Pet categories and breeds autocomplete
- [ ] Image upload to cloud storage (Cloudinary/AWS S3)
- [ ] Order history
- [ ] Pet details screen with more information

## 📄 License

This project is part of a coding challenge assignment.

## 👤 Author

Built as part of the Pet Shop Mobile App Challenge.

## 🙏 Acknowledgments

- **Dog CEO API** (https://dog.ceo/dog-api/) - For random dog images
- **Reqres.in** (https://reqres.in/) - For mock API endpoints
- **Expo Team** - For the amazing development framework
- **Zustand Team** - For the simple state management solution

