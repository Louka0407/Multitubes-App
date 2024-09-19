import React, { createContext, useState, useContext, useEffect } from 'react';

// Créer le contexte
const DateContext = createContext();

// Créer le provider du contexte
export const DateProvider = ({ children }) => {
  const storedDate = localStorage.getItem('selectedDate');
  const storedLine = localStorage.getItem('selectedLine');
  const initialDate = storedDate ? new Date(storedDate) : new Date();
  const initialLine = storedLine ? parseInt(storedLine, 10) : 10; // Valeur par défaut si aucune ligne n'est stockée

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [line, setLine] = useState(initialLine);

  // Sauvegarder la date et la ligne dans le localStorage
  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('selectedLine', line);
  }, [line]);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate, line, setLine }}>
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
