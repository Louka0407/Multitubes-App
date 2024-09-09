import React from 'react';
import { useNavigate } from 'react-router-dom';
import multitubesLogo from '../../../images/Multitubes Logo.png';
import styles from './HeaderPage.module.css';
import { ArrowLeftOutlined } from '@ant-design/icons';

function Header(props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(props.nav);
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
