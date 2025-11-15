import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { HeaderRespComponent } from '../header-resp/header-resp.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { Intervention, InterventionService } from '../../services/intervention.service';
import { Demande, DemandeService } from '../../services/demande.service';

@Component({
  selector: 'app-dashborad-responsable',
  standalone: true,
 imports: [
    CommonModule,
    FormsModule,
 
    RouterModule,
    MatIconModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatCardModule,
    HeaderRespComponent,
  
  ],
  providers: [DatePipe],
  templateUrl: './dashborad-responsable.component.html',
  styleUrl: './dashborad-responsable.component.scss'
})
export class DashboradResponsableComponent implements OnInit {
  searchTerm: string = '';
  selectedFilter: string = 'tous';
  activeTab: string = 'dashboard';
  urgentCount: number = 3;

  stats = {
    interventions: 0,
   planifiees: 0,
    enCours: 0,
    terminees: 0,
    escaladees: 0,
    totalDemandes: 0
  };

  
  constructor(private interventionService :InterventionService,private demandeService :DemandeService) { }

 ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // 📌 Charger toutes les interventions
    this.interventionService.getAllInterventions().subscribe({
      next: (interventions: Intervention[]) => {
        this.stats.interventions = interventions.length;
        this.stats.planifiees = interventions.filter(i => i.statut === 'PLANIFIEE').length;
        this.stats.enCours = interventions.filter(i => i.statut === 'EN_COURS').length;
        this.stats.terminees = interventions.filter(i => i.statut === 'TERMINEE').length;
        this.stats.escaladees = interventions.filter(i => i.statut === 'ESCALADEE').length;
      },
      error: (err) => console.error("❌ Erreur chargement interventions:", err)
    });

    // 📌 Charger toutes les demandes
    this.demandeService.getallDemandes().subscribe({
      next: (demandes: Demande[]) => {
        this.stats.totalDemandes = demandes.length;
      },
      error: (err) => console.error("❌ Erreur chargement demandes:", err)
    });
  }

 

  getRandomColor(): string {
    const colors = ['#378472', '#00b8ff', '#ff7d54', '#9c27b0', '#8bc34a'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedFilter = 'tous';
  }

 
}