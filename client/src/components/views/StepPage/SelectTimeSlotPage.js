import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDate } from '../DateContext/DateContext';

const SelectTimeSlotPage = () => {
  const navigate = useNavigate();
  const { selectedDate } = useDate();

  const handleSelectTimeSlot = (timeSlot) => {
    let firstHour;
    let day = getDayOfWeek(selectedDate);

    console.log("Selected Day: ", day);

    if(day === "Vendredi"){
      if(timeSlot === "morning"){
        firstHour = 6;
      }
      else if(timeSlot === "afternoon"){
        firstHour = 12;
      }
      else{
        firstHour = 18;
      }
    } else if(timeSlot === "junction"){
      firstHour = 0;
    } else if(day === "Samedi" || day === "Dimanche"){
      if(timeSlot === "morning"){
        firstHour = 6;
      }
      else if(timeSlot === "afternoon"){
        firstHour = 18;
      }
    } else {
      if(timeSlot === "morning"){
        firstHour = 6;
      }
      else if(timeSlot === "afternoon"){
        firstHour = 14;
      }
      else{
        firstHour = 22;
      }
    }

    navigate(`/manage-hours/${timeSlot}/${firstHour}`); 
  };

  function getDayOfWeek(selectedDate) {
    const date = new Date(selectedDate);
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return daysOfWeek[date.getDay()];
  }

  const day = getDayOfWeek(selectedDate);

  return (
    <div>
      <h1>Sélectionnez une période</h1>
      {day === "Samedi" || day === "Dimanche" ? (
        <>
          <button onClick={() => handleSelectTimeSlot('morning')}>Matin</button>
          <button onClick={() => handleSelectTimeSlot('afternoon')}>Après-midi</button>
          {day === "Samedi" && <button onClick={() => handleSelectTimeSlot('junction')}>Jonction</button>}
        </>
      ) : (
        <>
          <button onClick={() => handleSelectTimeSlot('morning')}>Matin</button>
          <button onClick={() => handleSelectTimeSlot('afternoon')}>Après-midi</button>
          <button onClick={() => handleSelectTimeSlot('night')}>Nuit</button>
        </>
      )}
    </div>
  );
};

export default SelectTimeSlotPage;
