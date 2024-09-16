import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectTimeSlotPage = () => {
  const navigate = useNavigate();

  const handleSelectTimeSlot = (timeSlot) => {

    let firstHour;

    let date = new Date();

    let day = date.toLocaleString('fr-FR',{weekday: 'long'});
    
    if(day === "vendredi"){
      if(timeSlot === "Matin"){
        firstHour = 6;
      }
      else if(timeSlot === "Après-midi"){
        firstHour = 12;
      }
      else{
        firstHour = 18;
      }
    }else if(timeSlot === "Jonction"){
      firstHour = 0o0;
    }else if(day === "samedi" || day === "dimanche"){
      if(timeSlot === "matin"){
        firstHour = 6;
      }
      else if(timeSlot === "Après-midi"){
        firstHour = 18;
      }
    }else{
      if(timeSlot === "Matin"){
        firstHour = 6;
        timeSlot = "morning"
      }
      else if(timeSlot === "Après-midi"){
        firstHour = 14;
        timeSlot = "afternoon"
      }
      else{
        firstHour = 22;
        timeSlot = "night"
      }
    }
    navigate(`/manage-hours/${timeSlot}/${firstHour}`);
  };

  return (
    <div>
      <h1>Sélectionnez une période</h1>
      <button onClick={() => handleSelectTimeSlot('Matin')}>Matin</button>
      <button onClick={() => handleSelectTimeSlot('Après-midi')}>Après-midi</button>
      <button onClick={() => handleSelectTimeSlot('Nuit')}>Nuit</button>
      <button onClick={() => handleSelectTimeSlot('Jonction')}>Jonction</button>
    </div>
  );
};

export default SelectTimeSlotPage;
