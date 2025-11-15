import { Component, OnInit } from '@angular/core';
import { InterventionComplet } from '../../responsable/interventions/interventions.component';
import { InterventionService } from '../../services/intervention.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HeaderDemComponent } from '../header-dem/header-dem.component';
import { DemandeService } from '../../services/demande.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { EquipementService } from '../../services/equipement.service';
import { forkJoin , map} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';

import { ToastrModule, ToastrService } from 'ngx-toastr';

export interface Intervention {
  id: number;
  dateIntervention: string | null; // string car Angular reçoit JSON
  dateDebut?: string | null;
  dateFin?: string | null;
  tempsPasse?: number | null;
  diagnostics?: string | null;
  commentaires?: string | null;
  solutionApporte?: string | null;
  valideParDemandeur?: boolean;
  technicienId: number ;
  statut?: 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ESCALADEE';
  demandeIntervention: any; // liaison vers la demande
}

@Component({
  selector: 'app-interventions-mes-demandes',
  standalone: true,
  imports: [CommonModule,FormsModule, MatIconModule,MatButtonModule,HeaderDemComponent,ToastrModule],
  templateUrl: './interventions-mes-demandes.component.html',
  styleUrl: './interventions-mes-demandes.component.scss'
})
export class InterventionsMesDemandesComponent implements OnInit {
  searchTerm: string = '';
  selectedStatus: string = 'tous';
  selectedPriority: string = 'tous';
  selectedTechnicien: string = 'tous';
userInterventions: InterventionComplet[] = [];
  selectedIntervention!: InterventionComplet|null ;
  listInterventions: InterventionComplet[] = [];
  filteredInterventions: any[] = [];
  intervention! : InterventionComplet |null;

  constructor(private interventionService: InterventionService , 
    private demandeService : DemandeService , 
    private technicienService : UtilisateurService,
    private utilisateurService : UtilisateurService,
    private equipementService : EquipementService, private toastr: ToastrService 
  
  
  ) {}

  ngOnInit(): void {
    this.loadUserInterventions();
  }


  
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  loadUserInterventions(): void {
    const userIdString = localStorage.getItem('userId');

  if (userIdString) {
    const userId = Number(userIdString); 
    this.demandeService.getInterventionsByDemandeur(userId).subscribe((interventions: Intervention[]) => {
      console.log("📌 Interventions brutes (demandeur) :", interventions);

      const requetes = interventions.map(intervention =>
        forkJoin({
          demande: this.demandeService.getDemandeById(intervention.demandeIntervention.id),
          technicien: this.technicienService.getTechnicienById(intervention.technicienId)
        }).pipe(
          switchMap(({ demande, technicien }) =>
            forkJoin({
              equipement: this.equipementService.getEquipementById(demande.equipementId),
              demandeur: this.utilisateurService.getUtilisateurById(demande.utilisateurId)
            }).pipe(
              map(({ equipement, demandeur }) => {
                return {
                  ...intervention,
                  Demande: demande,
                  Technicien: technicien,
                  Equipement: equipement,
                  Demandeur: demandeur
                } as InterventionComplet;
              })
            )
          )
        )
      );

      forkJoin(requetes).subscribe((interventionsCompletes: InterventionComplet[]) => {
        console.log("✅ Interventions complètes (demandeur) :", interventionsCompletes);
        this.listInterventions = interventionsCompletes;
              this.filteredInterventions = [...this.listInterventions];

      });
    });
  }
}

  filterInterventions(): void {
    this.filteredInterventions = this.listInterventions.filter(intervention => {
      const matchesSearch = intervention.Demande.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          intervention.Demande.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'tous' || 
                          intervention.statut === this.selectedStatus;
      
      const matchesPriority = this.selectedPriority === 'tous' || 
                            intervention.Demande.priorite === this.selectedPriority;
      
      const matchesTechnicien = this.selectedTechnicien === 'tous' || 
                              intervention.Technicien.id.toString() === this.selectedTechnicien;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTechnicien;
    });
  }
  onSelectIntervention(intervention: InterventionComplet): void {
    this.intervention= intervention;
  }

  onCloseDetail(): void {
    this.intervention = null;
  }

  onValider(intervention: InterventionComplet): void {
  if (!intervention.id) return;

  this.interventionService.validerParDemandeur(intervention.id).subscribe({
    next: (updatedIntervention) => {
      // Mettre à jour l'intervention dans la liste locale
      const index = this.listInterventions.findIndex(i => i.id === updatedIntervention.id);
      if (index !== -1) {
        this.listInterventions[index] = updatedIntervention;
      }

      // Optionnel : afficher un message de succès
      this.toastr.success('Intervention validée avec succès !');
      this.ngOnInit();
    },
    error: (err) => {
      console.error('Erreur lors de la validation :', err);
      this.toastr.error('Impossible de valider l’intervention.');
    }
  });
}

formatDate(date: string | null | undefined): string {
  if (!date) return ''; // ou un texte par défaut comme 'N/A'
  const d = new Date(date);
  return d.toLocaleDateString(); // format local
}

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'PLANIFIEE': return 'Planifiée';
      case 'EN_COURS': return 'En cours';
      case 'TERMINEE': return 'Terminée';
      case 'EN_ATTENTE_VALIDATION': return 'En attente de validation';
      case 'ESCALADEE': return 'Escaladée';
      default: return statut;
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'ELEVEE': return 'Haute';
      case 'MOYENNE': return 'Moyenne';
      case 'BASSE': return 'Basse';
      default: return priority;
    }
  }

  truncateText(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }
}
