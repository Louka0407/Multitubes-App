import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Liste des heures par période

const ManageHoursPage = () => {
  const { timeSlot: rawTimeSlot, firstHour } = useParams();
  const navigate = useNavigate();
  
  // Utilisation de useState pour gérer le duration
  const [duration, setDuration] = useState(0);  // Initialisation à 0
  const [timeSlot, setTimeSlot] = useState(rawTimeSlot);

  // Utilisation de useEffect pour définir duration une fois le composant monté
  useEffect(() => {
    let calculatedDuration;
    let date = new Date();
    let day = date.toLocaleString('fr-FR', { weekday: 'long' });

    console.log("Jour : " + day);
    
    if (day === "vendredi") {
      calculatedDuration = 7;
    } else if (timeSlot === "Jonction") {
      calculatedDuration = 7;
    } else if (day === "samedi" || day === "dimanche") {
      calculatedDuration = 13;
    } else {
      if (timeSlot === "Matin") {
        setTimeSlot("morning");
        calculatedDuration = 9;
      } else if (timeSlot === "Après-midi") {
        setTimeSlot("afternoon");
        calculatedDuration = 9;
      } else {
        setTimeSlot("night");
        calculatedDuration = 9;
      }
    }

    setDuration(calculatedDuration);  // Mise à jour de la durée dans l'état
  }, [timeSlot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const firstHourB = parseInt(firstHour, 10);
    let nextHour = (firstHourB + 1) % 24;

    console.log("Duration: " + duration);
    
    if (duration > 1) {
      navigate(`/manage-hours/${timeSlot}/${nextHour}`);
    } else {
      navigate('/completion');
    }

    setDuration(prevDuration => prevDuration - 1);  // Décrémente duration

  };

  const formattedFirstHour = String(firstHour).padStart(2, '0');


  return (
    <div>
      {/* firstHour = nextHour c'est juste le nom que j'ai donnée dans le param dans SelectTimeSlotPage*/}
      <h1>Heure : {formattedFirstHour}</h1>
      <form onSubmit={handleSubmit}>
        {['Titre 1', 'Titre 2', 'Titre 3', 'Titre 4', 'Titre 5', 'Titre 6', 'Titre 7', 'Titre 8', 'Titre 9', 'Titre 10'].map((title, index) => (
          <div key={index}>
            <label>{title}</label>
            <button type="button">OK</button>
            <button type="button">Non OK</button>
          </div>
        ))}
        <button type="submit">Suivant</button>
      </form>
    </div>
  );
};

export default ManageHoursPage;
