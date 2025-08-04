
import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';

// TODO: Replace with your actual Clerk publishable key
const CLERK_PUBLISHABLE_KEY = `pk_test_cGlja2VkLWRvZS0xOS5jbGVyay5hY2NvdW50cy5kZXYk
`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    {children}
  </ClerkProvider>
);

export default AuthProvider;
