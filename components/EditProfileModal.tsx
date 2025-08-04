import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

// Icon components
const X: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Feather name="x" size={size} color={color} />
);
const Camera: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Feather name="camera" size={size} color={color} />
);
const Plus: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Feather name="plus" size={size} color={color} />
);
const Minus: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Feather name="minus" size={size} color={color} />
);

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

interface FormData {
  firstName: string;
  secondName: string;
  thirdName: string;
  username: string;
  age: string;
  country: string;
  languages: string[];
  location: string;
  school: string;
  educationLevel: string;
  avatarUri?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export default function EditProfileModal({ 
  visible, 
  onClose, 
  onSave, 
  initialData 
}: EditProfileModalProps) {
  const { colors, typography, spacing } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    secondName: '',
    thirdName: '',
    username: '',
    age: '',
    country: '',
    languages: [],
    location: '',
    school: '',
    educationLevel: '',
    avatarUri: undefined,
  });

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [newLanguage, setNewLanguage] = useState('');

  // Animation values
  const translateY = useRef(new Animated.Value(1000)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  // Load cached data when modal opens
  useEffect(() => {
    if (visible) {
      loadCachedData();
      // Start animations
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 1000,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const loadCachedData = async () => {
    try {
      const cached = await AsyncStorage.getItem('profileFormCache');
      if (cached) {
        const data = JSON.parse(cached);
        setFormData({
          firstName: data.firstName || '',
          secondName: data.secondName || '',
          thirdName: data.thirdName || '',
          username: data.username || '',
          age: data.age || '',
          country: data.country || '',
          languages: data.languages || [],
          location: data.location || '',
          school: data.school || '',
          educationLevel: data.educationLevel || '',
          avatarUri: data.avatarUri,
        });
      } else if (initialData) {
        setFormData(initialData);
      }
    } catch (error) {
      console.error('Cache loading error:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          avatarUri: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country: country.name,
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language),
    }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.firstName || !formData.username || !formData.country) {
        Alert.alert('Validation Error', 'Please fill in all required fields.');
        return;
      }

      // Step 1: Cache form data locally first
      const dataToCache = {
        ...formData,
        // Don't cache the image file, cache the URI
        avatarUri: formData.avatarUri,
      };
      
      // Cache to AsyncStorage
      await AsyncStorage.setItem('profileFormCache', JSON.stringify(dataToCache));
      
      // Step 2: Upload image to S3 (prepare the structure)
      let s3ImageUrl = null;
      if (formData.avatarUri) {
        // TODO: Implement S3 upload here
        // const s3Response = await uploadToS3(formData.avatarUri);
        // s3ImageUrl = s3Response.url;
        
        // For now, placeholder for manual implementation
        console.log('Image ready for S3 upload:', formData.avatarUri);
        s3ImageUrl = 'PLACEHOLDER_S3_URL'; // Replace with actual S3 URL
      }
      
      // Step 3: Prepare data for API call
      const apiPayload = {
        ...formData,
        avatarUrl: s3ImageUrl, // S3 URL reference
        timestamp: new Date().toISOString(),
      };
      
      // TODO: Send to your backend API
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(apiPayload)
      // });
      
      console.log('Data ready for API upload:', apiPayload);
      
      // Step 4: Clear cache after successful upload (implement when API is ready)
      // await AsyncStorage.removeItem('profileFormCache');
      
      Alert.alert('Success', 'Profile saved locally and ready for upload!');
      onSave(apiPayload);
      onClose();
      
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save profile data');
    }
  };

  const handleReset = async () => {
    // Clear all form fields
    setFormData({
      firstName: '',
      secondName: '',
      thirdName: '',
      username: '',
      age: '',
      country: '',
      languages: [],
      location: '',
      school: '',
      educationLevel: '',
      avatarUri: undefined,
    });
    
    setSelectedCountry(null);
    setNewLanguage('');
    
    // Clear cached data
    await AsyncStorage.removeItem('profileFormCache');
    
    Alert.alert('Reset', 'Form cleared successfully');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View style={[styles.modalContainer, {
            transform: [{ translateY }, { scale }]
          }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <Text style={[styles.headerTitle, { color: colors.text, ...typography.h2 }]}>Edit Profile</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Section 1: Profile Header - Avatar Upload */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>Profile Photo</Text>
                <View style={styles.avatarSection}>
                  <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick}>
                    {formData.avatarUri ? (
                      <Image source={{ uri: formData.avatarUri }} style={styles.avatarImage} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface }]}>
                        <Camera color={colors.textSecondary} size={32} />
                      </View>
                    )}
                    <View style={[styles.cameraIcon, { backgroundColor: colors.accent }]}>
                      <Camera color="#FFF" size={16} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Section 2: Names */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>Personal Information</Text>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>First Name *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                      value={formData.firstName}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                      placeholder="Enter first name"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Second Name *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                      value={formData.secondName}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, secondName: text }))}
                      placeholder="Enter second name"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
                <View style={styles.fullWidth}>
                  <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Third Name (Optional)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={formData.thirdName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, thirdName: text }))}
                    placeholder="Enter third name"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>

              {/* Section 3: Identity */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>Identity</Text>
                <View style={styles.fullWidth}>
                  <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Username *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={formData.username}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                    placeholder="Enter username"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <Text style={[styles.helperText, { color: colors.textTertiary, ...typography.caption }]}>Letters and numbers only</Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Age</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                      value={formData.age}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                      placeholder="Enter age"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Country *</Text>
                    <TouchableOpacity
                      style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, justifyContent: 'center' }]}
                      onPress={() => Alert.alert('Country Selection', 'Country picker will be implemented')}
                    >
                      <Text style={[styles.inputText, { color: formData.country ? colors.text : colors.textSecondary }]}>
                        {formData.country || 'Select country'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Section 4: Languages */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>Languages</Text>
                <View style={styles.fullWidth}>
                  <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Primary Language *</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={formData.languages[0] || ''}
                    onChangeText={(text) => {
                      const newLanguages = [...formData.languages];
                      newLanguages[0] = text;
                      setFormData(prev => ({ ...prev, languages: newLanguages }));
                    }}
                    placeholder="Enter primary language"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                <View style={styles.addLanguageSection}>
                  <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Add Language (Optional)</Text>
                  <View style={styles.addLanguageRow}>
                    <TextInput
                      style={[styles.input, styles.flex1, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                      value={newLanguage}
                      onChangeText={setNewLanguage}
                      placeholder="Enter additional language"
                      placeholderTextColor={colors.textSecondary}
                    />
                    <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accent }]} onPress={addLanguage}>
                      <Plus color="#FFF" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                {formData.languages.slice(1).map((language, index) => (
                  <View key={index} style={[styles.languageItem, { backgroundColor: colors.surfaceSecondary }]}>
                    <Text style={[styles.languageText, { color: colors.text, ...typography.body }]}>{language}</Text>
                    <TouchableOpacity
                      style={[styles.removeButton, { backgroundColor: colors.error }]}
                      onPress={() => removeLanguage(language)}
                    >
                      <Minus color="#FFF" size={16} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Section 5: Location & Education */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, ...typography.h3 }]}>Location & Education</Text>
                <View style={styles.fullWidth}>
                  <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>State/Province/County</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                    value={formData.location}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                    placeholder="Enter location"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>School</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                      value={formData.school}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, school: text }))}
                      placeholder="Enter school name"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Education Level</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                      value={formData.educationLevel}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, educationLevel: text }))}
                      placeholder="Enter education level"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={handleReset}>
                  <Text style={[styles.resetButtonText, { color: colors.textSecondary, ...typography.body }]}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSave}>
                  <Text style={[styles.saveButtonText, { color: colors.surface, ...typography.body }]}>Save Profile</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  avatarPlaceholder: {
    width: 94,
    height: 94,
    borderRadius: 47,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  inputText: {
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  addLanguageSection: {
    marginTop: 16,
  },
  addLanguageRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  flex1: {
    flex: 1,
  },
  addButton: {
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  languageText: {
    fontSize: 16,
  },
  removeButton: {
    borderRadius: 6,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  resetButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 2,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});