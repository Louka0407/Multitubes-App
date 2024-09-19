import React, { useState, useEffect } from 'react';
import styles from './CompletionPage.module.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDate } from '../DateContext/DateContext';

const CompletionPage = () => {
  const { timeSlot } = useParams();
  const { selectedDate, line } = useDate(); // Supposons que vous utilisez un DateContext pour la date
  const [note, setNote] = useState(''); // État pour la note
  const navigate = useNavigate();

  useEffect(() => {
    // Fonction pour récupérer les données du ReportEntry
    const fetchReportEntry = async () => {
      try {
        const response = await axios.get('/api/reportEntry/reportentrydatacomment', {
          params: {
            selectedDate, // Date sélectionnée
            timeSlot      // Créneau horaire
          }
        });

        if (response.data.note) {
          // Si une note existe déjà, la définir dans l'état
          setNote(response.data.note);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du compte rendu:', error);
      }
    };

    fetchReportEntry();
  }, [selectedDate, timeSlot]);

  useEffect(() => {
    // Fonction pour réinitialiser la durée
    const resetDuration = () => {
      localStorage.setItem('duration', '1');
    };

    // Ajouter l'écouteur d'événement pour le retour en arrière du navigateur
    window.addEventListener('popstate', resetDuration);

    // Réinitialiser la durée au chargement de la page
    resetDuration();

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener('popstate', resetDuration);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = window.localStorage.getItem('userId');  

    try {
      // Mise à jour de la note dans le ReportEntry
      await axios.put('/api/reportEntry/update', {
        selectedDate,
        timeSlot,
        note, // La nouvelle note
        userId,
        line
      });

      // Rediriger vers la page de fin après la soumission
      navigate('/finish');
    } catch (error) {
      console.error('Erreur lors de la soumission de la note:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Header nav="retour" onBackClick={() => localStorage.setItem('duration', '1')} />
      <NavBar currentStep="3" />

      <div className={styles.header}>
        <h1>Remarques générales :</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.remarks}>
          <label>Remarques :</label>
          <textarea
            placeholder="Remarques (ex. heure coupure de courant...)"
            value={note}
            onChange={(e) => setNote(e.target.value)} // Mise à jour de l'état de note
          />
        </div>

        <button type="submit" className={styles.nextStep}>Soumettre le rapport :</button>
      </form>
    </div>
  );
};

export default CompletionPage;
