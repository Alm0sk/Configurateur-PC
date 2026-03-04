const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { auth, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/partners:
 *   get:
 *     tags: [Partners]
 *     summary: Récupère tous les partenaires
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: Liste des partenaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 name: "TechDistributor"
 *                 url: "https://techdist.com"
 *                 isActive: true
 *   post:
 *     tags: [Partners]
 *     summary: Crée un nouveau partenaire
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 example: "TechDistributor"
 *               url:
 *                 type: string
 *                 example: "https://techdist.com"
 *               description:
 *                 type: string
 *                 example: "Leading hardware distributor"
 *               contactEmail:
 *                 type: string
 *                 example: "contact@techdist.com"
 *     responses:
 *       201:
 *         description: Partenaire créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "TechDistributor"
 */
router.get('/', auth, partnerController.getAllPartners);
router.post('/', auth, adminOnly, partnerController.createPartner);

/**
 * @swagger
 * /api/partners/active:
 *   get:
 *     tags: [Partners]
 *     summary: Récupère les partenaires actifs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des partenaires actifs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 name: "TechDistributor"
 *                 isActive: true
 */
router.get('/active', auth, partnerController.getActivePartners);

/**
 * @swagger
 * /api/partners/{id}:
 *   get:
 *     tags: [Partners]
 *     summary: Récupère un partenaire par ID
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
 *         description: Partenaire trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "TechDistributor"
 *               url: "https://techdist.com"
 *   put:
 *     tags: [Partners]
 *     summary: Met à jour un partenaire
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
 *               name:
 *                 type: string
 *                 example: "TechDistributor Pro"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Partenaire mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "TechDistributor Pro"
 *   delete:
 *     tags: [Partners]
 *     summary: Supprime un partenaire
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
 *         description: Partenaire supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Partenaire supprimé avec succès"
 */
router.get('/:id', auth, partnerController.getPartnerById);
router.put('/:id', auth, adminOnly, partnerController.updatePartner);
router.delete('/:id', auth, adminOnly, partnerController.deletePartner);

module.exports = router;
