const express = require('express');
const router = express.Router();
const partnerPriceController = require('../controllers/partnerPriceController');

/**
 * @swagger
 * /api/partner-prices:
 *   get:
 *     tags: [Partner Prices]
 *     summary: Récupère tous les prix partenaires
 *     responses:
 *       200:
 *         description: Liste des prix
 *   post:
 *     tags: [Partner Prices]
 *     summary: Crée un nouveau prix partenaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               component:
 *                 type: string
 *               partner:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Prix créé
 */
router.get('/', partnerPriceController.getAllPartnerPrices);
router.post('/', partnerPriceController.createPartnerPrice);

/**
 * @swagger
 * /api/partner-prices/component/{componentId}:
 *   get:
 *     tags: [Partner Prices]
 *     summary: Récupère les prix pour un composant
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des prix du composant
 */
router.get('/component/:componentId', partnerPriceController.getPricesByComponent);

/**
 * @swagger
 * /api/partner-prices/partner/{partnerId}:
 *   get:
 *     tags: [Partner Prices]
 *     summary: Récupère les prix d'un partenaire
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des prix du partenaire
 */
router.get('/partner/:partnerId', partnerPriceController.getPricesByPartner);

/**
 * @swagger
 * /api/partner-prices/best/{componentId}:
 *   get:
 *     tags: [Partner Prices]
 *     summary: Récupère le meilleur prix pour un composant
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meilleur prix trouvé
 */
router.get('/best/:componentId', partnerPriceController.getBestPrice);

/**
 * @swagger
 * /api/partner-prices/{id}:
 *   put:
 *     tags: [Partner Prices]
 *     summary: Met à jour un prix
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Prix mis à jour
 *   delete:
 *     tags: [Partner Prices]
 *     summary: Supprime un prix
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prix supprimé
 */
router.put('/:id', partnerPriceController.updatePartnerPrice);
router.delete('/:id', partnerPriceController.deletePartnerPrice);

module.exports = router;
