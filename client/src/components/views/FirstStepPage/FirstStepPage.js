import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import NavBar from '../NavBar/NavBar';
import ClientFields from './Sections/ClientFields';
import styles from './FirstStepPage.module.css';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const validationSchema = Yup.object({
  line: Yup.number().required('Ligne is required').positive().integer(),
  date: Yup.date().required('Date is required').nullable(),
  timeSlot: Yup.string().required('Horaire is required'),
  clients: Yup.array().of(
    Yup.object({
      client: Yup.string().required('Client is required'),
      articleNavision: Yup.string().required('N° article NAVISION is required'),
      orderNumber: Yup.string().required('N° Ordre is required'),
      quantity: Yup.string().required('Quantité is required'),
    })
  )
});

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`; 
}

const FirstStep = () => {
  const navigate = useNavigate(); 

  const formik = useFormik({
    initialValues: {
      line: 1,
      date: formatDate(new Date()), 
      timeSlot: 'Matin',
      clients: [
        { client: '', articleNavision: '', orderNumber: '', quantity: '' }
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const rapportData = {
          line: values.line,
          date: values.date,
          timeSlot: values.timeSlot,
        };

        // Sauvegarde du rapport
        const rapportResponse = await axios.post('/api/report/', rapportData);
        const rapportId = rapportResponse.data._id;

        // Sauvegarde des clients
        const clientData = values.clients.map(client => ({
          ...client,
          rapportId: rapportId
        }));

        await axios.post('/api/client/', clientData);

        console.log('Data submitted successfully');
        
        // Après soumission, récupère les données à jour
        await fetchReport();
        
        navigate("/SecondStep");

      } catch (error) {
        console.error('Error submitting data:', error);
      }
    },
  });

  // Fonction pour récupérer les données rapport + clients
  const fetchReport = async () => {
    try {
      const formattedDate = formatDate(new Date(formik.values.date)); // Date à partir du formulaire
      console.log('Formatted Date:', formattedDate);

      const response = await axios.get(`/api/report/${formattedDate}`);

      if (response.data) {
        const { rapport, clients } = response.data;

        // Mise à jour des valeurs dans Formik
        formik.setValues({
          line: rapport.line,
          date: formatDate(new Date(rapport.date)),
          timeSlot: rapport.timeSlot,
          clients: clients.length > 0 ? clients : formik.values.clients // Assure qu'il y a au moins un client
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  // Appeler fetchReport au montage du composant
  useEffect(() => {
    fetchReport();
  }, []); // Exécution une seule fois au montage

  // Fonction pour ajouter un champ client
  const addClientFields = () => {
    const newClientField = { client: '', articleNavision: '', orderNumber: '', quantity: '' };
    formik.setFieldValue('clients', [...formik.values.clients, newClientField]);
  };

  return (
    <div className={styles.container}>
      <Header nav="/" />
      <NavBar currentStep="0" />

      <form className={styles.formContainer} onSubmit={formik.handleSubmit}>
        <div className={styles.formRow}>
          <label htmlFor="line">Ligne :</label>
          <select
            id="line"
            name="line"
            value={formik.values.line}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
          {formik.touched.line && formik.errors.line && <div className={styles.error}>{formik.errors.line}</div>}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="date">Date :</label>
          <input
            type="text"
            id="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.date && formik.errors.date && <div className={styles.error}>{formik.errors.date}</div>}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="timeSlot">Horaire :</label>
          <select
            id="timeSlot"
            name="timeSlot"
            value={formik.values.timeSlot}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="Matin">Matin</option>
            <option value="Après-midi">Après-midi</option>
            <option value="Soir">Soir</option>
          </select>
          {formik.touched.timeSlot && formik.errors.timeSlot && <div className={styles.error}>{formik.errors.timeSlot}</div>}
        </div>

        {formik.values.clients.map((clientField, index) => (
          <ClientFields
            key={index}
            index={index}
            values={clientField}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={formik.errors.clients?.[index] || {}}
            touched={formik.touched.clients?.[index] || {}}
          />
        ))}

        <div className={styles.addButtonContainer}>
          <button type="button" className={styles.addButton} onClick={addClientFields}>
            +
          </button>
        </div>

        <button type="submit" className={styles.nextStep}>Étape suivante :</button>
      </form>
    </div>
  );
}

export default FirstStep;
