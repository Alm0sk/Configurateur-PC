const User = require("../models/user");
const bcrypt = require("bcrypt");

// Récupère la liste des users
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupère un user suivant son id
module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'utilisateur demande son propre profil ou s'il est admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès refusé. Vous ne pouvez voir que votre propre profil.' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crée un user
module.exports.createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create(req.body);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update un user
module.exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprime un user
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
