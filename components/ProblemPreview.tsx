import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

// Placeholder for custom SVG icons
const Clock = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const Tag = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const ChevronDown = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const Mic = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const Camera = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const Type = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;

import { ProblemEntry } from '@/types/learning';

interface ProblemPreviewProps {
  problem: ProblemEntry;
  onPress?: () => void;
}

export default function ProblemPreview({ problem, onPress }: ProblemPreviewProps) {
  const { colors, typography } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <BlurView
        intensity={80}
        tint={colors.background === '#121212' ? 'dark' : 'light'}
        style={styles.container}
      >
        <View style={styles.previewHeader}>
          <View style={styles.leftContent}>
            {problem.imageUrl && (
              <Image source={{ uri: problem.imageUrl }} style={styles.thumbnail} />
            )}
            <View style={styles.textContent}>
              <Text style={[styles.title, { color: colors.text, ...typography.h3 }]}>{problem.title}</Text>
              <Text style={[styles.topic, { color: colors.accent, ...typography.body }]}>{problem.topic}</Text>
            </View>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  topic: {},
});
