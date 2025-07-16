import React, { createContext, useState, useEffect } from "react";

export const AvengerContext = createContext();

export function AvengerProvider({ children }) {
  const [selectedAvenger, setSelectedAvenger] = useState(null);
  const [missions, setMissions] = useState([]);
  const [editingMission, setEditingMission] = useState(null);

  useEffect(() => {
    const storedAvenger = localStorage.getItem("selectedAvenger");
    if (storedAvenger) setSelectedAvenger(JSON.parse(storedAvenger));
    const storedMissions = localStorage.getItem("missions");
    if (storedMissions) setMissions(JSON.parse(storedMissions));
  }, []);

  const selectAvenger = (hero) => {
    setSelectedAvenger(hero);
    localStorage.setItem("selectedAvenger", JSON.stringify(hero));
  };

  const addMission = (mission) => {
    const updated = [...missions, mission];
    setMissions(updated);
    localStorage.setItem("missions", JSON.stringify(updated));
  };

  const updateMission = (updatedMission) => {
    const updated = missions.map((m) =>
      m.id === updatedMission.id ? { ...updatedMission } : m
    );
    setMissions(updated);
    localStorage.setItem("missions", JSON.stringify(updated));
    setEditingMission(null);
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
      }}
    >
      {children}
    </AvengerContext.Provider>
  );
}
