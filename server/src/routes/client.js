const express = require('express');
const router = express.Router();
const { Client } = require("../models/Client");
const { auth } = require("../middleware/auth");
const {Rapport} = require("../models/Rapport");

//=================================
//             Client
//=================================

// Route pour créer un nouveau client
router.post('/', async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const operations = req.body.map(client => ({
            updateOne: {
                filter: { _id: client._id }, // Recherche du document avec l'_id
                update: { $set: client }, // Mise à jour des champs du document
                upsert: true // Création du document si non existant
            }
        }));

        // Exécutez les opérations en une seule fois
        const result = await Client.bulkWrite(operations);

        res.status(200).json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Route pour obtenir les clients associés à un rapport pour une date spécifique
router.get('/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(date));
        
        const rapport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (!rapport) {
            return res.status(404).json({ message: 'No report found for this date' });
        }

        // Trouver tous les clients associés à ce rapport
        const clients = await Client.find({ rapportId: rapport._id });
        res.status(200).json(clients);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fonction pour obtenir le début et la fin de la journée actuelle
const getStartAndEndOfDay = (date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    return { startOfDay, endOfDay };
};

module.exports = router;