import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../config/firebase';

/**
 * Create a user document in Firestore
 */
export const createUserDocument = async (user: User, displayName?: string) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    try {
      await setDoc(userRef, {
        email: user.email,
        displayName: displayName || user.displayName || 'User',
        role: 'user',
        emailVerified: user.emailVerified,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }
};

/**
 * Get user role from Firestore
 */
export const getUserRole = async (userId: string): Promise<'user' | 'admin'> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role || 'user';
    }
    return 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};

