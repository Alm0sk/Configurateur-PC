const Partner = require('../models/partner');

class PartnerService {
  // Créer un partenaire
  async createPartner(data) {
    const partner = new Partner(data);
    return await partner.save();
  }

  // Récupérer tous les partenaires
  async getAllPartners(filters = {}) {
    const query = {};
    
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    
    return await Partner.find(query).sort({ name: 1 });
  }

  // Récupérer un partenaire par ID
  async getPartnerById(id) {
    return await Partner.findById(id);
  }

  // Mettre à jour un partenaire
  async updatePartner(id, data) {
    return await Partner.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  // Supprimer un partenaire
  async deletePartner(id) {
    return await Partner.findByIdAndDelete(id);
  }

  // Récupérer les partenaires actifs
  async getActivePartners() {
    return await Partner.find({ isActive: true }).sort({ name: 1 });
  }

  // Mettre à jour la date de dernière synchronisation
  async updateLastSync(id, date = new Date()) {
    return await Partner.findByIdAndUpdate(
      id,
      { 'priceSync.lastSync': date },
      { new: true }
    );
  }
}

module.exports = new PartnerService();
