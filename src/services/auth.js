import {
  getFirebaseAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from './firebase';

const SESSION_KEY = 'scrs_klu_auth_user_v2';

// Designated Admin / Core Coordinator emails
export const ADMIN_EMAILS = [
  'admin@klu.ac.in',
  'scrs.admin@klu.ac.in',
  'scrs.lead@klu.ac.in',
  'core@klu.ac.in',
  'president@klu.ac.in',
  'faculty@klu.ac.in'
];

export function isKluEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase().endsWith('@klu.ac.in');
}

export function isAdminEmail(email) {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(clean) || clean.startsWith('admin');
}

export function getUserRole(email) {
  return isAdminEmail(email) ? 'admin' : 'participant';
}

// Get currently stored user session
export function getCurrentUser() {
  const auth = getFirebaseAuth();
  if (auth && auth.currentUser) {
    const email = auth.currentUser.email;
    return {
      uid: auth.currentUser.uid,
      email: email,
      displayName: auth.currentUser.displayName || email.split('@')[0],
      photoURL: auth.currentUser.photoURL,
      role: getUserRole(email),
      isFirebase: true
    };
  }

  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        role: getUserRole(parsed.email)
      };
    } catch {
      return null;
    }
  }
  return null;
}

// Subscribe to auth state changes
export function subscribeToAuth(callback) {
  const auth = getFirebaseAuth();
  if (auth) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (!isKluEmail(firebaseUser.email)) {
          signOut(auth);
          localStorage.removeItem(SESSION_KEY);
          callback(null, 'Access denied. You must use an official @klu.ac.in email account.');
          return;
        }

        const role = getUserRole(firebaseUser.email);
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL,
          role: role,
          isFirebase: true
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        callback(user, null);
      } else {
        const local = localStorage.getItem(SESSION_KEY);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            callback({ ...parsed, role: getUserRole(parsed.email) }, null);
            return;
          } catch {
            // ignore
          }
        }
        callback(null, null);
      }
    });
  }

  // Fallback to local session
  const user = getCurrentUser();
  callback(user, null);
  return () => {};
}

// Google Sign-In with @klu.ac.in
export async function signInWithGoogleKlu() {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error(
      'Firebase Auth is not initialized. Please verify your credentials in src/services/firebase.js.'
    );
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    hd: 'klu.ac.in',
    prompt: 'select_account'
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!isKluEmail(user.email)) {
      await signOut(auth);
      localStorage.removeItem(SESSION_KEY);
      throw new Error('Access denied. You must use an official @klu.ac.in email account.');
    }

    const role = getUserRole(user.email);
    const sessionUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL,
      role: role,
      isFirebase: true
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  } catch (err) {
    if (err.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Google Sign-In is not enabled yet in your Firebase Console. Go to Firebase Console > Authentication > Sign-in method and enable Google.'
      );
    }
    if (err.code === 'auth/unauthorized-domain') {
      throw new Error(
        'localhost is not authorized in Firebase. Go to Firebase Console > Authentication > Settings > Authorized domains and ensure "localhost" is added.'
      );
    }
    if (err.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by browser. Please allow popups or enter your @klu.ac.in email below.');
    }
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in popup was closed before completing authentication.');
    }
    throw err;
  }
}

// Direct sign-in using official organization email without password
export async function signInWithOrgEmailOnly(email) {
  const cleanEmail = email.trim().toLowerCase();

  if (!isKluEmail(cleanEmail)) {
    throw new Error('Restricted: Only official university emails ending with @klu.ac.in are allowed.');
  }

  const role = getUserRole(cleanEmail);
  const user = {
    uid: 'klu-' + btoa(cleanEmail).slice(0, 12),
    email: cleanEmail,
    displayName: cleanEmail.split('@')[0].toUpperCase(),
    role: role,
    isFirebase: Boolean(getFirebaseAuth())
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

// Sign out
export async function signOutParticipant() {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
  }
  localStorage.removeItem(SESSION_KEY);
}
