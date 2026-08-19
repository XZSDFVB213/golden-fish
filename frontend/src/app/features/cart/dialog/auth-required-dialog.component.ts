import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-required-dialog',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  template: `
    <div class="auth-dialog">

      <div class="icon">
        <mat-icon>person_outline</mat-icon>
      </div>

      <h2>
        Войдите в аккаунт
      </h2>

      <p>
        Чтобы оформить заказ,
        войдите или создайте аккаунт.
        Товары из корзины останутся на месте.
      </p>

      <button
        type="button"
        class="login"
        (click)="goLogin()"
      >
        Войти
      </button>

      <button
        type="button"
        class="register"
        (click)="goRegister()"
      >
        Создать аккаунт
      </button>

    </div>
  `,
  styles: [`
    .auth-dialog {
      width: 100%;
      max-width: 360px;

      padding: 30px 26px;

      text-align: center;
    }

    .icon {
      width: 58px;
      height: 58px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin: 0 auto 16px;

      border-radius: 18px;

      color: #0756c8;
      background: #edf4ff;
    }

    .icon mat-icon {
      width: 28px;
      height: 28px;
      font-size: 28px;
    }

    h2 {
      margin: 0;

      color: #18191d;

      font-size: 21px;
      font-weight: 800;
    }

    p {
      margin: 10px auto 22px;

      color: #858892;

      font-size: 12px;
      line-height: 1.55;
    }

    button {
      width: 100%;
      height: 45px;

      border: 0;
      border-radius: 11px;

      font: inherit;
      font-size: 12px;
      font-weight: 750;

      cursor: pointer;
    }

    .login {
      color: #fff;
      background: #0756c8;
    }

    .register {
      margin-top: 8px;

      color: #0756c8;
      background: #edf4ff;
    }
  `],
})
export class AuthRequiredDialogComponent {
  private dialogRef =
    inject(MatDialogRef<AuthRequiredDialogComponent>);

  private router = inject(Router);

  goLogin() {
    this.dialogRef.close();

    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          returnUrl: '/checkout',
        },
      },
    );
  }

  goRegister() {
    this.dialogRef.close();

    this.router.navigate(
      ['/register'],
      {
        queryParams: {
          returnUrl: '/checkout',
        },
      },
    );
  }
}