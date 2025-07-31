import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { InputMethod } from '@/types/learning';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

// Placeholder for custom SVG icons
const Type = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const Mic = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const Camera = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;

interface InputMethodCardProps {
  method: InputMethod;
  onPress: () => void;
  index: number;
}

export default function InputMethodCard({ method, onPress, index }: InputMethodCardProps) {
  const { colors, typography, spacing } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const getIcon = () => {
    switch (method.type) {
      case 'text': return Type;
      case 'voice': return Mic;
      case 'camera': return Camera;
      default: return Type;
    }
  };

  const IconComponent = getIcon();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <BlurView
          intensity={80}
          tint={colors.background === '#121212' ? 'dark' : 'light'}
          style={styles.container}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
            <IconComponent size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text, ...typography.h3 }]}>{method.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary, ...typography.body }]}>
            {method.description}
          </Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
