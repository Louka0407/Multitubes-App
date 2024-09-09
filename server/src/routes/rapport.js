const express = require('express');
const router = express.Router();
const { Rapport } = require("../models/Rapport");
const { auth } = require("../middleware/auth");


//=================================
//             Rapport
//=================================

// Route pour créer un nouveau rapport
router.post('/', async (req, res) => {
    try {
      const rapport = new Rapport(req.body);
      await rapport.save();
      res.status(201).json(rapport);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
module.exports = router;