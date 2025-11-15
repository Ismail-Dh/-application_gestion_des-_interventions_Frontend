import { Component, OnInit } from '@angular/core';
import { HeaderTechComponent } from '../header-tech/header-tech.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Intervention, InterventionService } from '../../services/intervention.service';
import { InterventionComplet } from '../../responsable/interventions/interventions.component';
import { DemandeService } from '../../services/demande.service';
import { Technicien, UtilisateurService } from '../../services/utilisateur.service';
import { EquipementService } from '../../services/equipement.service';
import { forkJoin , map} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-mes-interventions',
  standalone: true,
  imports: [HeaderTechComponent,CommonModule, 
      FormsModule,
      MatIconModule, 
      MatButtonModule,MatTabsModule, ReactiveFormsModule ],
  templateUrl: './mes-interventions.component.html',
  styleUrl: './mes-interventions.component.scss'
})
export class MesInterventionsComponent implements OnInit {
searchTerm: string = '';
  selectedStatus: string = 'tous';
  selectedPriority: string = 'tous';
  selectedTechnicien: string = 'tous';
  selectedTab = 0; 
  listInterventions: InterventionComplet[] = [];
  techniciens: Technicien[] = [];
  editForm!: FormGroup;
  filteredInterventions: any[] = [];
  intervention! : InterventionComplet | null;
  selectedIntervention: InterventionComplet | null = null;
  editMode: boolean = false; // Mode édition

  

onTabChange(index: number) {
  const statut = ['PLANIFIEE', 'EN_COURS', 'EN_ATTENTE_VALIDATION','TERMINEE', 'ESCALADEE'][index];
  this.filteredInterventions = this.listInterventions.filter(i => i.statut === statut);
     console.log('Statut sélectionné :', statut);
  console.log('Interventions filtrées :', this.filteredInterventions);
}


  constructor(
    private fb: FormBuilder,
    private interventionService: InterventionService,
    private demandeService: DemandeService,
    private technicienService: UtilisateurService,
    private equipementService: EquipementService,
    private utilisateurService: UtilisateurService
  ) {}

  initEditForm(): void {
    this.editForm = this.fb.group({
      commentaires: ['', Validators.required],
      dateFin: ['', Validators.required],
      diagnostics: ['', Validators.required],
      solutionApporte: ['', Validators.required],
      statut: ['', Validators.required],
      tempsPasse: [{ value: 0, disabled: true }] // Champ en lecture seule
    });
  }

 // Ouvrir le formulaire d'édition
  editIntervention(intervention: InterventionComplet): void {
      const today = new Date().toISOString().split('T')[0]; // Obtenir la date du jour au format 'YYYY-MM-DD'
      this.selectedIntervention = intervention;
      this.initEditForm();
      this.editForm.patchValue({
        commentaires: intervention.commentaires || '',
        dateFin: today, // Définit la date de fin à la date du jour
        diagnostics: intervention.diagnostics || '',
        statut: 'EN_ATTENTE_VALIDATION',
        solutionApporte: intervention.solutionApporte || '',
        tempsPasse: this.calculateTempsPasse(intervention.dateDebut, today) // Recalcule le temps passé avec la date du jour
      });
      this.editMode = true;
    }

  // Fermer le formulaire d'édition
  onCloseEditForm(): void {
    this.editMode = false;
    this.intervention = null;
    this.editForm.reset();
  }


    onSubmitEditForm(): void {
    if (this.selectedIntervention) {
      const updatedIntervention = {
        ...this.selectedIntervention,
        ...this.editForm.value,
        tempsPasse: this.calculateTempsPasse(this.selectedIntervention.dateDebut, this.editForm.value.dateFin)
      };

      this.interventionService.updateIntervention1(this.selectedIntervention.id, updatedIntervention).subscribe(() => {
        console.log("ok");
        // Mettre à jour la liste localement
        this.listInterventions = this.listInterventions.map(i =>
          i.id === this.intervention?.id ? { ...i, ...updatedIntervention } : i
        );
        this.filteredInterventions = [...this.listInterventions];
        this.onCloseEditForm();
      });
    }
  }

  // Calculer automatiquement le temps passé
  calculateTempsPasse(dateDebut: string , dateFin: string): number {
    if (!dateDebut || !dateFin) {
      return 0;
    }
    const start = new Date(dateDebut).getTime();
    const end = new Date(dateFin).getTime();
    const diffInMs = end - start;
    const diffInHours = diffInMs / (1000 * 60 * 60); // Convertir en heures
    return diffInHours > 0 ? diffInHours : 0; // Retourner 0 si la différence est négative
  }

ngOnInit(): void  {
    
     this.chargerInterventionsCompletes();
      
  }

  onEscalate(intervention: InterventionComplet): void {
  console.log('📌 Intervention escaladée :', intervention);

  this.interventionService.escaladerIntervention(intervention.id).subscribe({
    next: (updated) => {
      console.log('✅ Intervention escaladée avec succès', updated);
      // Mets à jour la liste affichée en front
      intervention.statut = updated.statut;
      this.ngOnInit();
    },
    error: (err) => {
      console.error('❌ Erreur lors de l’escalade', err);
    }
  });
}


chargerInterventionsCompletes(): void {
  const userIdString = localStorage.getItem('userId');

// Vérification si l'id existe
if (userIdString) {
  const userId = Number(userIdString); 
  this.interventionService.getInterventionsByTechnicien(userId).subscribe((interventions: Intervention[]) => {
    console.log("📌 Interventions brutes :", interventions);

    const requetes = interventions.map(intervention =>
      // Étape 1 : récupérer Demande + Technicien
      forkJoin({
        demande: this.demandeService.getDemandeById(intervention.demandeInterventionId),
        technicien: this.technicienService.getTechnicienById(intervention.technicienId)
      }).pipe(
        // Étape 2 : à partir de la demande → récupérer Equipement et Demandeur
        switchMap(({ demande, technicien }) =>
          forkJoin({
            equipement: this.equipementService.getEquipementById(demande.equipementId),
            demandeur: this.utilisateurService.getUtilisateurById(demande.utilisateurId) // ou getUtilisateurById
          }).pipe(
            map(({ equipement, demandeur }) => {
              console.log(`🔍 Intervention ${intervention.id} - Demande :`, demande);
              console.log(`🔍 Intervention ${intervention.id} - Technicien :`, technicien);
              console.log(`🔍 Intervention ${intervention.id} - Equipement :`, equipement);
              console.log(`🔍 Intervention ${intervention.id} - Demandeur :`, demandeur);

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
      console.log("✅ Interventions complètes :", interventionsCompletes);
      this.listInterventions = interventionsCompletes;
      this.onTabChange(this.selectedTab);
      
    });
  });
}}


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

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'tous';
    this.selectedPriority = 'tous';
    this.selectedTechnicien = 'tous';
    this.filterInterventions();
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'high': 'ELEVEE',
      'medium': 'MOYENNE',
      'low': 'BASSE'
    };
    return labels[priority] || priority;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'planned': 'PLANIFIEE',
      'in-progress': 'EN_COURS' ,
      'completed': 'TERMINEE',
      'cancelled': 'ESCALADEE'
    };
    return labels[status] || status;
  }



  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  truncateText(text: string, limit: number = 50): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  formatDate(dateString: string | null): string {
  if (!dateString) {
    return 'Date non définie';  // ou juste '' selon ce que tu veux afficher
  }
  const date = new Date(dateString);
  return date.toLocaleDateString();  // Format local ou personnalisé
}


  

  




onSelectIntervention(intervention: InterventionComplet): void {
  this.intervention = intervention;
}

onCloseDetail(): void {
  this.intervention=null;
}
}
