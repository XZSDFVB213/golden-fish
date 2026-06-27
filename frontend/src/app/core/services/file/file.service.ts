import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface IFileResponse {
  url: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private http = inject(HttpClient);

  private API_URL = `${environment.API_URL}/files`;

  upload(
    files: File[],
    folder: string = 'products',
  ) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post<IFileResponse[]>(
      `${this.API_URL}?folder=${folder}`,
      formData,
    );
  }
}