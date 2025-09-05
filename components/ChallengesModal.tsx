
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface ChallengeData {
  name: string;
  topic: string;
  level: 'easy' | 'medium' | 'hard';
  questionCount: number;
}

interface ChallengesModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (challengeData: ChallengeData) => void;
}

export default function ChallengesModal({ visible, onClose, onSubmit }: ChallengesModalProps) {
  const { colors, typography } = useTheme();
  const [challengeName, setChallengeName] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(10);

  const handleSubmit = () => {
    if (!challengeName.trim() || !topic.trim()) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    onSubmit({ name: challengeName, topic, level, questionCount });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text, ...typography.h2 }]}>Create a Challenge</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Challenge Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={challengeName}
              onChangeText={setChallengeName}
              placeholder="e.g., Algebra Fundamentals"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Topic</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={topic}
              onChangeText={setTopic}
              placeholder="e.g., Quadratic Equations"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Level</Text>
            <View style={styles.levelContainer}>
              <TouchableOpacity
                style={[styles.levelButton, level === 'easy' && { backgroundColor: colors.accent }]}                onPress={() => setLevel('easy')}
              >
                <Text style={[styles.levelText, level === 'easy' && { color: colors.surface }]}>Easy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.levelButton, level === 'medium' && { backgroundColor: colors.accent }]}                onPress={() => setLevel('medium')}
              >
                <Text style={[styles.levelText, level === 'medium' && { color: colors.surface }]}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.levelButton, level === 'hard' && { backgroundColor: colors.accent }]}                onPress={() => setLevel('hard')}
              >
                <Text style={[styles.levelText, level === 'hard' && { color: colors.surface }]}>Hard</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Number of Questions</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={questionCount.toString()}
              onChangeText={(text) => setQuestionCount(parseInt(text, 10) || 1)}
              keyboardType="numeric"
            />
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSubmit}>
              <Text style={[styles.saveButtonText, { color: colors.surface, ...typography.body }]}>Start Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingVertical: 10,
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
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
