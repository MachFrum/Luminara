import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Feather icon components with proper TypeScript types
interface IconProps {
  color: string;
  size: number;
}

const RefreshCw: React.FC<IconProps> = ({ color, size }) => <Feather name="refresh-cw" size={size} color={color} />;
const Search: React.FC<IconProps> = ({ color, size }) => <Feather name="search" size={size} color={color} />;
const Filter: React.FC<IconProps> = ({ color, size }) => <Feather name="filter" size={size} color={color} />;
const Type: React.FC<IconProps> = ({ color, size }) => <Feather name="type" size={size} color={color} />;
const Camera: React.FC<IconProps> = ({ color, size }) => <Feather name="camera" size={size} color={color} />;
const X: React.FC<IconProps> = ({ color, size }) => <Feather name="x" size={size} color={color} />;
const Send: React.FC<IconProps> = ({ color, size }) => <Feather name="send" size={size} color={color} />;
const Square: React.FC<IconProps> = ({ color, size }) => <Feather name="square" size={size} color={color} />;
const Play: React.FC<IconProps> = ({ color, size }) => <Feather name="play" size={size} color={color} />;
const Pause: React.FC<IconProps> = ({ color, size }) => <Feather name="pause" size={size} color={color} />;
const ArrowLeft: React.FC<IconProps> = ({ color, size }) => <Feather name="arrow-left" size={size} color={color} />;

import ProblemPreview from '@/components/ProblemPreview';
import InputMethodCard from '@/components/InputMethodCard';
import PulsingActionButton from '@/components/PulsingActionButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import CameraCapture from '@/components/CameraCapture';
import { useProblemSubmission } from '@/hooks/useProblemSubmission';
import { useProblemHistory } from '@/hooks/useProblemHistory';
import { ProblemEntry, InputMethod } from '@/types/learning';
import { useTheme } from '@/contexts/ThemeContext';
import { useTabBarScroll } from './_layout';

export default function LearnScreen() {
  const { colors, typography, spacing } = useTheme();
  const { onScroll } = useTabBarScroll();
  const [refreshing, setRefreshing] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [selectedInputMethod, setSelectedInputMethod] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ProblemEntry | null>(null);
  const modalAnim = useRef(new Animated.Value(0)).current;
  const problemModalAnim = useRef(new Animated.Value(0)).current;

  const { submitProblem, isSubmitting: isSubmittingProblem, result, error: submissionError, clearResult } = useProblemSubmission();
  const { problems, isLoading: isLoadingHistory, error: historyError, refetch } = useProblemHistory();
  
  const inputMethods: InputMethod[] = [
    {
      id: 'text',
      title: 'Type Problem',
      description: 'Enter your question or problem as text',
      icon: 'type',
      color: colors.accent,
      type: 'text',
    },
    {
      id: 'camera',
      title: 'Capture Image',
      description: 'Take a photo of your problem',
      icon: 'camera',
      color: colors.accent,
      type: 'camera',
    },
  ];

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRefresh = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openInputModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowInputModal(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeInputModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowInputModal(false);
      setSelectedInputMethod(null);
      setTextInput('');
      setIsProcessing(false);
    });
  };

  const handleInputMethodSelect = (methodId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedInputMethod(methodId);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    submitTextProblem();
  };

  const submitTextProblem = async () => {
    setIsProcessing(true);
    
    try {
      const problemId = await submitProblem({
        title: textInput.substring(0, 50) + (textInput.length > 50 ? '...' : ''),
        inputType: 'text',
        textContent: textInput,
      });
      
      if (problemId) {
        setTextInput('');
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to submit problem. Please try again.');
    }
  };

  const handleCameraCapture = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCamera(true);
  };

  const handleCameraResult = (result: any) => {
    setShowCamera(false);
    submitImageProblem(result.uri);
  };

  const submitImageProblem = async (imageUri: string) => {
    setIsProcessing(true);
    
    try {
      const problemId = await submitProblem({
        title: 'Image Problem',
        inputType: 'image',
        imageUrl: imageUri,
      });
      
      if (problemId) {
        // Keep modal open to show progress
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

  const handleCameraClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowCamera(false);
  };

  const openProblemModal = (problem: ProblemEntry) => {
    setSelectedProblem(problem);
    Animated.spring(problemModalAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeProblemModal = () => {
    Animated.timing(problemModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedProblem(null);
    });
  };

  // Handle submission result
  React.useEffect(() => {
    if (result) {
      if (result.status === 'completed') {
        setIsProcessing(false);
        closeInputModal();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Your problem has been solved! Check your learning history.');
        refetch(); // Refresh the problems list
      } else if (result.status === 'error') {
        setIsProcessing(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', result.errorMessage || 'Failed to process your problem.');
      }
    }
  }, [result]);

  // Handle submission errors
  React.useEffect(() => {
    if (submissionError) {
      setIsProcessing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', submissionError);
    }
  }, [submissionError]);

  const renderInputContent = () => {
    if (!selectedInputMethod) {
      return (
        <View style={styles.inputMethodsContainer}>
          <Text style={[styles.modalTitle, { color: colors.primary, ...typography.h2 }]}>How would you like to input your problem?</Text>
          {inputMethods.map((method, index) => (
            <InputMethodCard
              key={method.id}
              method={method}
              onPress={() => handleInputMethodSelect(method.id)}
              index={index}
            />
          ))}
        </View>
      );
    }

    switch (selectedInputMethod) {
      case 'text':
        return (
          <View style={styles.textInputContainer}>
            <Text style={[styles.modalTitle, { color: colors.primary, ...typography.h2 }]}>Type Your Problem</Text>
            
            {result && result.status === 'processing' && (
              <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.processingContainer}>
                <LoadingSpinner size={20} />
                <Text style={[styles.processingText, { color: colors.textSecondary, ...typography.body }]}>
                  AI is analyzing your problem...
                </Text>
              </BlurView>
            )}
            
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.textSecondary, ...typography.body }]}
              placeholder="Enter your question or problem here..."
              placeholderTextColor={colors.textSecondary}
              multiline
              value={textInput}
              onChangeText={setTextInput}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.submitButton, !textInput.trim() && styles.submitButtonDisabled]}
              onPress={handleTextSubmit}
              disabled={!textInput.trim() || isProcessing}
            >
              <LinearGradient
                colors={textInput.trim() && !isProcessing ? [colors.accent, colors.primary] : [colors.textSecondary, colors.textSecondary]}
                style={styles.submitGradient}
              >
                {isProcessing ? (
                  <LoadingSpinner size={20} />
                ) : (
                  <Send size={20} color={colors.primary} />
                )}
                <Text style={[styles.submitText, { color: colors.primary, ...typography.body }]}>
                  {isProcessing ? 'Processing...' : 'Submit'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      case 'camera':
        return (
          <View style={styles.cameraInputContainer}>
            <Text style={[styles.modalTitle, { color: colors.primary, ...typography.h2 }]}>Camera Capture</Text>
            
            {result && result.status === 'processing' && (
              <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.processingContainer}>
                <LoadingSpinner size={20} />
                <Text style={[styles.processingText, { color: colors.textSecondary, ...typography.body }]}>
                  AI is analyzing your image...
                </Text>
              </BlurView>
            )}
            
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleCameraCapture}
              >
                <LinearGradient
                  colors={[colors.accent, colors.primary]}
                  style={styles.cameraGradient}
                >
                  <Camera size={32} color={colors.primary} />
                </LinearGradient>
              </TouchableOpacity>
              <Text style={[styles.cameraStatus, { color: colors.textSecondary, ...typography.body }]}>
                Tap to open camera
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraResult}
        onClose={handleCameraClose}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.primary, ...typography.h1 }]}>Learning History</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary, ...typography.body }]}>
            {problems.length} problems solved
          </Text>
          
          {/* Search Bar */}
          <BlurView intensity={90} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.searchContainer}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text, ...typography.body }]}
              placeholder="Search problems, topics, or tags..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </BlurView>
        </View>
      </BlurView>

      {/* Content */}
      <View style={styles.content}>
        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={refreshing || isLoadingHistory}
        >
          <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.refreshGradient}>
            {refreshing || isLoadingHistory ? (
              <LoadingSpinner size={20} />
            ) : (
              <RefreshCw size={20} color={colors.accent} />
            )}
            <Text style={[styles.refreshText, { color: colors.accent, ...typography.body }]}>
              {refreshing || isLoadingHistory ? 'Loading...' : 'Refresh'}
            </Text>
          </BlurView>
        </TouchableOpacity>

        {/* Problems List */}
        <ScrollView 
          style={styles.problemsList} 
          showsVerticalScrollIndicator={false} 
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {(historyError || submissionError) && (
            <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.textSecondary, ...typography.body }]}>
                {historyError || submissionError}
              </Text>
            </BlurView>
          )}
          
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <ProblemPreview
                key={problem.id}
                problem={problem}
                onPress={() => openProblemModal(problem)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.primary, ...typography.h3 }]}>No problems found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary, ...typography.body }]}>
                {searchQuery ? 'Try adjusting your search terms' : 'Start solving problems to see them here'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <View style={styles.fab}>
          <PulsingActionButton onPress={openInputModal} />
        </View>
      </View>

      {/* Input Modal */}
      <Modal
        visible={showInputModal}
        transparent
        animationType="none"
        onRequestClose={closeInputModal}
      >
        <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    scale: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: modalAnim,
              },
            ]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={closeInputModal}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderInputContent()}
            </ScrollView>
          </Animated.View>
        </BlurView>
      </Modal>

      {/* Problem Details Modal */}
      {selectedProblem && (
        <Modal
          visible={!!selectedProblem}
          transparent
          animationType="none"
          onRequestClose={closeProblemModal}
        >
          <View style={styles.problemModalFullOverlay}>
            <Animated.View
              style={[
                styles.problemModalFullContent,
                {
                  backgroundColor:
                    colors.background === '#121212'
                      ? 'rgba(18,18,18,0.92)'
                      : 'rgba(255,255,255,0.96)',
                  transform: [
                    {
                      scale: problemModalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.98, 1],
                      }),
                    },
                  ],
                  opacity: problemModalAnim,
                },
              ]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View style={styles.problemDetailsContainer}>
                  <Text style={[styles.problemTitle, { color: colors.primary, ...typography.h2 }]}>
                    {selectedProblem.title}
                  </Text>
                  <Text style={[styles.problemSubtitle, { color: colors.primary, ...typography.body }]}>
                    {selectedProblem.topic} • {selectedProblem.tags?.join(', ')}
                  </Text>
                  <Text style={{ color: colors.primary, ...typography.body, marginTop: 16 }}>
                    {selectedProblem.solution || 'No solution available.'}
                  </Text>
                </View>
              </ScrollView>
              <TouchableOpacity
                style={[styles.doneButton, { backgroundColor: colors.charcoal }]}
                onPress={async () => {
                  // Simulate API call
                  await new Promise(res => setTimeout(res, 1200));
                  closeProblemModal();
                }}
              >
                <Text style={[styles.doneButtonText, { color: '#fff' }]}>Done</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  refreshButton: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  refreshGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  refreshText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  problemsList: {
    flex: 1,
    marginBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 110, // 80 (nav bar) + 30 (spacing)
    right: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(35,37,46,0.85)', // Less transparent
    padding: 30,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#23252e',
    borderRadius: 30,
  },
  modalContent: {
    borderRadius: 30,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
    backgroundColor: 'rgba(35,37,46,0.92)', // Less transparent
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#23252e',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  inputMethodsContainer: {
    paddingTop: 20,
  },
  textInputContainer: {
    paddingTop: 20,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  submitText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  cameraInputContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  cameraControls: {
    alignItems: 'center',
  },
  cameraButton: {
    marginBottom: 20,
    borderRadius: 50,
    overflow: 'hidden',
  },
  cameraGradient: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraStatus: {
    textAlign: 'center',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(35,37,46,0.85)', // Less transparent
  },
  processingText: {
    marginLeft: 8,
  },
  errorContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(35,37,46,0.85)', // Less transparent
  },
  errorText: {
    fontWeight: '500',
  },
  problemDetailsContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  problemTitle: {
    marginBottom: 8,
  },
  problemSubtitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  problemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  problemButton: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  problemButtonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  problemModalFullOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(18,18,18,0.85)', // Less transparent
    padding: 0,
  },
  problemModalFullContent: {
    flex: 1,
    width: '95%',
    height: '80%',
    borderRadius: 20,
    padding: 10,
    backgroundColor: 'rgba(18,18,18,0.85)', // Less transparent
    borderWidth: 1.5,
    borderColor: '#d9c4b0',
    justifyContent: 'space-between',
  },
  doneButton: {
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 12,
  },
  doneButtonText: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});
