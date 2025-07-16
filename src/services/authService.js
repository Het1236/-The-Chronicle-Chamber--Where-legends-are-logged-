import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, facebookProvider, db } from '../config/firebase';

// Create a new user with email and password
export const registerWithEmailAndPassword = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's profile with display name
    await updateProfile(user, { displayName });
    
    // Create a user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
      selectedHeroes: [],
      photoURL: user.photoURL || null
    });
    
    return { user };
  } catch (error) {
    return { error };
  }
};

// Sign in with email and password
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date().toISOString(),
        selectedHeroes: [],
        photoURL: user.photoURL || null
      });
    }
    
    return { user };
  } catch (error) {
    return { error };
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    
    // Check if user document exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date().toISOString(),
        selectedHeroes: [],
        photoURL: user.photoURL || null
      });
    }
    
    return { user };
  } catch (error) {
    return { error };
  }
};

// Sign out
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get user data from Firestore
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { userData: userDoc.data() };
    } else {
      // Create a new user document if it doesn't exist
      const newUserData = {
        uid,
        email: auth.currentUser?.email || '',
        displayName: auth.currentUser?.displayName || '',
        createdAt: new Date().toISOString(),
        selectedHeroes: [],
        photoURL: auth.currentUser?.photoURL || null
      };
      
      await setDoc(doc(db, 'users', uid), newUserData);
      return { userData: newUserData };
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return { error };
  }
};

// Update user's selected heroes
export const updateUserSelectedHeroes = async (uid, selectedHero) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const selectedHeroes = userData.selectedHeroes || [];
      
      // Check if hero already exists in the array
      const heroExists = selectedHeroes.some(hero => hero.id === selectedHero.id);
      
      if (!heroExists) {
        // Add the hero to the array
        const updatedHeroes = [...selectedHeroes, selectedHero];
        
        // Update the user document
        await setDoc(doc(db, 'users', uid), {
          ...userData,
          selectedHeroes: updatedHeroes
        });
        
        return { success: true, selectedHeroes: updatedHeroes };
      }
      
      return { success: true, selectedHeroes };
    } else {
      return { error: 'User not found' };
    }
  } catch (error) {
    return { error };
  }
};