*Read in [english](README.md)*

# À propos de
Cette application implémente un agenda simple avec ces fonctionnalités :
 - Consulter l'agenda
 - Ajouter un nouvel événement à l'agenda
 - Modifier un événement

# Configuration
En supposant que vous travaillez en local, créez votre base de données avec cette commande :
```bash
symfony console doctrine:database:create
```
Exécutez toutes les migrations :
```bash
symfony console doctrine:migrations:migrate
```
Vous devez exécuter cette commande dans votre terminal dans un autre pour avoir les catégories, sinon vous obtiendrez une erreur plus tard (puisque chaque événement doit avoir une catégorie)
```bash
symfony console doctrine:query:sql "INSERT INTO Category(name) VALUES('Birthday'), ('Wedding'), ('Meeting'), ('Conference'), ('Feast'), ('Other') "
```
Vous pouvez remplacer les valeurs actuelles de la requête par les vôtres comme ceci :
```SQL
INSERT INTO Category(name) VALUES([Your-var]), ([Another-one]), ...
```
Mais je **ne le conseille pas**, l'application est déjà configurée avec ces valeurs précédentes.

Si `symfony` n'est pas reconnu, remplacez `symfony console` dans votre commande par `php bin/console`.
ex : `php bin/console doctrine:database:create`

Après avoir exécuté ces deux commandes précédentes, vous devriez pouvoir lancer l'application :
```bash
symfony serve # ou symfony server:start
```

# Utilisation
Après avoir configuré l'application et l'avoir lancée, vous serez invité à vous connecter.
Dans votre page d'accueil (agenda),
 - Vous pouvez créer un nouvel événement en cliquant sur le bouton _Nouvel événement_ ou sur un carré du calendrier.
 - Vous pouvez modifier un événement en cliquant dessus dans le calendrier, puis choisissez _Modifier_
 - Vous pouvez supprimer en choisissant le bouton _Supprimer_

L'application est en anglais et en français, testez-la.
