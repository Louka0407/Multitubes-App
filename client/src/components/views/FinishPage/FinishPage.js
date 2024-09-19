import React, { useEffect } from 'react';
import { Result } from "antd";
import { USER_SERVER } from '../../Config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FinishPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      logout();
    }, 2000); 

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, []);

  const logout = async () => {
    window.localStorage.setItem('userId', null); 

    try {
      const response = await axios.get(`${USER_SERVER}/logout`);
      if (response.status === 200) {
        navigate("/login"); 
      } else {
        alert('Log Out Failed');
      }
    } catch (err) {
      console.error("Erreur logout :", err);
    }
  };

  return (
    <div>
      <Result
        status="success"
        title="Rapport enregistré avec succès !"
      />
    </div>
  );
}

export default FinishPage;
