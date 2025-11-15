import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { HeaderTechComponent } from '../header-tech/header-tech.component';
import { InterventionService } from '../../services/intervention.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dashborad-technicien',
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
    HeaderTechComponent,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './dashborad-technicien.component.html',
  styleUrls: ['./dashborad-technicien.component.scss']
})
export class DashboradTechnicienComponent implements OnInit {
  searchTerm: string = '';
  selectedFilter: string = 'tous';

  events: any[] = []; // interventions sous forme d'événements
  interventions: any[] = [];

  currentDate = new Date();
  currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
  currentYear = this.currentDate.getFullYear();
  days: any[] = [];

  constructor(private interventionService: InterventionService) {}

  ngOnInit(): void {
    this.loadInterventions();
    this.generateCalendar();
  }

  // Charger les interventions du technicien connecté
  loadInterventions(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.interventionService
        .getInterventionsByTechnicien(+userId)
        .subscribe((data) => {
          this.interventions = data;

          // Mapper en événements
          this.events = this.interventions.map((inter) => ({
            title: inter.id,
            start: new Date(inter.dateDebut)
          }));
        });
    }
  }

  // Générer calendrier du mois courant
  generateCalendar() {
    const firstDay = new Date(
      this.currentYear,
      this.currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      this.currentYear,
      this.currentDate.getMonth() + 1,
      0
    );
    this.days = [];

    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
      this.days.push({
        date: new Date(this.currentYear, this.currentDate.getMonth(), i)
      });
    }
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
  }

  updateCalendar() {
    this.currentMonth = this.currentDate.toLocaleString('default', {
      month: 'long'
    });
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
  }

  // Vérifier si deux dates sont le même jour
  isSameDate(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

       resetFilters(): void {
      // Actualiser la page
      window.location.reload();
    }
}
