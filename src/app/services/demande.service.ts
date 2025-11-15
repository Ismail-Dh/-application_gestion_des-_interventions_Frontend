import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from './intervention.service';

export interface Demande {
  id: number;
  titre: string;
  lieu: string;
  description: string;
  dateDemande: string;  
  statut: string;
  priorite: string;
  niveauIntervention: string;
  equipementId: number;
  utilisateurId: number;
}
@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private apiUrl = 'http://localhost:8084/api/Demandes';

  constructor(private http: HttpClient) {}

  creerDemande(demande: any): Observable<any> {
    
    return this.http.post(this.apiUrl, demande);
  }

  getMesDemandes(utilisateurId: number): Observable<Demande[]> {
    
    return this.http.get<Demande[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }

  modifierDemande(id: number, demande: Demande): Observable<Demande> {
  
  return this.http.put<Demande>(`${this.apiUrl}/${id}`, demande);
}
getallDemandes(): Observable<Demande[]> {
  return this.http.get<Demande[]>(this.apiUrl);}

  getDemandeById(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.apiUrl}/${id}`);
  }
refuserDemande(id: number): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiUrl}/${id}/rejeter`, null);
  }
  getInterventionsByDemandeur(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/utilisateur/interventions/${userId}`);
}

getInterventionByEquipement(equipementId: number): Observable<Intervention[]> {
  return this.http.get<Intervention[]>(`${this.apiUrl}/equipement/interventions/${equipementId}`);

}}
