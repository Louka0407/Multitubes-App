const express = require('express');
const router = express.Router();
const { Rapport } = require("../models/Rapport");
const { Client } = require("../models/Client");
const { auth } = require("../middleware/auth");

// Fonction pour obtenir le début et la fin de la journée actuelle
const getStartAndEndOfDay = (date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    return { startOfDay, endOfDay };
}

// Route pour créer un nouveau rapport
router.post('/', async (req, res) => {
    try {
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date());
        
        // Rechercher un rapport existant pour la date actuelle en ignorant l'heure
        const existingReport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (!existingReport) {
          // Créer et sauvegarder le nouveau rapport si aucun rapport n'existe pour la date actuelle
          const rapport = new Rapport(req.body);
          await rapport.save();
          res.status(201).json(rapport);
        }
        else {
          // Mettre à jour le rapport existant si nécessaire
          const updatedReport = await Rapport.findByIdAndUpdate(existingReport._id, req.body, { new: true });
          res.status(200).json(updatedReport);
      }

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(date));

        // Trouver le rapport pour la date donnée
        const rapport = await Rapport.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (!rapport) {
            return res.json({ message: "Aucun rapport trouvé pour cette date" });
        }

        // Récupérer les clients associés au rapport trouvé
        const clients = await Client.find({ rapportId: rapport._id });

        res.status(200).json({ rapport, clients });
    } catch (error) {
        console.error('Erreur lors de la récupération du rapport:', error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération du rapport et des clients" });
    }
});

module.exports = router;
