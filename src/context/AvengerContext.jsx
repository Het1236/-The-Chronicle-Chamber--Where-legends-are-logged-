import React, { createContext, useState, useEffect } from 'react';

export const AvengerContext = createContext();

export function AvengerProvider({ children }) {
  const [selectedAvenger, setSelectedAvenger] = useState(null);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const storedAvenger = localStorage.getItem('selectedAvenger');
    if (storedAvenger) setSelectedAvenger(JSON.parse(storedAvenger));
    const storedMissions = localStorage.getItem('missions');
    if (storedMissions) setMissions(JSON.parse(storedMissions));
  }, []);

  const selectAvenger = (hero) => {
    setSelectedAvenger(hero);
    localStorage.setItem('selectedAvenger', JSON.stringify(hero));
  };

  const addMission = (mission) => {
    const updated = [...missions, mission];
    setMissions(updated);
    localStorage.setItem('missions', JSON.stringify(updated));
  };

  return (
    <AvengerContext.Provider value={{
      selectedAvenger, selectAvenger,
      missions, addMission
    }}>
      {children}
    </AvengerContext.Provider>
  );
}