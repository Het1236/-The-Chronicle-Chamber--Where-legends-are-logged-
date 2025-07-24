import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext, useAuth } from "./AuthContext";
import {
  getSelectedAvenger,
  saveSelectedAvenger,
  getMissions,
  addMission as addMissionToFirebase,
  updateMission as updateMissionInFirebase,
  deleteMission as deleteMissionFromFirebase
} from "../services/firebaseService";

export const AvengerContext = createContext();

export function AvengerProvider({ children }) {
  const [selectedAvenger, setSelectedAvenger] = useState(null);
  const [missions, setMissions] = useState([]);
  const [editingMission, setEditingMission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get auth context
  const auth = useContext(AuthContext);
  const currentUser = auth?.currentUser;
  const authLoading = auth?.loading || false;

  // Load data from Firebase when user authentication state changes
  useEffect(() => {
    console.log('AvengerContext: Auth state changed', { currentUser, authLoading });
    
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('AvengerContext: Loading data from Firebase');
        
        // Only proceed if user is authenticated
        if (currentUser) {
          console.log('AvengerContext: User is authenticated, loading data');
          // Get selected avenger from Firebase
          const avenger = await getSelectedAvenger();
          console.log('AvengerContext: Selected avenger loaded', avenger);
          if (avenger) setSelectedAvenger(avenger);
          
          // Get all missions from Firebase
          const missionsList = await getMissions();
          console.log('AvengerContext: Missions loaded', missionsList.length);
          setMissions(missionsList);
        } else {
          console.log('AvengerContext: User is not authenticated, resetting state');
          // Reset state when user is not authenticated
          setSelectedAvenger(null);
          setMissions([]);
        }
      } catch (error) {
        console.error("Error loading data from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Only load data when auth state is determined (not loading)
    if (auth && !authLoading) {
      loadData();
    }
  }, [currentUser, authLoading, auth]);

  const selectAvenger = async (hero) => {
    try {
      setSelectedAvenger(hero);
      await saveSelectedAvenger(hero);
    } catch (error) {
      console.error("Error selecting avenger:", error);
    }
  };

  const addMission = async (mission) => {
    try {
      const newMission = await addMissionToFirebase(mission);
      if (newMission) {
        setMissions([...missions, newMission]);
      }
    } catch (error) {
      console.error("Error adding mission:", error);
    }
  };

  const updateMission = async (updatedMission) => {
    try {
      console.log("AvengerContext: Updating mission with ID:", updatedMission.id);
      
      // Ensure the mission has an ID
      if (!updatedMission.id) {
        throw new Error("Cannot update mission without an ID");
      }
      
      // Call Firebase service to update the mission
      const result = await updateMissionInFirebase(updatedMission);
      
      if (result) {
        // Update local state
        const updatedMissions = missions.map((mission) =>
          mission.id === updatedMission.id ? updatedMission : mission
        );
        
        setMissions(updatedMissions);
        setEditingMission(null);
        
        console.log("AvengerContext: Mission updated successfully");
        return true;
      }
    } catch (error) {
      console.error("AvengerContext: Error updating mission:", error);
      throw error; // Re-throw to allow handling in the component
    }
  };

  const deleteMission = async (id) => {
    try {
      console.log("AvengerContext: Deleting mission with ID:", id);
      
      // Call Firebase service to delete the mission
      const success = await deleteMissionFromFirebase(id);
      
      if (success) {
        // Update local state by filtering out the deleted mission
        const updated = missions.filter((m) => m.id !== id);
        setMissions(updated);
        console.log("AvengerContext: Mission deleted successfully");
        return true;
      } else {
        throw new Error("Failed to delete mission");
      }
    } catch (error) {
      console.error("AvengerContext: Error deleting mission:", error);
      throw error; // Re-throw to allow handling in the component
    }
  };

  return (
    <AvengerContext.Provider
      value={{
        selectedAvenger,
        selectAvenger,
        missions,
        addMission,
        editingMission,
        setEditingMission,
        updateMission,
        deleteMission,
        loading,
      }}
    >
      {children}
    </AvengerContext.Provider>
  );
}
