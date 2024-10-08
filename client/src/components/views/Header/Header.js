import React from 'react';
import { useNavigate } from 'react-router-dom';
import multitubesLogo from '../../../images/Multitubes Logo.png';
import styles from './HeaderPage.module.css';
import { ArrowLeftOutlined } from '@ant-design/icons';

function Header({ nav, onBackClick }) {
  const navigate = useNavigate();

  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleClick = () => {
    if (nav === "retour") {
      if (onBackClick) {
        onBackClick(); // Appel de la fonction de rappel
      }
      navigate(-1);
    } else {
      navigate(nav);
    }
    setTimeout(() => {
      smoothScrollToTop();
    }, 10);
  };


  return (
    <header className={styles.header}>
      <div className={styles.arrow} onClick={handleClick}>
        <ArrowLeftOutlined />
      </div>
      <div className={styles.divLogo}>
        <img src={multitubesLogo} alt="Multitubes Logo" className={styles.logo} />
      </div>
    </header>
  );
}

export default Header;
