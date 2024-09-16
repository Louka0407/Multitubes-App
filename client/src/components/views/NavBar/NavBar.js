import React from 'react';
import { Steps } from 'antd'; 
import 'antd/dist/reset.css'; 
import styles from './NavBar.module.css';

function NavBar(props) {
  return (
    <div className={styles.navBar}>
      <Steps
          current={parseInt(props.currentStep)}
          items={[
              {},
              {},
              {},
              {}
          ]}
      />  
    </div>
  )
}

export default NavBar