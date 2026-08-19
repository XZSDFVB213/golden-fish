import { Component, inject } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Router, RouterLink } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AuthRequiredDialogComponent } from '../dialog/auth-required-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatCard, MatIcon, RouterLink, MatButton, MatButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog)
  cart = inject(CartService);
  checkout() {
    const user = this.authService.user();

    if (!user) {
      this.openAuthDialog();
      return;
    }

    this.router.navigate(['/checkout']);
  }
  private openAuthDialog() {
    this.dialog.open(AuthRequiredDialogComponent, {
      width: '380px',
      maxWidth: 'calc(100vw - 24px)',
      autoFocus: false,
      panelClass: 'auth-required-dialog',
    });
  }
  increase(productId: string) {
    this.cart.increase(productId);
  }

  decrease(productId: string) {
    this.cart.decrease(productId);
  }

  remove(productId: string) {
    this.cart.remove(productId);
  }
}
