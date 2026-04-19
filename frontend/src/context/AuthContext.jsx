/**
 * Auth Context - provides authentication state throughout the app
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginWithGoogle, logout as firebaseLogout, isDemo, DEMO_USER } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      if (isDemo) {
        setUser(DEMO_USER);
      }
      // For real Firebase, onAuthStateChanged would handle this
    }
    setLoading(false);
  }, []);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await loginWithGoogle();
      setUser({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        isDemo: userData.isDemo || false,
      });
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseLogout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.email === 'admin@eventflow.ai' || isDemo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
