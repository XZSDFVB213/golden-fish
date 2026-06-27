import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../core/environments/environment';

import {
  IMainStatistics,
  IMiddleStatistics,
} from '../../../shared/models/statistics/statistics.interface';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private http = inject(HttpClient);

  private API_URL = `${environment.API_URL}/statistics`;

  getMainStatistics(storeId: string) {
    return this.http.get<IMainStatistics[]>(
      `${this.API_URL}/main/${storeId}`,
    );
  }

  getMiddleStatistics(storeId: string) {
    return this.http.get<IMiddleStatistics>(
      `${this.API_URL}/middle/${storeId}`,
    );
  }
}