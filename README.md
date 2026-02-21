#  Pet Shop Mobile App

A modern React Native pet adoption app built with Expo. Browse pets, discover random dogs, manage your cart, and adopt your perfect furry friend!

#### [Download APK for Android](https://drive.google.com/file/d/1HVU2cWINnpJpKMIezBEM9tMAt4mU9uIq/view?usp=sharing)

#### [Video Demo For IOS](https://drive.google.com/file/d/1E_i0WUb_Cp0Skib0TESowtYxQNfzvOre/view?usp=sharing)


## Project Structure

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

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- iOS: Xcode 14+ (for iOS Simulator)
- Android: Android Studio with Android SDK (for Android Emulator)
- Expo Go app (for testing on physical devices)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thesopan21/pet-shop.git
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
```

#### Android Emulator
```bash
npm run android
```

#### Physical Device
1. Install **Expo Go** from App Store or Play Store
2. Scan the QR code shown in terminal
3. App will load on your device


## Development

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

### Code Structure Guidelines

- **Screens**: Page-level components in `/app`
- **Components**: Reusable UI in `/components`
- **Store**: Redux slices in `/store/slices`
- **Services**: API functions in `/services`
- **Types**: TypeScript interfaces in `/types`
- **Validation**: Zod schemas in `/validation`


## Known Issues & Limitations

1. **Cart Persistence**: Cart resets on app reload
2. **Authentication**: No user authentication
3. **Payment**: Simulated checkout only
4. **Image Storage**: Local URIs only