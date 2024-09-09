const express = require('express');
const router = express.Router();
const { Client } = require("../models/Client");
const { auth } = require("../middleware/auth");


//=================================
//             Client
//=================================

// Route pour créer un nouveau client
router.post('/', async (req, res) => {
    try {
        
        // Assurez-vous que req.body est bien un tableau
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        // Créez les clients dans une seule opération
        const createdClients = await Client.insertMany(req.body);
        res.status(201).json(createdClients);
    } catch (err) {
        console.error('Error:', err); // Log de l'erreur
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;