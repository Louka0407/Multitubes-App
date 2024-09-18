import React, { useState } from 'react';
import styles from './CompletionPage.module.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';

const CompletionPage = () => {

    const [note, setNote] = useState(''); // État pour la note


  return (
    <div className={styles.container}>
      <Header nav="retour" />
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
