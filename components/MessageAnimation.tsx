import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/constants/design';

export const MessageAnimation = () => {
  const message1X = useSharedValue(-100);
  const message1Opacity = useSharedValue(0);
  
  const message2X = useSharedValue(100);
  const message2Opacity = useSharedValue(0);

  useEffect(() => {
    message1X.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }),
        withDelay(1000, withTiming(100, { duration: 1000, easing: Easing.in(Easing.exp) }))
      ),
      -1,
      true
    );
    message1Opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withDelay(2000, withTiming(0, { duration: 500 }))
      ),
      -1,
      true
    );

    message2X.value = withDelay(1500, withRepeat(
      withSequence(
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }),
        withDelay(1000, withTiming(-100, { duration: 1000, easing: Easing.in(Easing.exp) }))
      ),
      -1,
      true
    ));
    message2Opacity.value = withDelay(1500, withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withDelay(2000, withTiming(0, { duration: 500 }))
      ),
      -1,
      true
    ));
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateX: message1X.value }],
    opacity: message1Opacity.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateX: message2X.value }],
    opacity: message2Opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bubble, styles.bubbleLeft, animatedStyle1]}>
        <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
      </Animated.View>
      <Animated.View style={[styles.bubble, styles.bubbleRight, animatedStyle2]}>
        <Ionicons name="send" size={24} color={colors.accent} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleLeft: {
    left: '20%',
  },
  bubbleRight: {
    right: '20%',
  },
});
