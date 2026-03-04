const Configuration = require('../models/configuration');
const partnerPriceService = require('./partnerPriceService');

class ConfigurationService {
  // Créer une configuration
  async createConfiguration(userId, data) {
    const configuration = new Configuration({
      ...data,
      user: userId,
      totalCost: 0,
    });
    return await configuration.save();
  }

  // Récupérer les configurations d'un utilisateur
  async getUserConfigurations(userId, filters = {}) {
    const query = {
      $or: [
        { user: userId },
        { isPublic: true },
      ],
    };

    if (filters.status) {
      query.$and = [{ status: filters.status }];
    }

    return await Configuration.find(query)
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'components.component',
        select: 'title brand model category',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('components.selectedPartner', 'name')
      .sort({ createdAt: -1 });
  }

  // Récupérer une configuration par ID
  async getConfigurationById(id) {
    return await Configuration.findById(id)
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'components.component',
        select: 'title brand model category specifications',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('components.selectedPartner', 'name url');
  }

  // Ajouter un composant à une configuration
  async addComponent(configId, componentId, partnerId = null, price = 0) {
    const config = await Configuration.findById(configId);

    if (!config) {
      throw new Error('Configuration non trouvée');
    }

    // Vérifier si le composant existe déjà
    const existingComponent = config.components.find(
      (c) => c.component.toString() === componentId
    );

    if (existingComponent) {
      existingComponent.quantity += 1;
      existingComponent.price = price || existingComponent.price;
      existingComponent.selectedPartner = partnerId;
    } else {
      config.components.push({
        component: componentId,
        selectedPartner: partnerId,
        price,
        quantity: 1,
      });
    }

    // Calculer le coût total
    config.totalCost = this.calculateTotalCost(config.components);

    return await config.save();
  }

  // Supprimer un composant d'une configuration
  async removeComponent(configId, componentId) {
    const config = await Configuration.findById(configId);

    if (!config) {
      throw new Error('Configuration non trouvée');
    }

    config.components = config.components.filter(
      (c) => c.component.toString() !== componentId
    );

    config.totalCost = this.calculateTotalCost(config.components);

    return await config.save();
  }

  // Mettre à jour la quantité d'un composant
  async updateComponentQuantity(configId, componentId, quantity) {
    const config = await Configuration.findById(configId);

    if (!config) {
      throw new Error('Configuration non trouvée');
    }

    const component = config.components.find(
      (c) => c.component.toString() === componentId
    );

    if (component) {
      component.quantity = quantity;
      config.totalCost = this.calculateTotalCost(config.components);
    }

    return await config.save();
  }

  // Mettre à jour une configuration
  async updateConfiguration(id, data) {
    return await Configuration.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'components.component',
        select: 'title brand model category',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .populate('components.selectedPartner', 'name');
  }

  // Supprimer une configuration
  async deleteConfiguration(id) {
    return await Configuration.findByIdAndDelete(id);
  }

  // Calculer le coût total
  calculateTotalCost(components) {
    return components.reduce((total, comp) => {
      return total + (comp.price * comp.quantity);
    }, 0);
  }

  // Récupérer toutes les configurations (admin)
  async getAllConfigurations(filters = {}) {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.user) query.user = filters.user;

    return await Configuration.find(query)
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'components.component',
        select: 'title brand category',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
  }

  // Finaliser une configuration
  async finalizeConfiguration(id) {
    return await Configuration.findByIdAndUpdate(
      id,
      { status: 'finalized' },
      { new: true }
    );
  }

  // Archiver une configuration
  async archiveConfiguration(id) {
    return await Configuration.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    );
  }
}

module.exports = new ConfigurationService();
