const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configurationController');
const { auth, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/configurations:
 *   get:
 *     tags: [Configurations]
 *     summary: Récupère les configurations de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, finalized, archived]
 *           example: "draft"
 *     responses:
 *       200:
 *         description: Liste des configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 name: "Gaming PC 2024"
 *                 status: "draft"
 *   post:
 *     tags: [Configurations]
 *     summary: Crée une nouvelle configuration
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gaming PC 2024"
 *               description:
 *                 type: string
 *                 example: "High-end gaming configuration"
 *     responses:
 *       201:
 *         description: Configuration créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "Gaming PC 2024"
 *               status: "draft"
 */
router.get('/', auth, configurationController.getUserConfigurations);
router.post('/', auth, configurationController.createConfiguration);

/**
 * @swagger
 * /api/configurations/all:
 *   get:
 *     tags: [Configurations]
 *     summary: Récupère toutes les configurations (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: "draft"
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439099"
 *     responses:
 *       200:
 *         description: Liste de toutes les configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 name: "Gaming PC 2024"
 *                 status: "draft"
 *                 user: "507f1f77bcf86cd799439099"
 */
router.get('/all', auth, adminOnly, configurationController.getAllConfigurations);

/**
 * @swagger
 * /api/configurations/{id}:
 *   get:
 *     tags: [Configurations]
 *     summary: Récupère une configuration par ID
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
 *         description: Configuration trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "Gaming PC 2024"
 *               totalPrice: 3500.00
 *   put:
 *     tags: [Configurations]
 *     summary: Met à jour une configuration
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
 *                 example: "Gaming PC Pro 2024"
 *               description:
 *                 type: string
 *                 example: "Updated configuration"
 *     responses:
 *       200:
 *         description: Configuration mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               name: "Gaming PC Pro 2024"
 *   delete:
 *     tags: [Configurations]
 *     summary: Supprime une configuration
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
 *         description: Configuration supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Configuration supprimée avec succès"
 */
router.get('/:id', auth, configurationController.getConfigurationById);
router.put('/:id', auth, configurationController.updateConfiguration);
router.delete('/:id', auth, configurationController.deleteConfiguration);

/**
 * @swagger
 * /api/configurations/{id}/components:
 *   post:
 *     tags: [Configurations]
 *     summary: Ajoute un composant à une configuration
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
 *             required:
 *               - componentId
 *             properties:
 *               componentId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               partnerId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *               price:
 *                 type: number
 *                 example: 1199.99
 *     responses:
 *       200:
 *         description: Composant ajouté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               components:
 *                 - componentId: "507f1f77bcf86cd799439012"
 *                   price: 1199.99
 */
router.post('/:id/components', auth, configurationController.addComponent);

/**
 * @swagger
 * /api/configurations/{id}/components/{componentId}:
 *   delete:
 *     tags: [Configurations]
 *     summary: Supprime un composant d'une configuration
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Composant supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Composant supprimé avec succès"
 *   put:
 *     tags: [Configurations]
 *     summary: Met à jour la quantité d'un composant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Quantité mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Quantité mise à jour avec succès"
 */
router.delete('/:id/components/:componentId', auth, configurationController.removeComponent);
router.put('/:id/components/:componentId', auth, configurationController.updateComponentQuantity);

/**
 * @swagger
 * /api/configurations/{id}/finalize:
 *   patch:
 *     tags: [Configurations]
 *     summary: Finalise une configuration
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
 *         description: Configuration finalisée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               status: "finalized"
 */
router.patch('/:id/finalize', auth, configurationController.finalizeConfiguration);

/**
 * @swagger
 * /api/configurations/{id}/archive:
 *   patch:
 *     tags: [Configurations]
 *     summary: Archive une configuration
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
 *         description: Configuration archivée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               status: "archived"
 */
router.patch('/:id/archive', auth, configurationController.archiveConfiguration);

module.exports = router;
