import { Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ManagerGuard {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.auth.role();

    if (role === 'MANAGER') return true;

    this.router.navigate(['/home']);
    return false;
  }
}