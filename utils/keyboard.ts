import { Keyboard } from 'react-native';

/**
 * Keyboard utility functions for the app
 * Using react-native-keyboard-controller for better cross-platform keyboard handling
 */

/**
 * Dismiss the keyboard programmatically
 */
export const dismissKeyboard = () => {
  Keyboard.dismiss();
};

/**
 * Keyboard configuration constants for KeyboardAwareScrollView
 */
export const KEYBOARD_CONFIG = {
  // Bottom offset for KeyboardAwareScrollView (space below focused input)
  SCROLL_BOTTOM_OFFSET: 20,
  
  // Extra keyboard space for better UX
  EXTRA_KEYBOARD_SPACE: 20,
  
  // Disable scroll on keyboard hide
  DISABLE_SCROLL_ON_HIDE: false,
};
