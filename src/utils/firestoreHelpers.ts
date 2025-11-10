import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../config/firebase';
import { Poll, SavedPoll } from '../types/poll.types';
import { Workspace } from '../types/workspace.types';

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
        createdAt: serverTimestamp(),
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

/**
 * Save a poll to Firestore
 */
export const savePollToFirestore = async (poll: Poll, userId: string, workspaceId?: string, title?: string, description?: string): Promise<void> => {
  try {
    if (!userId) {
      throw new Error('User ID is required to save poll');
    }

    const pollRef = doc(db, 'polls', poll.id);
    
    const pollData = {
      id: poll.id,
      question: poll.question,
      choices: poll.choices,
      createdAt: poll.createdAt instanceof Date ? Timestamp.fromDate(poll.createdAt) : serverTimestamp(),
      lastModified: serverTimestamp(),
      design: poll.design || {
        theme: 'designer',
        primaryColor: '#8f4eff',
        fontStyle: 'sans',
        layout: 'card',
      },
      backgroundImage: poll.design?.backgroundImage || null,
      userId, // Required for security rules
      workspaceId: workspaceId || 'default', // Use 'default' if no workspace selected
      title: title || `Poll: ${poll.question.substring(0, 30)}${poll.question.length > 30 ? '...' : ''}`,
      description: description || '',
      totalVotes: poll.choices.reduce((sum, choice) => sum + choice.votes, 0),
      sharedWith: poll.sharedWith || [],
      permissions: poll.permissions || {},
      isPublic: false,
      shareableLink: `${window.location.origin}/poll/${poll.id}`,
    };

    console.log('Saving poll to Firestore:', {
      pollId: poll.id,
      userId,
      workspaceId: workspaceId || 'default',
      question: poll.question,
      choicesCount: poll.choices.length,
    });

    await setDoc(pollRef, pollData, { merge: true });
    
    console.log('✅ Poll successfully written to Firestore');
  } catch (error: any) {
    console.error('❌ Error saving poll to Firestore:', error);
    // Provide more detailed error message
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules allow authenticated users to create polls.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firestore is unavailable. Please check your internet connection.');
    } else {
      throw new Error(`Failed to save poll: ${error.message || 'Unknown error'}`);
    }
  }
};

/**
 * Load polls from Firestore for a specific user
 */
export const loadPollsFromFirestore = async (userId: string, workspaceId?: string): Promise<SavedPoll[]> => {
  try {
    const pollsRef = collection(db, 'polls');
    let q;
    
    if (workspaceId) {
      q = query(pollsRef, where('userId', '==', userId), where('workspaceId', '==', workspaceId));
    } else {
      q = query(pollsRef, where('userId', '==', userId));
    }
    
    const querySnapshot = await getDocs(q);
    const polls: SavedPoll[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      polls.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        question: data.question,
        choices: data.choices || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        lastModified: data.lastModified?.toDate() || new Date(),
        totalVotes: data.totalVotes || 0,
        design: data.design || { theme: 'designer', primaryColor: '#8f4eff', fontStyle: 'sans', layout: 'card' },
        backgroundImage: data.backgroundImage || undefined,
        userId: data.userId,
        sharedWith: data.sharedWith || [],
        permissions: data.permissions || {},
      });
    });
    
    return polls;
  } catch (error) {
    console.error('Error loading polls from Firestore:', error);
    throw new Error('Failed to load polls. Please try again.');
  }
};

/**
 * Load shared polls (where user email is in sharedWith array)
 */
export const loadSharedPollsFromFirestore = async (userEmail: string): Promise<SavedPoll[]> => {
  try {
    const pollsRef = collection(db, 'polls');
    const q = query(pollsRef, where('sharedWith', 'array-contains', userEmail));
    
    const querySnapshot = await getDocs(q);
    const polls: SavedPoll[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      polls.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        question: data.question,
        choices: data.choices || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        lastModified: data.lastModified?.toDate() || new Date(),
        totalVotes: data.totalVotes || 0,
        design: data.design || { theme: 'designer', primaryColor: '#8f4eff', fontStyle: 'sans', layout: 'card' },
        backgroundImage: data.backgroundImage || undefined,
        userId: data.userId,
        sharedWith: data.sharedWith || [],
        permissions: data.permissions || {},
      });
    });
    
    return polls;
  } catch (error) {
    console.error('Error loading shared polls from Firestore:', error);
    return [];
  }
};

/**
 * Load a single poll by ID (for sharing/public access)
 */
export const loadPollByIdFromFirestore = async (pollId: string): Promise<SavedPoll | null> => {
  try {
    const pollRef = doc(db, 'polls', pollId);
    const pollSnap = await getDoc(pollRef);
    
    if (pollSnap.exists()) {
      const data = pollSnap.data();
      return {
        id: pollSnap.id,
        title: data.title || '',
        description: data.description || '',
        question: data.question,
        choices: data.choices || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        lastModified: data.lastModified?.toDate() || new Date(),
        totalVotes: data.totalVotes || 0,
        design: data.design || { theme: 'designer', primaryColor: '#8f4eff', fontStyle: 'sans', layout: 'card' },
        backgroundImage: data.backgroundImage || undefined,
        userId: data.userId,
        sharedWith: data.sharedWith || [],
        permissions: data.permissions || {},
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading poll by ID from Firestore:', error);
    return null;
  }
};

/**
 * Update a poll in Firestore
 */
export const updatePollInFirestore = async (poll: Poll, userId: string, _workspaceId?: string, title?: string, description?: string): Promise<void> => {
  try {
    const pollRef = doc(db, 'polls', poll.id);
    
    // Verify ownership
    const pollSnap = await getDoc(pollRef);
    if (!pollSnap.exists() || pollSnap.data().userId !== userId) {
      throw new Error('You do not have permission to update this poll');
    }
    
    await updateDoc(pollRef, {
      question: poll.question,
      choices: poll.choices,
      lastModified: serverTimestamp(),
      design: poll.design,
      backgroundImage: poll.design?.backgroundImage || null,
      title: title || pollSnap.data().title,
      description: description || pollSnap.data().description || '',
      totalVotes: poll.choices.reduce((sum, choice) => sum + choice.votes, 0),
    });
  } catch (error) {
    console.error('Error updating poll in Firestore:', error);
    throw error;
  }
};

/**
 * Delete a poll from Firestore
 */
export const deletePollFromFirestore = async (pollId: string, userId: string): Promise<void> => {
  try {
    const pollRef = doc(db, 'polls', pollId);
    
    // Verify ownership
    const pollSnap = await getDoc(pollRef);
    if (!pollSnap.exists() || pollSnap.data().userId !== userId) {
      throw new Error('You do not have permission to delete this poll');
    }
    
    await deleteDoc(pollRef);
  } catch (error) {
    console.error('Error deleting poll from Firestore:', error);
    throw error;
  }
};

/**
 * Share a poll with another user by email
 */
export const sharePollWithUser = async (pollId: string, userId: string, email: string, permission: 'view' | 'edit' | 'delete' = 'view'): Promise<void> => {
  try {
    const pollRef = doc(db, 'polls', pollId);
    
    // Verify ownership
    const pollSnap = await getDoc(pollRef);
    if (!pollSnap.exists() || pollSnap.data().userId !== userId) {
      throw new Error('You do not have permission to share this poll');
    }
    
    const data = pollSnap.data();
    const sharedWith = data.sharedWith || [];
    const permissions = data.permissions || {};
    
    if (!sharedWith.includes(email)) {
      sharedWith.push(email);
    }
    permissions[email] = permission;
    
    await updateDoc(pollRef, {
      sharedWith,
      permissions,
    });
  } catch (error) {
    console.error('Error sharing poll:', error);
    throw error;
  }
};

/**
 * Create a workspace in Firestore
 */
export const createWorkspaceInFirestore = async (workspace: Omit<Workspace, 'id'>, userId: string): Promise<string> => {
  try {
    const workspacesRef = collection(db, 'workspaces');
    // Explicitly set only the fields we need for Firestore
    // Note: ownerId and members are required for security rules
    const workspaceData = {
      name: workspace.name,
      description: workspace.description || '',
      color: workspace.color,
      icon: workspace.icon,
      pollCount: workspace.pollCount || 0,
      ownerId: userId, // Required for security rules
      members: [userId], // Array including the owner's UID
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
    };
    
    const docRef = doc(workspacesRef);
    await setDoc(docRef, workspaceData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating workspace in Firestore:', error);
    throw new Error('Failed to create workspace. Please try again.');
  }
};

/**
 * Load workspaces from Firestore for a user
 */
export const loadWorkspacesFromFirestore = async (userId: string): Promise<Workspace[]> => {
  try {
    const workspacesRef = collection(db, 'workspaces');
    const q = query(workspacesRef, where('members', 'array-contains', userId));
    
    const querySnapshot = await getDocs(q);
    const workspaces: Workspace[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      workspaces.push({
        id: doc.id,
        name: data.name,
        description: data.description || '',
        color: data.color || '#8f4eff',
        icon: data.icon || '📊',
        createdAt: data.createdAt?.toDate() || new Date(),
        lastModified: data.lastModified?.toDate() || new Date(),
        pollCount: data.pollCount || 0,
      });
    });
    
    return workspaces;
  } catch (error) {
    console.error('Error loading workspaces from Firestore:', error);
    return [];
  }
};

/**
 * Update a workspace in Firestore
 */
export const updateWorkspaceInFirestore = async (workspaceId: string, updates: Partial<Workspace>, userId: string): Promise<void> => {
  try {
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    
    // Verify ownership
    const workspaceSnap = await getDoc(workspaceRef);
    if (!workspaceSnap.exists() || workspaceSnap.data().ownerId !== userId) {
      throw new Error('You do not have permission to update this workspace');
    }
    
    await updateDoc(workspaceRef, {
      ...updates,
      lastModified: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating workspace in Firestore:', error);
    throw error;
  }
};

/**
 * Delete a workspace from Firestore
 */
export const deleteWorkspaceFromFirestore = async (workspaceId: string, userId: string): Promise<void> => {
  try {
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    
    // Verify ownership
    const workspaceSnap = await getDoc(workspaceRef);
    if (!workspaceSnap.exists() || workspaceSnap.data().ownerId !== userId) {
      throw new Error('You do not have permission to delete this workspace');
    }
    
    await deleteDoc(workspaceRef);
  } catch (error) {
    console.error('Error deleting workspace from Firestore:', error);
    throw error;
  }
};
