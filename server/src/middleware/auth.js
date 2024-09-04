const { User } = require('../models/User');

let auth = async (req, res, next) => {
  try {
    let token = req.cookies.w_auth;

    // Trouver l'utilisateur par le token
    const user = await User.findByToken(token);

    if (!user) {
      return res.json({
        isAuth: false,
        error: true
      });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { auth };
