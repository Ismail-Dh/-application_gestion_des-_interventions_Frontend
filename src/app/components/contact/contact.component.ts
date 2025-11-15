import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


interface VortexLayer {
  depth: number;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  contactForm !: FormGroup;
  isSubmitting = false;
  showConfirmation = false;
  hologramActive = false;
  nameFocused = false;
  emailFocused = false;
  messageFocused = false;
  
  // Configuration des effets visuels
  vortexLayers: VortexLayer[] = Array(8).fill(0).map((_, i) => ({ depth: i }));

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  // Active l'hologramme
  activateHologram(): void {
    if (this.hologramActive) return;
    
    this.hologramActive = true;
    setTimeout(() => {
      this.hologramActive = false;
    }, 2000);
  }

  // Active une carte spécifique
  activateCard(index: number): void {
    console.log(`Card ${index} activated`);
    // Ici vous pourriez ajouter des effets spécifiques
  }

  // Soumission du formulaire
  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    
    // Simulation d'envoi
    setTimeout(() => {
      this.isSubmitting = false;
      this.showConfirmation = true;
      
      // Réinitialisation après 5 secondes
      setTimeout(() => {
        this.showConfirmation = false;
        this.contactForm.reset();
      }, 5000);
    }, 2000);
  }
}
