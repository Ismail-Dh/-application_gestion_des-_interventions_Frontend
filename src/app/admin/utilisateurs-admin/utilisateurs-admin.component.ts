import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateurs-admin',
  standalone: true,
  imports: [HeaderAdminComponent, FormsModule, CommonModule],
  templateUrl: './utilisateurs-admin.component.html',
  styleUrls: ['./utilisateurs-admin.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class UtilisateursAdminComponent {
  searchTerm: string = '';
  selectedService: string = 'tous';
  selectedStatut: string = 'tous';
  activeTab: string = 'demandeurs';

  services = [
    'Ressources Humaines',
    'Finance',
    'Production',
    'IT',
    'Marketing'
  ];

  statuts = ['ACTIF', 'INACTIF'];
  demandeurs: any[] = [];
  techniciens: any[] = [];
  responsables: any[] = [];

  constructor(private utilisateurService: UtilisateurService) {}

   ngOnInit(): void {
    this.utilisateurService.getDemandeurs().subscribe(data => {
      this.demandeurs = data.map(u => ({
        ...u,
        nomComplet: u.nom + ' ' + u.prenom,
        service: u.departement,
        dateCreation: u.dateDeCreation ? u.dateDeCreation.split('T')[0] : '',
        statut: u.statu // ou u.statut selon ton DTO
      }));
    });
  
    this.utilisateurService.getTechniciens().subscribe(data => {
      this.techniciens = data.map(u => ({
        ...u,
        nomComplet: u.nom + ' ' + u.prenom,
        niveau: u.niveau,
        statut: u.statu,
        dateCreation: u.dateDeCreation ? u.dateDeCreation.split('T')[0] : ''
      }));
    });
  
    this.utilisateurService.getResponsables().subscribe(data => {
      this.responsables = data.map(u => ({
        ...u,
        nomComplet: u.nom + ' ' + u.prenom,
        service: u.typeService,
        statut: u.statu,
        dateCreation: u.dateDeCreation ? u.dateDeCreation.split('T')[0] : ''
      }));
    });
  }

  // Méthodes améliorées
  onSearch(): void {
    console.log('Recherche:', this.searchTerm);
    // Implémentation de la recherche
  }

  onReset(): void {
    this.searchTerm = '';
    this.selectedService = 'tous';
    this.selectedStatut = 'tous';
  }

  toggleUserStatus(user: any) {
    this.utilisateurService.changerStatut(user.id).subscribe({
      next: () => {
        // Mets à jour le statut localement pour un affichage réactif
        user.statut = user.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF';
      },
      error: () => {
        alert('Erreur lors du changement de statut');
      }
    });
  }
onDeleteUser(user: any) {
  if (confirm(`Voulez-vous vraiment supprimer ${user.nomComplet} ?`)) {
    this.utilisateurService.supprimerUtilisateur(user.id).subscribe({
      next: () => {
        // Retire l'utilisateur du tableau local pour mise à jour immédiate
        if (this.activeTab === 'demandeurs') {
          this.demandeurs = this.demandeurs.filter(u => u.id !== user.id);
        } else if (this.activeTab === 'techniciens') {
          this.techniciens = this.techniciens.filter(u => u.id !== user.id);
        } else if (this.activeTab === 'responsables') {
          this.responsables = this.responsables.filter(u => u.id !== user.id);
        }
      },
      error: () => alert('Erreur lors de la suppression')
    });
  }
}


showAddForm = false;
newUserType: 'DEMANDEUR' | 'RESPONSABLE' | 'TECHNICIEN' = 'DEMANDEUR';

openAddForm(type: 'DEMANDEUR' | 'RESPONSABLE' | 'TECHNICIEN') {
  this.newUserType = type;
  this.showAddForm = true;
}

closeAddForm() {
  this.showAddForm = false;
}

newUser: any = {};

onAddUser() {
  this.newUser.type = this.newUserType; // Ajoute le type selon le bouton cliqué
  // ...puis envoie au backend
  this.utilisateurService.creerUtilisateur(this.newUser).subscribe(() => {
    this.closeAddForm();
    this.ngOnInit(); // recharge la liste
  });
}


editUser: any = null; // Utilisateur à modifier
showEditForm = false;
onModifyUser(user: any): void {
  this.editUser = { ...user }; // Copie pour édition
  this.showEditForm = true;
}
closeEditForm() {
  this.showEditForm = false;
  this.editUser = null;
}


onUpdateUser() {
  this.utilisateurService.modifierUtilisateur(this.editUser.id, this.editUser).subscribe(() => {
    this.closeEditForm();
    this.ngOnInit(); // Recharge la liste
  });
}
 

  onChangeLevel(user: any): void {
    console.log('Changement de niveau pour:', user.nomComplet);
    // Ouvrir un modal de changement de niveau
  }

  quickAddUser(): void {
    console.log('Ajout rapide déclenché');
    // Ouvrir un modal d'ajout rapide
  }

  getTechSkills(niveau: number): string[] {
    const baseSkills = ['Diagnostic', 'Réparation'];
    if (niveau === 1) return baseSkills;
    if (niveau === 2) return [...baseSkills, 'Formation', 'Supervision'];
    return [...baseSkills, 'Expertise', 'Audit', 'Gestion d\'équipe'];
  }

  getUserInitials(user: any): string {
    if (!user?.nomComplet) return '??';
    const names = user.nomComplet.split(' ');
    return names.map((n: string) => n[0]).join('').toUpperCase();
  }
  getStatutBadgeClass(statut: string): string {
    return statut === 'ACTIF' ? 'statut-actif' : 'statut-inactif';
  }
  getNiveauBadgeClass(niveau: number): string {
    switch(niveau) {
      case 1: return 'niveau-1';
      case 2: return 'niveau-2';
      case 3: return 'niveau-3';
      default: return 'niveau-1';
    }
  }

  getDisponibiliteBadgeClass(disponibilite: string): string {
    return disponibilite === 'DISPONIBLE' ? 'disponible' : 'occupe';
  }

}