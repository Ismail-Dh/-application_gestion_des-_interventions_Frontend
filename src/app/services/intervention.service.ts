import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterventionComplet } from '../responsable/interventions/interventions.component';


export interface Intervention {
  id: number;
  dateDebut: string | null;       
  dateFin: string | null;
  statut: string;
  tempsPasse: number | null;
  diagnostics: string | null;
  solutionApporte: string | null;
  commentaires: string | null;
  valideParDemandeur: boolean | null;
  demandeInterventionId: number;
  technicienId: number;
  dateIntervention: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  private apiUrl = 'http://localhost:8084/api/interventions';

  constructor(private http: HttpClient) {}

  creerIntervention(intervention: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}`, intervention);
}

getAllInterventions(): Observable<Intervention[]> {
  return this.http.get<Intervention[]>(`${this.apiUrl}`);
}

updateIntervention(id: number, intervention: any): Observable<Intervention> {
  return this.http.put<Intervention>(`${this.apiUrl}/interventions/${id}`, intervention);
}

updateIntervention1(id: number, intervention: any): Observable<Intervention> {
  return this.http.put<Intervention>(`${this.apiUrl}/interventions/completer/${id}`, intervention);
}

  getInterventionsByTechnicien(idTech: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/technicien/${idTech}`);
  }
escaladerIntervention(id: number): Observable<Intervention> {
  return this.http.put<Intervention>(
    `${this.apiUrl}/${id}/escalader`, 
    {}
  );
}
validerParDemandeur(id: number): Observable<InterventionComplet> {
  return this.http.put<InterventionComplet>(`${this.apiUrl}/${id}/valider`, {});
}

}
