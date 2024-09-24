import React, { useState } from 'react';
import { useFormik,ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
        console.log(dataRapport);
        if(dataRapport.message === "Rapport non trouvé"){
          setError("Pas de rapport existant.")
        }

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

    // Largeur et hauteur de l'image
    const imgWidth = 20; 
    const imgHeight = 20; 

    // Obtenir la largeur de la page
    const pageWidth = doc.internal.pageSize.getWidth();

    // Calculer la position X pour que l'image soit en haut à droite
    const imgX = pageWidth - imgWidth - 10; // 10 est la marge droite

    // Ajouter le titre centré en haut de la page
    const reportTitle = `Rapport du : ${formik.values.date}`;
    const titleWidth = doc.getTextWidth(reportTitle);
    const titleX = (pageWidth - titleWidth) / 2; // Centre le titre
    doc.text(reportTitle, titleX, 20);

    // Ajouter l'image en haut à droite
    doc.addImage('data:image/png;base64,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', 'PNG', imgX, 5, imgWidth, imgHeight);

    // Position y après le titre et l'image
    let yPosition = 40; 


    doc.text(`Numéro de ligne : ${formik.values.line}`, 10, yPosition);

    yPosition += 10;
    const NumCommande = dataRapport.clients.map(client => client.orderNumber);
    const numCommandeString = NumCommande.join('-');

    // Exemple de table avec les données JSON récupérées
    doc.autoTable({
      head: [['Client', 'Article Navision', 'Numéro de Commande', 'Quantité']],
      body: dataRapport.clients.map(client => [
        client.client, client.articleNavision, client.orderNumber, client.quantity
      ]),
      startY: yPosition,
      headStyles: {
        fillColor: [246, 166, 35], // Couleur orange (#f6a623)
        textColor: 255,            // Couleur du texte (blanc)
        fontStyle: 'bold',         // Texte en gras
      }
    });

    yPosition = doc.autoTable.previous.finalY + 10;

    responseReportEntry.forEach((entry, index) => {
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
      yPosition += 10;

      if (entry.workHours && entry.workHours.length > 0) {
        const hours = entry.workHours.map(workHour => workHour.hour);
        const titles = entry.workHours[0].workHours.map(item => item.title);

        // Préparer les statuts sous chaque titre
        const workHoursData = titles.map((title, rowIndex) => {
          return [title, ...entry.workHours.map(workHour => workHour.workHours[rowIndex].status)];
        });

        const notesData = ['Commentaire', ...entry.workHours.map(workHour => workHour.note || 'N/A')];

        doc.autoTable({
          head: [['Titre', ...hours]], 
          body: [
            ...workHoursData, 
            notesData       
          ],
          startY: yPosition,
          theme: 'grid', 
          headStyles: {
            fillColor: [246, 166, 35], // Couleur orange (#f6a623)
            textColor: 255,            // Couleur du texte (blanc)
            fontStyle: 'bold',         // Texte en gras
          },
          didParseCell: function (data) {
            const cellValue = data.cell.raw; // Contenu de la cellule
        
            if (cellValue === 'OK') {
              data.cell.styles.fillColor = [144, 238, 144]; // Vert clair (LimeGreen)
            } else if (cellValue === 'NOK') {
              data.cell.styles.fillColor = [255, 99, 71]; // Rouge (Tomato)
            } else if (cellValue === 'NA') {
              data.cell.styles.fillColor = [169, 169, 169]; // Gris (DarkGray)
            }
          }
        });
        
        yPosition = doc.autoTable.previous.finalY + 10;
        yPosition += 10; 

        doc.setFont('helvetica', 'normal');

    const commentText = `Commentaire général : ${entry.note || 'Aucun commentaire disponible'}`;
    const creatorName = entry.createdBy ? `${entry.createdBy.name} ${entry.createdBy.lastname}` : 'Inconnu';

    const boxX = 10;
    const boxY = yPosition;
    const padding = 5; 
    const textWidth = doc.getTextWidth(commentText) + 20; 
    const boxHeight = 20; 

    doc.setFillColor(240, 240, 240); // Gris clair
    doc.roundedRect(boxX, boxY, textWidth, boxHeight, 3, 3, 'F'); 

    doc.setFontSize(12); 
    doc.setTextColor(50);
    doc.text(commentText, boxX + padding, boxY + padding + 5); 

    yPosition += boxHeight + 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Créé par : ${creatorName}`, 10, yPosition); 

    yPosition += 10;


        if (index < responseReportEntry.length - 1) {
            doc.addPage();
            yPosition = 10; 
          }

      } else {
        // Si aucun workHour, afficher un message
        doc.setFontSize(12);
        doc.text('Aucune heure de travail associée.', 10, yPosition);
        yPosition += 10;
      }
    });

    doc.save(`Rapport.${formik.values.line}.${formik.values.date}.${numCommandeString}.pdf`);
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setCalendarDate(date);
    formik.setFieldValue('date', formattedDate);
    setShowCalendar(false);
  };

  return (
    <div className={styles.container2}>
    <Header nav="/" />

    <div className={styles.container}>
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
    </div>
  );
}

export default GenerateReport;
