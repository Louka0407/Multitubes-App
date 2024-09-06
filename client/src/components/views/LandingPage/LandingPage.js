import React from 'react';

import creerRapportImg from '../../../images/Créer un rapport.png';
import genererRapportImg from '../../../images/Générer un rapport.png';
import modifierRapportImg from '../../../images/Modifier un rapport.png';
import multitubesLogo from '../../../images/Multitubes Logo.png';

import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/FirstStep');
  };


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={multitubesLogo} alt="Multitubes Logo" className={styles.logo} />
      </header>
      <h1>Que voulez-vous faire ?</h1>
      <div className={styles.optionsContainer}>
        <div className={styles.optionCard} onClick={handleClick}>
          <img src={creerRapportImg} alt="Créer un rapport" className={styles.optionImage} />
          <p>Créer un rapport</p>
        </div>
        <div className={styles.optionCard}>
          <img src={genererRapportImg} alt="Générer un rapport" className={styles.optionImage} />
          <p>Générer un rapport</p>
        </div>
        <div className={styles.optionCard}>
          <img src={modifierRapportImg} alt="Modifier un rapport" className={styles.optionImage} />
          <p>Modifier un rapport</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
