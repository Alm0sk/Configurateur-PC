const userApiService = require("../services/userApiService");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Récupère la liste des users
module.exports.getUsers = async (req, res) => {
  // ..
};

// Récupère un user suivant son id
module.exports.getUser = async (req, res) => {
  // ..
};

// Crée un user
module.exports.createUser = async (req, res) => {
  // Hash le mdp avec bcrypt
  let salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  // ..
};

// Update un user
module.exports.updateUser = async (req, res) => {
  // Hash le mdp avec bcrypt
  let salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  // ..
};

// Supprime un user
module.exports.deleteUser = async (req, res) => {
  // ..
}; 