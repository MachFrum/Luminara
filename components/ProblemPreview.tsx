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
  const { colors, typography, spacing } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setExpanded(!expanded);
  };

  const expandedHeightValue = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // Adjust as needed
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const getTypeIcon = () => {
    switch (problem.type) {
      case 'voice': return Mic;
      case 'image': return Camera;
      default: return Type;
    }
  };

  const TypeIcon = getTypeIcon();

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
          <TouchableOpacity style={styles.expandButton} onPress={toggleExpanded}>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <ChevronDown size={20} color={colors.textSecondary} />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.expandedContent, { height: expandedHeightValue }]}>
          <View style={styles.expandedInner}>
            <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>Description</Text>
            <Text style={[styles.description, { color: colors.textSecondary, ...typography.body }]}>{problem.description}</Text>
            <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>Solution</Text>
            <Text style={[styles.solution, { color: colors.textSecondary, ...typography.body }]}>{problem.solution}</Text>
            {problem.tags.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {problem.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: colors.accent }]}>
                      <Tag size={10} color={colors.primary} />
                      <Text style={[styles.tagText, { color: colors.primary, ...typography.caption }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </Animated.View>
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
  expandButton: {
    padding: 8,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  expandedInner: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
  },
  solution: {
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  tagText: {},
});
