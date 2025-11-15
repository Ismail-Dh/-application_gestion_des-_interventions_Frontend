import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Demande, DemandeService } from '../../services/demande.service';
import { Demandeur, Technicien, UtilisateurService } from '../../services/utilisateur.service';
import { Intervention, InterventionService } from '../../services/intervention.service';
import { forkJoin , map} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { InterventionDetailComponent } from '../../responsable/intervention-detail/intervention-detail.component';
import { Equipement, EquipementService } from '../../services/equipement.service';

// Modules Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';


export interface InterventionComplet {
  id: number;
  dateDebut: string ;
  dateFin: string ;
  statut: string;
  tempsPasse: number | null;
  diagnostics: string | null;
  solutionApporte: string | null;
  commentaires: string | null;
  valideParDemandeur: boolean | null;
  dateIntervention: string | null;
  Demande: Demande;
  Technicien: Technicien;
  Equipement: Equipement;
  Demandeur : Demandeur;
}
@Component({
  selector: 'app-intervention-all',
  standalone: true,
  imports: [  CommonModule, 
      FormsModule,
      MatIconModule, 
      MatButtonModule,
      HeaderAdminComponent,
      InterventionDetailComponent,ReactiveFormsModule,MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule],
  templateUrl: './intervention-all.component.html',
  styleUrl: './intervention-all.component.scss'
})
export class InterventionAllComponent implements OnInit {
  searchTerm: string = '';
  selectedStatus: string = 'tous';
  selectedPriority: string = 'tous';
  selectedTechnicien: string = 'tous';

  techniciens: Technicien[] = [];
editForm!: FormGroup;
  listInterventions: InterventionComplet[] = [];

  constructor(
    private fb: FormBuilder,
    private interventionService: InterventionService,
    private demandeService: DemandeService,
    private technicienService: UtilisateurService,
    private equipementService: EquipementService,
    private utilisateurService: UtilisateurService
  ) {}


    ngOnInit(): void {
      this.editForm = this.fb.group({
    technicienId: [null, Validators.required],
    dateDebut: [null, Validators.required],
statut: ['PLANIFIEE'] ,
     niveauIntervention: [null]   
  });
     this.chargerInterventionsCompletes();
   
    

   
  }
chargerInterventionsCompletes(): void {
  this.interventionService.getAllInterventions().subscribe((interventions: Intervention[]) => {
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
      this.filteredInterventions = [...this.listInterventions];
    });
  });
}


  filteredInterventions: any[] = [];

  editingIntervention: InterventionComplet | null = null;


onCloseEdit(): void {
  this.editingIntervention = null;
}


editIntervention(id: number): void {
  this.editingIntervention = this.listInterventions.find(i => i.id === id) || null;
  if (!this.editingIntervention) return;

  // Récupérer le niveau d'intervention
  const niveau = this.editingIntervention.Demande.niveauIntervention;
const niveauNum = parseInt(niveau.split('_')[1], 10);
  // Appeler le service pour récupérer les techniciens correspondants
  this.utilisateurService.getTechniciensByNiveau(niveauNum).subscribe({
    next: (techniciens: any[]) => {
      // Stocker dans le Technicien actuel + tableau temporaire pour le select
      this.techniciens = techniciens;

      // Pré-remplir le formulaire
      this.editForm.patchValue({
        technicienId: this.editingIntervention!.Technicien?.id,
        dateDebut: this.editingIntervention!.dateDebut,
        statut: this.editingIntervention!.statut,
         niveauIntervention: this.editingIntervention!.Demande?.niveauIntervention // 🔥 ajout
      });
    },
    error: (err) => console.error("❌ Erreur récupération techniciens:", err)
  });
}

onNiveauChange(event: any): void {
   this.editForm.patchValue({ statut: 'PLANIFIEE' }); 
  const niveauNum = parseInt(event.value.split('_')[1], 10);
  this.utilisateurService.getTechniciensByNiveau(niveauNum).subscribe({
    next: (techniciens: any[]) => {
      this.techniciens = techniciens;
      this.editForm.patchValue({ technicienId: null }); // reset le choix
    },
    error: (err) => console.error("❌ Erreur récupération techniciens:", err)
  });
}

onSaveEdit(): void {
  if (!this.editingIntervention) return;

  const updated = {
    ...this.editingIntervention,
    technicienId: this.editForm.value.technicienId,
    dateDebut: this.editForm.value.dateDebut,
     statut: this.editForm.value.statut, 

  };
  const demandeUpdate = {
    ...this.editingIntervention.Demande,
    niveauIntervention: this.editForm.value.niveauIntervention
  };


  this.interventionService.updateIntervention(this.editingIntervention.id, updated).subscribe({
    next: (res) => {
      // mettre à jour la liste localement
      this.listInterventions = this.listInterventions.map(i =>
        i.id === this.editingIntervention?.id ? { ...i, ...updated } : i
      );
      this.filteredInterventions = [...this.listInterventions];
      this.onCloseEdit();
      this.ngOnInit();
    },
    error: (err) => console.error("❌ Erreur update:", err)
  });

  this.demandeService.modifierDemande(demandeUpdate.id, demandeUpdate).subscribe({
    next: (res) => {
      console.log("✅ Demande mise à jour:", res);
    },
    error: (err) => console.error("❌ Erreur update demande:", err)
  });
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
      'PLANIFIEE': 'PLANIFIEE',
      'in-progress': 'EN_COURS',
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


  viewDetails(id: number): void {
    console.log('Voir détails intervention:', id);
  }

  

  deleteIntervention(id: number): void {
    console.log('Supprimer intervention:', id);
  }

  createIntervention(): void {
    console.log('Créer nouvelle intervention');
  }

  selectedIntervention: InterventionComplet | null = null;

onSelectIntervention(intervention: InterventionComplet): void {
  this.selectedIntervention = intervention;
}

onCloseDetail(): void {
  this.selectedIntervention = null;
}
}