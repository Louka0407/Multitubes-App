const express = require('express');
const router = express.Router();
const {ReportEntry} = require('../models/ReportEntry');
const {Rapport} = require('../models/Rapport');

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

module.exports = router;