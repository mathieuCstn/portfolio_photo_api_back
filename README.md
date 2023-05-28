# portfolio_photo - serveur api

le serveur api du projet portfolio_photo. En attente du systeme d'échange de token côté front.

L'application front-end(côté client) accéssible en [cliquant ici](https://github.com/mathieuCstn/portfolio_photo).

# Mise en place de la base de données MySQL

![Architecture de la base de données du projet portfolio_photo](https://github.com/mathieuCstn/portfolio_photo_api_back/blob/42359c35b63be38101b561b40dcdca3d16419957/readme_assets/bdd_architecture_portfolio_photo-2023-03-24-0007.png)

## Importation de la base de données depuis un terminal

Pour cette manipulation, assurez-vous de vous placer dans le répertoire où se trouve le fichier de migration SQL.

Pour voir dans quel répertoire vous êtes, vous pouvez entrer la commande suivante depuis votre terminal :
```
pwd
```

### Importation de la base de données depuis les terminaux Linux, Unix ou l'invite de commande Windows (cmd)
```
mysql -u <Username> -p portfolio_photo < portfolio_photo_mysql.sql
```

### Importation de la base de données depuis PowerShell (Windows)
```
cmd.exe /c "mysql -u <Username> -p portfolio_photo < portfolio_photo_mysql.sql"
```

## Importation de la base de données pour les systèmes Linux et Unix

# Fichier `.env` - configuration

Ce projet utilise [dotenv](https://github.com/motdotla/dotenv#readme).

Pour configurer les variables d'environnement, vous devez ajouter un simple fichier `.env` à la racine du serveur api.
```
# Connection à la base de données MySQL
MYSQL_HOST='127.0.0.1'
MYSQL_USER="root"
MYSQL_PASSWORD="root"
MYSQL_DATABASE="portfolio_photo"

# Connection à Cloudinary
CLOUDINARY_CLOUD_NAME='<Cloud Name>'
CLOUDINARY_API_KEY='<API Key>'
CLOUDINARY_API_SECRET='<API Secret>'

# Clé secret pour encoder et décoder les tokens avec JsonWebToken
JWT_SECRET_KEY="vousmetrouverejamais"
```
