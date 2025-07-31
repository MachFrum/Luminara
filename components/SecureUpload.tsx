import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import { mediaUploadManager } from '@/lib/mediaUpload';
import LoadingSpinner from './LoadingSpinner';
import * as Haptics from 'expo-haptics';

// Placeholder for custom SVG icons
const Upload = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const Shield = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const CheckCircle = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const XCircle = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;

interface SecureUploadProps {
  onUploadComplete?: (uploadId: string, url: string) => void;
  onUploadError?: (error: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  bucket?: 'user-uploads' | 'problem-images' | 'voice-recordings';
  folder?: string;
}

export default function SecureUpload({
  onUploadComplete,
  onUploadError,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 10,
  bucket = 'user-uploads',
  folder
}: SecureUploadProps) {
  const { colors, typography, spacing } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = useCallback(async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = acceptedTypes.join(',');
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
          await handleFileUpload(file);
        }
      };
      input.click();
    } else {
      Alert.alert('Info', 'File upload is currently available on web only');
    }
  }, [acceptedTypes]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await mediaUploadManager.uploadFile({
        userId: 'user-placeholder', // Replace with actual user ID
        file,
        bucket,
        folder,
        metadata: { uploadedAt: new Date().toISOString(), originalName: file.name }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.uploadId && result.url) {
        setUploadStatus('success');
        onUploadComplete?.(result.uploadId, result.url);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => setUploadStatus('idle'), 2000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsUploading(false);
    }
  }, [bucket, folder, onUploadComplete, onUploadError]);

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading': return <LoadingSpinner size={24} />;
      case 'success': return <CheckCircle size={24} color={colors.accent} />;
      case 'error': return <XCircle size={24} color={colors.textSecondary} />;
      default: return <Upload size={24} color={colors.text} />;
    }
  };

  return (
    <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.container}>
      <TouchableOpacity
        style={styles.uploadArea}
        onPress={handleFileSelect}
        disabled={isUploading}
        activeOpacity={0.7}
      >
        <View style={styles.uploadContent}>
          {getStatusIcon()}
          <Text style={[styles.uploadText, { color: colors.text, ...typography.body }]}>
            {uploadStatus === 'uploading' ? `Uploading... ${uploadProgress}%` : 'Select File'}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Shield size={14} color={colors.textSecondary} />
        <Text style={[styles.footerText, { color: colors.textSecondary, ...typography.caption }]}>
          Secure Upload
        </Text>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  uploadArea: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadContent: {
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 6,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontWeight: 'bold',
  },
});
