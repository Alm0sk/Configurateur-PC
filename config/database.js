const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/configpc';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ Base de données MongoDB connectée avec succès');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
