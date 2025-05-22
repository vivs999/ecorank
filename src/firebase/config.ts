import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
// For deployment, set these up in your hosting environment
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDN6xE8JZhNWnIIj4_TKvE7mG3H4tvoyd4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "ecorank-app.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "ecorank-app",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "ecorank-app.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "354890216782",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:354890216782:web:2e8f72b3dc048a6c3a82f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app); 