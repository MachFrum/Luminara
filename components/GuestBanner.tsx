import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

// Placeholder for custom SVG icons
const UserPlus = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const X = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;

interface GuestBannerProps {
  onDismiss?: () => void;
}

export default function GuestBanner({ onDismiss }: GuestBannerProps) {
  const { colors, typography, spacing } = useTheme();

  const handleCreateAccount = () => {
    router.push('/auth/register');
  };

  return (
    <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text, ...typography.h3 }]}>You're a Guest</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, ...typography.body }]}>
            Sign up to save your progress.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.accent }]}
          onPress={handleCreateAccount}
        >
          <Text style={[styles.actionButtonText, { color: colors.primary, ...typography.body }]}>Sign Up</Text>
        </TouchableOpacity>
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {},
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  actionButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dismissButton: {
    padding: 8,
    marginLeft: 8,
  },
});
