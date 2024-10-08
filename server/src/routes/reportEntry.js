const express = require('express');
const router = express.Router();
const {ReportEntry} = require('../models/ReportEntry');
const {Rapport} = require('../models/Rapport');
const { WorkHours } = require('../models/WorkHours');
const { auth } = require("../middleware/auth");
const {User} = require("../models/User");

const getStartAndEndOfDay = (date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    return { startOfDay, endOfDay };
};


router.post('/create-entry' , auth, async (req, res) => {
    const { selectedDate, timeSlot, line } = req.body;
    try{
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(selectedDate));
    
        const rapport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            line
        });


        if (!rapport){
            return res.json({message: "Aucun rapport trouvé pour cette date"});
        }

            // Vérifier si un ReportEntry pour ce rapport et ce timeSlot existe déjà
        const existingReportEntry = await ReportEntry.findOne({
            reportId: rapport._id,
            timeSlot,
        });

        if (existingReportEntry) {
            return res.json({ message: "Un compte rendu pour ce créneau horaire existe déjà" });
        }

        const reportEntry = new ReportEntry({
            reportId: rapport._id,
            timeSlot,
            workHours: [],
            note: '',
            createBy: req.user._id?req.user._id:null
        });

        await reportEntry.save();

        res.status(201).json({message: "Compte rendu créé avec succès", reportEntry});
    }catch(err) {
        console.error('Erreur lors de la création du compte rendu', err);
        res.status(500).json({message: "Erreur serveur"});
    }
});

router.put('/update', async (req, res) => {
    const { selectedDate, timeSlot, note, workHours, userId, line } = req.body;

    // if (!selectedDate || !timeSlot) {
    //     return res.status(400).json({ message: "Les paramètres 'selectedDate' et 'timeSlot' sont requis." });
    // }

    try {
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(selectedDate));
    
        // Trouver le rapport pour la date donnée
        const rapport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            line
        });

        if (!rapport) {
            return res.status(404).json({ message: "Aucun rapport trouvé pour cette date" });
        }

        // Mettre à jour ou créer l'entrée de rapport
        const updatedReportEntry = await ReportEntry.findOneAndUpdate(
            { reportId: rapport._id, timeSlot },
            { note, workHours, createdBy: userId },
            { new: true, upsert: true }  // `new` pour retourner le document mis à jour, `upsert` pour créer s'il n'existe pas
        );

        if (!updatedReportEntry) {
            return res.status(404).json({ message: "Aucun compte rendu trouvé pour ce créneau horaire." });
        }

        res.status(200).json({ message: "Compte rendu mis à jour avec succès", updatedReportEntry });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du compte rendu:', err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get('/reportentrydata', async (req, res) =>{

    const { selectedDate, timeSlot , formattedFirstHour, line} = req.query;
    try{
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(selectedDate));

        // Trouver le rapport pour la date donnée
        const rapport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            line
        });

        if(rapport){
            const existingReportEntry = await ReportEntry.findOne({
                reportId: rapport._id,
                timeSlot,
            });

            if(existingReportEntry){
                const existingWorkHour = await WorkHours.findOne({
                    reportEntryId: existingReportEntry._id,
                    hour:formattedFirstHour
                })
                if(existingWorkHour){
                    res.status(200).json(existingWorkHour);
                }
                else{
                    res.json({message : "Pas de WorkHour trouvée"});
                }
            }
        }
    }catch(err){
        console.log("pas de compte rendu trouvé");
    }
});

router.get('/reportentrydatacomment', async (req, res) =>{

    const { selectedDate, timeSlot , formattedFirstHour, line} = req.query;
    try{
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(selectedDate));

        // Trouver le rapport pour la date donnée
        const rapport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            line
        });

        if(rapport){
            const existingReportEntry = await ReportEntry.findOne({
                reportId: rapport._id,
                timeSlot,
            });

            if(existingReportEntry){
                res.status(200).json(existingReportEntry)
            }
        }
    }catch(err){
        console.log("pas de compte rendu trouvé");
    }
});

router.get('/reportentries', async (req, res) => {
    const { rapportId } = req.query;
  
    if (!rapportId) {
      return res.status(400).json({ message: "rapportId est requis." });
    }
  
    try {
      // Récupérer les reportEntries pour ce rapport
      const reportEntries = await ReportEntry.find({ reportId: rapportId });
  
      // Si aucune entrée n'est trouvée, retournez un message d'erreur
      if (!reportEntries.length) {
        return res.status(404).json({ message: "Aucune entrée de rapport trouvée pour ce rapport." });
      }
  
      // Récupérer les workHours associés à chaque reportEntry
      const reportEntriesWithWorkHours = await Promise.all(
        reportEntries.map(async (entry) => {
          const workHours = await WorkHours.find({ reportEntryId: entry._id });
          const user = await User.findById(entry.createdBy).select('name lastname'); // Récupérer le nom et le prénom
          return { ...entry.toObject(), workHours, createdBy: user };
        })
      );
  
      // Retourner les reportEntries avec leurs workHours
      res.status(200).json(reportEntriesWithWorkHours);
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  

module.exports = router;