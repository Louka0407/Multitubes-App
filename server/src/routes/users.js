const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        code: req.user.code,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
    });
});

router.post("/register", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.json({ success: false, err });
    }
});

router.post("/login", async (req, res) => {
    try {
        // Recherche de l'utilisateur par code
        const user = await User.findOne({ code: req.body.code });
        // Si l'utilisateur n'existe pas, retour de l'erreur
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, code not found"
            });
        }

        // Comparaison des mots de passe
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.json({
                loginSuccess: false,
                message: "Wrong password"
            });
        }

        // Génération du token
        const tokenUser = await user.generateToken();

        // Définition des cookies et envoi de la réponse
        res.cookie("w_authExp", tokenUser.tokenExp);
        res
            .cookie("w_auth", tokenUser.token)
            .status(200)
            .json({
                loginSuccess: true,
                userId: tokenUser._id
            });

    } catch (err) {
        // Gestion des erreurs
        return res.status(400).send(err);
    }
});

router.get("/logout", auth, async (req, res) => {
    try {
        const result = await User.findOneAndUpdate(
            { _id: req.user._id }, 
            { token: "", tokenExp: "" }
        );

        if (!result) {
            return res.json({ success: false, message: 'User not found' });
        }

        return res.status(200).send({ success: true });
    } catch (err) {
        return res.json({ success: false, err });
    }
});

router.get("/", auth, async (req, res) => {
    try {
      const users = await User.find();
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
  });

  router.post("/deleteUser", auth, async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while deleting the user" });
    }
});

// Route pour la modification des utilisateurs
router.post("/updateUser", auth, async (req, res) => {
    try {
        console.log("Update request received for user:", req.body);

        const { userId, code, name, role, lastname } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Vérifier si le code est déjà utilisé par un autre utilisateur
        const existingUser = await User.findOne({ code });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ success: false, message: "Code already in use" });
        }

        await User.findByIdAndUpdate(userId, { code, name, role, lastname });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while updating the user" });
    }
});


module.exports = router;
