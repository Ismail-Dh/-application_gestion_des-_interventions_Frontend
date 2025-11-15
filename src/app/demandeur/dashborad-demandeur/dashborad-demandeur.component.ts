import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { HeaderDemComponent } from '../header-dem/header-dem.component';
import { Equipement, EquipementService } from '../../services/equipement.service';
import { DemandeService } from '../../services/demande.service';



interface Stats {
  pendingRequests: number;
  totaleRequests: number;
  completedRequests: number;
  urgentRequests: number;
  responseRate: number;   // 🔥 pourcentage de demandes traitées
  completionRate: number; // 🔥 pourcentage de demandes validées
  rejectionRate: number;  // 🔥 pourcentage de demandes rejetées
}
@Component({
  selector: 'app-dashborad-demandeur',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    HeaderDemComponent,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    RouterModule,
    FormsModule,
    MatProgressBarModule
  ],
  templateUrl: './dashborad-demandeur.component.html',
  styleUrl: './dashborad-demandeur.component.scss'
})
export class DashboradDemandeurComponent implements OnInit {
  searchTerm: string = '';
  selectedFilter: string = 'tous';
  showAddForm: boolean = false;
  
  newDemande: any = {
    titre: '',
    lieu: '',
    description: '',
    priorite: 'NORMALE',
    niveauIntervention: 'Niveau 1',
    equipementId: 101
  };

  stats: Stats = {
    pendingRequests: 0,
    totaleRequests: 0,
    completedRequests: 0,
    urgentRequests: 0,
    responseRate: 0,
  completionRate: 0,
  rejectionRate: 0
  };

  


  
equipements: Equipement[] = [];
  constructor(private router: Router,private equipementService: EquipementService,private demandeService : DemandeService) {}


    
ngOnInit() {
  const userId = localStorage.getItem('userId') ?? '';
  if (userId) {
    const id = parseInt(userId, 10);

    // Charger les équipements liés
    this.equipementService.getEquipementsByUtilisateurId(id).subscribe((data) => {
      this.equipements = data;
    });

    // Charger les demandes liées
    this.loadDemandes(id);
  }
}
submitNewDemande() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert("Utilisateur non connecté.");
    return;
  }

  // On complète la demande avec l'id de l'utilisateur
  const demandeToSend = {
    ...this.newDemande,
    utilisateurId: parseInt(userId, 10)
  };

  this.demandeService.creerDemande(demandeToSend).subscribe({
    next: (res) => {
      alert("Demande soumise avec succès !");
      this.showAddForm = false;
      this.newDemande = {}; // Reset du formulaire
    },
    error: (err) => {
      console.error("Erreur lors de la soumission de la demande :", err);
      alert("Échec de la soumission de la demande.");
    }
  });
}

  

 loadDemandes(userId: number) {
  this.demandeService.getMesDemandes(userId).subscribe((demandes) => {
    this.updateStats(demandes);
  });
}

updateStats(demandes: any[]) {
  this.stats.pendingRequests = demandes.filter(d => d.statut === 'EN_ATTENTE').length;
  this.stats.completedRequests = demandes.filter(d => d.statut === 'VALIDEE').length;
  this.stats.urgentRequests = demandes.filter(d => d.statut === 'REJETEE').length;
    this.stats.totaleRequests = demandes.length; // 🔥 total
    // 🔥 calculs de pourcentage
  if (this.stats.totaleRequests > 0) {
    const traitees = this.stats.completedRequests + this.stats.urgentRequests + this.stats.pendingRequests;
    this.stats.responseRate = Math.round((traitees / this.stats.totaleRequests) * 100);
    this.stats.completionRate = Math.round((this.stats.completedRequests / this.stats.totaleRequests) * 100);
    this.stats.rejectionRate = Math.round((this.stats.urgentRequests / this.stats.totaleRequests) * 100);
  } else {
    this.stats.responseRate = 0;
    this.stats.completionRate = 0;
    this.stats.rejectionRate = 0;
  }

}

  

  cancelAddForm(): void {
    this.showAddForm = false;
  }

  

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'URGENT': return '#ff4444';
      case 'HAUTE': return '#ffbb33';
      case 'NORMALE': return '#33b5e5';
      default: return '#aaaaaa';
    }
  }

  
}