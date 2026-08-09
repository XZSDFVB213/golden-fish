import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../core/environments/environment";
import { IManagerDashboard } from "../../../../shared/models/statistics/statistics.interface";

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard() {
    return this.http.get<IManagerDashboard>(
      `${environment.API_URL}/statistics/manager/dashboard`,
    );
  }
}