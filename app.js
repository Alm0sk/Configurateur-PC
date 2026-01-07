const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config({ path: './docker/.env' });

// Import de la connexion BD
const connectDB = require('./config/database');

// Import des routes
const userApiRoute = require('./routes/userApiRoute');
const categoryRoute = require('./routes/categoryRoute');
const componentRoute = require('./routes/componentRoute');
const partnerRoute = require('./routes/partnerRoute');
const partnerPriceRoute = require('./routes/partnerPriceRoute');
const configurationRoute = require('./routes/configurationRoute');

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(express.json());

// Configuration Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ConfiguratorPC API',
      version: '1.0.0',
      description: 'API RESTful pour la gestion de configurations PC',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./routes/*.js', './app.js'],
};

const specs = swaggerJsdoc(options);

// Routes Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes API
app.use('/api/users', userApiRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/components', componentRoute);
app.use('/api/partners', partnerRoute);
app.use('/api/partner-prices', partnerPriceRoute);
app.use('/api/configurations', configurationRoute);

// Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
