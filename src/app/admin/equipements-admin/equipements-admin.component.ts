import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger, query, stagger, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Equipement, EquipementService } from '../../services/equipement.service';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DemandeService } from '../../services/demande.service';

export interface Intervention {
  id: number;
  dateIntervention: string;
  dateDebut: string;
  dateFin: string;
  tempsPasse: number;
  diagnostics: string;
  commentaires: string;
  solutionApporte: string;
  valideParDemandeur: boolean;
  technicienId: number;
  statut: string;
  demandeIntervention: {
    id: number;
    titre: string;
    description: string;
    dateDemande: string;
    statut: string;
    niveauIntervention: string;
    priorite: string;
    equipementId: number;
    utilisateurId: number;
    lieu: string;
  }
}

interface Equipment {
  id: number;
  nom: string;
  numeroSerie: string;
  typeEquipement: string;
  marque: string;
  modele: string;
  dateAchat?: string | Date;
  dateGarantie?: string | Date;
  localisation: string;
  status: string;
  user: {
    nom: string;
    prenom: string;
    department: string;
  } | null;
}
@Component({
  selector: 'app-equipements-admin',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HeaderAdminComponent],
  templateUrl: './equipements-admin.component.html',
  styleUrl: './equipements-admin.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    
    ]),
   
    trigger('slideInDown', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ transform: 'translateX(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ]),
    trigger('chipAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ]),
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate('200ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, height: 0 }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', stagger('100ms', [
          animate('200ms ease-out', keyframes([
            style({ opacity: 0, transform: 'translateX(20px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1 })
          ]))
        ]), { optional: true })
      ])
    ])
  ]
})
export class EquipementsAdminComponent implements OnInit {
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  showConfirmDialog: boolean = false;
  equipmentToDelete: Equipment | null = null;
  currentSort = { key: 'name', direction: 'asc' };

 
selectedType = 'tous';
selectedStatus = 'tous';

types = ['Ordinateur', 'Imprimante', 'Scanner', 'Routeur', 'Switch', 'Autre'];
statuses = ['En service', 'Hors service', 'En maintenance'];



resetFilters() {
  this.searchTerm = '';
  this.selectedType = 'tous';
  this.selectedStatus = 'tous';
  this.applyFilters();
}

  activeFilters: any[] = [];
  filterDropdowns = [
    {
      id: 'type',
      label: 'Type',
      open: false,
      items: [
        { name: 'Ordinateur portable', value: 'laptop', selected: false },
        { name: 'Ordinateur fixe', value: 'desktop', selected: false },
        { name: 'Tablette', value: 'tablet', selected: false },
        { name: 'Téléphone', value: 'phone', selected: false }
      ]
    },
    {
      id: 'status',
      label: 'Statut',
      open: false,
      items: [
        { name: 'EN SERVICE', value: 'EN SERVICE', selected: false },
        { name: 'EN PANNE', value: 'EN PANNE', selected: false },
        { name: 'MAINTENANCE', value: 'MAINTENANCE', selected: false }
      ]
    }
  ];

  alerts = [
    {
      type: 'warning',
      icon: 'fas fa-exclamation-triangle',
      title: 'Équipements en panne',
      message: '5 équipements nécessitent une intervention',
      action: 'viewPanne',
      
    },
    {
      type: 'danger',
      icon: 'fas fa-times-circle',
      title: 'Garanties expirées',
      message: '12 équipements ne sont plus sous garantie',
      action: 'viewGarantie',
     
    }
  ];

  tableHeaders = [
    { label: 'N° Série', key: 'serialNumber', sortable: true },
    { label: 'Nom', key: 'name', sortable: true },
    { label: 'Type', key: 'type', sortable: true },
    { label: 'Marque/Modèle', key: 'brand', sortable: true },
    { label: 'Utilisateur', key: 'user', sortable: true },
    { label: 'Statut', key: 'status', sortable: true },
    { label: 'Localisation', key: 'location', sortable: true },
    { label: 'Date achat', key: 'purchaseDate', sortable: true },
    { label: 'Fin garantie', key: 'warrantyEndDate', sortable: true },
    { label: 'Actions', key: 'actions', sortable: false }
  ];

equipments: any[] = [];
filteredEquipments: any[] = [];

loadEquipementsWithUtilisateurs(): void {
  this.equipmentService.getEquipements().subscribe(equipements => {
    const requests = equipements.map(equipement => {
      if (equipement.utilisateurId) {
        return this.utilisateurService.getUtilisateurById(equipement.utilisateurId).pipe(
          map(data => {
            equipement.utilisateur = data;
            return equipement;
          })
        );
      } else {
        return of(equipement); // Aucun utilisateur lié
      }
    });

    forkJoin(requests).subscribe(result => {
      this.equipments = result;
      this.filteredEquipments = result;
      this.updateAlerts();
    });
  });
}

getEquipmentsInPanne(): number {
  return this.equipments.filter(e => e.statut === 'HORS_SERVICE').length;
}

getEquipmentsExpiredWarranty(): number {
  const today = new Date();
  return this.equipments.filter(e => {
    if (!e.dateGarantie) return false;
    const warrantyEnd = new Date(e.dateGarantie);
    return warrantyEnd < today;
  }).length;
}
updateAlerts() {
  this.alerts = [
    {
      type: 'warning',
      icon: 'fas fa-exclamation-triangle',
      title: 'Équipements en panne',
      message: `${this.getEquipmentsInPanne()} équipement(s) nécessitent une intervention`,
      action: 'viewPanne',
    },
    {
      type: 'danger',
      icon: 'fas fa-times-circle',
      title: 'Garanties expirées',
      message: `${this.getEquipmentsExpiredWarranty()} équipement(s) ne sont plus sous garantie`,
      action: 'viewGarantie',
    }
  ];
}



 equipmentForm: FormGroup;
  isEditMode = false;
  showAddModal = false;

  equipmentTypes = [
    { name: 'Ordinateur', value: 'ORDINATEUR' },
    { name: 'Imprimante', value: 'IMPRIMANTE' },
    { name: 'Scanner', value: 'SCANNER' },
    { name: 'Switch', value: 'SWITCH' },
    { name: 'Routeur', value: 'ROUTEUR' },
    { name: 'Autre', value: 'autre' }
  ];

  demandeurs: any[] = [];



loadDemandeurs() {
  this.utilisateurService.getDemandeurs().subscribe({
    next: (data) => this.demandeurs = data,
    error: (err) => console.error("Erreur chargement des demandeurs", err)
  });
}


  constructor(private fb: FormBuilder,private utilisateurService: UtilisateurService,
    private equipmentService: EquipementService,
  private demandeService: DemandeService) {
    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      serialNumber: ['', Validators.required],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      warrantyEndDate: ['', Validators.required],
      location: ['', Validators.required],
      assignedUser: [''],
      status: ['service', Validators.required]
    });
  }

  submitEquipment(): void {
  if (this.equipmentForm.invalid) return;

  const formData = this.equipmentForm.value;

  // S'assurer que typeEquipement est en MAJUSCULES
  formData.typeEquipement = formData.typeEquipement?.toUpperCase();

  // Convertir les dates en objets Date pour le backend
  formData.dateAchat = formData.dateAchat ? new Date(formData.dateAchat) : null;
  formData.dateGarantie = formData.dateGarantie ? new Date(formData.dateGarantie) : null;

  if (this.isEditMode) {
    // Appel de modification
    this.equipmentService.modifierEquipement(formData.id,formData).subscribe({
      next: () => {
        this.ngOnInit();
        this.closeModal();
      },
      error: (err) => console.error("Erreur modification équipement", err)
    });
  } else {
    // Appel d’ajout
    this.equipmentService.creerEquipement(formData).subscribe({
      next: () => {
        this.ngOnInit();
        this.closeModal();
      },
      error: (err) => console.error("Erreur enregistrement équipement", err)
    });
  }
}



  closeModal() {
    this.showAddModal = false;
    this.equipmentForm.reset();
  }
  ngOnInit(): void {
    this.equipmentForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      numeroSerie: ['', Validators.required],
      typeEquipement: ['', Validators.required],
      marque: [''],
      modele: [''],
      dateAchat: [''],
      dateGarantie: [''],
      localisation: [''],
      utilisateurId: [''],
      statut: ['EN_SERVICE', Validators.required]
    });
    this.loadEquipementsWithUtilisateurs();
    this.filteredEquipments = [...this.equipments];
    this.updatePagination();
     this.loadDemandeurs();
  }

  trackById(index: number, item: Equipment): number {
    return item.id;
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      laptop: '#4e73df',
      desktop: '#1cc88a',
      tablet: '#f6c23e',
      phone: '#e74a3b',
      monitor: '#36b9cc',
      printer: '#858796',
      other: '#5a5c69'
    };
    return colors[type] || '#5a5c69';
  }

  getUserColor(user: { nom: string } | null): string {
    if (!user) return '#cccccc';
    const hash = user.nom.split('').reduce((acc: number, char: string) => char.charCodeAt(0) + acc, 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 65%)`;
  }

  addEquipment(): void {
    this.isEditMode = false;
    this.equipmentForm.reset({
      type: 'laptop',
      warrantyPeriod: 24
    });
    this.showAddModal = true;
  }

  editEquipment(equipment: Equipment): void {
  this.isEditMode = true;

  this.equipmentForm.patchValue({
    ...equipment,
    dateAchat: equipment.dateAchat ? new Date(equipment.dateAchat).toISOString().split('T')[0] : '',
    dateGarantie: equipment.dateGarantie ? new Date(equipment.dateGarantie).toISOString().split('T')[0] : ''
  });

  this.showAddModal = true;
}

  

    

  generateId(): number {
    return Math.max(...this.equipments.map(e => e.id), 0) + 1;
  }

  calculateWarrantyEndDate(purchaseDate: string, warrantyPeriod: number): Date {
    const date = new Date(purchaseDate);
    date.setMonth(date.getMonth() + warrantyPeriod);
    return date;
  }

  checkWarrantyStatus(purchaseDate: string, warrantyPeriod: number): string {
    const endDate = this.calculateWarrantyEndDate(purchaseDate, warrantyPeriod);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 0) return 'expired';
    if (diffDays < 30) return 'expiring';
    return 'valid';
  }

  confirmDelete(equipment: Equipment): void {
  console.log("Équipement à supprimer :", equipment);
  this.equipmentToDelete = equipment;
  this.showConfirmDialog = true;
}

  deleteEquipment(): void {
    if (!this.equipmentToDelete) return;

  this.equipmentService.supprimerEquipement(this.equipmentToDelete.id).subscribe({
    next: () => {
      console.log('Équipement supprimé avec succès');
      this.showConfirmDialog = false;
      this.ngOnInit(); // recharge la liste
    },
    error: (err) => {
      console.error('Erreur lors de la suppression de l’équipement', err);
      this.showConfirmDialog = false;
    }
  });
  }

  cancelDelete(): void {
    this.equipmentToDelete = null;
    this.showConfirmDialog = false;
  }

 

  

  applyFilters(): void {
    let result = [...this.equipments];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(term) || 
        e.serialNumber.toLowerCase().includes(term) ||
        e.type.toLowerCase().includes(term)
      );
    }

    this.filterDropdowns.forEach(dropdown => {
      const selectedItems = dropdown.items.filter(item => item.selected).map(item => item.value);
      if (selectedItems.length > 0) {
        result = result.filter((e: Equipment) => {
          const value = e[dropdown.id as keyof Equipment];
          return typeof value === 'string' ? selectedItems.includes(value) : false;
        });
      }
    });

    this.filteredEquipments = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  onFilterChange(): void {
    this.updateActiveFilters();
    this.applyFilters();
  }

  updateActiveFilters(): void {
    this.activeFilters = [];
    this.filterDropdowns.forEach(dropdown => {
      const selectedItems = dropdown.items.filter(item => item.selected);
      selectedItems.forEach(item => {
        this.activeFilters.push({
          id: dropdown.id,
          name: item.name,
          value: item.value,
          active: true
        });
      });
    });
  }

  removeFilter(filter: any): void {
    const dropdown = this.filterDropdowns.find(d => d.id === filter.id);
    if (dropdown) {
      const item = dropdown.items.find(i => i.value === filter.value);
      if (item) {
        item.selected = false;
      }
    }
    this.onFilterChange();
  }

  toggleDropdown(id: string): void {
    const dropdown = this.filterDropdowns.find(d => d.id === id);
    if (dropdown) {
      dropdown.open = !dropdown.open;
    }
  }

  sortTable(key: string): void {
    if (this.currentSort.key === key) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.key = key;
      this.currentSort.direction = 'asc';
    }

    this.filteredEquipments.sort((a, b) => {
      const valueA = a[key as keyof Equipment];
      const valueB = b[key as keyof Equipment];

      if (valueA == null) return 1;
      if (valueB == null) return -1;
      if (valueA == null && valueB == null) return 0;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.currentSort.direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        return this.currentSort.direction === 'asc' 
          ? valueA.getTime() - valueB.getTime() 
          : valueB.getTime() - valueA.getTime();
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.currentSort.direction === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }

      return 0;
    });
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

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEquipments.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  handleAlertAction(action: string): void {
    switch (action) {
      case 'viewPanne':
        this.filterDropdowns.find(d => d.id === 'status')?.items.forEach(item => {
          item.selected = item.value === 'EN PANNE';
        });
        this.onFilterChange();
        break;
      case 'viewGarantie':
        this.filteredEquipments = this.equipments.filter(e => e.warrantyStatus === 'expired');
        this.currentPage = 1;
        this.updatePagination();
        break;
    }
  }

  get paginatedEquipments(): Equipment[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEquipments.slice(start, end);
  }

  showDetailModal = false;
selectedEquipment: any = null;
equipmentInterventions: any[] = [];
isLoadingDetail = false;

viewEquipmentDetail(equipment: any) {
  this.selectedEquipment = equipment;
  this.isLoadingDetail = true;
  this.showDetailModal = true;

  // Récupérer les interventions par équipement
  this.demandeService.getInterventionByEquipement(equipment.id)
    .subscribe({
      next: (data) => {
        // S'assurer que c'est un tableau
this.equipmentInterventions = Array.isArray(data) 
  ? data 
  : data ? [data] : [];
          this.isLoadingDetail = false;
      },
      error: (err) => {
        console.error('Erreur récupération interventions', err);
        this.isLoadingDetail = false;
      }
    });
}
// Toggle l’affichage du détail
toggleIntervDetail(index: number) {
  this.equipmentInterventions[index].showDetail = !this.equipmentInterventions[index].showDetail;
}



closeDetailModal() {
  this.showDetailModal = false;
  this.selectedEquipment = null;
  this.equipmentInterventions = [];
}

}
