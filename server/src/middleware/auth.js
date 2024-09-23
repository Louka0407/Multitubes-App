const { User } = require('../models/User');

let auth = async (req, res, next) => {
  try {
    let token = req.cookies.w_auth;

    if (!token) {
      return res.status(401).json({ isAuth: false, message: 'Token non fourni. Redirection vers la page de connexion.' });
    }

    const user = await User.findByToken(token);

    if (!user) {
      return res.status(401).json({ isAuth: false, message: 'Authentification échouée. Redirection vers la page de connexion.' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ isAuth: false, message: 'Erreur serveur. Redirection vers la page de connexion.' });
  }
};


module.exports = { auth };
