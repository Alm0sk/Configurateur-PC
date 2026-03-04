const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');

// import le controlleur
const userApiController = require('../controllers/userApiController');

router.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Récupère tous les utilisateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john@example.com"
 */
router.get('/', auth, adminOnly, userApiController.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Récupère un utilisateur par ID
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
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john@example.com"
 */
router.get('/:id', auth, userApiController.getUser);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Crée un nouvel utilisateur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               firstName: "John"
 *               email: "john@example.com"
 */
router.post('/', auth, adminOnly, userApiController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Met à jour un utilisateur
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
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               firstName: "Jane"
 *               email: "jane@example.com"
 */
router.put('/:id', auth, adminOnly, userApiController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Supprime un utilisateur
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
 *         description: Utilisateur supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Utilisateur supprimé avec succès"
 */
router.delete('/:id', auth, adminOnly, userApiController.deleteUser);

// Export des routes contenu dans le router
module.exports = router;