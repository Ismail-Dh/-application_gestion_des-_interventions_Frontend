import { Component, Input } from '@angular/core';
import { InterventionComplet } from '../interventions/interventions.component';

@Component({
  selector: 'app-intervention-detail',
  standalone: true,
  imports: [],
  templateUrl: './intervention-detail.component.html',
  styleUrl: './intervention-detail.component.scss'
})
export class InterventionDetailComponent {
@Input() intervention!: InterventionComplet;

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Non défini';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
