const partnerService = require('../services/partnerService');

class PartnerController {
  // Créer un partenaire
  async createPartner(req, res) {
    try {
      const partner = await partnerService.createPartner(req.body);
      res.status(201).json({
        success: true,
        message: 'Partenaire créé avec succès',
        data: partner,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création du partenaire',
        error: error.message,
      });
    }
  }

  // Récupérer tous les partenaires
  async getAllPartners(req, res) {
    try {
      const filters = {};
      
      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
      
      const partners = await partnerService.getAllPartners(filters);
      res.status(200).json({
        success: true,
        count: partners.length,
        data: partners,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des partenaires',
        error: error.message,
      });
    }
  }

  // Récupérer un partenaire par ID
  async getPartnerById(req, res) {
    try {
      const partner = await partnerService.getPartnerById(req.params.id);
      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partenaire non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        data: partner,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du partenaire',
        error: error.message,
      });
    }
  }

  // Mettre à jour un partenaire
  async updatePartner(req, res) {
    try {
      const partner = await partnerService.updatePartner(req.params.id, req.body);
      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partenaire non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Partenaire mis à jour avec succès',
        data: partner,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour du partenaire',
        error: error.message,
      });
    }
  }

  // Supprimer un partenaire
  async deletePartner(req, res) {
    try {
      const partner = await partnerService.deletePartner(req.params.id);
      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partenaire non trouvé',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Partenaire supprimé avec succès',
        data: partner,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du partenaire',
        error: error.message,
      });
    }
  }

  // Récupérer les partenaires actifs
  async getActivePartners(req, res) {
    try {
      const partners = await partnerService.getActivePartners();
      res.status(200).json({
        success: true,
        count: partners.length,
        data: partners,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des partenaires actifs',
        error: error.message,
      });
    }
  }
}

module.exports = new PartnerController();
