
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

const ChatScreen = () => {
  const { colors, typography } = useTheme();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'assistant' },
    { id: 2, text: 'I have a question about photosynthesis.', sender: 'user' },
  ]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    setChatMessages([...chatMessages, { id: Date.now(), text: message, sender: 'user' }]);
    setMessage('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chat</Text>
      </View>
      <ScrollView style={styles.chatContainer}>
        {chatMessages.map((chat) => (
          <View key={chat.id} style={[
            styles.chatBubble,
            chat.sender === 'user' ? styles.userBubble : styles.assistantBubble,
            { backgroundColor: chat.sender === 'user' ? colors.primary : colors.surface }
          ]}>
            <Text style={{ color: chat.sender === 'user' ? colors.background : colors.text }}>{chat.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity onPress={handleSendMessage} style={[styles.sendButton, { backgroundColor: colors.primary }]}>
          <Feather name="send" size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
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
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#d9c4b0',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    marginRight: 16,
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
