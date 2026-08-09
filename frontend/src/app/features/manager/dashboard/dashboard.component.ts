import { Component, inject, signal } from '@angular/core';
import { DashboardService } from './service/dashboard.service';
import { IManagerDashboard } from '../../../shared/models/statistics/statistics.interface';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIcon, MatCard,DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private dashboardService = inject(DashboardService);

  dashboard = signal<IManagerDashboard | null>(null);
  today = new Date();
  constructor() {
    this.dashboardService
      .getDashboard()
      .subscribe((res) => {
        console.log(res);
        this.dashboard.set(res)});
  }
}
