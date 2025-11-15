import { Component, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { UtilisateurService } from '../../services/utilisateur.service';
import { EquipementService } from '../../services/equipement.service';
import { LogService } from '../../services/log.service';
import { InterventionService } from '../../services/intervention.service';

interface DashboardCard {
  title: string;
  icon: string;
  actions: ActionItem[];
  buttonText: string;
  buttonIcon: string;
}

interface ActionItem {
  icon: string;
  text: string;
  type?: 'warning' | 'info' | 'success';
}

interface StatEntry {
  key: string;
  value: {
    value: string;
    progress: number;
  };
}
interface RecentActivity {
  icon: string;
  user: string;      // ← matricule
  action: string;    // ← action
  time: string;      // ← formaté à partir de dateAction
}
export interface LogApp {
  id: string;
  sourceService: string;
  action: string;
  matricule: string;
  message: string;
  dateAction: string;
}

@Component({
  selector: 'app-dashborad-admin',
  standalone: true,
  imports: [RouterModule,HeaderAdminComponent,MatIconModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatCardModule,CommonModule],
  templateUrl: './dashborad-admin.component.html',
  styleUrl: './dashborad-admin.component.scss'
})
export class DashboradAdminComponent implements OnInit{

  constructor(private userService: UtilisateurService ,private equipementService : EquipementService , private logService :LogService , private InterventionService :InterventionService) {}

  ngOnInit(): void {
    this.loadUserCount();
    this.loadEquipementCount();
    this.loadInterventionCount();
    this.logService.getLogs().subscribe({
    next: (data: LogApp[]) => {
      this.recentActivity = this.logsToRecentActivity(data,5);
    },
    error: (err) => console.error('Erreur chargement logs :', err)
  });
  }

  loadUserCount(): void {
    this.userService.getTotalUsers().subscribe({
      next: (count) => {
        // Mettre à jour le champ "utilisateurs" dans statsEntries
        const userStat = this.statsEntries.find(stat => stat.key === 'utilisateurs');
        if (userStat) {
          userStat.value.value = count.toString();
        }
      },
      error: (err) => console.error('Erreur lors du chargement du nombre d\'utilisateurs :', err)
    });
  }
    loadEquipementCount(): void {
    this.equipementService.getTotalEquipements().subscribe({
      next: (count) => {
        // Mettre à jour le champ "utilisateurs" dans statsEntries
        const equipementStat = this.statsEntries.find(stat => stat.key === 'équipements');
        if (equipementStat) {
          equipementStat.value.value = count.toString();
        }
      },
      error: (err) => console.error('Erreur lors du chargement du nombre d\'utilisateurs :', err)
    });
  }

loadInterventionCount(): void {
  this.InterventionService.getAllInterventions().subscribe({
    next: (interventions) => {
      const total = interventions.length; // 🔥 Compter le nombre total
      const interventionStat = this.statsEntries.find(stat => stat.key === 'interventions');
      if (interventionStat) {
        interventionStat.value.value = total.toString();
      }
    },
    error: (err) => console.error('Erreur lors du chargement du nombre d\'interventions :', err)
  });
}

  // Données des statistiques
  statsEntries: StatEntry[] = [
    { key: 'utilisateurs', value: { value: '0', progress: 65 } },
    { key: 'équipements', value: { value: '0', progress: 65 } },
    { key: 'interventions', value: { value: '0', progress: 42 } },
  ];

  // Méthode pour obtenir les icônes
  getIcon(key: string): string {
    const icons: {[key: string]: string} = {
      'utilisateurs': 'people',
      'équipements': 'computer',
      'interventions': 'build',
      'résolution': 'check_circle'
    };
    return icons[key] || 'help';
  }

  // Animation des cartes
  animateCard(event: Event): void {
    const card = event.target as HTMLElement;
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
  }

  resetCard(event: Event): void {
    const card = event.target as HTMLElement;
    card.style.transform = '';
    card.style.boxShadow = '';
  }

  // Données des cartes
  // Données des cartes
  dashboardCards: DashboardCard[] = [
    {
      title: 'Gestion des utilisateurs',
      icon: '👥',
      actions: [
        {
          icon: '➕',
          text: 'Ajouter de nouveaux utilisateurs (demandeurs, techniciens, responsables)'
        },
        {
          icon: '✏️',
          text: 'Modifier les rôles ou activer/désactiver des comptes'
        },
        {
          icon: '🗑️',
          text: 'Supprimer un utilisateur inactif'
        }
      ],
      buttonText: 'Gérer les utilisateurs',
      buttonIcon: '🔧'
    },
    {
      title: 'Gestion des équipements',
      icon: '💻',
      actions: [
        {
          icon: '📦',
          text: 'Ajouter ou retirer un équipement (PC, imprimante, switch, etc.)'
        },
        {
          icon: '🔗',
          text: 'Lier un équipement à un utilisateur'
        },
        {
          icon: '📋',
          text: 'Suivre les interventions par matériel'
        }
      ],
      buttonText: 'Inventaire',
      buttonIcon: '📊'
    },
    {
      title: 'Paramètres système',
      icon: '⚙️',
      actions: [
        {
          icon: '🏷️',
          text: 'Définir les types d\'interventions disponibles'
        },
        {
          icon: '⏱️',
          text: 'Configurer les SLA (temps de réponse et de résolution par priorité)'
        },
        {
          icon: '🔔',
          text: 'Gérer les options de notification et les niveaux de techniciens',
          type: 'warning'
        }
      ],
      buttonText: 'Paramètres',
      buttonIcon: '⚙️'
    },
    {
      title: 'Statistiques & Rapports',
      icon: '📊',
      actions: [
        {
          icon: '📈',
          text: 'Visualiser les performances globales (taux de résolution, demandes en retard, satisfaction...)'
        },
        {
          icon: '📄',
          text: 'Exporter les rapports en PDF / Excel'
        },
        {
          icon: '🔍',
          text: 'Filtrer par période, service, technicien...'
        }
      ],
      buttonText: 'Statistiques',
      buttonIcon: '📊'
    },
    {
      title: 'Suivi et journal système',
      icon: '📋',
      actions: [
        {
          icon: '📝',
          text: 'Consulter l\'historique des actions (création, modification, suppression)'
        },
        {
          icon: '🔒',
          text: 'Vérifier les logs pour des raisons de sécurité ou d\'audit'
        }
      ],
      buttonText: 'Logs',
      buttonIcon: '📜'
    }
  ];
  // Dans la classe DashboardComponent, ajoutez ces propriétés :
recentActivity: RecentActivity[] = [];
logsToRecentActivity(logs: LogApp[], limit: number = 5): RecentActivity[] {
  return logs
    .sort((a, b) => new Date(b.dateAction).getTime() - new Date(a.dateAction).getTime()) // tri du plus récent au plus ancien
    .slice(0, limit) // ← limiter à 5 ou 10
    .map(log => ({
      icon: this.getIconForService(log.sourceService),
      user: log.matricule,
      action: log.action + (log.message ? ' : ' + log.message : ''),
      time: this.formatRelativeTime(log.dateAction)
    }));
}

getIconForService(service: string): string {
  switch (service.toLowerCase()) {
    case 'auth_service': return 'person_add';
    case 'equipement_service': return 'computer';
    case 'intervention_service': return 'construction';
    case 'notification_service': return 'notifications';
    case 'security_service': return 'security';
    default: return 'info'; // icône générique
  }
}
formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `Il y a ${diff} seconde(s)`;
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minute(s)`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} heure(s)`;
  return date.toLocaleString('fr-FR');
}

// Ajoutez cette méthode pour les animations
animateActivityItem(event: any): void {
  const item = event.currentTarget;
  item.style.transform = 'scale(1.02)';
  item.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
}

resetActivityItem(event: any): void {
  const item = event.currentTarget;
  item.style.transform = '';
  item.style.boxShadow = '';
}

  onCardAction(cardTitle: string): void {
    console.log(`Action clicked for: ${cardTitle}`);
    // Implémentez la logique de navigation ici
  }

  
}
