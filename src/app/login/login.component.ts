import { Component, signal, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ✅ Assure-toi que le chemin est correct
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  matricule = '';
  motDePasse = '';
  erreur = '';
  loading = false;

  matriculeFocused = false;
  passwordFocused = false;
  hologramActive = false;
  securityLevel = 0;

  tunnelLayers = Array(5).fill(0).map((_, i) => ({ depth: i }));
  errorMessage: Signal<string | null> = signal(null);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.loading) return;

    this.loading = true;
    this.securityLevel = 0;

    const scanInterval = setInterval(() => {
      this.securityLevel += Math.floor(Math.random() * 15) + 5;

      if (this.securityLevel >= 100) {
        clearInterval(scanInterval);
        setTimeout(() => {
          this.loading = false;
          this.login(); // Appel réel ici
        }, 800);
      }
    }, 300);
  }

  login() {
    this.loading = true;
    this.authService.login(this.matricule, this.motDePasse).subscribe({
      next: (res) => {
        console.log('Connexion réussie', res);
  
        // Sauvegarder les infos dans localStorage (optionnel si pas déjà fait dans service)
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));
        localStorage.setItem('userId', res.id.toString());
       

        // Redirection selon rôle
        const routes: { [key: string]: string } = {
          'ADMINISTRATEUR': '/admin/dashboard',
          'RESPONSABLE': '/responsable/dashboard',
          'TECHNICIEN': '/technicien/dashboard',
          'DEMANDEUR': '/user/dashboard',
        };
        const target = routes[res.type] || '/logs';
        this.router.navigate([target]);
  
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        this.loading = false;
  
        // Affiche un message d'erreur selon status (tu peux adapter)
        if (err.status === 401) {
          this.erreur = 'Matricule ou mot de passe incorrect';
        } else {
          this.erreur = 'Erreur de connexion au serveur';
        }
  
        this.triggerDistortion(); // effet visuel en cas d'erreur
      }
    });
  }
  

  activateHologram() {
    if (this.hologramActive) return;
    this.hologramActive = true;
    setTimeout(() => this.hologramActive = false, 2000);
  }

  triggerDistortion() {
    const distortion = document.querySelector('.quantum-distortion');
    if (distortion) {
      distortion.classList.add('active');
      setTimeout(() => distortion.classList.remove('active'), 1000);
    }
  }

  onForgotPassword() {
    alert('Fonction à venir...');
  }
}
