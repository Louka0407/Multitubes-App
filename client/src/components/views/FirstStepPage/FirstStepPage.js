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

  const [clientFields, setClientFields] = useState([
    { client: '', articleNavision: '', orderNumber: '', quantity: '' }
  ]);

  const formik = useFormik({
    initialValues: {
      line: 1,
      date: formatDate(new Date()),
      timeSlot: 'Matin',
      clients: clientFields,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const rapportData = {
          line: values.line,
          date: values.date,
          timeSlot: values.timeSlot,
        };

        const rapportResponse = await axios.post('/api/report/', rapportData);
        const rapportId = rapportResponse.data._id;

        const clientData = values.clients.map(client => ({
          ...client,
          rapportId: rapportId
        }));

        await axios.post('/api/client/', clientData);

        console.log('Data submitted successfully');
        navigate("/SecondStep");
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    },
  });

  // useEffect est exécuté une seule fois au début du chargement de la page 
  // Permet de charger les données du rapport si il existe déjà
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const formattedDate = formatDate(new Date(formik.values.date)); // Formater la date au format attendu
        const response = await axios.get(`/api/report/${formattedDate}`);
        const responseClient = await axios.get(`/api/client/${formattedDate}`);

        if (response.data) {
          const reportData = response.data;
          const clientData = responseClient.data;

          // Mettre à jour les valeurs du formulaire avec les données existantes
          formik.setValues({
            line: reportData.line,
            date: formatDate(new Date(reportData.date)),
            timeSlot: reportData.timeSlot,
            clients: clientData
          });
        }
      } catch (error) {
        // Gérer le cas où le rapport n'existe pas encore ou d'autres erreurs
        if (error.response && error.response.status === 404) {
          console.log('Aucun rapport trouvé pour cette date. Vous pouvez en créer un.');
        } else {
          console.error('Erreur lors de la récupération du rapport:', error);
        }
      }
    };

    fetchReport(); // Appeler la fonction pour charger le rapport
    // eslint-disable-next-line
  }, [formik.values.date]);

  const addClientFields = () => {
    const newClientField = { client: '', articleNavision: '', orderNumber: '', quantity: '' };
    setClientFields([...clientFields, newClientField]);
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

        {/* Le .map permet de split chaque client pour créer des visuels séparés*/}
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
