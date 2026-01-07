const categoryService = require('../services/categoryService');

class CategoryController {
  // Créer une catégorie
  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        message: 'Catégorie créée avec succès',
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création de la catégorie',
        error: error.message,
      });
    }
  }

  // Récupérer toutes les catégories
  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des catégories',
        error: error.message,
      });
    }
  }

  // Récupérer une catégorie par ID
  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée',
        });
      }
      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la catégorie',
        error: error.message,
      });
    }
  }

  // Mettre à jour une catégorie
  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Catégorie mise à jour avec succès',
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la catégorie',
        error: error.message,
      });
    }
  }

  // Supprimer une catégorie
  async deleteCategory(req, res) {
    try {
      const category = await categoryService.deleteCategory(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Catégorie supprimée avec succès',
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la catégorie',
        error: error.message,
      });
    }
  }
}

module.exports = new CategoryController();
