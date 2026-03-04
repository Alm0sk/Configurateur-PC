const express = require('express');
const router = express.Router();
const partnerPriceController = require('../controllers/partnerPriceController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * /api/partner-prices:
 *   get:
 *     tags: [Partner Prices]
 *     summary: Récupère tous les prix partenaires
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des prix
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 component: "507f1f77bcf86cd799439012"
 *                 partner: "507f1f77bcf86cd799439013"
 *                 price: 1199.99
 *   post:
 *     tags: [Partner Prices]
 *     summary: Crée un nouveau prix partenaire
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - component
 *               - partner
 *               - price
 *             properties:
 *               component:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               partner:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *               price:
 *                 type: number
 *                 example: 1199.99
 *     responses:
 *       201:
 *         description: Prix créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               component: "507f1f77bcf86cd799439012"
 *               price: 1199.99
 */
router.get('/', auth, partnerPriceController.getAllPartnerPrices);
router.post('/', auth, partnerPriceController.createPartnerPrice);

/**
 * @swagger
 * /api/partner-prices/component/{componentId}:
 *   get:
 *     tags: [Partner Prices]
 *     summary: Récupère les prix pour un composant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Liste des prix du composant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 component: "507f1f77bcf86cd799439012"
 *                 partner: "507f1f77bcf86cd799439013"
 *                 price: 1199.99
 */
router.get('/component/:componentId', auth, partnerPriceController.getPricesByComponent);

/**
 * @swagger
 * /api/partner-prices/partner/{partnerId}:
 *   get:
 *     tags: [Partner Prices]
 *     summary: Récupère les prix d'un partenaire
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Liste des prix du partenaire
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 component: "507f1f77bcf86cd799439012"
 *                 partner: "507f1f77bcf86cd799439013"
 *                 price: 1199.99
 */
router.get('/partner/:partnerId', auth, partnerPriceController.getPricesByPartner);

/**
 * @swagger
 * /api/partner-prices/best/{componentId}:
 *   get:
 *     tags: [Partner Prices]
 *     summary: Récupère le meilleur prix pour un composant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Meilleur prix trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               component: "507f1f77bcf86cd799439012"
 *               partner: "507f1f77bcf86cd799439013"
 *               price: 1100.00
 */
router.get('/best/:componentId', auth, partnerPriceController.getBestPrice);

/**
 * @swagger
 * /api/partner-prices/{id}:
 *   put:
 *     tags: [Partner Prices]
 *     summary: Met à jour un prix
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 1150.00
 *     responses:
 *       200:
 *         description: Prix mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               price: 1150.00
 *   delete:
 *     tags: [Partner Prices]
 *     summary: Supprime un prix
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Prix supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Prix supprimé avec succès"
 */
router.put('/:id', auth, partnerPriceController.updatePartnerPrice);
router.delete('/:id', auth, partnerPriceController.deletePartnerPrice);

module.exports = router;
