const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Récupère toutes les catégories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "69a83398c339a58585a36429"
 *                   name:
 *                     type: string
 *                     example: "CPU"
 *                   description:
 *                     type: string
 *                     example: "Processeurs"
 *   post:
 *     tags: [Categories]
 *     summary: Crée une nouvelle catégorie
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mémoire"
 *               description:
 *                 type: string
 *                 example: "Barrettes de RAM"
 *               icon:
 *                 type: string
 *                 example: "memory-icon.svg"
 *     responses:
 *       201:
 *         description: Catégorie créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 */
router.get('/', auth, categoryController.getAllCategories);
router.post('/', auth, adminOnly, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Récupère une catégorie par ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "69a83398c339a58585a36429"
 *     responses:
 *       200:
 *         description: Catégorie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *   put:
 *     tags: [Categories]
 *     summary: Met à jour une catégorie
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "69a83398c339a58585a36429"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Mémoire"
 *               description:
 *                 type: string
 *                 example: "Barrettes de RAM DDR5"
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *   delete:
 *     tags: [Categories]
 *     summary: Supprime une catégorie
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "69a83398c339a58585a36429"
 *     responses:
 *       200:
 *         description: Catégorie supprimée
 */
router.get('/:id', auth, categoryController.getCategoryById);
router.put('/:id', auth, adminOnly, categoryController.updateCategory);
router.delete('/:id', auth, adminOnly, categoryController.deleteCategory);

module.exports = router;
