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
        email: req.user.email,
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
        // Recherche de l'utilisateur par email
        const user = await User.findOne({ email: req.body.email });

        // Si l'utilisateur n'existe pas, retour de l'erreur
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
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

module.exports = router;
