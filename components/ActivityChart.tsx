import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { DailyActivity } from '@/types/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface ActivityChartProps {
  data: DailyActivity[];
  height?: number;
}

export default function ActivityChart({ data, height = 150 }: ActivityChartProps) {
  const { colors, typography, spacing } = useTheme();
  const animatedValues = useRef(
    data.map(() => new Animated.Value(0))
  ).current;

  const maxProblems = Math.max(...data.map(day => day.problems), 1);

  useEffect(() => {
    const animations = data.map((_, index) =>
      Animated.timing(animatedValues[index], {
        toValue: data[index].problems,
        duration: 1000,
        delay: index * 80,
        useNativeDriver: false, // Necessary for color/gradient animations
      })
    );
    Animated.stagger(50, animations).start();
  }, [data]);

  const handleBarPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <BlurView intensity={50} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.container}>
      <View style={[styles.chart, { height }]}>
        {data.map((day, index) => {
          const barHeight = animatedValues[index].interpolate({
            inputRange: [0, maxProblems],
            outputRange: [5, height - 40], // Min height of 5
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity key={day.date} style={styles.barContainer} onPress={handleBarPress}>
              <View style={styles.barWrapper}>
                <Animated.View style={[{ height: barHeight, width: 20 }]}>
                  <LinearGradient
                    colors={day.completed ? [colors.accent, '#22c58b'] : [colors.textSecondary, colors.textSecondary]}
                    style={styles.bar}
                  />
                </Animated.View>
              </View>
              <Text style={[styles.dayLabel, { color: colors.textSecondary, ...typography.caption }]}>
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 16,
    overflow: 'hidden',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    flex: 1,
    borderRadius: 10,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
