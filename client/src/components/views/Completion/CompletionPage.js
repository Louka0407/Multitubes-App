import React, { useState, useEffect } from 'react';
import styles from './CompletionPage.module.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assurez-vous que vous utilisez axios pour les requêtes HTTP
import { useDate } from '../DateContext/DateContext'; // Si vous avez un DateContext pour selectedDate

const CompletionPage = () => {
  const { timeSlot } = useParams();
  const { selectedDate } = useDate(); // Supposons que vous utilisez un DateContext pour la date
  const [note, setNote] = useState(''); // État pour la note
  const navigate = useNavigate();

  useEffect(() => {
    // Fonction pour récupérer les données du ReportEntry
    const fetchReportEntry = async () => {
      console.log("test");
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

  const resetDuration = () => {
    // Réinitialiser la durée à 1 dans le localStorage
    localStorage.setItem('duration', '1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mise à jour de la note dans le ReportEntry
      await axios.put('/api/reportEntry/update', {
        selectedDate,
        timeSlot,
        note, // La nouvelle note
      });

      // Rediriger vers la page de fin après la soumission
      navigate('/finish');
    } catch (error) {
      console.error('Erreur lors de la soumission de la note:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Header nav="retour" onBackClick={resetDuration} />
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
