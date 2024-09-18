import React, { createContext, useState, useContext, useEffect } from 'react';

// Créer le contexte
const DateContext = createContext();

// Créer le provider du contexte
export const DateProvider = ({ children }) => {
  const storedDate = localStorage.getItem('selectedDate');
  const initialDate = storedDate ? new Date(storedDate) : new Date();

  const [selectedDate, setSelectedDate] = useState(initialDate);

  // recup la date du localstorage
  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate);
  }, [selectedDate]);

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
