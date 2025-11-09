import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjokFV54qKN0OVZ1_pWEiNsdjSBhMOjkE",
  authDomain: "poll-voting-app-80a35.firebaseapp.com",
  projectId: "poll-voting-app-80a35",
  storageBucket: "poll-voting-app-80a35.firebasestorage.app",
  messagingSenderId: "112476376403",
  appId: "1:112476376403:web:ca4048a4cd884bbfffa5a6",
  measurementId: "G-SH8Y5Z9TK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

