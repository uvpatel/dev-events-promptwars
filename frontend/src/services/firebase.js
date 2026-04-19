/**
 * Firebase Configuration & Initialization
 * Falls back to demo mode if credentials are not configured
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true' ||
  !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'your-firebase-api-key';

let auth = null;
let googleProvider = null;

if (!isDemo) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

// Demo user object
const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@eventflow.ai',
  displayName: 'Demo User',
  photoURL: null,
  isDemo: true,
};

/**
 * Sign in with Google (or demo mode)
 */
export async function loginWithGoogle() {
  if (isDemo) {
    localStorage.setItem('authToken', 'demo-token');
    return DEMO_USER;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    localStorage.setItem('authToken', token);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Sign out
 */
export async function logout() {
  localStorage.removeItem('authToken');
  if (!isDemo && auth) {
    await signOut(auth);
  }
}

/**
 * Get current auth state
 */
export function onAuthChange(callback) {
  if (isDemo) {
    // Check if demo user is "logged in"
    const token = localStorage.getItem('authToken');
    if (token) {
      callback(DEMO_USER);
    } else {
      callback(null);
    }
    return () => { };
  }

  const { onAuthStateChanged } = require('firebase/auth');
  return onAuthStateChanged(auth, callback);
}

export { auth, isDemo, DEMO_USER };


