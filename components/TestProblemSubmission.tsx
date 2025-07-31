import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export default function TestProblemSubmission() {
  const { colors, typography, spacing } = useTheme();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testSubmitProblem = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      console.log('Testing submit-problem function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('submit-problem', {
        body: {
          input_type: 'text',
          title: 'Test Problem',
          text_content: 'What is the capital of France?',
          user_id: 'test-user-id'
        }
      });
      
      console.log('Response data:', data);
      console.log('Response error:', functionError);
      
      if (functionError) {
        throw new Error(`Function error: ${JSON.stringify(functionError)}`);
      }
      
      setResult(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Test failed:', err);
      setError(err instanceof Error ? err.message : String(err));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const testGeminiApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      console.log('Testing test-gemini function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('test-gemini', {
        body: {
          prompt: 'What is the capital of France?'
        }
      });
      
      console.log('Response data:', data);
      console.log('Response error:', functionError);
      
      if (functionError) {
        throw new Error(`Function error: ${JSON.stringify(functionError)}`);
      }
      
      setResult(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Test failed:', err);
      setError(err instanceof Error ? err.message : String(err));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlurView intensity={80} tint={colors.background === '#121212' ? 'dark' : 'light'} style={styles.container}>
      <Text style={[styles.title, { color: colors.text, ...typography.h2 }]}>Test Problem Submission</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, padding: spacing.md, borderRadius: spacing.sm }]}
          onPress={testSubmitProblem}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size={16} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.background, ...typography.body }]}>Test Submit Problem</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent, padding: spacing.md, borderRadius: spacing.sm }]}
          onPress={testGeminiApi}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size={16} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.primary, ...typography.body }]}>Test Gemini API</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {error && (
        <BlurView intensity={80} tint="dark" style={[styles.messageContainer, { borderColor: colors.textSecondary }]}>
          <Text style={[styles.messageTitle, { color: colors.text }]}>Error:</Text>
          <Text style={[styles.messageText, { color: colors.textSecondary }]}>{error}</Text>
        </BlurView>
      )}
      
      {result && (
        <BlurView intensity={80} tint="dark" style={[styles.messageContainer, { borderColor: colors.accent }]}>
          <Text style={[styles.messageTitle, { color: colors.text }]}>Result:</Text>
          <Text style={[styles.messageText, { color: colors.textSecondary }]}>{JSON.stringify(result, null, 2)}</Text>
        </BlurView>
      )}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  messageContainer: {
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  messageTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    lineHeight: 20,
  },
});