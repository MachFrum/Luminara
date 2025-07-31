import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { 
  CameraViewComponent, 
  CameraTypeEnum, 
  FlashModeEnum, 
  useCameraPermissionsHook, 
  isCameraAvailable 
} from '@/utils/camera';

// Placeholder for custom SVG icons
const CameraIcon = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const RotateCcw = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const ImageIcon = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const X = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;
const Zap = ({ color, size }) => <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 2 }} />;

const { width, height } = Dimensions.get('window');

interface CameraCaptureProps {
  onCapture: (result: any) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const { colors, typography, spacing } = useTheme();
  const [facing, setFacing] = useState<string>(CameraTypeEnum?.back || 'back');
  const [permission, requestPermission] = useCameraPermissionsHook();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!permission) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.permissionGradient}
        >
          <CameraIcon size={64} color="#FFF" />
          <Text style={[styles.permissionTitle, { color: '#FFF', ...typography.h2 }]}>Camera Access Needed</Text>
          <Text style={[styles.permissionText, { color: '#FFF', ...typography.body }]}>
            To help you learn, we need access to your camera to capture problems and concepts.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={[styles.permissionButtonText, { color: colors.primary, ...typography.body }]}>Grant Permission</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    Haptics.selectionAsync();
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (Platform.OS === 'web' || !isCameraAvailable()) {
          setTimeout(() => {
            setIsCapturing(false);
            onCapture({ uri: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg' });
          }, 1000);
        } else {
          if (cameraRef.current?.takePictureAsync) {
            const photo = await cameraRef.current.takePictureAsync();
            onCapture(photo);
          }
          setIsCapturing(false);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        setIsCapturing(false);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    }
  };

  const openGallery = () => {
    Alert.alert(
      'Select Image',
      'Choose an image from your gallery to start learning.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Gallery', 
          onPress: () => onCapture({ uri: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg' })
        }
      ]
    );
  };

  const cameraProps: any = {
    style: styles.camera,
    facing,
    ref: cameraRef
  };

  return (
    <View style={styles.container}>
      <CameraViewComponent {...cameraProps}>
        <BlurView intensity={80} tint="dark" style={styles.topOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.instructionText, { color: '#FFF', ...typography.body }]}>
            Point your camera at any problem
          </Text>
        </BlurView>

        <View style={styles.centerOverlay}>
          <View style={styles.focusFrame} />
        </View>

        <BlurView intensity={80} tint="dark" style={styles.bottomOverlay}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.controlButton} onPress={openGallery}>
              <ImageIcon size={24} color="#FFF" />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isCapturing}
              >
                <LinearGradient
                  colors={isCapturing ? ['#FF6B6B', '#FF4757'] : [colors.accent, '#22c58b']}
                  style={styles.captureButtonInner}
                >
                  {isCapturing ? <Zap size={32} color="#FFF" /> : <CameraIcon size={32} color="#FFF" />}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <RotateCcw size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </CameraViewComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  permissionContainer: {
    flex: 1,
  },
  permissionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  permissionText: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 10,
  },
  instructionText: {
    fontWeight: '600',
  },
  centerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusFrame: {
    width: width * 0.8,
    height: height * 0.3,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 30,
    paddingBottom: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  controlButton: {
    padding: 15,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  captureButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
