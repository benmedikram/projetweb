README - EduSpace (Front-end)

1. Présentation du projet
------------------------
EduSpace est une plateforme de gestion destinée aux étudiants. Elle permet de centraliser et d’organiser les tâches, projets, cours et documents, tout en offrant un tableau de bord personnalisé et des notifications/rappels pour optimiser la gestion du temps et le suivi académique.

2. Choix du framework
--------------------
**React.js** a été choisi pour :
- La création d’interfaces réactives et performantes grâce au Virtual DOM
- La modularité via des composants réutilisables (ex : TaskCard, ProjectCard, Sidebar)
- Une intégration facile avec un back-end API (ici NestJS)
- Une grande communauté et un écosystème riche pour les bibliothèques et outils

3. Fonctionnalités développées
-----------------------------
- **Gestion des tâches** : ajout, modification, suppression, changement d’état (À faire, En cours, Terminé)
- **Gestion des projets** : création, suivi et affichage des deadlines
- **Gestion des cours et documents** : consultation et organisation des fichiers
- **Tableau de bord personnalisé** : synthèse visuelle des tâches, projets et notifications
- **Navigation** : sidebar permettant d’accéder facilement aux différentes sections (Dashboard, Tasks, Projects, Courses)

4. Installation et lancement
----------------------------
1. **Cloner le projet** :
git clone https://github.com/benmedikram/projetweb.git

2. **Installer les dépendances** :
npm install

3. **Lancer l’application** :
npm start

4. **Organisation des fichier** :
- `src/components/` : composants réutilisables (ex : Sidebar…)
- `src/pages/` : pages principales (Dashboard, Tasks, Projects, Courses…) et fichiers CSS : styles globaux et spécifiques aux composants
- `src/App.js` : point d’entrée de l’application
- `src/index.js` : initialisation de l’application

5. **Publier sur Github** :
---------------------
1. Initialiser un dépôt Git si ce n’est pas déjà fait :
git init
2. Ajouter les fichiers :
git add .
3. Faire un commit :
git commit -m "Comment"
4. Pousser le projet sur GitHub :
git push -u origin main
