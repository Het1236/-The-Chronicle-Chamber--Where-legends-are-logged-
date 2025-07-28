import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChange, getUserData } from '../services/authService';
import { auth } from '../config/firebase';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remove this console log
    // console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChange(async (user) => {
      // Remove this console log
      // console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get additional user data from Firestore
          const { userData, error } = await getUserData(user.uid);
          if (!error) {
            // Remove this console log
            // console.log('User data loaded:', userData);
            setUserData(userData);
          } else {
            console.error('Error loading user data:', error);
          }
        } catch (err) {
          console.error('Exception loading user data:', err);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Initialize with current user if already logged in
    const currentAuthUser = auth.currentUser;
    if (currentAuthUser) {
      // Remove this console log
      // console.log('Current user already available:', currentAuthUser.uid);
      setCurrentUser(currentAuthUser);
      getUserData(currentAuthUser.uid).then(({ userData, error }) => {
        if (!error) {
          // Remove this console log
          // console.log('Initial user data loaded:', userData);
          setUserData(userData);
        }
        setLoading(false);
      });
    }

    return unsubscribe;
  }, []);

  // Update user data when it changes
  const updateUserData = async () => {
    if (currentUser) {
      const { userData, error } = await getUserData(currentUser.uid);
      if (!error) {
        setUserData(userData);
      }
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}