
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

interface SetGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (goal: any) => void;
}

export default function SetGoalModal({ visible, onClose, onSave }: SetGoalModalProps) {
  const { colors, typography } = useTheme();
  const [goalName, setGoalName] = useState('');
  const [goalObjective, setGoalObjective] = useState('');
  const [progress, setProgress] = useState('');

  const handleSave = () => {
    if (!goalName || !goalObjective || !progress) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    const goalData = {
      name: goalName,
      objective: goalObjective,
      progress: parseInt(progress, 10),
    };

    onSave(goalData);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text, ...typography.h2 }]}>Set Your Own Goal</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Goal Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={goalName}
              onChangeText={setGoalName}
              placeholder="Enter goal name"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Goal Objective</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={goalObjective}
              onChangeText={setGoalObjective}
              placeholder="Enter goal objective"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={[styles.label, { color: colors.textSecondary, ...typography.body }]}>Progress</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={progress}
              onChangeText={setProgress}
              placeholder="Enter progress"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={handleSave}>
              <Text style={[styles.saveButtonText, { color: colors.surface, ...typography.body }]}>Save Goal</Text>
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
