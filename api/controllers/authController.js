const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Génère un token JWT
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Inscription d'un nouvel utilisateur
 */
module.exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Un compte existe déjà avec cet email.' 
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      message: 'Inscription réussie.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de l\'inscription.',
      error: error.message 
    });
  }
};

/**
 * Connexion d'un utilisateur
 */
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect.' 
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Compte désactivé. Contactez l\'administrateur.' 
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Email ou mot de passe incorrect.' 
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: 'Connexion réussie.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la connexion.',
      error: error.message 
    });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
module.exports.getProfile = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        profilePicture: req.user.profilePicture,
        isActive: req.user.isActive,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du profil.',
      error: error.message 
    });
  }
};

/**
 * Mettre à jour le profil de l'utilisateur connecté
 */
module.exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, profilePicture } = req.body;
    
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profil mis à jour.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du profil.',
      error: error.message 
    });
  }
};

/**
 * Changer le mot de passe
 */
module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user._id);

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Mot de passe actuel incorrect.' 
      });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Mot de passe modifié avec succès.' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors du changement de mot de passe.',
      error: error.message 
    });
  }
};
