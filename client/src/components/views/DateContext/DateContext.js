import React, { createContext, useState, useContext } from 'react';

// Créer le contexte
const DateContext = createContext();

// Créer le provider du contexte
export const DateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte de la date
export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};
