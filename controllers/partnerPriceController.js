const partnerPriceService = require('../services/partnerPriceService');

class PartnerPriceController {
  // Créer un prix partenaire
  async createPartnerPrice(req, res) {
    try {
      const partnerPrice = await partnerPriceService.createPartnerPrice(req.body);
      res.status(201).json({
        success: true,
        message: 'Prix partenaire créé avec succès',
        data: partnerPrice,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création du prix partenaire',
        error: error.message,
      });
    }
  }

  // Récupérer tous les prix
  async getAllPartnerPrices(req, res) {
    try {
      const prices = await partnerPriceService.getAllPartnerPrices();
      res.status(200).json({
        success: true,
        count: prices.length,
        data: prices,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des prix',
        error: error.message,
      });
    }
  }

  // Récupérer les prix pour un composant
  async getPricesByComponent(req, res) {
    try {
      const prices = await partnerPriceService.getPricesByComponent(req.params.componentId);
      res.status(200).json({
        success: true,
        count: prices.length,
        data: prices,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des prix',
        error: error.message,
      });
    }
  }

  // Récupérer les prix d'un partenaire
  async getPricesByPartner(req, res) {
    try {
      const prices = await partnerPriceService.getPricesByPartner(req.params.partnerId);
      res.status(200).json({
        success: true,
        count: prices.length,
        data: prices,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des prix',
        error: error.message,
      });
    }
  }

  // Récupérer le meilleur prix pour un composant
  async getBestPrice(req, res) {
    try {
      const price = await partnerPriceService.getBestPrice(req.params.componentId);
      if (!price) {
        return res.status(404).json({
          success: false,
          message: 'Aucun prix disponible pour ce composant',
        });
      }
      res.status(200).json({
        success: true,
        data: price,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du meilleur prix',
        error: error.message,
      });
    }
  }

  // Mettre à jour un prix
  async updatePartnerPrice(req, res) {
    try {
      const price = await partnerPriceService.updatePartnerPrice(req.params.id, req.body);
      if (!price) {
        return res.status(404).json({
          success: false,
          message: 'Prix non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Prix mis à jour avec succès',
        data: price,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour du prix',
        error: error.message,
      });
    }
  }

  // Supprimer un prix
  async deletePartnerPrice(req, res) {
    try {
      const price = await partnerPriceService.deletePartnerPrice(req.params.id);
      if (!price) {
        return res.status(404).json({
          success: false,
          message: 'Prix non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Prix supprimé avec succès',
        data: price,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du prix',
        error: error.message,
      });
    }
  }
}

module.exports = new PartnerPriceController();
