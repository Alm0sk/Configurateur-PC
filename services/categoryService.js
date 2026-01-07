const Category = require('../models/category');

class CategoryService {
  // Créer une catégorie
  async createCategory(data) {
    const category = new Category(data);
    return await category.save();
  }

  // Récupérer toutes les catégories
  async getAllCategories() {
    return await Category.find().sort({ name: 1 });
  }

  // Récupérer une catégorie par ID
  async getCategoryById(id) {
    return await Category.findById(id);
  }

  // Mettre à jour une catégorie
  async updateCategory(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  // Supprimer une catégorie
  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryService();
