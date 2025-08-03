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
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

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

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');

  // Animation values
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  // Load cached data when modal opens
  useEffect(() => {
    if (visible) {
      loadCachedData();
      // Start animations
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
        mass: 0.8,
      });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      // Reset animations
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(1000, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
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

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country: country.name,
    }));
    setShowCountryPicker(false);
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

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X color="#000" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Section 1: Profile Header - Avatar Upload */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Photo</Text>
                <View style={styles.avatarSection}>
                  <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick}>
                    {formData.avatarUri ? (
                      <Image source={{ uri: formData.avatarUri }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Camera color="#666" size={32} />
                      </View>
                    )}
                    <View style={styles.cameraIcon}>
                      <Camera color="#FFF" size={16} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Section 2: Names */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>First Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.firstName}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                      placeholder="Enter first name"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Second Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.secondName}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, secondName: text }))}
                      placeholder="Enter second name"
                    />
                  </View>
                </View>
                <View style={styles.fullWidth}>
                  <Text style={styles.label}>Third Name (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.thirdName}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, thirdName: text }))}
                    placeholder="Enter third name"
                  />
                </View>
              </View>

              {/* Section 3: Identity */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Identity</Text>
                <View style={styles.fullWidth}>
                  <Text style={styles.label}>Username *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.username}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                    placeholder="Enter username"
                  />
                  <Text style={styles.helperText}>Letters and numbers only</Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.age}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                      placeholder="Enter age"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Country *</Text>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => setShowCountryPicker(true)}
                    >
                      <Text style={[styles.inputText, !formData.country && styles.placeholderText]}>
                        {formData.country || 'Select country'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Section 4: Languages */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.fullWidth}>
                  <Text style={styles.label}>Primary Language *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.languages[0] || ''}
                    onChangeText={(text) => {
                      const newLanguages = [...formData.languages];
                      newLanguages[0] = text;
                      setFormData(prev => ({ ...prev, languages: newLanguages }));
                    }}
                    placeholder="Enter primary language"
                  />
                </View>
                <View style={styles.addLanguageSection}>
                  <Text style={styles.label}>Add Language (Optional)</Text>
                  <View style={styles.addLanguageRow}>
                    <TextInput
                      style={[styles.input, styles.flex1]}
                      value={newLanguage}
                      onChangeText={setNewLanguage}
                      placeholder="Enter additional language"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addLanguage}>
                      <Plus color="#FFF" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
                {formData.languages.slice(1).map((language, index) => (
                  <View key={index} style={styles.languageItem}>
                    <Text style={styles.languageText}>{language}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeLanguage(language)}
                    >
                      <Minus color="#FFF" size={16} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Section 5: Location & Education */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location & Education</Text>
                <View style={styles.fullWidth}>
                  <Text style={styles.label}>State/Province/County</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                    placeholder="Enter location"
                  />
                </View>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>School</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.school}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, school: text }))}
                      placeholder="Enter school name"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>Education Level</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.educationLevel}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, educationLevel: text }))}
                      placeholder="Enter education level"
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>

        {/* Country Picker Modal */}
        <CountryPicker
          visible={showCountryPicker}
          onSelect={handleCountrySelect}
          onClose={() => setShowCountryPicker(false)}
          withFilter
          withFlag
          withEmoji
          withCallingCode
          withCurrency
        />
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
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
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
    color: '#000',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34D399',
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
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    minHeight: 48,
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
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
    backgroundColor: '#34D399',
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
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#374151',
  },
  removeButton: {
    backgroundColor: '#EF4444',
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
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#34D399',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
}); 