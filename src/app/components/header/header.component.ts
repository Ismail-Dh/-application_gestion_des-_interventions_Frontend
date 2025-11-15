import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  menuOpen = false; // ✅ C’est ce qui manquait !

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
