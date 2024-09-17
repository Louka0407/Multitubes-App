import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDate } from '../DateContext/DateContext';
import styles from './SelectTimeSlotPage.module.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import axios from 'axios';


const SelectTimeSlotPage = () => {
  const navigate = useNavigate();
  const { selectedDate } = useDate();

  const handleSelectTimeSlot = async (timeSlot) => {
    let firstHour;
    let day = getDayOfWeek(selectedDate);

    if (day === 'Vendredi') {
      if (timeSlot === 'morning') {
        firstHour = 6;
      } else if (timeSlot === 'afternoon') {
        firstHour = 12;
      } else {
        firstHour = 18;
      }
    } else if (timeSlot === 'junction') {
      firstHour = 0;
    } else if (day === 'Samedi' || day === 'Dimanche') {
      if (timeSlot === 'morning') {
        firstHour = 6;
      } else if (timeSlot === 'afternoon') {
        firstHour = 18;
      }
    } else {
      if (timeSlot === 'morning') {
        firstHour = 6;
      } else if (timeSlot === 'afternoon') {
        firstHour = 14;
      } else {
        firstHour = 22;
      }
    }
    try{
      const response = await axios.post('/api/reportEntry/create-entry',{
        selectedDate,
        timeSlot,
      });
      console.log("Compte rendu créé : ", response.data);
    }catch(err) {
      console.error('Erreur lors de la création du compte rendu: ', err);
    }
    navigate(`/manage-hours/${timeSlot}/${firstHour}`);
  };

  function getDayOfWeek(selectedDate) {
    const date = new Date(selectedDate);
    const daysOfWeek = [
      'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ];
    return daysOfWeek[date.getDay()];
  }

  const day = getDayOfWeek(selectedDate);

  return (
    <div className={styles.container}>
      <Header nav="retour" />
      <NavBar currentStep="1" />

      <h1>Sélectionnez une période</h1>
      <div className={styles.buttonContainer}>
        {day === 'Samedi' || day === 'Dimanche' ? (
          <>
            <button className={styles.morningButton} onClick={() => handleSelectTimeSlot('morning')}>Matin</button>
            <button className={styles.afternoonButton} onClick={() => handleSelectTimeSlot('afternoon')}>Après-midi</button>
            {day === 'Samedi' && (
              <button className={styles.junctionButton} onClick={() => handleSelectTimeSlot('junction')}>Jonction</button>
            )}
          </>
        ) : (
          <>
            <button className={styles.morningButton} onClick={() => handleSelectTimeSlot('morning')}>Matin</button>
            <button className={styles.afternoonButton} onClick={() => handleSelectTimeSlot('afternoon')}>Après-midi</button>
            <button className={styles.nightButton} onClick={() => handleSelectTimeSlot('night')}>Nuit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectTimeSlotPage;
