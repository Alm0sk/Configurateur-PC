const configurationService = require('../services/configurationService');

class ConfigurationController {
  // Créer une configuration
  async createConfiguration(req, res) {
    try {
      const config = await configurationService.createConfiguration(req.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Configuration créée avec succès',
        data: config,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création de la configuration',
        error: error.message,
      });
    }
  }

  // Récupérer les configurations de l'utilisateur
  async getUserConfigurations(req, res) {
    try {
      const filters = {
        status: req.query.status,
      };
      
      const configurations = await configurationService.getUserConfigurations(req.userId, filters);
      res.status(200).json({
        success: true,
        count: configurations.length,
        data: configurations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des configurations',
        error: error.message,
      });
    }
  }

  // Récupérer une configuration par ID
  async getConfigurationById(req, res) {
    try {
      const config = await configurationService.getConfigurationById(req.params.id);
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuration non trouvée',
        });
      }
      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la configuration',
        error: error.message,
      });
    }
  }

  // Ajouter un composant à une configuration
  async addComponent(req, res) {
    try {
      const { componentId, partnerId, price } = req.body;
      
      if (!componentId) {
        return res.status(400).json({
          success: false,
          message: 'componentId est requis',
        });
      }
      
      const config = await configurationService.addComponent(
        req.params.id,
        componentId,
        partnerId,
        price
      );
      
      res.status(200).json({
        success: true,
        message: 'Composant ajouté avec succès',
        data: config,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de l\'ajout du composant',
        error: error.message,
      });
    }
  }

  // Supprimer un composant d'une configuration
  async removeComponent(req, res) {
    try {
      const config = await configurationService.removeComponent(
        req.params.id,
        req.params.componentId
      );
      
      res.status(200).json({
        success: true,
        message: 'Composant supprimé avec succès',
        data: config,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la suppression du composant',
        error: error.message,
      });
    }
  }

  // Mettre à jour la quantité d'un composant
  async updateComponentQuantity(req, res) {
    try {
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'La quantité doit être >= 1',
        });
      }
      
      const config = await configurationService.updateComponentQuantity(
        req.params.id,
        req.params.componentId,
        quantity
      );
      
      res.status(200).json({
        success: true,
        message: 'Quantité mise à jour avec succès',
        data: config,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la quantité',
        error: error.message,
      });
    }
  }

  // Mettre à jour une configuration
  async updateConfiguration(req, res) {
    try {
      const config = await configurationService.updateConfiguration(req.params.id, req.body);
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuration non trouvée',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Configuration mise à jour avec succès',
        data: config,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la configuration',
        error: error.message,
      });
    }
  }

  // Supprimer une configuration
  async deleteConfiguration(req, res) {
    try {
      const config = await configurationService.deleteConfiguration(req.params.id);
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuration non trouvée',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Configuration supprimée avec succès',
        data: config,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la configuration',
        error: error.message,
      });
    }
  }

  // Récupérer toutes les configurations (admin)
  async getAllConfigurations(req, res) {
    try {
      const filters = {
        status: req.query.status,
        user: req.query.user,
      };
      
      const configurations = await configurationService.getAllConfigurations(filters);
      res.status(200).json({
        success: true,
        count: configurations.length,
        data: configurations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des configurations',
        error: error.message,
      });
    }
  }

  // Finaliser une configuration
  async finalizeConfiguration(req, res) {
    try {
      const config = await configurationService.finalizeConfiguration(req.params.id);
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuration non trouvée',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Configuration finalisée avec succès',
        data: config,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la finalisation de la configuration',
        error: error.message,
      });
    }
  }

  // Archiver une configuration
  async archiveConfiguration(req, res) {
    try {
      const config = await configurationService.archiveConfiguration(req.params.id);
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'Configuration non trouvée',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Configuration archivée avec succès',
        data: config,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de l\'archivage de la configuration',
        error: error.message,
      });
    }
  }
}

module.exports = new ConfigurationController();
