const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const { auth, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/components:
 *   get:
 *     tags: [Components]
 *     summary: Récupère tous les composants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: "GPU"
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *           example: "NVIDIA"
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: Liste des composants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   basePrice:
 *                     type: number
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 title: "RTX 4080"
 *                 description: "High-end GPU"
 *                 brand: "NVIDIA"
 *                 basePrice: 1199.99
 *   post:
 *     tags: [Components]
 *     summary: Crée un nouveau composant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - brand
 *               - category
 *               - basePrice
 *             properties:
 *               title:
 *                 type: string
 *                 example: "RTX 4080"
 *               description:
 *                 type: string
 *                 example: "High-end GPU for gaming"
 *               brand:
 *                 type: string
 *                 example: "NVIDIA"
 *               model:
 *                 type: string
 *                 example: "RTX4080"
 *               category:
 *                 type: string
 *                 example: "GPU"
 *               basePrice:
 *                 type: number
 *                 example: 1199.99
 *     responses:
 *       201:
 *         description: Composant créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "RTX 4080"
 */
router.get('/', auth, componentController.getAllComponents);
router.post('/', auth, adminOnly, componentController.createComponent);

/**
 * @swagger
 * /api/components/search:
 *   get:
 *     tags: [Components]
 *     summary: Recherche des composants
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           example: "RTX"
 *     responses:
 *       200:
 *         description: Résultats de recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 title: "RTX 4080"
 *                 brand: "NVIDIA"
 */
router.get('/search', auth, componentController.searchComponents);

/**
 * @swagger
 * /api/components/category/{categoryId}:
 *   get:
 *     tags: [Components]
 *     summary: Récupère les composants par catégorie
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Liste des composants de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439012"
 *                 title: "RTX 4080"
 *                 category: "507f1f77bcf86cd799439011"
 */
router.get('/category/:categoryId', auth, componentController.getComponentsByCategory);

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     tags: [Components]
 *     summary: Récupère un composant par ID
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
 *         description: Composant trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "RTX 4080"
 *               brand: "NVIDIA"
 *   put:
 *     tags: [Components]
 *     summary: Met à jour un composant
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
 *               title:
 *                 type: string
 *                 example: "RTX 4080 Super"
 *               basePrice:
 *                 type: number
 *                 example: 1299.99
 *     responses:
 *       200:
 *         description: Composant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "RTX 4080 Super"
 *   delete:
 *     tags: [Components]
 *     summary: Supprime un composant
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
 *         description: Composant supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Composant supprimé avec succès"
 */
router.get('/:id', auth, componentController.getComponentById);
router.put('/:id', auth, adminOnly, componentController.updateComponent);
router.delete('/:id', auth, adminOnly, componentController.deleteComponent);

module.exports = router;
