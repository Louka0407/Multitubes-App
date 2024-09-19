import React, { useState } from 'react';
import styles from './CompletionPage.module.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';

const CompletionPage = () => {

    const [note, setNote] = useState(''); // État pour la note

    const resetDuration = () => {
      // Réinitialiser la durée à 1 dans le localStorage
      localStorage.setItem('duration', '1');
    };

  return (
    <div className={styles.container}>
      <Header nav="retour" onBackClick={resetDuration}/>
      <NavBar currentStep="3" />

      <div className={styles.header}>
        <h1>Remarques générales :</h1>
      </div>


      <form className={styles.formContainer}>
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
