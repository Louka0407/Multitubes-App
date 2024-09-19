import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation} from 'react-router-dom';
import { useDate } from '../DateContext/DateContext';
import { toast } from 'react-toastify';
import styles from './ManageHoursPage.module.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const ManageHoursPage = () => {
  const { timeSlot: rawTimeSlot, firstHour } = useParams();
  const navigate = useNavigate();
  const { selectedDate } = useDate();
  const formattedFirstHour = String(firstHour).padStart(2, '0');

  const [responses, setResponses] = useState({
    'Netteté décor et texte': 'NA',
    'Orientation Cap': 'NA',
    'Cap bien vissé / snappée': 'NA',
    'Alu seal bien fixé': 'NA',
    'Pas de dommages sur les tubes': 'NA',
    'Hauteur étiquette/décor': 'NA',
    'Spot': 'NA',
    'Tenue tête': 'NA',
    'Pas d\'ovalité':'NA',
    'Aspect vernis':'NA',
    'Tube droit':'NA',
    'Pas de variation de teinte':'NA',
    'Ligne de découpe':'NA',
  });

  const [duration, setDuration] = useState(0);
  const [timeSlot, setTimeSlot] = useState(rawTimeSlot);
  const [note, setNote] = useState(''); // État pour la note
  const location = useLocation(); // Hook pour écouter les changements d'URL


  useEffect(() => {
    const storedDuration = localStorage.getItem('duration');
    if (storedDuration) {
      // Si duration est déjà présent dans le localStorage, on l'utilise
      setDuration(parseInt(storedDuration, 10));
    } else {
      // Sinon, on calcule et on l'enregistre
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
      localStorage.setItem('duration', calculatedDuration);
    }
  }, [timeSlot, selectedDate]);
  


  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêcher le comportement par défaut du formulaire
  
    const workHours = Object.keys(responses).map(key => ({
      title: key,
      status: responses[key]
    }));
  
    try {
      const response = await axios.post('/api/workHours', {
        selectedDate, // Récupéré via votre DateContext
        timeSlot,     // Le créneau horaire actuel
        note: document.querySelector('textarea').value, // Récupération de la note du textarea
        hour: formattedFirstHour,
        workHours // Le tableau des heures de travail avec leurs titres et statuts
      });
  
      // Vérifier si les workHours existent déjà
      if (response.data.workHoursId) {
        await axios.put(`/api/workHours/update/${response.data.workHoursId}`, {
          note,
          workHours, 
          hour: formattedFirstHour
      });}
      const firstHourB = parseInt(firstHour, 10);
      let nextHour = (firstHourB + 1) % 24;

      if (duration > 1) {
        localStorage.setItem('duration', duration - 1);

        navigate(`/manage-hours/${timeSlot}/${nextHour}`);
      } else {
        localStorage.removeItem('duration');

        navigate(`/completion/${timeSlot}`);
      }

        toast.success('Soumission réussie !');
        console.log("duration : " + duration)
        setDuration(prevDuration => prevDuration - 1);
        window.scrollTo(0, 0);
      
    } catch (err) {
      console.error('Erreur lors de la soumission des heures de travail:', err);
      toast.error('Erreur lors de la soumission.');
    }
  };

  useEffect(() => {

    const storedDuration = localStorage.getItem('duration');
    if (storedDuration) {
      setDuration(parseInt(storedDuration, 10));
    }
    
    console.log("date : " + selectedDate + "formattedFirstHour : " + formattedFirstHour);
  
    async function fetchData(){
      try {
        const response = await axios.get(`/api/reportEntry/reportentrydata`, {
          params: {
            selectedDate,
            timeSlot,
            formattedFirstHour
          }
        });
        
        const existingReportEntry = response.data;
  
        // Mettre à jour la note, même si elle est vide
        if (existingReportEntry.note) {
          setNote(existingReportEntry.note);
        } else {
          setNote(''); // Réinitialiser la note si elle n'existe pas
        }
  
        // Toujours vérifier et mettre à jour les workHours, même s'il n'y a pas de note
        if (existingReportEntry.workHours && existingReportEntry.workHours.length > 0) {
          const updatedResponses = {};
          existingReportEntry.workHours.forEach(workHour => {
            updatedResponses[workHour.title] = workHour.status || 'NA'; // 'NA' par défaut si aucun statut n'est trouvé
          });
  
          setResponses(updatedResponses); // Mettre à jour l'état des réponses avec les données récupérées
          console.log("responses : " + JSON.stringify(updatedResponses, null, 2));
        } else {
          // Réinitialiser les responses si workHours est vide
          setResponses({
            'Netteté décor et texte': 'NA',
            'Orientation Cap': 'NA',
            'Cap bien vissé / snappée': 'NA',
            'Alu seal bien fixé': 'NA',
            'Pas de dommages sur les tubes': 'NA',
            'Hauteur étiquette/décor': 'NA',
            'Spot': 'NA',
            'Tenue tête': 'NA',
            'Pas d\'ovalité':'NA',
            'Aspect vernis':'NA',
            'Tube droit':'NA',
            'Pas de variation de teinte':'NA',
            'Ligne de découpe':'NA',
          });
        }
  
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }
  
    fetchData();
    // eslint-disable-next-line 
  }, [location.pathname]);
  

  const handleResponseChange = (key, value) => {
    setResponses({
      ...responses,
      [key]: value
    });
  };




  function getDayOfWeek(selectedDate) {
    const date = new Date(selectedDate);
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return daysOfWeek[date.getDay()];
  }

  const handleBackClick = () => {
    if (duration > 0) {
      setDuration(prevDuration => {
        const newDuration = prevDuration + 1;
        localStorage.setItem('duration', newDuration);
        return newDuration;
      });
    }
  };

  return (
    <div className={styles.container}>
      <Header nav="retour" onBackClick={handleBackClick} />
      <NavBar currentStep="2" />

      <div className={styles.header}>
        <h1>Heure : {formattedFirstHour}</h1>
      </div>

      <div className={styles.divG}>
        <div className={styles.tooltipContainer}>
          <InfoCircleOutlined style={{ color: '#08c', fontSize: '20px' }} />
          <div className={styles.tooltip}>
            OK = Conforme / NOK = Non conforme / NA = Non applicable / A = Arret
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
          <textarea
            placeholder="Remarques (ex. heure coupure de courant...)"
            value={note}
            onChange={(e) => setNote(e.target.value)} // Mise à jour de l'état de note
          />
        </div>

        <button type="submit" className={styles.nextStep}>Étape suivante :</button>
      </form>
    </div>
  );
};

export default ManageHoursPage;
