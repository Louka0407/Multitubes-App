import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDate } from '../DateContext/DateContext';
import { toast } from 'react-toastify';
import styles from './ManageHoursPage.module.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import { InfoCircleOutlined } from '@ant-design/icons';

const ManageHoursPage = () => {
  const { timeSlot: rawTimeSlot, firstHour } = useParams();
  const navigate = useNavigate();
  const { selectedDate } = useDate();

  const [responses, setResponses] = useState({
    'Netteté décor et texte': 'OK',
    'Orientation Cap': 'OK',
    'Cap bien vissé / snappée': 'OK',
    'Alu seal bien fixé': 'OK',
    'Pas de dommages sur les tubes': 'OK',
    'Hauteur étiquette/décor': 'OK',
    'Spot': 'OK',
    'Tenue tête': 'OK',
    'Pas d\'ovalité':'OK',
    'Aspect vernis':'OK',
    'Tube droit':'OK',
    'Pas de variation de teinte':'OK',
    'Ligne de découpe':'OK',
  });

  const [duration, setDuration] = useState(0); 
  const [timeSlot, setTimeSlot] = useState(rawTimeSlot);
  
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

  const handleResponseChange = (key, value) => {
    setResponses({
      ...responses,
      [key]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const firstHourB = parseInt(firstHour, 10);
    let nextHour = (firstHourB + 1) % 24;

    if (duration > 1) {
      navigate(`/manage-hours/${timeSlot}/${nextHour}`);
    } else {
      navigate('/completion');
    }

    toast.success('Soumission réussie !'); // Affichage de la notification

    setDuration(prevDuration => prevDuration - 1); 
    window.scrollTo(0, 0);
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
      <NavBar currentStep="2" />

      <div className={styles.header}>
        <h1>Heure : {formattedFirstHour}</h1>
      </div>

      <div className={styles.divG}>
        <div className={styles.tooltipContainer}>
          <InfoCircleOutlined style={{ color: '#08c', fontSize: '20px' }} />
          <div className={styles.tooltip}>
            OK = Conforme / NOK = Non conforme / NA = Absent / A = Arret
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {Object.keys(responses).map((label, index) => (
          <div className={styles.row} key={index}>
            <label>{label}</label>
            <select
              value={responses[label]}
              onChange={(e) => handleResponseChange(label, e.target.value)}
              className={`${styles.selectButton} ${styles[responses[label].toLowerCase()]}`}
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
