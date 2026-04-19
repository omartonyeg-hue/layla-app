import { useEffect, useRef } from 'react';
import { Animated, Easing, Keyboard, Platform, type KeyboardEvent } from 'react-native';

// Track the keyboard's visible height, animated in lock-step with the OS.
//
// Why not KeyboardAvoidingView? On iOS with QuickType / autocorrect enabled,
// KAV's internal height measurement under-reports by the suggestion strip
// height, so sticky footers (like a comment composer) end up partially
// clipped. Reading `e.endCoordinates.height` off the keyboard events gives us
// the real visible frame including QuickType.
//
// Returns an Animated.Value you can interpolate or plug straight into a
// `paddingBottom` / `bottom` on an Animated.View. When the keyboard is
// closed the value is 0; when open it's the keyboard's full frame height.
export const useKeyboardHeight = () => {
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      Animated.timing(height, {
        toValue: e.endCoordinates.height,
        duration: e.duration ?? 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };
    const onHide = (e: KeyboardEvent) => {
      Animated.timing(height, {
        toValue: 0,
        duration: e.duration ?? 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };

    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvt, onShow);
    const hideSub = Keyboard.addListener(hideEvt, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [height]);

  return height;
};
