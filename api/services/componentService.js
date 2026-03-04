const Component = require('../models/component');

class ComponentService {
  // Créer un composant
  async createComponent(data) {
    const component = new Component(data);
    return await component.save();
  }

  // Récupérer tous les composants avec filtres optionnels
  async getAllComponents(filters = {}) {
    const query = {};
    
    if (filters.category) query.category = filters.category;
    if (filters.brand) query.brand = { $regex: filters.brand, $options: 'i' };
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    
    return await Component.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });
  }

  // Récupérer les composants par catégorie
  async getComponentsByCategory(categoryId) {
    return await Component.find({ category: categoryId, isActive: true })
      .populate('category', 'name')
      .sort({ brand: 1, title: 1 });
  }

  // Récupérer un composant par ID
  async getComponentById(id) {
    return await Component.findById(id).populate('category', 'name');
  }

  // Mettre à jour un composant
  async updateComponent(id, data) {
    return await Component.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('category', 'name');
  }

  // Supprimer un composant
  async deleteComponent(id) {
    return await Component.findByIdAndDelete(id);
  }

  // Chercher des composants par titre ou marque
  async searchComponents(query) {
    return await Component.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { model: { $regex: query, $options: 'i' } },
      ],
      isActive: true,
    }).populate('category', 'name');
  }
}

module.exports = new ComponentService();
