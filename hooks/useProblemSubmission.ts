import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { submitProblem as apiSubmitProblem } from '@/lib/api';

export interface ProblemSubmissionData {
  title: string;
  inputType: 'text' | 'image' | 'voice';
  textContent?: string;
  imageData?: string; // base64 encoded image
  voiceUrl?: string;
  description?: string;
}

export interface ProblemResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  solution?: string;
  explanation?: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  errorMessage?: string;
}

// Generate a valid UUID v4
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export function useProblemSubmission() {
  const { user, isAuthenticated, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ProblemResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitProblem = useCallback(async (data: ProblemSubmissionData): Promise<string | null> => {
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    // Validate input
    if (!data.title.trim()) {
      setError('Problem title is required');
      setIsSubmitting(false);
      return null;
    }

    if (!data.textContent?.trim() && !data.imageData && !data.voiceUrl) {
      setError('Problem content is required');
      setIsSubmitting(false);
      return null;
    }

    try {
      // Prepare submission data
      const submissionData = {
        title: data.title.trim(),
        inputType: data.inputType,
        description: data.description?.trim(),
        textContent: data.textContent?.trim(),
        imageUrl: data.imageData, // This should be a URL after upload
        voiceUrl: data.voiceUrl,
      };

      console.log('Submitting problem with data:', submissionData);

      // Submit to AWS API Gateway
      const response = await apiSubmitProblem(submissionData);

      if (!response || !response.id) {
        throw new Error('Invalid response from server');
      }

      console.log('Problem submitted successfully with ID:', response.id);
      // Set result
      const initialResult: ProblemResult = {
        id: response.id,
        status: response.status || 'completed',
        solution: response.solution,
        subject: response.subject,
        difficulty: response.difficulty,
        tags: response.tags,
      };

      setResult(initialResult);

      // If still processing, start polling
      if (response.status === 'processing' || response.status === 'pending') {
        console.log('Starting polling for problem completion');
        pollForCompletion(response.id);
      }

      return response.id;

    } catch (err) {
      console.error('Problem submission error:', err);
      
      let errorMessage = 'Failed to submit problem';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, isAuthenticated, token]);

  const pollForCompletion = useCallback(async (problemId: string) => {
    const maxAttempts = 60; // 2 minutes with 2-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        console.log(`Polling attempt ${attempts + 1}/${maxAttempts} for problem ${problemId}`);
        
        if (!isValidUUID(problemId)) {
          throw new Error('Invalid problem ID format for polling');
        }
        
        // Get problem status from API
        const data = await apiRequest(`/problems/${problemId}`, { authenticated: true });

        console.log('Poll result:', {
          status: data.status,
          hasSolution: !!data.solution,
        });

        // Update result
        const newResult: ProblemResult = {
          id: data.id,
          status: data.status,
          solution: data.solution || undefined,
          explanation: data.solution || undefined,
          subject: data.topic || data.subject || undefined,
          difficulty: data.difficulty || undefined,
          tags: data.tags || undefined,
          errorMessage: data.error_message || undefined,
        };

        setResult(newResult);

        // Stop polling if completed or error
        if (data.status === 'completed' || data.status === 'error') {
          if (data.status === 'error') {
            setError(data.error_message || 'Problem processing failed');
          }
          return;
        }

        // Continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setError('Problem processing timed out');
        }
      } catch (err) {
        console.error('Polling error:', err);
        setError('Failed to check problem status');
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 1000);
  }, [isAuthenticated, user]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    submitProblem,
    isSubmitting,
    result,
    error,
    clearResult,
  };
}