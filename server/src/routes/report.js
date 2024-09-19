// routes/rapport.js
const express = require('express');
const router = express.Router();
const { Rapport } = require('../models/Rapport');
const { Client } = require('../models/Client');

// Fonction pour obtenir le début et la fin de la journée actuelle
const getStartAndEndOfDay = (date) => {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    return { startOfDay, endOfDay };
}


// Route pour créer un rapport
router.post('/', async (req, res) => {
    try {
        const { line, date } = req.body;

        // Vérification qu'il n'existe pas déjà un rapport pour cette date
        const { startOfDay, endOfDay } = getStartAndEndOfDay(new Date(date));
        const existingReport = await Rapport.findOne({
            date: { $gte: startOfDay, $lt: endOfDay }, line
        });

        if (existingReport) {
            return res.status(400).json({ message: "Un rapport pour cette date existe déjà" });
        }

        // Créer et sauvegarder le nouveau rapport
        const rapport = new Rapport({ line, date });
        await rapport.save();

        res.status(201).json(rapport);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Route pour mettre à jour un rapport par ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const updatedReport = await Rapport.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedReport) {
            return res.status(404).json({ message: "Rapport non trouvé" });
        }

        res.status(200).json(updatedReport);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Route pour obtenir un rapport et ses clients par date
router.get('/', async (req, res) => {
    const { date, line } = req.query;
  
    try {
      const rapport = await Rapport.findOne({ date, line });
      if (rapport) {
        const clients = await Client.find({ rapportId: rapport._id });

        res.status(200).json({ rapport, clients });
      }
      if(!rapport){
        return res.json({ message: "Rapport non trouvé" });
      }
      
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  

module.exports = router;
