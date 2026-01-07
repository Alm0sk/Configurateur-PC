const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');

/**
 * @swagger
 * /api/components:
 *   get:
 *     tags: [Components]
 *     summary: Récupère tous les composants
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Liste des composants
 *   post:
 *     tags: [Components]
 *     summary: Crée un nouveau composant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               category:
 *                 type: string
 *               basePrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Composant créé
 */
router.get('/', componentController.getAllComponents);
router.post('/', componentController.createComponent);

/**
 * @swagger
 * /api/components/search:
 *   get:
 *     tags: [Components]
 *     summary: Recherche des composants
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
router.get('/search', componentController.searchComponents);

/**
 * @swagger
 * /api/components/category/{categoryId}:
 *   get:
 *     tags: [Components]
 *     summary: Récupère les composants par catégorie
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des composants de la catégorie
 */
router.get('/category/:categoryId', componentController.getComponentsByCategory);

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     tags: [Components]
 *     summary: Récupère un composant par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Composant trouvé
 *   put:
 *     tags: [Components]
 *     summary: Met à jour un composant
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
 *         description: Composant mis à jour
 *   delete:
 *     tags: [Components]
 *     summary: Supprime un composant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Composant supprimé
 */
router.get('/:id', componentController.getComponentById);
router.put('/:id', componentController.updateComponent);
router.delete('/:id', componentController.deleteComponent);

module.exports = router;
