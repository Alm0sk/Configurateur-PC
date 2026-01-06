# Configurateur PC

## Lancement de l'application

### Initier la base de données et l'application avec Docker

L'application utilise un base de données Mongodb. Pour lancer une instance locale de Mongodb ainsi que l'application Node JS, vous pouvez utiliser le fichier `docker-compose.yml`et les ressources associées dans le dossier `docker`.

*Initialisez et démarrez le conteneur Docker :*

```bash
docker compose -f docker/docker-compose.yml up -d 
```

*Arrêter le conteneur Docker (et supprimer les volumes) :*

```bash
docker compose -f docker/docker-compose.yml down -v
```

*Acceder à l'interface de gestion de MongoDB Express :*

l'interface de gestion de MongoDB (Mongo Express) est accessible à l'adresse : `http://localhost:8081`. Utilisez les identifiants définis dans le fichier `.env` pour vous connecter.

### Modifier les accès à la base de données

Par defaut les identifiants de connexion à la base de données sont définis dans le fichier `.env` à la racine du projet. Vous pouvez modifier les variables `DB_USERNAME` et `DB_PASSWORD` pour changer les identifiants d'accès.

par défaut :

```bash
DB_USERNAME=user
DB_PASSWORD=tot0
```
