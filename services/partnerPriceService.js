const PartnerPrice = require('../models/partnerPrice');

class PartnerPriceService {
  // Créer un prix partenaire
  async createPartnerPrice(data) {
    const partnerPrice = new PartnerPrice(data);
    return await partnerPrice.save();
  }

  // Récupérer tous les prix
  async getAllPartnerPrices() {
    return await PartnerPrice.find()
      .populate('component', 'title brand model basePrice')
      .populate('partner', 'name url');
  }

  // Récupérer les prix pour un composant
  async getPricesByComponent(componentId) {
    return await PartnerPrice.find({ component: componentId, inStock: true })
      .populate('partner', 'name url contactEmail')
      .sort({ price: 1 });
  }

  // Récupérer les prix d'un partenaire
  async getPricesByPartner(partnerId) {
    return await PartnerPrice.find({ partner: partnerId })
      .populate('component', 'title brand model category')
      .sort({ createdAt: -1 });
  }

  // Récupérer le prix d'un composant chez un partenaire
  async getPartnerPrice(componentId, partnerId) {
    return await PartnerPrice.findOne({ component: componentId, partner: partnerId })
      .populate('component', 'title brand model')
      .populate('partner', 'name url');
  }

  // Mettre à jour un prix
  async updatePartnerPrice(id, data) {
    return await PartnerPrice.findByIdAndUpdate(
      id,
      { ...data, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).populate('component', 'title brand').populate('partner', 'name');
  }

  // Supprimer un prix
  async deletePartnerPrice(id) {
    return await PartnerPrice.findByIdAndDelete(id);
  }

  // Récupérer le meilleur prix pour un composant
  async getBestPrice(componentId) {
    return await PartnerPrice.findOne({ component: componentId, inStock: true })
      .populate('partner', 'name url')
      .sort({ price: 1 });
  }

  // Récupérer les meilleurs prix pour plusieurs composants
  async getBestPrices(componentIds) {
    const bestPrices = [];
    
    for (const componentId of componentIds) {
      const best = await this.getBestPrice(componentId);
      if (best) bestPrices.push(best);
    }
    
    return bestPrices;
  }

  // Mettre à jour les stocks
  async updateStock(componentId, partnerId, inStock) {
    return await PartnerPrice.findOneAndUpdate(
      { component: componentId, partner: partnerId },
      { inStock },
      { new: true }
    );
  }
}

module.exports = new PartnerPriceService();
