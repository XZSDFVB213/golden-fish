import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { IUser } from '../../shared/models/user/user.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIcon, MatCard, RouterLink, MatButton],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  user = signal<IUser | null>(this.authService.user());

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
