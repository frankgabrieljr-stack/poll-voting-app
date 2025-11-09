import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'user' | 'admin';
  createdAt: any;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserDisplayName: (displayName: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or get user document in Firestore
  const createUserDocument = async (user: User, displayName?: string) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        email: user.email,
        displayName: displayName || user.displayName || 'User',
        role: 'user', // Default role
        createdAt: serverTimestamp(),
      });
    }
  };

  // Fetch user data from Firestore
  const fetchUserData = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData({
          uid: user.uid,
          email: user.email,
          displayName: userSnap.data().displayName || user.displayName,
          role: userSnap.data().role || 'user',
          createdAt: userSnap.data().createdAt,
        });
      } else {
        // Create user document if it doesn't exist
        await createUserDocument(user);
        fetchUserData(user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      await createUserDocument(user, displayName);

      // Fetch user data
      await fetchUserData(user);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to logout');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  };

  const updateUserDisplayName = async (displayName: string) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      // Update Firebase Auth
      await updateProfile(currentUser, { displayName });

      // Update Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { displayName });

      // Refresh user data
      await fetchUserData(currentUser);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update display name');
    }
  };

  const updateUserEmail = async (newEmail: string) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      await updateEmail(currentUser, newEmail);

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { email: newEmail });

      await fetchUserData(currentUser);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update email');
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      await updatePassword(currentUser, newPassword);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update password');
    }
  };

  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    register,
    login,
    logout,
    resetPassword,
    updateUserDisplayName,
    updateUserEmail,
    updateUserPassword,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

