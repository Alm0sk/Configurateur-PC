const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configurationController');

/**
 * @swagger
 * /api/configurations:
 *   get:
 *     tags: [Configurations]
 *     summary: Récupère les configurations de l'utilisateur
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, finalized, archived]
 *     responses:
 *       200:
 *         description: Liste des configurations
 *   post:
 *     tags: [Configurations]
 *     summary: Crée une nouvelle configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Configuration créée
 */
router.get('/', configurationController.getUserConfigurations);
router.post('/', configurationController.createConfiguration);

/**
 * @swagger
 * /api/configurations/all:
 *   get:
 *     tags: [Configurations]
 *     summary: Récupère toutes les configurations (admin)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste de toutes les configurations
 */
router.get('/all', configurationController.getAllConfigurations);

/**
 * @swagger
 * /api/configurations/{id}:
 *   get:
 *     tags: [Configurations]
 *     summary: Récupère une configuration par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration trouvée
 *   put:
 *     tags: [Configurations]
 *     summary: Met à jour une configuration
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
 *         description: Configuration mise à jour
 *   delete:
 *     tags: [Configurations]
 *     summary: Supprime une configuration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration supprimée
 */
router.get('/:id', configurationController.getConfigurationById);
router.put('/:id', configurationController.updateConfiguration);
router.delete('/:id', configurationController.deleteConfiguration);

/**
 * @swagger
 * /api/configurations/{id}/components:
 *   post:
 *     tags: [Configurations]
 *     summary: Ajoute un composant à une configuration
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
 *             properties:
 *               componentId:
 *                 type: string
 *               partnerId:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Composant ajouté
 */
router.post('/:id/components', configurationController.addComponent);

/**
 * @swagger
 * /api/configurations/{id}/components/{componentId}:
 *   delete:
 *     tags: [Configurations]
 *     summary: Supprime un composant d'une configuration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Composant supprimé
 *   put:
 *     tags: [Configurations]
 *     summary: Met à jour la quantité d'un composant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: componentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quantité mise à jour
 */
router.delete('/:id/components/:componentId', configurationController.removeComponent);
router.put('/:id/components/:componentId', configurationController.updateComponentQuantity);

/**
 * @swagger
 * /api/configurations/{id}/finalize:
 *   patch:
 *     tags: [Configurations]
 *     summary: Finalise une configuration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration finalisée
 */
router.patch('/:id/finalize', configurationController.finalizeConfiguration);

/**
 * @swagger
 * /api/configurations/{id}/archive:
 *   patch:
 *     tags: [Configurations]
 *     summary: Archive une configuration
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration archivée
 */
router.patch('/:id/archive', configurationController.archiveConfiguration);

module.exports = router;
