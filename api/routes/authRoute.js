const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *         token:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Inscription d'un nouvel utilisateur
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
 *                 example: Balthazar
 *               lastName:
 *                 type: string
 *                 example: Swagger
 *               email:
 *                 type: string
 *                 example: balthazar.swagger@example.com
 *               password:
 *                 type: string
 *                 example: swagger123
 *     responses:
 *       200:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email déjà utilisé
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jeana.dupont@example.com
 *               password:
 *                 type: string
 *                 example: jeana
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               user:
 *                 id: "69a83398c339a58585a36429"
 *                 firstName: "Balthazar"
 *                 lastName: "Swagger"
 *                 email: "balthazar.swagger@example.com"
 *                 role: "user"
 *       401:
 *         description: Non authentifié
 */
router.get('/me', auth, authController.getProfile);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     tags: [Auth]
 *     summary: Mettre à jour le profil
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Balthazar"
 *               lastName:
 *                 type: string
 *                 example: "Swagger"
 *               profilePicture:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Non authentifié
 */
router.put('/me', auth, authController.updateProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Changer le mot de passe
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "swagger123"
 *               newPassword:
 *                 type: string
 *                 example: "nouveauMotdepasse456"
 *     responses:
 *       200:
 *         description: Mot de passe modifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mot de passe modifié avec succès"
 *       400:
 *         description: Mot de passe actuel incorrect
 *       401:
 *         description: Non authentifié
 */
router.post('/change-password', auth, authController.changePassword);

module.exports = router;
