# 🎨 Frontend – Gestion des Interventions

### Angular · Angular Material · JWT Auth · Chatbot UI

### Stage OCP (Juillet 2025 – Août 2025)

## 📌 **Description du Projet**

Cette interface web a été développée dans le cadre d’un stage de fin d’année au **Groupe OCP (Khouribga)**.
Elle permet la **gestion complète des interventions techniques** : création, planning, suivi, techniciens, notifications, et assistance via chatbot.

Le frontend communique avec une architecture microservices Spring Boot via une **API Gateway** sécurisée (JWT).

---

## 🖥️ **Fonctionnalités Principales**

### 🔐 **Authentification & Sécurité**

* Login / Logout avec **JWT**
* Intercepteur Angular pour injecter automatiquement le token
* Garde de routes (AuthGuard)
* Gestion des rôles (Admin / User / Technicien)

### 🛠️ **Gestion des Interventions**

* Tableau de bord des interventions
* Création / modification / suppression (CRUD)
* Formulaires dynamiques Angular Reactive Forms
* Assignation de techniciens
* Filtrage & pagination

### 👷 **Gestion des Techniciens**

* Liste des techniciens
* Affectation aux interventions
* Profil détaillé

### 🔔 **Notifications en temps réel**

* Affichage des messages envoyés via RabbitMQ
  (retransmis par le microservice Notification)

### 📊 **Logs & Monitoring**

* Interface de visualisation des actions historiques (MongoDB)

### 🤖 **Chatbot Intelligent**

* Widget intégré dans l’interface
* Interaction directe avec le microservice Chatbot
* Aide au diagnostic, recherche d’interventions, réponses rapides

---

## 📦 **Technologies Utilisées**

### 🔸 Frontend

* **Angular 17+**
* **TypeScript**
* **Angular Material**
* **SCSS**

### 🔸 Communication Backend

* API REST via Gateway
* JWT
* Interceptor HTTP
* Services Angular (DI)

### 🔸 Tests

* Jasmine / Karma
* Postman (tests end-to-end)

---


## 📷 **UI & Expérience Utilisateur**

* UI responsive (Angular Material + Flex Layout)
* Thèmes personnalisés pour s’adapter à la charte OCP
* Modales, tables, cards, listes, dialogues Material
* Dashboard synthétique et ergonomique

---


## 👤 **Auteur**

**Ismail – Stagiaire Ingénieur Génie Informatique**
**Groupe OCP, Khouribga – Stage Juillet/Août 2025**
