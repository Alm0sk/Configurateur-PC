const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');

/**
 * @swagger
 * /api/partners:
 *   get:
 *     tags: [Partners]
 *     summary: Récupère tous les partenaires
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Liste des partenaires
 *   post:
 *     tags: [Partners]
 *     summary: Crée un nouveau partenaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               description:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Partenaire créé
 */
router.get('/', partnerController.getAllPartners);
router.post('/', partnerController.createPartner);

/**
 * @swagger
 * /api/partners/active:
 *   get:
 *     tags: [Partners]
 *     summary: Récupère les partenaires actifs
 *     responses:
 *       200:
 *         description: Liste des partenaires actifs
 */
router.get('/active', partnerController.getActivePartners);

/**
 * @swagger
 * /api/partners/{id}:
 *   get:
 *     tags: [Partners]
 *     summary: Récupère un partenaire par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Partenaire trouvé
 *   put:
 *     tags: [Partners]
 *     summary: Met à jour un partenaire
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
 *         description: Partenaire mis à jour
 *   delete:
 *     tags: [Partners]
 *     summary: Supprime un partenaire
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Partenaire supprimé
 */
router.get('/:id', partnerController.getPartnerById);
router.put('/:id', partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;
