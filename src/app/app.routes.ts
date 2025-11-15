import { Routes } from '@angular/router';
import {  authGuard } from './guards/auth.guard';
export const routes: Routes = [
{ 
  path: '',
  loadComponent: () => import('./components/accueil/accueil.component').then(m => m.AccueilComponent)
      
},
     
{
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent)
  },
  
  {
    path: 'services',
    loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent)
  },

{
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chatbot/chatbot.component').then(m => m.ChatbotComponent)
  },

  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  
      
    
    {
      path: 'admin/dashboard',
      loadComponent: () => import('./admin/dashborad-admin/dashborad-admin.component')
        .then(c => c.DashboradAdminComponent),
      canActivate: [ authGuard]
    }, {
      path: 'admin/statistiques',
      loadComponent: () => import('./admin/powerbi/powerbi.component')
        .then(c => c.PowerbiComponent),
      canActivate: [ authGuard]
    },
    {path: 'admin/rapports',
      loadComponent: () => import('./admin/rapport/rapport.component')
        .then(c => c.RapportComponent),
      canActivate: [ authGuard]
    },
     {
      path: 'responsable/dashboard',
      loadComponent: () => import('./responsable/dashborad-responsable/dashborad-responsable.component')
        .then(c => c.DashboradResponsableComponent),
      canActivate: [ authGuard]
    },
      {
      path: 'technicien/dashboard',
      loadComponent: () => import('./technicien/dashborad-technicien/dashborad-technicien.component')
        .then(c => c.DashboradTechnicienComponent),
      canActivate: [ authGuard]
    },
       {
      path: 'responsable/demandes',
      loadComponent: () => import('./responsable/demande/demande.component')
        .then(c => c.DemandeComponent),
      canActivate: [ authGuard]
    },
    {
      path: 'responsable/rapports',
      loadComponent: () => import('./responsable/rapport-res/rapport-res.component')
        .then(c => c.RapportResComponent),
      canActivate: [ authGuard]
    },
     {
      path: 'responsable/interventions',
      loadComponent: () => import('./responsable/interventions/interventions.component')
        .then(c => c.InterventionsComponent),
      canActivate: [ authGuard]
    },
      { path: 'technicien/interventions',
      loadComponent: () => import('./technicien/mes-interventions/mes-interventions.component')
        .then(c => c.MesInterventionsComponent),
      canActivate: [ authGuard]
    },
         {
      path: 'user/dashboard',
      loadComponent: () => import('./demandeur/dashborad-demandeur/dashborad-demandeur.component')
        .then(c => c.DashboradDemandeurComponent),
      canActivate: [ authGuard]
    },
      {
      path: 'user/demandes',
      loadComponent: () => import('./demandeur/mes-demandes/mes-demandes.component')
        .then(c => c.MesDemandesComponent),
      canActivate: [ authGuard]
    },
     {
      path: 'user/intervention-demande',
      loadComponent: () => import('./demandeur/interventions-mes-demandes/interventions-mes-demandes.component')
        .then(c => c.InterventionsMesDemandesComponent),
      canActivate: [ authGuard]
    },
   { 
    path: 'admin/utilisateurs-admin', 
    loadComponent: () => import('./admin/utilisateurs-admin/utilisateurs-admin.component')
      .then(c => c.UtilisateursAdminComponent),
      canActivate: [ authGuard]
  },
     { 
    path: 'admin/equipements-admin', 
    loadComponent: () => import('./admin/equipements-admin/equipements-admin.component')
      .then(c => c.EquipementsAdminComponent),
      canActivate: [ authGuard]
  },
   { 
    path: 'admin/interventions', 
    loadComponent: () => import('./admin/intervention-all/intervention-all.component')
      .then(c => c.InterventionAllComponent),
      canActivate: [ authGuard]
  },
   
];
