const express = require('express');
const router = express.Router();
const { ReportEntry } = require('../models/ReportEntry');
const { WorkHours } = require('../models/WorkHours');
const { Rapport } = require('../models/Rapport');

const getStartAndEndOfDay = (date) => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  return { startOfDay, endOfDay };
};

// Route pour créer ou mettre à jour les heures de travail
router.post('/', async (req, res) => {
  const { selectedDate, timeSlot, note, workHours, hour, line } = req.body;

  if (!selectedDate || !timeSlot || !workHours || !Array.isArray(workHours)) {
    return res.status(400).json({ message: "Paramètres manquants ou incorrects." });
  }

  try {
    // Étape 1: Trouver le rapport correspondant à la date
    const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(selectedDate));
    const rapport = await Rapport.findOne({ date: { $gte: startOfDay, $lt: endOfDay }, line });


    // Étape 2: Trouver le reportEntry correspondant au timeSlot
    const reportEntry = await ReportEntry.findOne({ reportId: rapport._id, timeSlot });

    // Étape 3: Vérifier si les workHours existent déjà
    const existingWorkHours = await WorkHours.findOne({ reportEntryId: reportEntry._id, hour });

    if (existingWorkHours) {
      // Si les workHours existent déjà, renvoyer leur ID et un message informatif
      return res.status(200).json({ message: "Les heures de travail existent déjà.", workHoursId: existingWorkHours._id });
    }

    // Étape 4: Créer un nouvel objet WorkHours
    const workHoursDoc = new WorkHours({
      reportEntryId: reportEntry._id,
      note,
      workHours,
      hour
    });
    await workHoursDoc.save();

    return res.status(201).json({ message: "Heures de travail créées avec succès", workHours: workHoursDoc });

  } catch (err) {
    console.error('Erreur lors de la création des heures de travail:', err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put('/update/:id', async (req, res) => {
  const { note, workHours } = req.body;
  const workHoursId = req.params.id;
  const hour = req.body.hour;

  // if (!note || !workHours || !Array.isArray(workHours)) {
  //   return res.status(400).json({ message: "Paramètres manquants ou incorrects." });
  // }

  try {
    // Vérification de l'existence des workHours à mettre à jour
    const existingWorkHours = await WorkHours.findById(workHoursId);

    if (!existingWorkHours) {
      return res.status(404).json({ message: "Aucune entrée d'heures de travail trouvée." });
    }

    // Mise à jour des workHours
    existingWorkHours.note = note;
    existingWorkHours.workHours = workHours;
    existingWorkHours.hour = hour;

    await existingWorkHours.save();

    return res.status(200).json({ message: "Heures de travail mises à jour avec succès", workHours: existingWorkHours });

  } catch (err) {
    console.error('Erreur lors de la mise à jour des heures de travail:', err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour récupérer toutes les entrées par timeslot
router.get('/reportentries/:id?', async (req, res) => {
  const reportEntryId = req.params.id;

  try {
    if (reportEntryId) {
      const reportEntry = await ReportEntry.findById(reportEntryId);
      if (!reportEntry) {
        return res.status(404).json({ message: "Entrée non trouvée." });
      }
      return res.status(200).json(reportEntry);
    }
  } catch (err) {
    console.error('Erreur lors de la récupération des entrées:', err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});




module.exports = router;
