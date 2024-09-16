import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDate } from '../DateContext/DateContext';

// Liste des heures par période

const ManageHoursPage = () => {
  const { timeSlot: rawTimeSlot, firstHour } = useParams();
  const navigate = useNavigate();
  const { selectedDate } = useDate();

  // Utilisation de useState pour gérer le duration
  const [duration, setDuration] = useState(0);  // Initialisation à 0
  const [timeSlot, setTimeSlot] = useState(rawTimeSlot);
  // Utilisation de useEffect pour définir duration une fois le composant monté
  useEffect(() => {
    let calculatedDuration;
    let day;
    day = getDayOfWeek(selectedDate);

    if (day === "Vendredi") {
      if(timeSlot === "morning"){
        calculatedDuration = 7;
      }else if(timeSlot === "afternoon"){
        calculatedDuration = 7;
      }else{
        calculatedDuration = 7;
      }
    } else if (timeSlot === "junction") {
      calculatedDuration = 7;
    } else if (day === "Samedi" || day === "Dimanche") {
      calculatedDuration = 13;
    } else {
      if (timeSlot === "morning") {
        calculatedDuration = 9;
      } else if (timeSlot === "afternoon") {
        calculatedDuration = 9;
      } else {
        calculatedDuration = 9;
      }
    }


    setDuration(calculatedDuration);  // Mise à jour de la durée dans l'état
    // eslint-disable-next-line
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


  function getDayOfWeek(selectedDate) {
    const date = new Date(selectedDate);
  
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
    // Récupère le jour de la semaine (0 pour dimanche, 1 pour lundi, etc.)
    const dayOfWeekIndex = date.getDay();
  
    // Retourne le jour correspondant
    return daysOfWeek[dayOfWeekIndex];
  }

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
