import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import NavBar from '../NavBar/NavBar';
import ClientFields from './Sections/ClientFields';
import styles from './FirstStepPage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDate } from '../DateLineContext/DateLineContext';

const validationSchema = Yup.object({
  line: Yup.number().required('Ligne is required').positive().integer(),
  date: Yup.date().required('Date is required').nullable(),
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
};

const FirstStep = () => {
  const { setSelectedDate, setLine } = useDate();
  const navigate = useNavigate();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));
  const [loading, setLoading] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const formik = useFormik({
    initialValues: {
      line: 10,
      date: currentDate, 
      clients: [
        { client: '', articleNavision: '', orderNumber: '', quantity: '' }
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true); 
      try {
        const formattedDate = formatDate(new Date(values.date));

        const response = await axios.get(`/api/report`, {
          params: { date: formattedDate, line: values.line }
        });
        
        const existingReport = response.data.rapport;

        const rapportData = {
          line: values.line,
          date: values.date,
        };

        let rapportResponse;
        if (existingReport) {
          // Update existing report with PUT
          rapportResponse = await axios.put(`/api/report/${existingReport._id}`, rapportData);
        } else {
          // Create new report with POST
          rapportResponse = await axios.post('/api/report/', rapportData);
        }

        const rapportId = rapportResponse.data._id;
        const clientData = values.clients.map(client => ({
          ...client,
          rapportId: rapportId
        }));

        await axios.post('/api/client/', clientData);
        console.log('Client data submitted successfully');
        
        // Reset form values after successful submission
        formik.resetForm();
        navigate("/SelectTimeSlotPage");

      } catch (error) {
        console.error('Error submitting data:', error);
        alert('Une erreur s\'est produite lors de la soumission des données. Veuillez réessayer.');
      } finally {
        setIsSubmitting(false); 
      }
    },
  });

  const fetchReport = useCallback(async (line, date) => {
    setLoading(true); 
    try {
      const formattedDate = formatDate(new Date(date));
      const response = await axios.get(`/api/report`, {
        params: { date: formattedDate, line: line }
      });

      if (response.data.message) {
        // Met à jour les valeurs du formulaire sans réinitialiser la ligne
        formik.setValues(prevValues => ({
          ...prevValues,
          date: formattedDate,
          clients: formik.initialValues.clients,
        }));
      } else {
        const { rapport, clients } = response.data;

        // Met à jour les valeurs du formulaire avec les données récupérées
        formik.setValues({
          line: rapport.line,
          date: formattedDate,
          clients: clients.length > 0 ? clients : formik.initialValues.clients,
        });
      }
    } catch (error) {
      console.error('Error fetching report data:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  }, [formik]);

  useEffect(() => {
    // Se déclenche seulement lorsque currentDate ou formik.values.line changent
    const fetchData = async () => {
      await fetchReport(formik.values.line, currentDate);
    };

    fetchData();
    // Les dépendances sont currentDate et formik.values.line pour éviter les boucles infinies
  }, [currentDate, formik.values.line]);

  useEffect(() => {
    setLine(formik.initialValues.line); // Set the line in your context or state
  }, []);

  const handleLineChange = async (event) => {
    const { value } = event.target;
    formik.setFieldValue('line', value);
    // Appelle fetchReport avec la nouvelle ligne et la date actuelle
    await fetchReport(value, currentDate);
    setLine(value);

  };

  const addClientFields = () => {
    const newClientField = { client: '', articleNavision: '', orderNumber: '', quantity: '' };
    formik.setFieldValue('clients', [...formik.values.clients, newClientField]);
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setCalendarDate(date);
    setCurrentDate(formattedDate); 
    formik.setFieldValue('date', formattedDate);
    setShowCalendar(false);
  };

  return (
    <div className={styles.container}>
      <Header nav="/" />
      <NavBar currentStep="0" />

      <form className={styles.formContainer} onSubmit={formik.handleSubmit}>
        <div className={styles.formRow}>
          <label htmlFor="date">Date :</label>
          <div className={styles.dateContainer}>
            <input
              type="text"
              id="date"
              name="date"
              value={formik.values.date}
              onClick={() => setShowCalendar(!showCalendar)}
              readOnly
            />
            {showCalendar && (
              <div className={styles.calendarWrapper}>
                <Calendar
                  onChange={handleDateChange}
                  value={calendarDate}
                />
              </div>
            )}
          </div>
          {formik.touched.date && formik.errors.date && <div className={styles.error}>{formik.errors.date}</div>}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="line">Ligne :</label>
          <select
            id="line"
            name="line"
            value={formik.values.line}
            onChange={handleLineChange}
            onBlur={formik.handleBlur}
          >
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
            <option value={42}>42</option>
            <option value={45}>45</option>
            <option value={46}>46</option>

          </select>
          {formik.touched.line && formik.errors.line && <div className={styles.error}>{formik.errors.line}</div>}
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

        <button type="submit" className={styles.nextStep} disabled={isSubmitting || loading}>
          {loading ? 'Chargement...' : 'Étape suivante :'}
        </button>
      </form>
    </div>
  );
};

export default FirstStep;
