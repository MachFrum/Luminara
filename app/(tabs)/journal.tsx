
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

const JournalScreen = () => {
  const { colors } = useTheme();
  const [journalEntry, setJournalEntry] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Journal</Text>
      </View>
      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        value={journalEntry}
        onChangeText={setJournalEntry}
        placeholder="Write your journal entry here..."
        placeholderTextColor={colors.textSecondary}
        multiline
      />
      <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]}>
        <Feather name="check" size={20} color={colors.background} />
        <Text style={[styles.saveButtonText, { color: colors.background }]}>Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d9c4b0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default JournalScreen;
