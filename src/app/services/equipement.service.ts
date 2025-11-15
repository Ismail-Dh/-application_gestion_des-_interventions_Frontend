import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipement {
  id: number;
  nom: string;
  numeroSerie: string;
  modele: string;
  marque: string;
  localisation: string;
  typeEquipement: string;
  statut: string;
  dateAchat: string;
  dateGarantie: string;
  utilisateurId: number;
}
@Injectable({
  providedIn: 'root'
})
export class EquipementService  {
  private apiUrl = 'http://localhost:8083/api/equipements';
 constructor(private http: HttpClient) {}
  creerEquipement(equipement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, equipement);
  }

  modifierEquipement(id: number, equipement: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, equipement);
  }

  getTotalEquipements(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getEquipements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  supprimerEquipement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEquipementsByUtilisateurId(utilisateurId: number): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
  getEquipementById(id: number): Observable<Equipement> {
    return this.http.get<Equipement>(`${this.apiUrl}/${id}`);
  }

  mettreHorsService(id: number) {
  return this.http.put(`${this.apiUrl}/${id}/hors-service`, {});
}
}
