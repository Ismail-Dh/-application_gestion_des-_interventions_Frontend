import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { HeaderDemComponent } from '../header-dem/header-dem.component';
import { DemandeService } from '../../services/demande.service';
import {Equipement, EquipementService } from '../../services/equipement.service';

interface Demande {
  id: number;
  titre: string;
  lieu: string;
  description: string;
  dateDemande: Date ; // Date peut être un objet Date ou une string ISO
  statut: string;
  priorite: string;
  niveauIntervention: string;
  equipementId: number;
  utilisateurId: number;
}

@Component({
  selector: 'app-mes-demandes',
  standalone: true,
   imports: [
    CommonModule,
    MatIconModule,
    DatePipe,
    HeaderDemComponent,
    MatButtonModule,
    RouterModule,
    FormsModule,
    MatTooltipModule
  ],
  templateUrl: './mes-demandes.component.html',
  styleUrl: './mes-demandes.component.scss'
})
export class MesDemandesComponent implements OnInit {

  searchTerm: string = '';
  selectedFilter: string = 'tous';
  sortColumn: string = 'dateDemande';
  sortDirection: string = 'desc';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  demandes: Demande[] = [];

  filteredDemandes: Demande[] = [];

  constructor(public router: Router,private demandeService: DemandeService,private equipementService: EquipementService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.demandeService.getMesDemandes(+userId).subscribe({
        next: (data) => {
    this.demandes = data.map(d => ({
      ...d,
      dateDemande: new Date(d.dateDemande)
    }));
    this.filterDemandes();
    this.sortDemandes(this.sortColumn);
  },
  error: (err) => {
    console.error('Erreur lors du chargement des demandes', err);
  }
});
}

  if (userId) {
    const id = parseInt(userId, 10);
    this.equipementService.getEquipementsByUtilisateurId(id).subscribe((data) => {
      this.equipements = data;
    });

}}

selectedDemande: Demande = {
  id: 0,
  titre: '',
  lieu: '',
  description: '',
  dateDemande: new Date(),
  statut: '',
  priorite: '',
  niveauIntervention: '',
  equipementId: 0,
  utilisateurId: 0
};
showDetailForm = false;
showEditForm = false;

// Afficher les détails
viewDemandeDetails(id: number) {
  const demande = this.demandes.find(d => d.id === id);
  if (demande) {
    this.selectedDemande = { ...demande };
    this.showDetailForm = true;
    this.showEditForm = false;
  }
}

// Passer en mode édition
startEditDemande() {
  this.showEditForm = true;
  this.showDetailForm = false;
}

// Annuler / fermer formulaire
closeForm() {
  this.showDetailForm = false;
  this.showEditForm = false;
}

// Soumettre la modification
submitEditDemande() {
  if (!this.selectedDemande) return;

  // Création d’une copie avec dateDemande convertie en string ISO
  const demandeToSend = {
    ...this.selectedDemande,
    dateDemande: this.selectedDemande.dateDemande instanceof Date
      ? this.selectedDemande.dateDemande.toISOString()
      : this.selectedDemande.dateDemande
  };

  this.demandeService.modifierDemande(this.selectedDemande.id, demandeToSend).subscribe({
  next: (updated) => {
    this.ngOnInit();
    alert('Demande modifiée avec succès !');
    this.closeForm();
  },
  error: (err) => {
    console.error('Erreur lors de la modification', err);
    alert('Erreur lors de la modification.');
  }
});

}

newDemande: any = {
    titre: '',
    lieu: '',
    description: '',
    priorite: 'NORMALE',
    niveauIntervention: 'Niveau 1',
    equipementId: 101
  };
  showAddForm: boolean = false;
equipements: Equipement[] = [];

 
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
      this.ngOnInit();
    },
    error: (err) => {
      console.error("Erreur lors de la soumission de la demande :", err);
      alert("Échec de la soumission de la demande.");
    }
  });
  this.equipementService.mettreHorsService(this.newDemande.equipementId).subscribe({
    next: () => {
      console.log('Équipement mis hors service avec succès.');
    },
    error: (err) => {
      console.error('Erreur lors de la mise hors service de l\'équipement :', err);
    }
  });
}

cancelAddForm(): void {
    this.showAddForm = false;
  }

  filterDemandes(): void {
    let filtered = this.demandes;

    // Filtre par recherche
    if (this.searchTerm) {
      filtered = filtered.filter(d => 
        d.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        d.lieu.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    switch (this.selectedFilter) {
      case 'en-attente':
        filtered = filtered.filter(d => d.statut === 'EN_ATTENTE');
        break;
      case 'en-cours':
        filtered = filtered.filter(d => d.statut === 'EN_COURS');
        break;
      case 'termine':
        filtered = filtered.filter(d => d.statut === 'TERMINE');
        break;
      case 'annule':
        filtered = filtered.filter(d => d.statut === 'ANNULE');
        break;
      // 'tous' ne filtre pas
    }

    this.filteredDemandes = filtered;
    this.currentPage = 1; // Réinitialiser la pagination après filtrage
  }

  sortDemandes(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredDemandes.sort((a, b) => {
      const valueA = a[column as keyof Demande];
      const valueB = b[column as keyof Demande];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getStatusLabel(statut: string): string {
    const statusLabels: {[key: string]: string} = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'TERMINE': 'Terminé',
      'ANNULE': 'Annulé'
    };
    return statusLabels[statut] || statut;
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'URGENT': return '#ff4444';
      case 'HAUTE': return '#ffbb33';
      case 'NORMALE': return '#33b5e5';
      default: return '#aaaaaa';
    }
  }

 /* viewDemandeDetails(id: number): void {
    this.router.navigate(['/demande', id]);
  }*/

  editDemande(id: number): void {
const demande = this.demandes.find(d => d.id === id);
  if (demande) {
    this.selectedDemande = { ...demande };
    this.showEditForm = true;
    this.showDetailForm = false;
  }  }

  cancelDemande(id: number): void {
    const demande = this.demandes.find(d => d.id === id);
    if (demande && confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
      demande.statut = 'ANNULE';
      this.filterDemandes();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredDemandes.length / this.itemsPerPage);
  }

  get paginatedDemandes(): Demande[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDemandes.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}