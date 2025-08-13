import { generateUUID } from '@/utils/uuid';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

// MOCK API - Replace with actual API calls

const api = {
  login: async (credentials: any) => {
    console.log('Logging in with:', credentials);
    // Mock a successful login
    return {
      token: generateUUID(),
      user: {
        id: generateUUID(),
        email: credentials.email,
        firstName: 'Test',
        lastName: 'User',
        isGuest: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
    };
  },

  register: async (credentials: any) => {
    console.log('Registering with:', credentials);
    // Mock a successful registration
    return {
      token: generateUUID(),
      user: {
        id: generateUUID(),
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        isGuest: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
    };
  },

  requestPasswordReset: async (email: string) => {
    console.log('Requesting password reset for:', email);
    // Mock a successful password reset request
    return { message: 'Password reset email sent' };
  },

  submitProblem: async (submission: any) => {
    console.log('Submitting problem:', submission);
    // Mock a successful submission
    return { id: generateUUID(), ...submission };
  },

  getProblemHistory: async (userId: string) => {
    console.log('Getting problem history for user:', userId);
    // Mock problem history data
    return [
      { id: generateUUID(), title: 'Problem 1', status: 'solved', submittedAt: new Date().toISOString() },
      { id: generateUUID(), title: 'Problem 2', status: 'failed', submittedAt: new Date().toISOString() },
    ];
  },

  getUserProgress: async (userId: string) => {
    console.log('Getting user progress for user:', userId);
    // Mock user progress data
    return {
      completedProblems: 5,
      totalProblems: 10,
      achievements: ['First Problem Solved'],
    };
  },

  uploadMedia: async (file: any) => {
    console.log('Uploading media:', file.name);
    // Mock a successful upload
    return { url: `https://mock-cdn.com/${generateUUID()}-${file.name}` };
  },
};

export default api;
