import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
}

/**
 * Hook to check authentication status
 * Returns authentication state and user information
 */
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token) {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            token: null,
          });
          return;
        }

        // Parse user data
        let user: User | null = null;
        if (userStr) {
          try {
            user = JSON.parse(userStr);
          } catch (e) {
            console.error('Failed to parse user data:', e);
          }
        }

        // Check if user has required role (admin or author)
        const isAuthorized = user && (user.role === 'admin' || user.role === 'author');

        setAuthState({
          isAuthenticated: !!token && isAuthorized,
          isLoading: false,
          user,
          token,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          token: null,
        });
      }
    };

    checkAuth();

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return authState;
}

/**
 * Check if user is authenticated (synchronous check)
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) return false;
  
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    return user && (user.role === 'admin' || user.role === 'author');
  } catch {
    return false;
  }
}

/**
 * Logout user and clear authentication data
 */
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

