const User = require('../models/user');

// Récupère la liste des users
module.exports.getUsers = async (query) => {
  try {
    let users = await User.find(query);
    return users;
  } catch (e) {
    // log errors
    throw Error('Error while query all users');
  }
};

// Récupère un user par son ID
module.exports.getUser = async (query) => {
  try {
    let user = await User.findOne(query);
    return user;
  } catch (e) {
    // log errors
    throw Error('Error while querying one User');
  }
};

// Crée un user
module.exports.createUser = async (user) => {
  try {
    return await user.save();
  } catch (e) {
    // Log Errors
    throw Error('Error while save User');
  }
};

// Met à jour un user
module.exports.updateUser = async (query, user) => {
  try {
    return await User.updateOne(query, user);
  } catch (e) {
    // Log Errors
    throw Error('Error while update User');
  }
};

// Supprime un user
module.exports.deleteUser = async (query) => {
  try {
    return await User.deleteOne(query);
  } catch (e) {
    // Log Errors
    throw Error('Error while delete User');
  }
}; 