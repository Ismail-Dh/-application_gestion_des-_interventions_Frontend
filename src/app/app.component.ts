import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,FooterComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ocp_intervention_frontend';
  constructor(private router: Router) {}

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
  get isResponsableRoute(): boolean {
    return this.router.url.startsWith('/responsable');
  }
  get isUserRoute(): boolean {
    return this.router.url.startsWith('/user');
  }

  get isTechnicienRoute(): boolean {
    return this.router.url.startsWith('/technicien');
  }


}
