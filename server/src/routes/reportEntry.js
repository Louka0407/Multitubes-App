const express = require('express');
const router = express.Router();
const {ReportEntry} = require('../models/ReportEntry');
const {Rapport} = require('../models/Rapport');
const { WorkHours } = require('../models/WorkHours');

const getStartAndEndOfDay = (date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    return { startOfDay, endOfDay };
};


router.post('/create-entry' , async (req, res) => {
    const { selectedDate, timeSlot } = req.body;
    try{
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(selectedDate));
    
        const rapport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
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
            note: ''
        });

        await reportEntry.save();

        res.status(201).json({message: "Compte rendu créé avec succès", reportEntry});
    }catch(err) {
        console.error('Erreur lors de la création du compte rendu', err);
        res.status(500).json({message: "Erreur serveur"});
    }
});

router.put('/update', async (req, res) => {
    const { selectedDate, timeSlot, note, workHours } = req.body;

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
            }
        });

        if (!rapport) {
            return res.status(404).json({ message: "Aucun rapport trouvé pour cette date" });
        }

        // Mettre à jour ou créer l'entrée de rapport
        const updatedReportEntry = await ReportEntry.findOneAndUpdate(
            { reportId: rapport._id, timeSlot },
            { note, workHours },
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

    const { selectedDate, timeSlot , formattedFirstHour} = req.query;
    try{
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(selectedDate));

        // Trouver le rapport pour la date donnée
        const rapport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
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

module.exports = router;