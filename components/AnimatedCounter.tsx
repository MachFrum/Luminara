import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: any;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({ 
  value,
  duration = 800,
  style,
  suffix = '',
  prefix = ''
}: AnimatedCounterProps) {
  const { typography } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value: animValue }) => {
      setDisplayValue(Math.floor(animValue));
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: true, // Use native driver for performance
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value, duration]);

  return (
    <Text style={[styles.counter, typography.h1, style]}>
      {prefix}{displayValue}{suffix}
    </Text>
  );
}

const styles = StyleSheet.create({
  counter: {
    fontWeight: 'bold',
  },
});
