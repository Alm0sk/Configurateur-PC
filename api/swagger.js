 const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Configurateur PC API',
      version: '1.0.0',
      description: 'API pour la gestion des configurations PC'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
