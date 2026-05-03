import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: false
})
export class NavbarComponent {
  private readonly authService: AuthService;
  private readonly router: Router;
  menuOpen = false;
  currentUser$;

  constructor(
    authService: AuthService,
    router: Router
  ) {
    this.authService = authService;
    this.router = router;
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
    void this.router.navigate(['/']);
  }
}
