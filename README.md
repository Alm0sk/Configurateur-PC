# Configurateur PC

_Gestion des requêtes API d'une application de configuration de PC._

_Application réalisée durant la formation CPIL de l'IPI en 2026 dans le cadre du module API de Mr Nicolas CHEVALIER._

## Lancement de l'application

_L'application a été entièrement prévue pour être déployée avec Docker_

De cette manière, il n'y a besoin de rien d'autre que Docker (un navigateur internet et un terminal aussi pour être précis) pour faire fonctionner l'application. Toutes les dépendances sont gérées par Docker, et il n'est pas nécessaire d'installer Node JS ou MongoDB sur votre machine.

C'est une approche que j'apprécie car :

- Garantie que l'application fonctionnera de la même manière sur n'importe quelle machine.
- Simplifie la gestion des versions
- Facilite la mise en place d'un déploiement via kubernetes et les outils DevOps comme ansible ou terraform que j'aime utiliser.

### Initier la base de données et l'application avec Docker

L'image docker de l'application se compose de :

- Une base de données MongoDB pour stocker les données de l'application sur le port 27017.

- Une interface de gestion de MongoDB (Mongo Express) accessible sur le port 8081. --> `http://localhost:8081`

- Un serveur Node JS pour l'API actif sur le port 5173. --> `http://localhost:5173`

**Toutes les commandes suivantes doivent être exécutées à la racine du projet.**

#### Initialisez et démarrez le conteneur Docker

```bash
docker compose -f docker/docker-compose.yml up -d
```

#### Redémarrez le conteneur Docker avec les changements pris en compte

En cas de changement effectué dans les fichiers dans les fichiers de routes ou de seed, il est nécessaire de reconstruire l'image Docker pour que les changements soient pris en compte :

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

#### Arrêter le conteneur Docker (et supprimer les volumes)

```bash
docker compose -f docker/docker-compose.yml down -v
```

### Accéder à l'interface de gestion de MongoDB Express

L'interface de gestion de MongoDB (Mongo Express) est actif à l'adresse : `http://localhost:8081`. Utilisez les identifiants définis dans le fichier [docker/.env](docker/.env) pour vous connecter.local

```bash
DB_USERNAME=tech
DB_PASSWORD=pass
```

![Login Mongo Express](medias/mongo_express_login.png)

Une fois connecté, vous pourrez visualiser les différentes collections de la base de données, ainsi que les données qu'elles contiennent. Vous pourrez également effectuer des opérations de lecture, d'écriture, de mise à jour et de suppression sur les données.

La base de données est initiée avec les données de test définies dans le fichier [api/seed.js](api/seed.js).

_En cas de changements effectués dans ce fichier il est nécessaire de redémarrer le conteneur Docker avec la commande `docker compose down -v` pour supprimer les volumes et réinitialiser la base de données, puis `docker compose up -d --build` pour relancer le conteneur avec les nouvelles données._

> À noter que sur la page des utilisateurs ci-dessous, les mots de passe sont hashés via bcrypt

![Page User Mongo Express](medias/mongo_express_user.png)

### Accéder à la documentation de l'API swagger

L'API est documentée avec Swagger, et la documentation est accessible à l'adresse : `http://localhost:5173/api-docs`. Vous y trouverez une description détaillée de chaque endpoint de l'API, ainsi que des exemples de requêtes et de réponses.

![Acceuil Swagger](medias/swagger_home.png)

## Documentation API Swagger

Comme dit précédemment, l'API est documentée avec Swagger, et la documentation est accessible à l'adresse : `http://localhost:5173/api-docs` . Vous y trouverez une description détaillée de chaque endpoint de l'API, ainsi que des exemples de requêtes et de réponses.

La documentation est générée à partir des commentaires présents dans les fichiers de routes de l'API [api/routes/](api/routes/), et est mise à jour automatiquement à chaque redémarrage avec l'option `--build` du serveur (documentée ci-dessus [Redémarrez le conteneur Docker avec les changements pris en compte](#redémarrez-le-conteneur-docker-avec-les-changements-pris-en-compte)).

### Exemple d'utilisation de la documentation API Swagger

Pour illustrer l'utilisation de Swagger, nous allons prendre l'exemple de l'enpoint d'inscription d'un nouvel utilisateur **Balthazar Swagger** défini dans le fichier [api/routes/authRoute.js](api/routes/authRoute.js) avec la requête POST /api/auth/register.

Dans ce fichier, nous avons défini l'endpoint d'inscription de la manière suivante :

```javascript
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
router.post("/register", authController.register);
```

Dans la documentation Swagger, cet endpoint sera présenté de la manière suivante :

![Swagger POST Register](medias/swagger_post_register.png)

Après un test de la requête avec les données de notre nouvel utilisateur **Balthazar Swagger**, comme effectué dans la capture ci-dessus, nous obtenons la réponse suivante de l'API :

```json
{
  "message": "Inscription réussie.",
  "user": {
    "id": "69a837f9db0e2e662337f824",
    "firstName": "Balthazar",
    "lastName": "Swagger",
    "email": "balthazar.swagger@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWE4MzdmOWRiMGUyZTY2MjMzN2Y4MjQiLCJpYXQiOjE3NzI2MzIwNTcsImV4cCI6MTc3MzIzNjg1N30.ByoGsy6-kEVylUrKQTQSfdkNesD4pggrtkbrXwGbu6Y"
}
```

Cette réponse indique que l'inscription de l'utilisateur **Balthazar Swagger** a été réussie, et nous fournit les détails de l'utilisateur ainsi qu'un **token d'authentification** JWT pour les requêtes futures nécessitant une authentification.

D'ailleurs nous pouvons voir que l'utilisateur a été ajouté à la base de données MongoDB via Mongo Express :
![Mongo Express Balthazar](medias/mongo_express_balthazar.png)

### Token d'authentification JWT

Dans l'exemple précédent, nous avons reçu un token d'authentification JWT dans la réponse de l'API après l'inscription de l'utilisateur **Balthazar Swagger**. Ce token est nécessaire pour effectuer des requêtes authentifiées vers les endpoints protégés de l'API avecJWT, comme la création d'une nouvelle configuration avec la route `POST /api/configurations` pour l'utilisateur **Jeana Dupont**.

#### Mise en place du token JWT

Le token JWT (JSON Web Token) est un système d'authentification qui permet aux utilisateurs de s'identifier auprès de l'API une seule fois, puis de réutiliser le token généré pour toutes les requêtes suivantes nécessitant une authentification.

> Dans le cas de cette application de test, le token est valable pendant la durée très (trop) confortable de 7 jours.

**Identifier les endpoints protégés dans Swagger :**

- Les endpoints avec un **cadenas 🔒** nécessitent un token JWT (exemple : `GET /api/auth/me`)
- Les endpoints sans cadenas sont publics (exemple : `POST /api/auth/login`).

![Swagger Endpoints Proteges](medias/swagger_endpoints_proteges.png)

**Comment les endpoints protégés sont définis dans le code :**

Dans les fichiers de routes, les endpoints protégés utilisent le middleware `auth` entre l'URL et le contrôleur :

```javascript
const { auth } = require("../middleware/auth");

// Route PUBLIQUE (pas de middleware auth)
router.post("/login", authController.login);

// Route PROTÉGÉE (avec le middleware auth)
router.get("/me", auth, authController.getProfile);
```

La présence du middleware `auth` vérifie automatiquement le token JWT avant d'exécuter le contrôleur. Dans la documentation Swagger, on ajoute `security: - bearerAuth: []` pour afficher le cadenas 🔒.

#### Test de l'endpoint `POST /api/configurations`

Si j'essaye la requête directement dans Swagger sans le token d'authentification, j'obtiens une réponse d'erreur 401 Unauthorized :

```json
{
  "message": "Accès refusé. Token manquant."
}
```

![Swagger POST Configuration Unauthorized](medias/swagger_post_configuration_unauthorized.png)

Cependant, après avoir authentifié l'utilisateur **Jeana Dupont** avec la route `POST /api/auth/login` et obtenu un token JWT valide, je peux inclure ce token dans Swagger (bouton **Authorize** tout en haut à droite de la page Swagger)

![Swagger Authorize](medias/swagger_authorize.png)

Et maintenant, avec le token d'authentification JWT inclus dans les requêtes, je peux effectuer la requête `POST /api/configurations` pour créer une nouvelle configuration pour l'utilisateur **Jeana Dupont** sans rencontrer d'erreur d'authentification :

![Swagger POST Configuration Authorized](medias/swagger_post_configuration_authorized.png)

La configuration est créée avec succès, et nous obtenons une réponse 200 OK de l'API avec les détails de la configuration créée :

```json
{
  "success": true,
  "message": "Configuration créée avec succès",
  "data": {
    "user": "69a84c889f1a5ffb788bbebe",
    "name": "Gaming PC 2024",
    "description": "High-end gaming configuration",
    "totalCost": 0,
    "status": "draft",
    "isPublic": false,
    "notes": "",
    "_id": "69a84d15117ad77b0473e442",
    "components": [],
    "createdAt": "2026-03-04T15:17:41.186Z",
    "updatedAt": "2026-03-04T15:17:41.186Z",
    "__v": 0
  }
}
```

La configuration est également visible sur :

- Swagger via la route `GET /api/configurations` qui retourne les configurations de l'utilisateur authentifié ici **Jeana Dupont** :
  ![Swagger GET Configurations](medias/swagger_get_configurations.png)

- Mongo Express dans la collection des configurations :
  ![Mongo Express Configuration](medias/mongo_express_configuration.png)

- Et également dans le backoffice de l'application que nous allons voir dans la prochaine section :
  ![Backoffice Configuration](medias/backoffice_configuration.png)

> La configuration créée est vide, mais une requête `PUT /api/configurations/{id}` permet de mettre à jour la configuration avec les composants et les autres détails nécessaires pour que la configuration soit complète.

## Backoffice

Je vais profiter de la partie backoffice pour entrer dans le détail de la différence entre les rôles **admin** et **user** du point de vue de API autorisés, et de la gestion des configurations.

### Authentification

L'accès au backoffice est protégé par une authentification.

> J'ai ajouté les informations de connexion de l'utilisateur admin sous le bouton **Se connecter** pour faciliter les tests de connexion au backoffice.

![Backoffice Login](medias/backoffice_login.png)

Tout les utilisateurs créés dans la base de données MongoDB peuvent se connecter au backoffice, mais seuls les utilisateurs avec le rôle **admin** peuvent accéder à toutes les configurations créées par tous les utilisateurs. Les utilisateurs avec le rôle **user** ne peuvent voir que leurs propres configurations ou les configurations publics.

### Prise en main du backoffice

Une fois authentifié, vous accédez à la page d'accueil du backoffice qui regroupe les principales informations sur les différentes collections de la base de données.

![Backoffice Home](medias/backoffice_home.png)

### Rôles admin

Je vais faire une rapide tour des différentes pages du backoffice et des différences entre un utilisateur avec le rôle **admin** et un utilisateur avec le rôle **user**, grâce au paramètre `isAdmin` qui est défini dans le contexte d'authentification du backoffice.
Qui se retrouve dans le code des [backoffice/src/pages/](backoffice/src/pages/) sous la forme de la variable `isAdmin`

```javascript
const isAdmin = user?.role === "admin";
```

Côté API, les routes protégées par le middleware `adminOnly` sont uniquement accessibles aux utilisateurs avec le rôle **admin**, et les utilisateurs avec le rôle **user** reçoivent une réponse d'erreur 403 Forbidden s'ils essaient d'accéder à ces routes, comme ci -dessous

```javascript
router.get("/", auth, adminOnly, userApiController.getUsers);
```

![API Route Admin Only](medias/api_route_admin_only.png)

```json
{
  "message": "Accès refusé. Droits administrateur requis."
}
```

### Page Utilisateurs

#### Point de vue admin page utilisateurs

Depuis cette page un admin peut voir la liste des utilisateurs et :

- Créer un nouvel utilisateur
- Modifier un utilisateur existant
- Supprimer un utilisateur

> Il faut obligatoirement le rôle admin pour accéder à la liste des utilisateurs, et les utilisateurs avec le rôle user n'y ont pas accès, et le lien n'apparait pas sur la barre de navigation du backoffice.

**Liste des utilisateurs :**

![Backoffice Users Admin](medias/backoffice_users_admin.png)

**Modification d'un utilisateur :**
![Backoffice Edit User Admin](medias/backoffice_edit_user_admin.png)

**Affichage des informations d'un utilisateur :**
![Backoffice User Detail Admin](medias/backoffice_user_detail_admin.png)

#### Point de vue user page utilisateurs

A la place de la catégorie **Utilisateurs** dans la barre de navigation du backoffice, les utilisateurs avec le rôle **user** ont accès à la catégorie **Mon Profil** qui leur permet de voir leurs propres informations, mais pas celles des autres utilisateurs.
J'ai également enlevé le bouton **modifier**

![Backoffice Users User](medias/backoffice_users_user.png)

### Page Catégories

#### Point de vue admin page catégories

Depuis cette page un admin peut voir la liste des catégories et :

- Rechercher une catégorie par son nom ou sa description
- Créer une nouvelle catégorie
- Modifier une catégorie existante
- Supprimer une catégorie

![Backoffice Categories Admin](medias/backoffice_categories_admin.png)
![Backoffice Research Category](medias/backoffice_research_category.png)![alt text](image.png)
![Backoffice Edit Category Admin](medias/backoffice_edit_category_admin.png)

#### Point de vue user page catégories

En tant qu'utilisateur classique, les options de création, modification et suppression de catégories ne sont pas disponibles.

![Backoffice Categories User](medias/backoffice_categories_user.png)

### Page Composants

#### Point de vue admin page composants

Depuis cette page un admin peut voir la liste des composants et :

- Rechercher un composant par son nom ou sa description
- Filtrer les composants par catégorie
- Créer un nouveau composant
- Modifier un composant existant
- Supprimer un composant

![Backoffice Filter Component](medias/backoffice_filter_component.png)
![Backoffice Research Component](medias/backoffice_research_component.png)
![Backoffice Edit Component Admin](medias/backoffice_edit_component_admin.png)

#### Point de vue user page composants

En tant qu'utilisateur classique, les options de création, modification et suppression de composants ne sont pas disponibles.

![Backoffice Components User](medias/backoffice_components_user.png)

### Page Partenaires

Comme pour la page des **Composants**

#### Point de vue admin page partenaires

Depuis cette page un admin peut voir la liste des partenaires et :

- Rechercher un partenaire par son nom ou sa description
- Créer un nouveau partenaire
- Modifier un partenaire existant
- Supprimer un partenaire

![Backoffice Partners Admin](medias/backoffice_partners_admin.png)
![Backoffice Edit Partner Admin](medias/backoffice_edit_partner_admin.png)

#### Point de vue user page partenaires

En tant qu'utilisateur classique, les options de création, modification et suppression de partenaires ne sont pas disponibles.

![Backoffice Partners User](medias/backoffice_partners_user.png)

### Page Configurations

La page permets de voir les différentes configurations créées, et d'accéder à leur détail. Un utilisateur avec le rôle **admin** peut voir toutes les configurations créées par tous les utilisateurs, tandis qu'un utilisateur avec le rôle **user** ne peut voir que ses propres configurations ou les configurations publiques.

#### Point de vue admin page configurations

Depuis cette page un admin peut :

- accéder à la liste de toutes les configurations créées par tous les utilisateurs public et privé
- créer une nouvelle configuration
- accéder au détail de chaque configuration
- supprimer une configuration
- rechercher une configuration par son nom ou sa description
- modifier une configuration existante (nom, description, notes, statut, visibilité public/privé)

![Backoffice Configurations Admin](medias/backoffice_configurations_admin.png)
![Backoffice Create Configuration Admin](medias/backoffice_create_configuration_admin.png)

> Il peut également acceder à la page de détail de chaque configuration pour en afficher les détails, et ajouter des composants à la configuration :

![Backoffice Configuration Detail Admin](medias/backoffice_configuration_detail_admin.png)

#### Point de vue user page configurations

En tant qu'utilisateur classique, les options de création, modification et suppression de configurations ne sont pas disponibles que pour leurs propres configurations.

Également les configurations visibles sont uniquement les configurations publiques ou les configurations privées de l'utilisateur lui-même.

![Backoffice Configurations User](medias/backoffice_configurations_user.png)

Sur la page détails d'une configuration d'un autre utilisateur, les options de modification et suppression ne sont pas disponibles :

![Backoffice Configuration Detail User](medias/backoffice_configuration_detail_user.png)

En revanche sur la page détails d'une configuration de l'utilisateur lui même, les options de modification et suppression sont disponibles :

![Backoffice Configuration Detail User Own](medias/backoffice_configuration_detail_user_own.png)

## Conclusion

Ce module marque le dernier module technique de la formation CPIL et de ma réorientation débuté il y'a 4 ans. Mais également le dernier module avec Mr Alexandre Chevalier.

J'ai eu l'occasion de mettre à profit les API, C#, un peu de base de données et du développement mobile android au cours de ces modules qui ont tous un répo dédié sur mon GitHub.

Je me doute que vous serez le seul à regarder ce GitHub et encore plus jusqu'à la fin, Alors je vous remercie d'avoir pris le temps de lire ce readme, les précédents, mon mémoire de troisième année.

Et au plaisir de vous croisez dans le monde professionnel, quand je serais DevOps à plein temps

Merci.
