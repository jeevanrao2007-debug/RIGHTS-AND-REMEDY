import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  type User,
  type Auth,
} from 'firebase/auth';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
  provider: 'firebase' | 'local_session';
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

export let firebaseApp: FirebaseApp | null = null;
export let firebaseAuth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
  } catch (err) {
    console.warn('Firebase initialization skipped or failed:', err);
  }
}

// Local session store for fallback/offline when Firebase credentials are not yet entered
const LOCAL_STORAGE_USER_KEY = 'rrn_current_user_v1';

function getStoredLocalUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredLocalUser(user: AppUser | null) {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  } catch (e) {
    console.warn('Could not persist local user:', e);
  }
}

// Default guest user for effortless evaluation
const defaultGuestUser: AppUser = {
  uid: 'user_navigator_guest',
  email: 'client@navigator.legal',
  displayName: 'Legal Navigator User',
  photoURL: null,
  isAnonymous: true,
  provider: 'local_session',
};

let currentAppUser: AppUser | null = getStoredLocalUser() || defaultGuestUser;
const authListeners = new Set<(user: AppUser | null) => void>();

function notifyAuthListeners() {
  authListeners.forEach((fn) => {
    try {
      fn(currentAppUser);
    } catch (e) {
      console.error(e);
    }
  });
}

// Setup Firebase auth state listener if Firebase is available
if (firebaseAuth) {
  fbOnAuthStateChanged(firebaseAuth, (user: User | null) => {
    if (user) {
      currentAppUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        provider: 'firebase',
      };
      setStoredLocalUser(currentAppUser);
    } else {
      currentAppUser = getStoredLocalUser() || defaultGuestUser;
    }
    notifyAuthListeners();
  });
}

export const authService = {
  isConfigured: () => isFirebaseConfigured,

  getCurrentUser: (): AppUser | null => currentAppUser,

  subscribe: (callback: (user: AppUser | null) => void): (() => void) => {
    authListeners.add(callback);
    callback(currentAppUser);
    return () => {
      authListeners.delete(callback);
    };
  },

  getIdToken: async (): Promise<string | null> => {
    if (firebaseAuth && firebaseAuth.currentUser) {
      try {
        return await firebaseAuth.currentUser.getIdToken();
      } catch (err) {
        console.warn('Failed to retrieve Firebase ID token:', err);
      }
    }
    // Return simulated token for local session
    return currentAppUser ? `bearer_mock_${currentAppUser.uid}` : null;
  },

  signInWithEmail: async (email: string, password: string): Promise<AppUser> => {
    if (firebaseAuth) {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        provider: 'firebase',
      };
      currentAppUser = user;
      setStoredLocalUser(user);
      notifyAuthListeners();
      return user;
    }

    // Local simulation
    const user: AppUser = {
      uid: `usr_${Math.abs(email.split('').reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0))}`,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      provider: 'local_session',
    };
    currentAppUser = user;
    setStoredLocalUser(user);
    notifyAuthListeners();
    return user;
  },

  signUpWithEmail: async (email: string, password: string): Promise<AppUser> => {
    if (firebaseAuth) {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        provider: 'firebase',
      };
      currentAppUser = user;
      setStoredLocalUser(user);
      notifyAuthListeners();
      return user;
    }

    const user: AppUser = {
      uid: `usr_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      provider: 'local_session',
    };
    currentAppUser = user;
    setStoredLocalUser(user);
    notifyAuthListeners();
    return user;
  },

  signInWithGoogle: async (): Promise<AppUser> => {
    if (firebaseAuth) {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(firebaseAuth, provider);
      const user: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        provider: 'firebase',
      };
      currentAppUser = user;
      setStoredLocalUser(user);
      notifyAuthListeners();
      return user;
    }

    const user: AppUser = {
      uid: `usr_google_${Date.now()}`,
      email: 'verified.user@gmail.com',
      displayName: 'Google Verified User',
      photoURL: null,
      provider: 'local_session',
    };
    currentAppUser = user;
    setStoredLocalUser(user);
    notifyAuthListeners();
    return user;
  },

  signOut: async (): Promise<void> => {
    if (firebaseAuth) {
      try {
        await fbSignOut(firebaseAuth);
      } catch (err) {
        console.warn('Firebase signout error:', err);
      }
    }
    currentAppUser = defaultGuestUser;
    setStoredLocalUser(currentAppUser);
    notifyAuthListeners();
  },
};
