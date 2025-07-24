import { db, auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  setDoc 
} from 'firebase/firestore';

// Collection references
const AVENGERS_COLLECTION = 'avengers';
const MISSIONS_COLLECTION = 'missions';

// Avenger related functions
export const getAvengers = async () => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve([]);
          return;
        }
        
        const querySnapshot = await getDocs(collection(db, AVENGERS_COLLECTION));
        resolve(querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      });
    });
  } catch (error) {
    console.error('Error getting avengers:', error);
    return [];
  }
};

export const getAvengerById = async (id) => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve(null);
          return;
        }
        
        const docRef = doc(db, AVENGERS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          resolve({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          console.log('No such avenger!');
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting avenger:', error);
    return null;
  }
};

export const saveSelectedAvenger = async (avenger) => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve(false);
          return;
        }
        
        // Save to the user's document instead of a global document
        const docRef = doc(db, 'users', user.uid);
        // Use setDoc with merge option to create the document if it doesn't exist
        await setDoc(docRef, { selectedAvenger: avenger }, { merge: true });
        resolve(true);
      });
    });
  } catch (error) {
    console.error('Error saving selected avenger:', error);
    return false;
  }
};

export const getSelectedAvenger = async () => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve(null);
          return;
        }
        
        // Get from the user's document
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().selectedAvenger) {
          resolve(docSnap.data().selectedAvenger);
        } else {
          // Create the user document if it doesn't exist
          if (!docSnap.exists()) {
            await setDoc(docRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString()
            }, { merge: true });
            console.log('Created new user document');
          }
          console.log('No selected avenger found for this user');
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting selected avenger:', error);
    return null;
  }
};

// Mission related functions
export const getMissions = async () => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve([]);
          return;
        }
        
        // Check if user document exists
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        // Create user document if it doesn't exist
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString()
          });
          console.log('Created new user document in getMissions');
        }
        
        // Query only missions for the current user
        const q = query(collection(db, MISSIONS_COLLECTION), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        resolve(querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      });
    });
  } catch (error) {
    console.error('Error getting missions:', error);
    return [];
  }
};

export const getMissionsByHeroId = async (heroId) => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve([]);
          return;
        }
        
        // Query only missions for the current user with the specified heroId
        const q = query(
          collection(db, MISSIONS_COLLECTION), 
          where("uid", "==", user.uid),
          where("heroId", "==", heroId)
        );
        const querySnapshot = await getDocs(q);
        resolve(querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      });
    });
  } catch (error) {
    console.error('Error getting missions by hero ID:', error);
    return [];
  }
};

export const addMission = async (mission) => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve(null);
          return;
        }
        
        // Add the user ID to the mission data
        const missionWithUser = {
          ...mission,
          uid: user.uid // Add user ID to the mission
        };
        
        const docRef = await addDoc(collection(db, MISSIONS_COLLECTION), missionWithUser);
        resolve({
          id: docRef.id,
          ...missionWithUser
        });
      });
    });
  } catch (error) {
    console.error('Error adding mission:', error);
    return null;
  }
};

export const updateMission = async (mission) => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve(null);
          return;
        }
        
        console.log("Firebase: Updating mission with ID:", mission.id);
        
        const { id, ...missionData } = mission;
        // First check if this mission belongs to the current user
        const missionRef = doc(db, MISSIONS_COLLECTION, id);
        const missionSnap = await getDoc(missionRef);
        
        if (!missionSnap.exists()) {
          console.error('Mission not found');
          resolve(null);
          return;
        }
        
        const existingMission = missionSnap.data();
        if (existingMission.uid !== user.uid) {
          console.error('Permission denied: This mission belongs to another user');
          resolve(null);
          return;
        }
        
        // Ensure we don't change the uid when updating and add timestamp
        const secureUpdatedMission = {
          ...missionData,
          uid: user.uid, // Ensure the uid stays the same
          updatedAt: new Date().toISOString() // Add timestamp for when it was updated
        };
        
        console.log("Firebase: Updating document with data:", secureUpdatedMission);
        await updateDoc(missionRef, secureUpdatedMission);
        
        console.log("Firebase: Mission updated successfully");
        resolve({
          id,
          ...secureUpdatedMission
        });
      });
    });
  } catch (error) {
    console.error('Firebase: Error updating mission:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const deleteMission = async (missionId) => {
  try {
    // Wait for auth state to be initialized
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user
        
        if (!user) {
          console.error('No authenticated user found');
          resolve(false);
          return;
        }
        
        console.log("Firebase: Deleting mission with ID:", missionId);
        
        // First check if this mission belongs to the current user
        const missionRef = doc(db, MISSIONS_COLLECTION, missionId);
        const missionSnap = await getDoc(missionRef);
        
        if (!missionSnap.exists()) {
          console.error('Mission not found');
          resolve(false);
          return;
        }
        
        const missionData = missionSnap.data();
        if (missionData.uid !== user.uid) {
          console.error('Permission denied: This mission belongs to another user');
          resolve(false);
          return;
        }
        
        // Now we can safely delete the mission
        await deleteDoc(missionRef);
        console.log("Firebase: Mission deleted successfully");
        resolve(true);
      });
    });
  } catch (error) {
    console.error('Firebase: Error deleting mission:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};