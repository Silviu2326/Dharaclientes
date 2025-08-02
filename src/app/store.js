import { QueryClient } from '@tanstack/react-query';

// TanStack Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  therapists: ['therapists'],
  therapist: (id) => ['therapist', id],
  appointments: ['appointments'],
  appointment: (id) => ['appointment', id],
  favorites: ['favorites'],
  notifications: ['notifications'],
  paymentHistory: ['paymentHistory'],
  reviews: ['reviews'],
  journalDocuments: ['journalDocuments'],
  userProfile: ['userProfile'],
};

// Global state helpers (if needed beyond TanStack Query)
export const globalState = {
  user: null,
  isAuthenticated: false,
};