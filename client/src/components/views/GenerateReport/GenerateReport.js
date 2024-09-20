import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import NavBar from '../NavBar/NavBar';
import Header from '../Header/Header';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './GenerateReport.module.css';


// Validation du formulaire
const validationSchema = Yup.object({
  line: Yup.number().required('La ligne est requise').positive().integer(),
  date: Yup.date().required('La date est requise').nullable(),
});

// Formatage de la date
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

function GenerateReport() {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      line: '',
      date: formatDate(new Date()), // Date actuelle
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        // Récupérer le rapport
        const response = await axios.get('/api/report', {
          params: { date: values.date, line: values.line }
        });

        const dataRapport = response.data;

        // Récupérer les reportEntries associés
        const rapportId = dataRapport.rapport._id;

        const responseReportEntry = await axios.get('/api/reportentry/reportentries', {
          params: { rapportId: rapportId }
        });

        const dataReportEntry = responseReportEntry.data;

        generatePDF(dataRapport, dataReportEntry);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const generatePDF = (dataRapport, responseReportEntry) => {
    const doc = new jsPDF();
    const reportTitle = `Rapport du : ${formik.values.date}`;
    const titleWidth = doc.getTextWidth(reportTitle);
    const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2; // Centre le titre
    doc.text(reportTitle, titleX, 10);
    
    // Position y après le titre
    let yPosition = 30;


    doc.text(`Numéros de ligne : ${formik.values.line}`, 10, yPosition);

    // Ajout d'un espace pour séparer le titre des tables
    yPosition += 10;
    const NumCommande = dataRapport.clients.map(client => client.orderNumber);
    const numCommandeString = NumCommande.join('-');
    // Exemple de table avec les données JSON récupérées
    doc.autoTable({
      head: [['Client', 'Article Navision', 'Numéro de Commande', 'Quantité']],
      body: dataRapport.clients.map(client => [
        client.client, client.articleNavision, client.orderNumber, client.quantity
      ]),
      startY: yPosition
    });

    // Position de départ après la première table
    yPosition = doc.autoTable.previous.finalY + 10;

    // Boucle à travers les reportEntries pour afficher les timeslots et workHours
    responseReportEntry.forEach((entry, index) => {
      // Affichage du timeSlot
      doc.setFontSize(14);

      const timeslot = entry.timeSlot;
      let periode;
      if(timeslot === "morning"){
        periode = "Matin :";
      }else if(timeslot === "afternoon"){
        periode = "Après-midi :";
      }else if(timeslot === "night"){
        periode = "Soir :";
      }else{
        periode = "Jonction :";
      }

      doc.text(periode, 10, yPosition);
      yPosition += 10; // Ajouter un espace après chaque timeSlot

      // Affichage des workHours associés
      if (entry.workHours && entry.workHours.length > 0) {
        // Préparer les heures, titres, et notes
        const hours = entry.workHours.map(workHour => workHour.hour);
        const titles = entry.workHours[0].workHours.map(item => item.title);

        // Préparer les statuts sous chaque titre
        const workHoursData = titles.map((title, rowIndex) => {
          return [title, ...entry.workHours.map(workHour => workHour.workHours[rowIndex].status)];
        });

        // Préparer les notes (une par heure)
        const notesData = ['Commentaire', ...entry.workHours.map(workHour => workHour.note || 'N/A')];

        // Générer la table avec les heures en colonnes et notes en bas
        doc.autoTable({
          head: [['Titre', ...hours]], // Les heures deviennent des colonnes
          body: [
            ...workHoursData,          // Les statuts pour chaque heure sont affichés sous leur titre respectif
            notesData                  // Ajouter les notes à la fin du tableau
          ],
          startY: yPosition,
          theme: 'grid', // Optionnel, ajoute un style de grille à la table
        });

        // Met à jour la position y après l'affichage du tableau
        // Met à jour la position y après l'affichage du tableau
        yPosition = doc.autoTable.previous.finalY + 10;
        yPosition += 10; // Ajout d'espace avant le commentaire

        // Préparation du commentaire général
        const commentText = `Commentaire général : ${entry.note || 'Aucun commentaire disponible'}`;

        // Dessine un rectangle autour du commentaire
        const boxX = 10;
        const boxY = yPosition - 6;
        const boxHeight = 12;
        const textWidth = doc.getTextWidth(commentText) + 10; // Ajoute de l'espace pour la bordure

        doc.rect(boxX, boxY, textWidth, boxHeight); // Dessine un rectangle
        doc.text(commentText, boxX + 5, yPosition); // Positionne le texte à l'intérieur du rectangle

        yPosition += 20; // Ajouter un espace suffisant avant l'élément suivant
        const creatorName = entry.createdBy ? `${entry.createdBy.name} ${entry.createdBy.lastname}` : 'Inconnu';
        doc.text(`Créé par : ${creatorName}`, 10, yPosition);
        yPosition += 10;

        if (index < responseReportEntry.length - 1) {
            doc.addPage();
            yPosition = 10; // Réinitialise la position Y au début de la page
          }

      } else {
        // Si aucun workHour, afficher un message
        doc.setFontSize(12);
        doc.text('Aucune heure de travail associée.', 10, yPosition);
        yPosition += 10;
      }
    });

    // Sauvegarde du fichier PDF
    doc.save(`Rapport.${formik.values.line}.${formik.values.date}.${numCommandeString}.pdf`);
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setCalendarDate(date);
    formik.setFieldValue('date', formattedDate);
    setShowCalendar(false);
  };

  return (
    <div className={styles.container}>
      <Header nav="/" />

      <h1>Générer un Rapport</h1>

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
              <Calendar
                onChange={handleDateChange}
                value={calendarDate}
              />
            )}
          </div>
          {formik.touched.date && formik.errors.date && (
            <div className={styles.error}>{formik.errors.date}</div>
          )}
        </div>

        <div className={styles.formRow}>
          <label htmlFor="line">Ligne :</label>
          <select
            id="line"
            name="line"
            value={formik.values.line}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Sélectionner une ligne</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
            <option value={42}>42</option>
            <option value={45}>45</option>
          </select>
          {formik.touched.line && formik.errors.line && (
            <div className={styles.error}>{formik.errors.line}</div>
          )}
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Chargement...' : 'Générer le Rapport'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}

export default GenerateReport;
