import { Component, AfterViewInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, NgClass, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderRespComponent } from '../header-resp/header-resp.component';
import { Demande, DemandeService } from '../../services/demande.service';
import { Router } from '@angular/router';
import { EquipementService } from '../../services/equipement.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { InterventionService } from '../../services/intervention.service';

@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [
    HeaderRespComponent,
    MatProgressBarModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    DatePipe,
    NgIf,
    NgFor,
    NgClass
  ],
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss']
})
export class DemandeComponent implements AfterViewInit {
  userName: string = 'Responsable';
  searchTerm: string = '';
  selectedFilter: string = 'tous';
  showTechniciensModal: boolean = false;
  interventionDate: string = new Date().toISOString().split('T')[0];
  
  demandes: Demande[] = [];
  demandesEnAttente: Demande[] = [];
  demandesValidees: Demande[] = [];
  demandesRejetees: Demande[] = [];
  demandesTerminees: Demande[] = [];
constructor(public router: Router,private interventionService : InterventionService,private demandeService: DemandeService,private equipementService: EquipementService,private utilisateurService : UtilisateurService) {}
  selectedDemande: any = null;
  selectedTechnicien: any = null;
  techniciensDisponibles: any[] = [];
  activeTab: string = 'en_attente';
  ngOnInit(): void {
  this.demandeService.getallDemandes().subscribe({
    next: (data) => {
      this.demandes = data;

      this.demandesEnAttente = this.demandes.filter(d => d.statut === 'EN_ATTENTE');
      this.demandesValidees = this.demandes.filter(d => d.statut === 'VALIDEE');
      this.demandesRejetees = this.demandes.filter(d => d.statut === 'REJETEE');
      this.demandesTerminees = this.demandes.filter(d => d.statut === 'TERMINEE');
    },
    error: (err) => {
      console.error('Erreur lors du chargement des demandes', err);
    }
  });
}


  ngAfterViewInit() {
    setTimeout(() => {
      this.loadTechniciens();
    });
  }

  filteredDemandes() {
    return this.demandesEnAttente.filter(demande => {
      // Filtre par recherche
      const matchesSearch = this.searchTerm === '' || 
        demande.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        demande.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtre par priorité
      const matchesFilter = this.selectedFilter === 'tous' || 
        demande.priorite.toLowerCase() === this.selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
  }


  getFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  refuserDemande(demande: Demande): void {
  this.demandeService.refuserDemande(demande.id).subscribe({
    next: (updatedDemande) => {
      // Retirer la demande de la liste locale après succès
      this.demandesEnAttente = this.demandesEnAttente.filter(d => d.id !== updatedDemande.id);
      console.log('Demande rejetée avec succès:', updatedDemande);
      this.ngOnInit(); // Rafraîchir la liste des demandes
    },
    error: (err) => {
      console.error('Erreur lors du refus de la demande:', err);
    }
  });
}


  openTechniciensModal(demande: any): void {
    this.selectedDemande = demande;
    this.showTechniciensModal = true;
     this.loadTechniciensByNiveau(demande.niveauIntervention);
  }

  closeTechniciensModal(): void {
    this.showTechniciensModal = false;
    this.selectedTechnicien = null;
  }

  selectTechnicien(tech: any): void {
    this.selectedTechnicien = tech;
  }

  confirmTechnicienSelection(): void {
  if (!this.selectedTechnicien || !this.interventionDate || !this.selectedDemande) {
    return; // sécurité : vérifier que tout est sélectionné
  }

  const intervention = {
    dateDebut: this.interventionDate,
    demandeInterventionId: this.selectedDemande.id,
    technicienId: this.selectedTechnicien.id
  };

  this.interventionService.creerIntervention(intervention).subscribe({
    next: () => {
      alert('Intervention créée avec succès');
      this.closeTechniciensModal();
      this.ngOnInit();
      // ici tu peux aussi rafraîchir la liste des demandes ou interventions
    },
    error: (err) => {
      console.error('Erreur lors de la création de l\'intervention', err);
      alert('Erreur lors de la création de l\'intervention');
    }
  });
}


  resetFilters(): void {
    this.searchTerm = '';
    this.selectedFilter = 'tous';
  }

  getChargeLevel(charge: number): string {
    if (charge < 50) return 'low';
    if (charge < 80) return 'medium';
    return 'high';
  }

  getUserColor(name: string): string {
    if (!name) return '#3f51b5';
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = ['#3f51b5', '#673ab7', '#2196f3', '#009688', '#4caf50'];
    return colors[Math.abs(hash) % colors.length];
  }

  private loadTechniciens(): void {
    this.techniciensDisponibles = [
      { nom: 'Jean Dupont', niveau: 3, charge: 30, interventions: 5 },
      { nom: 'Marie Martin', niveau: 2, charge: 70, interventions: 8 },
      { nom: 'Pierre Durand', niveau: 1, charge: 90, interventions: 12 }
    ];
  }

  loadTechniciensByNiveau(niveau: string): void {
  // Adapter le niveau pour correspondre à un numéro (1, 2, 3)
  // selon ton enum NiveauIntervention (NIVEAU_1, NIVEAU_2, NIVEAU_3)
  const niveauNumber = this.convertNiveauEnumToNumber(niveau);

  this.utilisateurService.getTechniciensByNiveau(niveauNumber).subscribe({
    next: (techniciens) => {
      this.techniciensDisponibles = techniciens;
    },
    error: (err) => {
      console.error('Erreur lors du chargement des techniciens', err);
      this.techniciensDisponibles = [];
    }
  });
}

// Exemple de convertisseur enum string vers nombre
convertNiveauEnumToNumber(niveau: string): number {
  switch (niveau) {
    case 'NIVEAU_1': return 1;
    case 'NIVEAU_2': return 2;
    case 'NIVEAU_3': return 3;
    default: return 1; // valeur par défaut
  }
}

}