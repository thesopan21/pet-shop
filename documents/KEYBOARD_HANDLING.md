# Keyboard Handling with react-native-keyboard-controller

This document explains the keyboard handling implementation in the Pet Shop app using `react-native-keyboard-controller`.

## Why react-native-keyboard-controller?

### Advantages over Built-in APIs

**react-native-keyboard-controller** offers:

1. **Consistency**: Same behavior across iOS and Android
2. **Performance**: Better than `KeyboardAvoidingView` 
3. **Smooth Animations**: Native-feeling keyboard transitions
4. **Minimal Configuration**: Works out of the box
5. **Rich Features**: More options than built-in APIs

### Comparison

| Feature | KeyboardAvoidingView | react-native-keyboard-controller |
|---------|---------------------|----------------------------------|
| Cross-platform consistency | ❌ Varies | ✅ Consistent |
| Animation smoothness | ⚠️ Sometimes janky | ✅ Native smooth |
| Auto-scroll to input | ❌ Manual | ✅ Automatic |
| Performance | ⚠️ Can lag | ✅ Optimized |
| Configuration | 🔧 Complex | ✅ Simple |

## Implementation

### 1. Root Layout Setup

The `KeyboardProvider` wraps the entire app in `app/_layout.tsx`:

```tsx
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  return (
    <KeyboardProvider>
      {/* Rest of the app */}
    </KeyboardProvider>
  );
}
```

### 2. KeyboardAwareScrollView

In screens with forms (like `app/(tabs)/add-pet.tsx`):

```tsx
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function AddPetScreen() {
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        {/* Form content */}
      </KeyboardAwareScrollView>
    </View>
  );
}
```

### 3. Enhanced Input Component

The `Input` component uses `forwardRef` to enable keyboard navigation:

```tsx
import { forwardRef } from 'react';

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, onSubmit, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        returnKeyType={onSubmit ? 'next' : 'done'}
        onSubmitEditing={onSubmit}
        blurOnSubmit={!onSubmit}
        {...props}
      />
    );
  }
);
```

### 4. Smart Input Navigation

In forms, inputs are connected for seamless navigation:

```tsx
const breedInputRef = useRef<TextInput>(null);
const ageInputRef = useRef<TextInput>(null);
const priceInputRef = useRef<TextInput>(null);

<Input
  label="Pet Name"
  returnKeyType="next"
  onSubmit={() => breedInputRef.current?.focus()}
/>

<Input
  ref={breedInputRef}
  label="Breed"
  returnKeyType="next"
  onSubmit={() => ageInputRef.current?.focus()}
/>

<Input
  ref={ageInputRef}
  label="Age"
  returnKeyType="next"
  onSubmit={() => priceInputRef.current?.focus()}
/>

<Input
  ref={priceInputRef}
  label="Price"
  returnKeyType="done"
  onSubmit={handleSubmit}
/>
```

## Features Enabled

### 1. Auto-Scroll to Focused Input
When a user taps an input, the screen automatically scrolls to keep it visible above the keyboard.

### 2. Smooth Keyboard Animations
The keyboard appears and disappears with native smooth animations that match the platform's expectations.

### 3. Keyboard Navigation
Users can:
- Press **"Next"** to move to the next input field
- Press **"Done"** on the last field to submit the form
- Navigate through the form without touching the screen

### 4. Consistent Behavior
Works identically on:
- iOS Simulator
- iOS Physical Device
- Android Emulator
- Android Physical Device

## Configuration Options

### KeyboardAwareScrollView Props

```tsx
<KeyboardAwareScrollView
  bottomOffset={20}              // Space below focused input
  extraKeyboardSpace={20}        // Extra space above keyboard
  disableScrollOnKeyboardHide    // Disable auto-scroll when keyboard hides
  enabled={true}                 // Enable/disable the component
/>
```

### Input Return Key Types

```typescript
returnKeyType: 
  | 'done'      // Shows "Done" button
  | 'go'        // Shows "Go" button
  | 'next'      // Shows "Next" button (moves to next field)
  | 'search'    // Shows "Search" button
  | 'send'      // Shows "Send" button
```

## Best Practices

### 1. Always Use KeyboardProvider
Wrap your app root with `KeyboardProvider` for it to work:

```tsx
<KeyboardProvider>
  <App />
</KeyboardProvider>
```

### 2. Use KeyboardAwareScrollView for Forms
Replace `ScrollView` + `KeyboardAvoidingView` with:

```tsx
<KeyboardAwareScrollView>
  {/* form content */}
</KeyboardAwareScrollView>
```

### 3. Connect Inputs with Refs
Create a smooth flow between inputs:

```tsx
const input2Ref = useRef<TextInput>(null);

<Input
  returnKeyType="next"
  onSubmit={() => input2Ref.current?.focus()}
/>
<Input ref={input2Ref} />
```

### 4. Set Appropriate Return Key Types
- Use `"next"` for fields with more inputs below
- Use `"done"` for the last field
- Use `"search"` for search inputs
- Use `"send"` for message inputs

### 5. Handle Submit on Last Field
The last input can trigger form submission:

```tsx
<Input
  returnKeyType="done"
  onSubmit={handleSubmit}
/>
```

## Troubleshooting

### Issue: Keyboard doesn't dismiss
**Solution**: Use `Keyboard.dismiss()` from React Native:

```tsx
import { Keyboard } from 'react-native';

const dismissKeyboard = () => {
  Keyboard.dismiss();
};
```

### Issue: ScrollView doesn't scroll to input
**Solution**: Ensure `KeyboardProvider` wraps your app root.

### Issue: Input refs not working
**Solution**: Make sure Input component uses `forwardRef`:

```tsx
export const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  return <TextInput ref={ref} {...props} />;
});
```

## Performance Considerations

### Optimizations

1. **Use `bottomOffset`**: Reduces unnecessary scrolling
2. **Disable scroll on hide**: Set `disableScrollOnKeyboardHide={true}` if not needed
3. **Memoize callbacks**: Use `useCallback` for onSubmit handlers

### Example

```tsx
const handleNext = useCallback(() => {
  nextInputRef.current?.focus();
}, []);

<Input onSubmit={handleNext} />
```

## Related Documentation

- [Expo Keyboard Controller Docs](https://docs.expo.dev/versions/latest/sdk/keyboard-controller/)
- [react-native-keyboard-controller GitHub](https://github.com/kirillzyusko/react-native-keyboard-controller)

## Summary

The keyboard controller provides:
- ✅ Better UX with smooth animations
- ✅ Consistent cross-platform behavior  
- ✅ Auto-scroll to focused inputs
- ✅ Smart keyboard navigation
- ✅ Minimal configuration needed
- ✅ Native performance

This makes forms feel more polished and professional, matching user expectations from native apps.
