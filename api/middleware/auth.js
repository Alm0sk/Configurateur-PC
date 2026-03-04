const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token
 */
const auth = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Accès refusé. Token manquant.' 
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Token invalide. Utilisateur introuvable.' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Compte désactivé.' 
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expiré. Veuillez vous reconnecter.' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token invalide.' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur d\'authentification.',
      error: error.message 
    });
  }
};

/**
 * Middleware pour vérifier le rôle admin
 */
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Accès refusé. Droits administrateur requis.' 
    });
  }
  next();
};

/**
 * Middleware optionnel - attache l'utilisateur si token présent
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Ignorer les erreurs de token - continuer sans authentification
    next();
  }
};

module.exports = { auth, adminOnly, optionalAuth };
