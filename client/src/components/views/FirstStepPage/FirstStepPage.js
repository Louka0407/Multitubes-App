import React, { useState } from 'react';
import multitubesLogo from '../../../images/Multitubes Logo.png';
import styles from './FirstStepPage.module.css';

function FirstStep() {
  const [line, setLine] = useState(1);
  const [date, setDate] = useState('08/07/2024');
  const [timeSlot, setTimeSlot] = useState('Matin');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={multitubesLogo} alt="Multitubes Logo" className={styles.logo} />
      </header>

      <h2 className={styles.stepTitle}>Etape 1</h2>

      <div className={styles.stepper}>
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} className={`${styles.step} ${i === 0 ? styles.active : ''}`}>
            {i + 1}
          </div>
        ))}
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formRow}>
          <label>Ligne :</label>
          <select value={line} onChange={(e) => setLine(e.target.value)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>

          <label>Date :</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Horaire :</label>
          <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
            <option value="Matin">Matin</option>
            <option value="Après-midi">Après-midi</option>
            <option value="Soir">Soir</option>
          </select>
        </div>

        <div className={styles.formRow}>
          <label>Client :</label>
          <input type="text" value="Loukaiencli" disabled />
        </div>

        <div className={styles.formRow}>
          <label>N° article NAVISION :</label>
          <input type="text" value="04-520-5050-050" disabled />
        </div>

        <div className={styles.formRow}>
          <label>N° Ordre :</label>
          <input type="text" value="04-520-5050-050" disabled />
        </div>

        <div className={styles.formRow}>
          <label>Quantité :</label>
          <input type="text" value="04-520-5050-050" disabled />
        </div>

        <div className={styles.addButtonContainer}>
          <button className={styles.addButton}>+</button>
        </div>
      </div>

      <button className={styles.nextStep}>Étape suivante :</button>
    </div>
  );
}

export default FirstStep;
