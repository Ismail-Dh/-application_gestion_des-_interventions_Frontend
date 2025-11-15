import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Technicien {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  motDePasse: string | null;
  telephone: string;
  email: string;
  dateDeCreation: string;   // ou Date
  type: string;
  niveau: number;
  statu: string;
}

export interface Demandeur {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  motDePasse: string | null;
  telephone: string;
  email: string;
  dateDeCreation: string;   // ou Date
  type: string;
  departement: string;
  statu: string;
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private apiUrl = 'http://localhost:8080/api/utilisateurs';

  constructor(private http: HttpClient) {}

    creerUtilisateur(user: any) {
    return this.http.post<any>(this.apiUrl, user);
  }

    modifierUtilisateur(id: number, user: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  getTotalUsers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
  getDemandeurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/demandeurs`);
  }

  getTechniciens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/techniciens`);
  }
  getTechniciensByNiveau(niveau:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/niveau/${niveau}`);
  }
  getResponsables(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/responsables`);
  }
  getUtilisateurById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/demandeur/${id}`)};

  changerStatut(id: number) {
  return this.http.put(`${this.apiUrl}/${id}/changer-statut`, null, { responseType: 'text' });
}
supprimerUtilisateur(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
 getTechnicienById(id: number): Observable<Technicien> {
  return this.http.get<Technicien>(`${this.apiUrl}/technicien/${id}`);}
}