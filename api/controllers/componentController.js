const componentService = require('../services/componentService');

class ComponentController {
  // Créer un composant
  async createComponent(req, res) {
    try {
      const component = await componentService.createComponent(req.body);
      res.status(201).json({
        success: true,
        message: 'Composant créé avec succès',
        data: component,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création du composant',
        error: error.message,
      });
    }
  }

  // Récupérer tous les composants
  async getAllComponents(req, res) {
    try {
      const filters = {};
      
      if (req.query.category) filters.category = req.query.category;
      if (req.query.brand) filters.brand = req.query.brand;
      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
      
      const components = await componentService.getAllComponents(filters);
      res.status(200).json({
        success: true,
        count: components.length,
        data: components,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des composants',
        error: error.message,
      });
    }
  }

  // Récupérer les composants par catégorie
  async getComponentsByCategory(req, res) {
    try {
      const components = await componentService.getComponentsByCategory(req.params.categoryId);
      res.status(200).json({
        success: true,
        count: components.length,
        data: components,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des composants',
        error: error.message,
      });
    }
  }

  // Récupérer un composant par ID
  async getComponentById(req, res) {
    try {
      const component = await componentService.getComponentById(req.params.id);
      if (!component) {
        return res.status(404).json({
          success: false,
          message: 'Composant non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        data: component,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du composant',
        error: error.message,
      });
    }
  }

  // Mettre à jour un composant
  async updateComponent(req, res) {
    try {
      const component = await componentService.updateComponent(req.params.id, req.body);
      if (!component) {
        return res.status(404).json({
          success: false,
          message: 'Composant non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Composant mis à jour avec succès',
        data: component,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour du composant',
        error: error.message,
      });
    }
  }

  // Supprimer un composant
  async deleteComponent(req, res) {
    try {
      const component = await componentService.deleteComponent(req.params.id);
      if (!component) {
        return res.status(404).json({
          success: false,
          message: 'Composant non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Composant supprimé avec succès',
        data: component,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du composant',
        error: error.message,
      });
    }
  }

  // Rechercher des composants
  async searchComponents(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Le paramètre de recherche q est requis',
        });
      }
      
      const components = await componentService.searchComponents(q);
      res.status(200).json({
        success: true,
        count: components.length,
        data: components,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche',
        error: error.message,
      });
    }
  }
}

module.exports = new ComponentController();
