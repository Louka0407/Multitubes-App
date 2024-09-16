import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDate } from '../DateContext/DateContext';
import styles from './ManageHoursPage.module.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';

const ManageHoursPage = () => {
  const { timeSlot: rawTimeSlot, firstHour } = useParams();
  const navigate = useNavigate();
  const { selectedDate } = useDate();

  // État pour les réponses par défaut (toutes à "OK")
  const [responses, setResponses] = useState({
    'Netteté décor et texte': 'OK',
    'Orientation Cap': 'OK',
    'Cap bien vissé / snappée': 'OK',
    'Alu seal bien fixé': 'OK',
    'Pas de dommages sur les tubes': 'OK',
    'Hauteur étiquette/décor': 'OK',
    'Spot': 'OK',
    'Tenue tête': 'OK',
  });

  // Utilisation de useState pour gérer la durée
  const [duration, setDuration] = useState(0); 
  const [timeSlot, setTimeSlot] = useState(rawTimeSlot);

  // Utilisation de useEffect pour calculer la durée
  useEffect(() => {
    let calculatedDuration;
    const day = getDayOfWeek(selectedDate);

    if (day === 'Vendredi') {
      calculatedDuration = 7;
    } else if (timeSlot === 'junction') {
      calculatedDuration = 7;
    } else if (day === 'Samedi' || day === 'Dimanche') {
      calculatedDuration = 13;
    } else {
      calculatedDuration = 9;
    }

    setDuration(calculatedDuration);
  }, [timeSlot, selectedDate]);

  // Gestion de la modification des réponses
  const handleResponseChange = (key, value) => {
    setResponses({
      ...responses,
      [key]: value
    });
  };

  // Gestion de la soumission et navigation
  const handleSubmit = (e) => {
    e.preventDefault();

    const firstHourB = parseInt(firstHour, 10);
    let nextHour = (firstHourB + 1) % 24;

    if (duration > 1) {
      navigate(`/manage-hours/${timeSlot}/${nextHour}`);
    } else {
      navigate('/completion');
    }

    setDuration(prevDuration => prevDuration - 1); 
  };

  const formattedFirstHour = String(firstHour).padStart(2, '0');

  function getDayOfWeek(selectedDate) {
    const date = new Date(selectedDate);
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return daysOfWeek[date.getDay()];
  }

  return (
    <div className={styles.container}>
      <Header nav="retour" />
      <NavBar currentStep="1" />

      <header className={styles.header}>
        <h1>Heure : {formattedFirstHour}</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {Object.keys(responses).map((label, index) => (
          <div className={styles.row} key={index}>
            <label>{label}</label>
            <select
              value={responses[label]}
              onChange={(e) => handleResponseChange(label, e.target.value)}
              className={`${styles.selectButton} ${styles[responses[label].toLowerCase()]}`} // Appliquer la couleur en fonction de la réponse
            >
              <option value="OK">OK</option>
              <option value="NOK">NOK</option>
              <option value="NA">NA</option>
              <option value="A">A</option>
            </select>
          </div>
        ))}

        <div className={styles.remarks}>
          <label>Remarques :</label>
          <textarea placeholder="Remarques (ex. heure coupure de courant...)" />
        </div>

        <button type="submit" className={styles.nextStep}>Étape suivante :</button>
      </form>
    </div>
  );
};

export default ManageHoursPage;
