import React, { useState, useEffect } from 'react';

import creerRapportImg from '../../../images/Créer un rapport.png';
import genererRapportImg from '../../../images/Générer un rapport.png';
import multitubesLogo from '../../../images/Multitubes Logo.png';
import adminPageImg from '../../../images/Admin Page.png';
import axios from 'axios';

import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get('/api/users/auth');
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Erreur lors de la vérification des autorisations :', error);
      }
    };    
    checkAdmin();
  }, []);


  const handleClick = () => {
    navigate('/FirstStep');
  };

  const handleClick2 = () => {
    navigate('/generatereport');
  }

  const handleClick3 = () => {
    navigate('/admin');
  }

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
        <div className={styles.optionCard} onClick={handleClick2}>
          <img src={genererRapportImg} alt="Générer un rapport" className={styles.optionImage} />
          <p>Générer un rapport</p>
        </div>
        {isAdmin &&(
          <div className={styles.optionCard} onClick={handleClick3}>
            <img src={adminPageImg} alt="Page administrateur" className={styles.optionImage} />
            <p>Page administrateur</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
