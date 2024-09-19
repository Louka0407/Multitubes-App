import React, { useEffect, useState } from 'react';
import { Result } from "antd";
import { USER_SERVER } from '../../Config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FinishPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Récupérer le userId depuis localStorage
    const userId = window.localStorage.getItem('userId');

    // Vérifier si un userId est présent et récupérer les données utilisateur
    if (userId) {
      getUserData(userId);
    }

    const timeoutId = setTimeout(() => {
      logout();
    }, 2000); // Attente avant la déconnexion

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, []);

  // Fonction pour récupérer les données utilisateur via l'API
  const getUserData = async (userId) => {
    try {
      const response = await axios.get(`${USER_SERVER}/auth`);
      if (response.status === 200) {
        console.log('Nom:', response.data.name, 'Prénom:', response.data.lastname);
        setUserData({ name: response.data.name, lastname: response.data.lastname });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données utilisateur :", err);
    }
  };

  const logout = async () => {
    window.localStorage.setItem('userId', null);

    try {
      const response = await axios.get(`${USER_SERVER}/logout`);
      if (response.status === 200) {
        navigate("/login"); 
      } else {
        alert('Échec de la déconnexion');
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  return (
    <div>
      <Result
        status="success"
        title="Rapport enregistré avec succès !"
        subTitle={userData ? `Nom : ${userData.name}, Prénom : ${userData.lastname}` : "Chargement des données utilisateur..."}
      />
    </div>
  );
}

export default FinishPage;
