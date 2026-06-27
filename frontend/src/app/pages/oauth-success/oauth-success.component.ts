import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { error } from 'console';

@Component({
  selector: 'app-oauth-success',
  standalone: true,
  template: `
    <div class="flex justify-center items-center h-screen">
      Вход...
    </div>
  `,
})
export class OAuthSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    const token =
      this.route.snapshot.queryParamMap.get('accessToken');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    localStorage.setItem('accessToken', token);

    this.authService.getProfile().subscribe({
      next: (user) => {
        this.authService.setUser(user);

        this.router.navigate(['/home']);
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}