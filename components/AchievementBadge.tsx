import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Achievement } from '@/types/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

// Placeholder for custom SVG icon
const CustomIcon = ({ color, size }) => (
  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />
);

interface AchievementBadgeProps {
  achievement: Achievement;
  index: number;
  onPress?: () => void;
}

const getRarityColors = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'legendary':
      return ['#FFD700', '#FFA500'];
    case 'epic':
      return ['#9B59B6', '#8E44AD'];
    case 'rare':
      return ['#3498DB', '#2980B9'];
    default:
      return ['#95A5A6', '#7F8C8D'];
  }
};

export default function AchievementBadge({ achievement, index, onPress }: AchievementBadgeProps) {
  const { colors, typography, spacing } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 150;
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const rarityColors = getRarityColors(achievement.rarity);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={rarityColors}
          style={styles.container}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <CustomIcon color={achievement.color} size={24} />
          </View>
          <Text style={[styles.title, { color: colors.primary, ...typography.h3 }]}>
            {achievement.title}
          </Text>
          <Text style={[styles.description, { color: colors.text, ...typography.caption }]}>
            {achievement.description}
          </Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 16,
  },
});
