# Firebase Setup Guide for Poll Voting App

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "poll-voting-app")
4. Follow the setup wizard
5. Enable Google Analytics (optional)

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

## Step 3: Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Start in **test mode** (we'll add security rules later)
4. Choose a location (closest to your users)
5. Click "Enable"

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 5: Add Configuration to App

1. Create a `.env` file in the root of your project:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

2. Replace the values with your actual Firebase config values

## Step 6: Set Up Admin User

1. Go to **Authentication** > **Users** in Firebase Console
2. Create a test user or use your own email
3. Go to **Firestore Database** > **Data**
4. Create a collection called `users`
5. Create a document with ID = your user's UID (from Authentication)
6. Add these fields:
   - `email`: "your-email@example.com"
   - `displayName`: "Admin User"
   - `role`: "admin"
   - `createdAt`: (timestamp)

## Step 7: Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users can read their own data, admins can read all
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if isAdmin();
    }
    
    // Polls: users can CRUD their own, read shared polls
    match /polls/{pollId} {
      allow read: if request.auth != null && 
                  (resource.data.userId == request.auth.uid || 
                   request.auth.token.email in resource.data.sharedWith ||
                   !resource.data.userId); // Public polls (no userId)
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                            (resource.data.userId == request.auth.uid || isAdmin());
      
      // Admins can do anything
      allow read, write: if isAdmin();
    }
  }
}
```

## Step 8: Test the Setup

1. Start your app: `npm run dev`
2. Try to register a new account
3. Check Firebase Console to see if user was created
4. Check Firestore to see if user document was created
5. Try creating a poll and verify it's saved to Firestore

## Troubleshooting

- **"Firebase: Error (auth/configuration-not-found)"**: Make sure your `.env` file has all the correct values
- **"Permission denied"**: Check your Firestore security rules
- **User not created in Firestore**: Check browser console for errors, verify AuthContext is working

## Next Steps

After setup is complete:
1. Update WorkspaceContext to use Firestore instead of localStorage
2. Test poll creation with user authentication
3. Test poll sharing functionality
4. Set up admin dashboard

